import React from 'react';
import { useMotor } from '../context/MotorContext';
import { OctagonAlert, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

export default function EmergencyStop() {
    const { isEStop, triggerEStop, resetEStop, isConnected } = useMotor();

    return (
        <div className="flex flex-col gap-2 h-full">
            <button
                onClick={triggerEStop}
                disabled={isEStop || !isConnected}
                className={clsx(
                    "group relative w-full h-full min-h-[5rem] rounded-xl flex items-center justify-center gap-4 border-2 transition-all duration-150 active:scale-95 shadow-xl",
                    isEStop
                        ? "bg-red-950 border-red-900 text-red-300 opacity-50 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-500 border-red-400 text-white shadow-red-600/30"
                )}
            >
                <div className="absolute inset-0 bg-repeat opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 10%, transparent 10%)', backgroundSize: '10px 10px' }} />
                <OctagonAlert size={32} className={clsx("relative z-10", !isEStop && "animate-pulse")} />
                <span className="relative z-10 text-xl font-black tracking-widest uppercase">
                    EMERGENCY STOP
                </span>
            </button>

            {isEStop && (
                <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 shrink-0">
                    <span className="text-red-700 dark:text-red-400 font-bold flex items-center gap-2 text-xs">
                        <OctagonAlert size={14} />
                        HALTED
                    </span>
                    <button
                        onClick={resetEStop}
                        className="px-3 py-1 bg-red-600 text-white rounded font-bold text-[10px] flex items-center gap-2"
                    >
                        <RotateCcw size={12} />
                        RESET
                    </button>
                </div>
            )}
        </div>
    );
}
