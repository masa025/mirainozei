'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import WidgetFooter from './WidgetFooter';

export default function AgeIncomeComparisonWidget() {
    const [view, setView] = useState<'historical' | 'international'>('historical');
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const viewInterval = setInterval(() => {
            setView(v => (v === 'historical' ? 'international' : 'historical'));
        }, 12000);
        return () => clearInterval(viewInterval);
    }, [isPaused]);

    const historicalData = [
        { age: '20代', peak: 350, current: 320 },
        { age: '30代', peak: 580, current: 430 },
        { age: '40代', peak: 720, current: 510 },
        { age: '50代', peak: 850, current: 620 },
        { age: '60代', peak: 600, current: 400 },
    ];

    const internationalData = [
        { age: '20代', japan: 320, usa: 550, korea: 350 },
        { age: '30代', japan: 430, usa: 850, korea: 520 },
        { age: '40代', japan: 510, usa: 1100, korea: 680 },
        { age: '50代', japan: 620, usa: 1250, korea: 750 },
    ];

    return (
        <div
            className="widget"
            style={{ height: '100%', minHeight: '360px', display: 'flex', flexDirection: 'column' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                <h2 className="widget-title" style={{ marginBottom: 0 }}>
                    <span style={{ color: 'var(--accent-blue)' }}>📉</span> 世代別の収入格差・停滞
                </h2>

                {/* View Toggles */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px', zIndex: 10 }}>
                    <button
                        onClick={() => setView('historical')}
                        style={{
                            padding: '4px 8px', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'historical' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'historical' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'historical' ? 700 : 500,
                        }}
                    >
                        過去比較
                    </button>
                    <button
                        onClick={() => setView('international')}
                        style={{
                            padding: '4px 8px', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'international' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'international' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'international' ? 700 : 500,
                        }}
                    >
                        国際比較
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', marginTop: '0.5rem', minHeight: '220px' }}>
                {view === 'historical' && (
                    <motion.div
                        key="historical-view"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35 }}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                            失われた右肩上がり（1997年ピーク時 vs 現代の年齢別年収）
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalData} margin={{ top: 10, right: 16, left: -10, bottom: 16 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                <XAxis dataKey="age" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}万`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    formatter={(value: any, name: any) => [`${value}万円`, name === 'peak' ? '1997年 (ピーク時)' : '現在']}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                                <Line type="monotone" dataKey="peak" name="1997年 (ピーク)" stroke="var(--text-tertiary)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: 'var(--text-tertiary)' }} animationDuration={1000} />
                                <Line type="monotone" dataKey="current" name="現在" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 5, fill: 'var(--accent-blue)' }} activeDot={{ r: 7 }} animationDuration={1000} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {view === 'international' && (
                    <motion.div
                        key="international-view"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35 }}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                            安い日本・平坦な給与カーブ（日・米・韓 平均年収推移）
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={internationalData} margin={{ top: 10, right: 16, left: -10, bottom: 16 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                <XAxis dataKey="age" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}万`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    formatter={(value: any, name: any) => {
                                        const label = name === 'japan' ? '日本' : name === 'usa' ? 'アメリカ' : '韓国';
                                        return [`約${value}万円`, label];
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                                <Line type="monotone" dataKey="usa" name="アメリカ" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} animationDuration={900} />
                                <Line type="monotone" dataKey="korea" name="韓国" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} animationDuration={900} />
                                <Line type="monotone" dataKey="japan" name="日本" stroke="var(--accent-red)" strokeWidth={3} dot={{ r: 5, fill: 'var(--accent-red)' }} activeDot={{ r: 7 }} animationDuration={900} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}
            </div>

            <WidgetFooter
                sourceName="国税庁「民間給与実態統計調査」/ OECD"
                sourceUrl="https://www.nta.go.jp/publication/statistics/kokuzeicho/minkan/top.htm"
                shareText="【押し潰された現役世代】1997年には30代580万・40代720万だった年齢別年収カーブが、現在は30代430万・40代510万へと大幅に下落。"
                isPaused={isPaused}
            />
        </div>
    );
}
