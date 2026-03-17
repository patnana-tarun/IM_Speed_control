import React, { useState, useEffect } from 'react';
import { useMotor } from '../context/MotorContext';
import { Send, Gauge, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function SpeedControl() {
    const { setSpeed, refSpeed, isEStop, isConnected } = useMotor();
    const [sent, setSent] = useState(false);
    const [localSpeed, setLocalSpeed] = useState('0');

    const handleUpdate = () => {
        let val = parseFloat(localSpeed);
        if (isNaN(val)) val = 0;
        val = Math.min(1500, Math.max(0, val));

        setLocalSpeed(val.toString());
        setSpeed(val);

        setSent(true);
        setTimeout(() => setSent(false), 200);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleUpdate();
    };

    const handleChange = (e) => {
        const val = e.target.value;
        if (val === '' || /^\d*\.?\d*$/.test(val)) setLocalSpeed(val);
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2">
                <Gauge className="text-blue-600 dark:text-blue-500" size={20} />
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide">Speed Control</h2>
            </div>

            <div className="flex items-end gap-3">
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Target RPM</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={localSpeed}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            disabled={isEStop}
                            className="w-full text-2xl font-mono p-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50 text-gray-900 dark:text-gray-100"
                            placeholder="0"
                        />
                    </div>
                </div>

                <button
                    onClick={handleUpdate}
                    disabled={isEStop}
                    className={clsx(
                        "h-[46px] px-6 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 uppercase text-xs tracking-wider",
                        sent ? "bg-green-600" : "bg-blue-600 hover:bg-blue-500"
                    )}
                >
                    {sent ? <CheckCircle2 size={18} /> : <Send size={16} />}
                    {sent ? "Set" : "Apply"}
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <input
                    type="range"
                    min="0"
                    max="1500"
                    value={Number(localSpeed) || 0}
                    onChange={(e) => setLocalSpeed(e.target.value)}
                    onMouseUp={handleUpdate}
                    disabled={isEStop}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>0</span>
                    <span>750</span>
                    <span>1500</span>
                </div>
            </div>
        </div>
    );
}

