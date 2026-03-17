import React from 'react';
import { useMotor } from '../context/MotorContext';
import clsx from 'clsx';

export default function SpeedGauge() {
    const { telemetry, refSpeed } = useMotor();

    // Settings
    const MAX_SPEED = 1500;
    const MIN_SPEED = 0;

    // Calculate angles (Needle moves from -135deg to +135deg)
    const mapSpeedToAngle = (speed) => {
        const clamped = Math.min(Math.max(speed, MIN_SPEED), MAX_SPEED);
        const ratio = clamped / (MAX_SPEED - MIN_SPEED);
        return -135 + (ratio * 270);
    };

    const needleAngle = mapSpeedToAngle(telemetry.speed);
    const refAngle = mapSpeedToAngle(refSpeed);

    // Ticks generation
    const ticks = [];
    const majorMod = 500;
    for (let s = 0; s <= MAX_SPEED; s += 100) {
        const isMajor = s % majorMod === 0;
        const angle = mapSpeedToAngle(s);
        ticks.push({ speed: s, angle, isMajor });
    }

    return (
        <div className="bg-white dark:bg-[#111] p-4 lg:p-6 rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col items-center justify-between relative overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:scale-[1.01] hover:shadow-blue-500/10 h-full min-h-0">
            {/* Header */}
            <div className="text-center shrink-0 mb-2">
                <h3 className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px]">
                    Motor Performance
                </h3>
            </div>

            {/* Speedometer SVG - Much Larger and Centered */}
            <div className="relative w-full flex-1 flex items-center justify-center min-h-0 bg-radial-center overflow-visible">
                <svg viewBox="0 0 300 300" className="w-[90%] h-[90%] drop-shadow-[0_0_20px_rgba(59,130,246,0.1)] overflow-visible">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Ticks */}
                    {ticks.map((t, i) => {
                        const rad = (t.angle - 90) * (Math.PI / 180);
                        const outerR = 145;
                        const innerR = t.isMajor ? 120 : 132;
                        const x1 = 150 + outerR * Math.cos(rad);
                        const y1 = 150 + outerR * Math.sin(rad);
                        const x2 = 150 + innerR * Math.cos(rad);
                        const y2 = 150 + innerR * Math.sin(rad);

                        let labelX = 0, labelY = 0;
                        if (t.isMajor) {
                            const labelR = 100;
                            labelX = 150 + labelR * Math.cos(rad);
                            labelY = 150 + labelR * Math.sin(rad);
                        }

                        return (
                            <g key={i}>
                                <line
                                    x1={x1} y1={y1} x2={x2} y2={y2}
                                    stroke={t.isMajor ? (Math.abs(t.speed - telemetry.speed) < 100 ? "#3b82f6" : "#666") : "#333"}
                                    strokeWidth={t.isMajor ? 4 : 1.5}
                                    className="transition-colors duration-300"
                                />
                                {t.isMajor && t.speed > 0 && (
                                    <text
                                        x={labelX} y={labelY}
                                        textAnchor="middle" dominantBaseline="middle"
                                        className={clsx(
                                            "text-[16px] font-mono font-black transition-all duration-300",
                                            Math.abs(t.speed - telemetry.speed) < 100
                                                ? "fill-blue-500 dark:fill-blue-400 scale-125"
                                                : "fill-gray-400 dark:fill-gray-600"
                                        )}
                                    >
                                        {t.speed}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Reference Marker */}
                    <g transform={`rotate(${refAngle}, 150, 150)`}>
                        <polygon points="144,15 156,15 150,45" fill="#3b82f6" opacity="0.9" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    </g>

                    {/* Main Needle */}
                    <g transform={`rotate(${needleAngle}, 150, 150)`} className="transition-transform duration-300 ease-out">
                        <circle cx="150" cy="150" r="10" fill="#ef4444" />
                        <path d="M 147,150 L 150,20 L 153,150 Z" fill="#ef4444" filter="url(#glow)" />
                        <circle cx="150" cy="150" r="5" fill="#881313" />
                    </g>
                </svg>

                {/* Sub-label inside gauge space */}
                <div className="absolute bottom-[20%] text-center">
                    <span className="text-[10px] lg:text-xs font-bold text-gray-500 dark:text-gray-600 uppercase tracking-[0.5em]">RPM</span>
                </div>
            </div>

            {/* Premium Bottom Readouts - Compacted for narrower width */}
            <div className="w-full grid grid-cols-2 gap-4 lg:gap-6 px-2 mb-2 shrink-0 border-t border-gray-100 dark:border-gray-800/50 pt-4">
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Actual</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl lg:text-4xl font-black text-blue-600 dark:text-blue-500 font-mono leading-none">
                            {telemetry.speed.toFixed(0)}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">RPM</span>
                    </div>
                </div>

                <div className="flex flex-col items-center border-l border-gray-100 dark:border-gray-800">
                    <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Target</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl lg:text-4xl font-black text-gray-700 dark:text-gray-200 font-mono leading-none">
                            {refSpeed}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">RPM</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
