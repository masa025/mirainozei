'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine, LabelList } from 'recharts';
import WidgetFooter from './WidgetFooter';

const domesticData = [
    { year: '2020', wage: 100.0, cpi: 100.0 },
    { year: '2021', wage: 100.3, cpi: 99.8 },
    { year: '2022', wage: 102.0, cpi: 102.8 },
    { year: '2023', wage: 103.2, cpi: 106.7 },
    { year: '2024', wage: 106.0, cpi: 109.9 },
    { year: '2025', wage: 108.4, cpi: 113.1 },
];

const globalData = [
    { country: '韓国', growth: 161, color: '#3b82f6' },
    { country: '米国', growth: 51, color: '#10b981' },
    { country: '英国', growth: 42, color: '#f59e0b' },
    { country: 'ドイツ', growth: 34, color: '#8b5cf6' },
    { country: 'フランス', growth: 31, color: '#ec4899' },
    { country: '日本', growth: 3, color: '#ef4444' },
];

export default function RealWageWidget() {
    const [view, setView] = useState<'domestic' | 'global'>('domestic');
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setView(prev => (prev === 'domestic' ? 'global' : 'domestic'));
        }, 11000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div
            className="widget h-full flex flex-col relative overflow-hidden"
            style={{ minHeight: '360px', height: '100%' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            {/* Header and Toggle Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', position: 'relative', zIndex: 10, gap: '0.5rem' }}>
                <div>
                    <h3 className="outfit" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 3v18h18" />
                            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                        </svg>
                        実質賃金の推移と国際比較
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                        {view === 'domestic' ? '物価高騰と名目賃金の乖離 (2020年=100)' : '主要国の実質賃金上昇率 (1990年比)'}
                    </p>
                </div>

                {/* Manual Toggle Buttons */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.06)', padding: '2px', borderRadius: '6px' }}>
                    <button
                        onClick={() => setView('domestic')}
                        style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer', border: 'none', background: view === 'domestic' ? 'rgba(255,255,255,0.9)' : 'transparent', color: view === 'domestic' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: view === 'domestic' ? 700 : 500 }}
                    >
                        国内推移
                    </button>
                    <button
                        onClick={() => setView('global')}
                        style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer', border: 'none', background: view === 'global' ? 'rgba(255,255,255,0.9)' : 'transparent', color: view === 'global' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: view === 'global' ? 700 : 500 }}
                    >
                        国際比較
                    </button>
                </div>
            </div>

            {/* Chart Area with Crossfade Animation */}
            <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '220px' }}>
                <AnimatePresence mode="wait">
                    {view === 'domestic' && (
                        <motion.div
                            key="domestic-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.35 }}
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
                                    <XAxis dataKey="year" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis domain={[95, 115]} stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                        formatter={(value: any, name: any) => [Number(value).toFixed(1), name === 'cpi' ? '消費者物価指数' : '名目賃金指数']}
                                    />
                                    <ReferenceLine y={100} stroke="rgba(0,0,0,0.2)" strokeDasharray="3 3" />
                                    <Area type="monotone" dataKey="cpi" name="cpi" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCpi)" animationDuration={1100} />
                                    <Area type="monotone" dataKey="wage" name="wage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWage)" animationDuration={1100} />
                                </AreaChart>
                            </ResponsiveContainer>

                            <div style={{ position: 'absolute', right: '12px', top: '12%', fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                生活費の高騰 ↑
                            </div>
                            <div style={{ position: 'absolute', right: '12px', bottom: '22%', fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700, background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                給与の伸び悩み →
                            </div>
                        </motion.div>
                    )}

                    {view === 'global' && (
                        <motion.div
                            key="global-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.35 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={globalData} layout="vertical" margin={{ top: 5, right: 44, left: 6, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={true} vertical={false} />
                                    <XAxis type="number" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `+${val}%`} />
                                    <YAxis dataKey="country" type="category" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} width={56} fontWeight={600} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                        formatter={(value: any) => [`+${value}%`, '実質賃金上昇率(1990年比)']}
                                    />
                                    <Bar dataKey="growth" radius={[0, 4, 4, 0]} animationDuration={900}>
                                        {globalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                        <LabelList dataKey="growth" position="right" formatter={(v: any) => `+${v}%`} style={{ fontSize: '10px', fontWeight: 700, fill: 'var(--text-primary)' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <WidgetFooter
                sourceName="厚生労働省「毎月勤労統計調査」/ OECD Stat"
                sourceUrl="https://www.mhlw.go.jp/toukei/list/30-1a.html"
                shareText="【実質賃金の停滞】1990年以降、米国+51%・韓国+161%と実質賃金が伸びる中、日本はわずか+3%でほぼ横ばい。さらに足元の物価高に賃金が追いついていません。"
                isPaused={isPaused}
            />
        </div>
    );
}
