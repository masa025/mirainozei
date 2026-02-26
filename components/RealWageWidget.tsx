'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from 'recharts';

// Data A: Domestic (Japan's "Lost 30 Years" / Recent Inflation Crisis) - Index: 2020=100 (Approximations based on MHLW & MIC data)
const domesticData = [
    { year: '2020', wage: 100.0, cpi: 100.0 },
    { year: '2021', wage: 100.1, cpi: 99.8 },
    { year: '2022', wage: 101.9, cpi: 102.3 },
    { year: '2023', wage: 103.1, cpi: 105.6 },
    { year: '2024(推)', wage: 105.2, cpi: 108.5 },
];

// Data B: Global Real Wage Growth (Cumulative % change since ~1990, OECD approximations)
const globalData = [
    { country: '韓国', growth: 161, color: '#3b82f6' },
    { country: '米国', growth: 51, color: '#10b981' },
    { country: '英国', growth: 42, color: '#f59e0b' },
    { country: 'ドイツ', growth: 34, color: '#8b5cf6' },
    { country: 'フランス', growth: 31, color: '#ec4899' },
    { country: '日本', growth: 3, color: '#ef4444' }, // Highlighted in red
];

export default function RealWageWidget() {
    const [view, setView] = useState<'domestic' | 'global'>('domestic');

    useEffect(() => {
        // Auto-toggle views every 12 seconds
        const interval = setInterval(() => {
            setView(prev => prev === 'domestic' ? 'global' : 'domestic');
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="widget h-full flex flex-col relative overflow-hidden" style={{ minHeight: '300px' }}>

            {/* Header and Toggle Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
                <div>
                    <h3 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 3v18h18" />
                            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                        </svg>
                        実質賃金の推移と国際比較
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                        {view === 'domestic' ? '物価高騰と賃金の乖離 (2020年=100)' : '主要国の実質賃金上昇率 (1990年比)'}
                    </p>
                </div>

                {/* Manual Toggle Buttons */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.1)', padding: '2px', borderRadius: '6px' }}>
                    <button
                        onClick={() => setView('domestic')}
                        style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none', background: view === 'domestic' ? 'var(--widget-bg)' : 'transparent', color: view === 'domestic' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: view === 'domestic' ? 600 : 400, boxShadow: view === 'domestic' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
                    >
                        国内推移
                    </button>
                    <button
                        onClick={() => setView('global')}
                        style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none', background: view === 'global' ? 'var(--widget-bg)' : 'transparent', color: view === 'global' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: view === 'global' ? 600 : 400, boxShadow: view === 'global' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
                    >
                        国際比較
                    </button>
                </div>
            </div>

            {/* Chart Area with Crossfade Animation */}
            <div style={{ flex: 1, position: 'relative', width: '100%' }}>
                <AnimatePresence mode="wait">

                    {/* VIEW A: Domestic Wage vs Inflation */}
                    {view === 'domestic' && (
                        <motion.div
                            key="domestic-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={domesticData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCpi" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorWage" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                    <XAxis dataKey="year" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis domain={[95, 110]} stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--widget-bg)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ fontSize: '0.85rem' }}
                                        labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                                        formatter={(value: any, name: any) => [Number(value).toFixed(1), name === 'cpi' ? '消費者物価指数' : '名目賃金']}
                                    />
                                    <ReferenceLine y={100} stroke="rgba(0,0,0,0.2)" strokeDasharray="3 3" />
                                    <Area type="monotone" dataKey="cpi" name="cpi" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCpi)" animationDuration={1500} />
                                    <Area type="monotone" dataKey="wage" name="wage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWage)" animationDuration={1500} />
                                </AreaChart>
                            </ResponsiveContainer>

                            {/* Overlay Annotations */}
                            <div style={{ position: 'absolute', right: '15px', top: '15%', fontSize: '0.8rem', color: '#ef4444', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                生活費の高騰 ↑
                            </div>
                            <div style={{ position: 'absolute', right: '15px', bottom: '25%', fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                給与の伸び悩み →
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW B: Global Wage Growth Comparison */}
                    {view === 'global' && (
                        <motion.div
                            key="global-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={globalData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={true} vertical={false} />
                                    <XAxis type="number" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `+${val}%`} />
                                    <YAxis dataKey="country" type="category" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} width={60} fontWeight={600} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ backgroundColor: 'var(--widget-bg)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                        formatter={(value: any) => [`+${value}%`, '実質賃金上昇率']}
                                    />
                                    <Bar dataKey="growth" radius={[0, 4, 4, 0]} animationDuration={1000}>
                                        {globalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>

                            <div style={{ position: 'absolute', right: '10px', bottom: '5px', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                                ※ 1990年〜 近年の累積上昇率 (OECD推計)
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

        </div>
    );
}
