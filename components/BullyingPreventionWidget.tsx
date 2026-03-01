'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

// Data based on MEXT statistics
// Budget: 億円 (100 million JPY)
// Total Cases: 万件 (10,000 cases)
// Serious Incidents: 件 (cases)
// Resolution Rate: %
const metricsData = [
    { year: '2019', budget: 70, totalCases: 61.2, serious: 723, resolutionRate: 79.5 },
    { year: '2020', budget: 72, totalCases: 51.7, serious: 514, resolutionRate: 77.0 }, // COVID year dip
    { year: '2021', budget: 75, totalCases: 61.5, serious: 705, resolutionRate: 80.1 },
    { year: '2022', budget: 80, totalCases: 68.2, serious: 919, resolutionRate: 78.0 },
    { year: '2023', budget: 85, totalCases: 73.3, serious: 1306, resolutionRate: 77.5 },
    { year: '2024', budget: 88, totalCases: 75.0, serious: 1405, resolutionRate: 77.0 }, // 2024 estimates based on 令和6年度
];

// Custom Tooltip for View A (Budget vs Total Cases)
const TooltipA = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'var(--widget-bg)', padding: '10px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <p style={{ fontWeight: 800, margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{label}年度</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-blue)' }}>対策予算: <span style={{ fontWeight: 700 }}>{payload[0].value} 億円</span></p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-red)' }}>認知件数: <span style={{ fontWeight: 700 }}>{payload[1].value} 万件</span></p>
            </div>
        );
    }
    return null;
};

// Custom Tooltip for View B (Budget vs Serious Incidents)
const TooltipB = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'var(--widget-bg)', padding: '10px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <p style={{ fontWeight: 800, margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{label}年度</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-blue)' }}>対策予算: <span style={{ fontWeight: 700 }}>{payload[0].value} 億円</span></p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#f59e0b' }}>重大事態件数: <span style={{ fontWeight: 700 }}>{payload[1].value} 件</span></p>
            </div>
        );
    }
    return null;
};

// Custom Tooltip for View C (Resolution Rate vs Serious Incidents)
const TooltipC = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'var(--widget-bg)', padding: '10px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <p style={{ fontWeight: 800, margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{label}年度</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981' }}>報告上の解消率: <span style={{ fontWeight: 700 }}>{payload[0].value}%</span></p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#f59e0b' }}>重大事態件数: <span style={{ fontWeight: 700 }}>{payload[1].value} 件</span></p>
            </div>
        );
    }
    return null;
};

type ViewMode = 'viewA' | 'viewB' | 'viewC';

export default function BullyingPreventionWidget() {
    const [view, setView] = useState<ViewMode>('viewA');

    // Auto-toggle views every 7 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setView(prev => {
                if (prev === 'viewA') return 'viewB';
                if (prev === 'viewB') return 'viewC';
                return 'viewA';
            });
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const renderHeader = () => {
        switch (view) {
            case 'viewA':
                return {
                    subtitle: '予算消化 vs 認知総数',
                    title: '金でいじめは減らない',
                    desc: '予算を増やしても過去最多を更新し続ける認知件数'
                };
            case 'viewB':
                return {
                    subtitle: '対策予算 vs 重大事態',
                    title: '防げない「命の危機」',
                    desc: '数十億円のシステム整備でも急増する生死に関わる重大事態'
                };
            case 'viewC':
                return {
                    subtitle: '報告解消率 vs 重大事態',
                    title: '形骸化する「解消率80%」',
                    desc: '「解決した」と報告される裏で過去最多となる深刻な事案'
                };
        }
    };

    const headerContent = renderHeader();

    return (
        <div className="widget" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header & Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', minHeight: '60px' }}>
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', fontWeight: 600 }}>
                        {headerContent.subtitle}
                    </h3>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {headerContent.title}
                    </div>
                </motion.div>

                {/* Manual View Toggles */}
                <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.05)', padding: '0.25rem', borderRadius: '20px' }}>
                    {(['viewA', 'viewB', 'viewC'] as ViewMode[]).map((mode, index) => (
                        <button
                            key={mode}
                            onClick={() => setView(mode)}
                            style={{
                                padding: '0.2rem 0.6rem',
                                fontSize: '0.75rem',
                                borderRadius: '15px',
                                background: view === mode ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                                color: view === mode ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                fontWeight: view === mode ? 700 : 500,
                                border: view === mode ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {['全体', '重大', '矛盾'][index]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Area */}
            <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
                <AnimatePresence mode="wait">

                    {/* VIEW A: Budget vs Total Cases */}
                    {view === 'viewA' && (
                        <motion.div
                            key="viewA"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                {headerContent.desc}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '12px', height: '12px', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '2px' }}></div>
                                    対策予算(億円)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '12px', height: '3px', background: 'var(--accent-red)', borderRadius: '2px' }}></div>
                                    認知件数(万件)
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={metricsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                    <RechartsTooltip content={<TooltipA />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                    <Bar yAxisId="left" dataKey="budget" fill="var(--accent-blue)" fillOpacity={0.3} radius={[4, 4, 0, 0]} animationDuration={1000} />
                                    <Line yAxisId="right" type="monotone" dataKey="totalCases" stroke="var(--accent-red)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-red)' }} activeDot={{ r: 6 }} animationDuration={1000} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* VIEW B: Budget vs Serious Incidents */}
                    {view === 'viewB' && (
                        <motion.div
                            key="viewB"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                {headerContent.desc}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '12px', height: '12px', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '2px' }}></div>
                                    対策予算(億円)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '12px', height: '3px', background: '#f59e0b', borderRadius: '2px' }}></div>
                                    重大事態(件)
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={metricsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[500, 1500]} />
                                    <RechartsTooltip content={<TooltipB />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                    <Bar yAxisId="left" dataKey="budget" fill="var(--accent-blue)" fillOpacity={0.3} radius={[4, 4, 0, 0]} animationDuration={1000} />
                                    <Line yAxisId="right" type="stepAfter" dataKey="serious" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} animationDuration={1000} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* VIEW C: Resolution Rate vs Serious Incidents */}
                    {view === 'viewC' && (
                        <motion.div
                            key="viewC"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                {headerContent.desc}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '12px', height: '12px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '2px' }}></div>
                                    報告上の解消率(%)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '12px', height: '3px', background: '#f59e0b', borderRadius: '2px' }}></div>
                                    重大事態(件)
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={metricsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[60, 100]} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[500, 1500]} />
                                    <RechartsTooltip content={<TooltipC />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                    <Area yAxisId="left" type="monotone" dataKey="resolutionRate" fill="#10b981" fillOpacity={0.15} stroke="#10b981" animationDuration={1000} />
                                    <Line yAxisId="right" type="monotone" dataKey="serious" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} animationDuration={1000} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Conclusion / Insight Footer */}
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: '#f59e0b' }}>「対策予算の増加」も「80%近い解消率」も、命の危機を防ぐ指標にはなりません。</strong>
                    表面的な数値目標を追いかける一方で、現場の深刻なSOS（重大事態件数）は過去最悪を更新し続けています。
                </p>
            </div>
        </div>
    );
}
