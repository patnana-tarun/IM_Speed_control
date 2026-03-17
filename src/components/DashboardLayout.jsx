import React, { useState } from 'react';
import { useMotor } from '../context/MotorContext';
import { Network, Activity, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import clsx from 'clsx';

export default function DashboardLayout({ children }) {
    const { isConnected, connect, disconnect } = useMotor();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-100 dark:bg-[#050505] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 flex flex-col overflow-hidden">
            {/* Top Status Bar (Responsive) */}
            <header className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 shadow-sm z-50 shrink-0">
                <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-[1800px] mx-auto">

                    {/* Logo Area */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                            <Activity className="text-white" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base sm:text-lg font-black tracking-widest uppercase text-gray-900 dark:text-white leading-none">
                                Motor<span className="text-blue-500">Ctrl</span>
                            </h1>
                            <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hidden xs:block">
                                V/Hz Drive System
                            </span>
                        </div>
                    </div>

                    {/* Desktop Controls */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Connection Status Pill */}
                        <div className={clsx(
                            "px-4 py-1.5 rounded-full border flex items-center gap-3 text-xs font-bold tracking-wider transition-colors",
                            isConnected
                                ? "bg-green-500/10 border-green-500/30 text-green-500"
                                : "bg-red-500/10 border-red-500/30 text-red-500"
                        )}>
                            <div className={clsx("w-2 h-2 rounded-full animate-pulse", isConnected ? "bg-green-500" : "bg-red-500")} />
                            {isConnected ? 'ONLINE' : 'OFFLINE'}
                        </div>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

                        <button
                            onClick={isConnected ? disconnect : connect}
                            className={clsx(
                                "relative px-5 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all overflow-hidden group hover:scale-105 active:scale-95",
                                isConnected
                                    ? "bg-red-600 hover:bg-red-500 text-white"
                                    : "bg-blue-600 hover:bg-blue-500 text-white"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <Network size={16} />
                                {isConnected ? 'Disconnect' : 'Connect'}
                            </span>
                        </button>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

                        <ThemeToggle />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Controls */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Status</span>
                            <div className={clsx(
                                "px-3 py-1 rounded-full border flex items-center gap-2 text-xs font-bold tracking-wider",
                                isConnected
                                    ? "bg-green-500/10 border-green-500/30 text-green-500"
                                    : "bg-red-500/10 border-red-500/30 text-red-500"
                            )}>
                                <div className={clsx("w-2 h-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
                                {isConnected ? 'ONLINE' : 'OFFLINE'}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                isConnected ? disconnect() : connect();
                                setMobileMenuOpen(false);
                            }}
                            className={clsx(
                                "w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2",
                                isConnected
                                    ? "bg-red-600 text-white"
                                    : "bg-blue-600 text-white"
                            )}
                        >
                            <Network size={18} />
                            {isConnected ? 'Disconnect System' : 'Connect Interface'}
                        </button>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Theme</span>
                            <ThemeToggle />
                        </div>
                    </div>
                )}
            </header>

            {/* Main Dashboard Grid */}
            <main className="flex-1 p-3 sm:p-4 overflow-hidden">
                <div className="max-w-[1800px] mx-auto h-full flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}
