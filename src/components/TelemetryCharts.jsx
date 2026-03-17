import React, { useState } from 'react';
import { useMotor } from '../context/MotorContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function TelemetryCharts() {
    const { history } = useMotor();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Augment history with computed vfRatio for the chart
    const chartHistory = history.map(pt => ({
        ...pt,
        vfRatio: pt.frequency > 0 ? parseFloat((pt.voltage / pt.frequency).toFixed(4)) : 0,
    }));

    const charts = [
        {
            id: 'voltage',
            title: 'Phase Voltage',
            unit: 'V',
            label: 'V_AC',
            color: '#a855f7',
            glowColor: 'rgba(168,85,247,0.3)',
            dataKey: 'voltage',
            domain: ['auto', 'auto'],
        },
        {
            id: 'current',
            title: 'Phase Current',
            unit: 'A',
            label: 'I_rms',
            color: '#06b6d4',
            glowColor: 'rgba(6,182,212,0.3)',
            dataKey: 'current',
            domain: [0, 'auto'],
        },
        {
            id: 'vfRatio',
            title: 'V/F Ratio',
            unit: 'V/Hz',
            label: 'V/F',
            color: '#10b981',
            glowColor: 'rgba(16,185,129,0.3)',
            dataKey: 'vfRatio',
            domain: [0.28, 0.40],
        },
    ];

    const nextChart = () => setCurrentIndex((prev) => (prev + 1) % charts.length);
    const prevChart = () => setCurrentIndex((prev) => (prev - 1 + charts.length) % charts.length);

    // Custom tooltips
    const CustomTooltip = ({ active, payload, label, unit }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1a1a1a] text-gray-200 text-xs p-3 rounded-lg border border-gray-800 shadow-2xl">
                    <p className="font-mono text-gray-400 mb-1">{new Date(payload[0].payload.timestamp).toLocaleTimeString()}</p>
                    <p className="font-bold text-lg text-white font-mono">{`${payload[0].value.toFixed(2)} ${unit}`}</p>
                </div>
            );
        }
        return null;
    };

    const currentChart = charts[currentIndex];

    return (
        <div className="flex flex-col gap-4 h-full min-h-0 flex-1">
            <div className="relative flex-1 group">
                {/* Navigation Arrows */}
                <button
                    onClick={prevChart}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-xl bg-gray-100/80 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/20 backdrop-blur-md text-gray-800 dark:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={nextChart}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-xl bg-gray-100/80 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/20 backdrop-blur-md text-gray-800 dark:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Chart Card */}
                <div
                    className={clsx(
                        "h-full bg-white dark:bg-[#111] p-8 rounded-3xl border transition-all duration-500 flex flex-col",
                        "border-gray-200 dark:border-gray-800 shadow-2xl",
                        currentIndex === 0 && "hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
                        currentIndex === 1 && "hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
                        currentIndex === 2 && "hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    )}
                >
                    <div className="w-full flex items-center justify-between mb-8">
                        <div className="flex flex-col">
                            <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">{currentChart.title}</h3>
                        </div>
                        <span className={clsx(
                            "text-xs font-bold font-mono py-1.5 px-3 rounded-lg border",
                            currentIndex === 0 && "text-purple-500 border-purple-500/20 bg-purple-500/5",
                            currentIndex === 1 && "text-cyan-500 border-cyan-500/20 bg-cyan-500/5",
                            currentIndex === 2 && "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                        )}>
                            {currentChart.label}
                        </span>
                    </div>

                    <div className="flex-1 w-full min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartHistory}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.05} stroke="#555" vertical={false} />
                                <XAxis dataKey="timestamp" hide domain={['dataMin', 'dataMax']} type="number" />
                                <YAxis
                                    domain={currentChart.domain}
                                    tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }}
                                    tickFormatter={val => currentIndex === 2 ? val.toFixed(3) : val.toFixed(1)}
                                    width={50}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip unit={currentChart.unit} />} cursor={{ stroke: '#333', strokeWidth: 1 }} />
                                <Line
                                    type="monotone"
                                    dataKey={currentChart.dataKey}
                                    stroke={currentChart.color}
                                    strokeWidth={3}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

