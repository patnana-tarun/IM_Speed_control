import React from 'react';
import { useMotor } from '../context/MotorContext';
import { Zap, Activity, Waves, Gauge } from 'lucide-react';
import clsx from 'clsx';

export default function PowerMetrics() {
    const { telemetry } = useMotor();

    const MetricCard = ({ title, value, unit, icon: Icon, color, decimals = 1 }) => {
        return (
            <div className={clsx(
                "relative overflow-hidden rounded-2xl p-5 border backdrop-blur-sm transition-all duration-300 group",
                "bg-white/80 dark:bg-black/40",
                color === 'yellow' && "border-yellow-500/30 hover:border-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]",
                color === 'blue' && "border-blue-500/30 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
                color === 'purple' && "border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]",
                color === 'emerald' && "border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            )}>
                {/* Background Glow */}
                <div className={clsx(
                    "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40",
                    color === 'yellow' && "bg-yellow-500",
                    color === 'blue' && "bg-blue-500",
                    color === 'purple' && "bg-purple-500",
                    color === 'emerald' && "bg-emerald-500"
                )} />

                <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</span>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className={clsx(
                                "text-2xl sm:text-3xl font-black font-mono tracking-tight",
                                "text-gray-800 dark:text-white"
                            )}>
                                {typeof value === 'number' ? value.toFixed(decimals) : value}
                            </span>
                            <span className="text-xs font-bold text-gray-500">{unit}</span>
                        </div>
                    </div>

                    <div className={clsx(
                        "p-2 rounded-lg bg-opacity-20 flex items-center justify-center",
                        color === 'yellow' && "bg-yellow-500 text-yellow-600 dark:text-yellow-400",
                        color === 'blue' && "bg-blue-500 text-blue-600 dark:text-blue-400",
                        color === 'purple' && "bg-purple-500 text-purple-600 dark:text-purple-400",
                        color === 'emerald' && "bg-emerald-500 text-emerald-600 dark:text-emerald-400"
                    )}>
                        <Icon size={20} />
                    </div>
                </div>
            </div>
        );
    };

    const vfRatio = telemetry.frequency > 0 ? (telemetry.voltage / telemetry.frequency) : 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
                title="RMS Voltage"
                value={telemetry.voltage}
                unit="V"
                icon={Zap}
                color="yellow"
            />
            <MetricCard
                title="Phase Current"
                value={telemetry.current}
                unit="A"
                icon={Activity}
                color="blue"
                decimals={3}
            />
            <MetricCard
                title="Frequency"
                value={telemetry.frequency || 0}
                unit="Hz"
                icon={Waves}
                color="purple"
            />
            <MetricCard
                title="V/F Ratio"
                value={vfRatio}
                unit="V/Hz"
                icon={Gauge}
                color="emerald"
                decimals={3}
            />
        </div>
    );
}

