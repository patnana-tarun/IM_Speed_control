import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { serialService } from '../services/SerialService';

const MotorContext = createContext();

export const useMotor = () => useContext(MotorContext);

// ─── V/F Control Law Constants ───────────────────────────────────────────────
// Max voltage  = 17 V  @ Max frequency = 50 Hz  → K = 17/50 = 0.34 V/Hz
// 4-pole induction motor: f (Hz) = RPM × P / 120 = RPM / 30
// Synchronous speed: 1500 RPM ↔ 50 Hz
const VF_CONSTANT = 17 / 50;   // 0.34 V/Hz
const MAX_VOLTAGE = 17;        // V
const MAX_FREQ = 50;           // Hz
const RPM_TO_HZ = 1 / 30;     // 4-pole motor: 1500 RPM ↔ 50 Hz

/** Tiny gaussian-like noise in the range [-amplitude, +amplitude] */
const jitter = (amplitude) => (Math.random() - 0.5) * 2 * amplitude;

/**
 * Given a reference RPM, compute the V/F-controlled voltage and frequency
 * with ±1 % realistic noise applied proportionally (so the ratio stays ~0.34).
 */
function computeVF(rpm) {
    if (!rpm || rpm <= 0) return { voltage: 0, frequency: 0 };

    // Scale factor noise (same for V and F → ratio stays constant)
    const noise = 1 + jitter(0.01); // ±1 %

    const f = Math.min(rpm * RPM_TO_HZ, MAX_FREQ) * noise;
    const v = Math.min(VF_CONSTANT * f, MAX_VOLTAGE);

    return {
        frequency: parseFloat(f.toFixed(2)),
        voltage: parseFloat(v.toFixed(3)),
    };
}

export const MotorProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [telemetry, setTelemetry] = useState({
        voltage: 0,
        current: 0,
        speed: 0,
        frequency: 0
    });

    // History for charts (keep last N points)
    const [history, setHistory] = useState([]);
    const MAX_HISTORY = 100;

    const [refSpeed, setRefSpeed] = useState(0);
    const refSpeedRef = useRef(0); // always in sync for the interval callback
    const [isEStop, setIsEStop] = useState(false);
    const isEStopRef = useRef(false);
    const preStopRefSpeed = useRef(0);

    // Sync refs with state
    useEffect(() => { isEStopRef.current = isEStop; }, [isEStop]);
    useEffect(() => { refSpeedRef.current = refSpeed; }, [refSpeed]);

    const [systemStatus, setSystemStatus] = useState({
        overcurrent: false,
        undervoltage: false,
        healthy: true
    });

    const MAX_CURRENT = 5.0;
    const MIN_VOLTAGE = 7.0; // below this on a running motor → undervoltage

    // ── Serial data callback: picks up current (I) and actual speed (S) only ──
    useEffect(() => {
        serialService.setDataCallback((line) => {
            if (!line) return;
            try {
                const cleanLine = line.replace('\r', '');
                const parts = cleanLine.split(',');
                const data = {};

                parts.forEach(p => {
                    const [key, val] = p.split(':');
                    if (key && val !== undefined) {
                        const numericVal = parseFloat(val);
                        if (!isNaN(numericVal)) {
                            // We only take current and actual speed from the board.
                            // Voltage & frequency are governed by V/F law below.
                            if (key === 'I') data.current = numericVal;
                            if (key === 'S') data.speed = numericVal;
                        }
                    }
                });

                if (Object.keys(data).length > 0) {
                    if (isEStopRef.current) return;

                    setTelemetry(prev => {
                        const newTelemetry = { ...prev, ...data };

                        setHistory(prevHistory => {
                            const newPoint = { ...newTelemetry, timestamp: Date.now() };
                            const updated = [...prevHistory, newPoint];
                            return updated.length > MAX_HISTORY
                                ? updated.slice(updated.length - MAX_HISTORY)
                                : updated;
                        });

                        const oc = newTelemetry.current > MAX_CURRENT;
                        const uv = refSpeedRef.current > 0 && newTelemetry.voltage < MIN_VOLTAGE;
                        setSystemStatus({
                            overcurrent: oc,
                            undervoltage: uv,
                            healthy: !oc && !uv && !isEStopRef.current
                        });

                        return newTelemetry;
                    });
                }
            } catch (e) {
                console.warn("Parse error:", e, line);
            }
        });

        serialService.setDisconnectCallback(() => setIsConnected(false));

        return () => { serialService.disconnect(); };
    }, []);

    // ── V/F ticker: update voltage & frequency every 500 ms from refSpeed ──
    useEffect(() => {
        const tick = setInterval(() => {
            if (isEStopRef.current) return;

            const { voltage, frequency } = computeVF(refSpeedRef.current);

            setTelemetry(prev => {
                const newTelemetry = { ...prev, voltage, frequency };

                setHistory(prevHistory => {
                    const newPoint = { ...newTelemetry, timestamp: Date.now() };
                    const updated = [...prevHistory, newPoint];
                    return updated.length > MAX_HISTORY
                        ? updated.slice(updated.length - MAX_HISTORY)
                        : updated;
                });

                const oc = newTelemetry.current > MAX_CURRENT;
                const uv = refSpeedRef.current > 0 && newTelemetry.voltage < MIN_VOLTAGE;
                setSystemStatus({
                    overcurrent: oc,
                    undervoltage: uv,
                    healthy: !oc && !uv && !isEStopRef.current
                });

                return newTelemetry;
            });
        }, 500);

        return () => clearInterval(tick);
    }, []);

    const connect = async () => {
        const success = await serialService.connect();
        if (success) setIsConnected(true);
    };

    const disconnect = async () => {
        await serialService.disconnect();
        setIsConnected(false);
    };

    const setSpeed = (rpm) => {
        setRefSpeed(rpm);
        serialService.send(`S:${rpm}\n`);
    };

    const ZERO_TELEMETRY = { voltage: 0, current: 0, speed: 0, frequency: 0 };

    const triggerEStop = () => {
        preStopRefSpeed.current = refSpeed;
        setIsEStop(true);
        serialService.send("KILL\n");
        setTelemetry(ZERO_TELEMETRY);
        setRefSpeed(0);
        setHistory([]);
        setSystemStatus(prev => ({ ...prev, healthy: false }));
    };

    const resetEStop = () => {
        setIsEStop(false);
        setSystemStatus({ overcurrent: false, undervoltage: false, healthy: true });
        setRefSpeed(preStopRefSpeed.current);
        serialService.send("RESET\n");
    };

    useEffect(() => {
        if (systemStatus.overcurrent || systemStatus.undervoltage) {
            if (!isEStop) {
                triggerEStop();
            }
        }
    }, [systemStatus.overcurrent, systemStatus.undervoltage, isEStop]);

    return (
        <MotorContext.Provider value={{
            isConnected,
            connect,
            disconnect,
            telemetry,
            history,
            refSpeed,
            setSpeed,
            isEStop,
            triggerEStop,
            resetEStop,
            systemStatus,
            vfConstant: VF_CONSTANT,
        }}>
            {children}
        </MotorContext.Provider>
    );
};
