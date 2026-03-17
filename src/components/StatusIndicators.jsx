import React from 'react';
import { useMotor } from '../context/MotorContext';
import clsx from 'clsx';
import { CheckCircle2, AlertTriangle, ZapOff } from 'lucide-react';

export default function StatusIndicators() {
    const { systemStatus, isConnected } = useMotor();

    // Helper to render each indicator block
    const Indicator = ({ label, isActive, color, Icon }) => {
        const showActive = isConnected && isActive;

        const colorStyles = {
            red: {
                container: "bg-red-600 border-red-600 shadow-lg shadow-red-600/40 scale-105",
                icon: "text-white",
                text: "text-white",
                dot: "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            },
            green: {
                container: "bg-green-600 border-green-600 shadow-lg shadow-green-600/40 scale-105",
                icon: "text-white",
                text: "text-white",
                dot: "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            }
        };

        const activeStyle = colorStyles[color] || colorStyles.red; // Fallback

        return (
            <div className={clsx(
                "flex items-center gap-2 p-3 rounded-xl border transition-all duration-300",
                showActive
                    ? activeStyle.container
                    : "bg-gray-50/50 dark:bg-gray-800/20 border-gray-100 dark:border-gray-800 opacity-70 grayscale"
            )}>
                <div className={clsx(
                    "w-2 h-2 rounded-full transition-all duration-300 shrink-0",
                    showActive
                        ? activeStyle.dot
                        : "bg-gray-300 dark:bg-gray-600"
                )} />

                <span className={clsx(
                    "text-[10px] lg:text-xs font-black flex-1 transition-colors duration-300 tracking-tight",
                    showActive
                        ? activeStyle.text
                        : "text-gray-400 dark:text-gray-500"
                )}>
                    {label}
                </span>

                <Icon size={14} className={clsx(
                    "transition-colors duration-300 shrink-0",
                    showActive
                        ? activeStyle.icon
                        : "text-gray-300 dark:text-gray-600"
                )} />
            </div>
        );
    };

    return (
        // Grid layout for indicators
        <div className="grid grid-cols-1 gap-1.5 w-full h-full">
            <Indicator
                label="SYSTEM HEALTHY"
                isActive={systemStatus.healthy}
                color="green"
                Icon={CheckCircle2}
            />
            <Indicator
                label="OVERCURRENT"
                isActive={systemStatus.overcurrent}
                color="red"
                Icon={AlertTriangle}
            />
            <Indicator
                label="UNDERVOLTAGE"
                isActive={systemStatus.undervoltage}
                color="red"
                Icon={ZapOff}
            />
        </div>
    );
}
