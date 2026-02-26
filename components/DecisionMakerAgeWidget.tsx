'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DecisionMakerAgeWidget() {
    // Current state to toggle between views (CEOs vs Politicians)
    const [view, setView] = useState<'ceo' | 'diet'>('ceo');

    useEffect(() => {
        // Auto-toggle view every 12 seconds
        const viewInterval = setInterval(() => {
            setView(v => v === 'ceo' ? 'diet' : 'ceo');
        }, 12000);
        return () => clearInterval(viewInterval);
    }, []);

    // Estimated data based on Tokyo Shoko Research (CEOs) and Diet Member Demographics
    const ceoData = [
        { name: '80歳以上', value: 12.5, color: '#991b1b' }, // Dark Red
        { name: '70代', value: 31.8, color: '#dc2626' }, // Red
        { name: '60代', value: 27.6, color: '#f97316' }, // Orange
        { name: '50代', value: 19.4, color: '#fcd34d' }, // Yellow
        { name: '40代', value: 7.2, color: '#60a5fa' }, // Blue
        { name: '30代以下', value: 1.5, color: '#3b82f6' }, // Dark Blue
    ];

    const dietData = [
        { name: '80歳以上', value: 4.8, color: '#991b1b' },
        { name: '70代', value: 24.2, color: '#dc2626' },
        { name: '60代', value: 29.5, color: '#f97316' },
        { name: '50代', value: 28.1, color: '#fcd34d' },
        { name: '40代', value: 10.3, color: '#60a5fa' },
        { name: '30代以下', value: 3.1, color: '#3b82f6' },
    ];

    const activeData = view === 'ceo' ? ceoData : dietData;

    // Calculate total percentage 60 and over to highlight the issue
    const over60Percent = activeData.filter(d => ['80歳以上', '70代', '60代'].includes(d.name)).reduce((sum, item) => sum + item.value, 0);

    // Custom labeled pie function
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        if (percent < 0.05) return null; // Don't show label for tiny slices

        return (
            <text x={x} y={y} fill="white" fontSize="12" fontWeight="bold" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="widget" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h2 className="widget-title">
                    <span style={{ color: 'var(--accent-orange)' }}>👨‍🦳</span> 意思決定者の高齢化
                </h2>

                {/* View Toggles */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px', zIndex: 10 }}>
                    <button
                        onClick={() => setView('ceo')}
                        style={{
                            padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'ceo' ? 'var(--widget-bg)' : 'transparent',
                            color: view === 'ceo' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'ceo' ? 600 : 400,
                            boxShadow: view === 'ceo' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        企業社長
                    </button>
                    <button
                        onClick={() => setView('diet')}
                        style={{
                            padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'diet' ? 'var(--widget-bg)' : 'transparent',
                            color: view === 'diet' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'diet' ? 600 : 400,
                            boxShadow: view === 'diet' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        国会議員
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                過半数が60歳以上。「逃げ切る世代」による未来の決定構造。
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <AnimateChange view={view}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                            <Pie
                                data={activeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={110}
                                fill="#8884d8"
                                dataKey="value"
                                stroke="var(--widget-bg)"
                                strokeWidth={2}
                                animationDuration={1000}
                            >
                                {activeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--widget-bg)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                                formatter={(value: any) => [`${value}%`, '構成比']}
                            />
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ fontSize: '11px', bottom: -5 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </AnimateChange>

                {/* Center / Highlight stat overlay */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-red)', fontWeight: 600 }}>60歳以上の割合</span>
                    <span style={{ fontSize: '1.5rem', color: 'var(--accent-red)', fontWeight: 800, lineHeight: 1 }}>{over60Percent.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
}

// Helper component for smooth transitions between pie charts
function AnimateChange({ children, view }: { children: React.ReactNode, view: string }) {
    return (
        <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
            {children}
        </motion.div>
    );
}
