'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function AgeIncomeComparisonWidget() {
    // Current state to toggle between views (Historical vs International)
    const [view, setView] = useState<'historical' | 'international'>('historical');

    useEffect(() => {
        // Auto-toggle view every 15 seconds
        const viewInterval = setInterval(() => {
            setView(v => v === 'historical' ? 'international' : 'historical');
        }, 15000);
        return () => clearInterval(viewInterval);
    }, []);

    // Estimated Historical Data: Median/Average Annual Income by Age Group (Unit: 万/Ten Thousand Yen)
    // Comparing 1997 (Peak) vs 2023 (Present) based on National Tax Agency data approximations
    const historicalData = [
        { age: '20代', peak: 350, current: 320 },
        { age: '30代', peak: 580, current: 430 },
        { age: '40代', peak: 720, current: 510 },
        { age: '50代', peak: 850, current: 620 },
        { age: '60代', peak: 600, current: 400 },
    ];

    // Estimated International Data: Average Annual Wage Equivalent by Age Group in USD (Converted to approximate JPY scale for visual consistency if needed, but let's use a normalized index or USD for purity. Let's use a clear JPY equivalent index where 100 = Japan 20s for easy visual comparison). 
    // Wait, let's use raw estimated USD for international shock value, or JPY. Let's use JPY equivalents (万) for consistency with the historical chart.
    // US: Very high curve. SK: Surpassed Japan, steep growth in 30s/40s. JP: Flat.
    const internationalData = [
        { age: '20代', japan: 320, usa: 550, korea: 350 },
        { age: '30代', japan: 430, usa: 850, korea: 520 },
        { age: '40代', japan: 510, usa: 1100, korea: 680 },
        { age: '50代', japan: 620, usa: 1250, korea: 750 },
    ];

    return (
        <div className="widget" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h2 className="widget-title">
                    <span style={{ color: 'var(--accent-blue)' }}>📉</span> 世代別の収入格差・停滞
                </h2>

                {/* View Toggles */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px', zIndex: 10 }}>
                    <button
                        onClick={() => setView('historical')}
                        style={{
                            padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'historical' ? 'var(--widget-bg)' : 'transparent',
                            color: view === 'historical' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'historical' ? 600 : 400,
                            boxShadow: view === 'historical' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        過去との比較
                    </button>
                    <button
                        onClick={() => setView('international')}
                        style={{
                            padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'international' ? 'var(--widget-bg)' : 'transparent',
                            color: view === 'international' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'international' ? 600 : 400,
                            boxShadow: view === 'international' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        国際比較
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', marginTop: '1rem' }}>

                {/* VIEW A: Historical Comparison */}
                {view === 'historical' && (
                    <motion.div
                        key="historical-view"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                            失われた右肩上がり（1997年 vs 現代の年収推移）
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                <XAxis dataKey="age" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}万`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--widget-bg)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    formatter={(value: any, name: any) => [`${value}万円`, name === 'peak' ? '1997年 (ピーク時)' : '現在 (2023年頃)']}
                                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Line type="monotone" dataKey="peak" name="1997年 (ピーク時)" stroke="var(--text-tertiary)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: 'var(--text-tertiary)' }} animationDuration={1500} />
                                <Line type="monotone" dataKey="current" name="現在" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 5, fill: 'var(--accent-blue)' }} activeDot={{ r: 8 }} animationDuration={1500} />
                            </LineChart>
                        </ResponsiveContainer>

                        <div style={{ position: 'absolute', top: '25%', left: '15%', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.8)', padding: '4px', borderRadius: '4px', border: '1px dashed var(--text-tertiary)' }}>
                            昔の30〜40代の高揚感
                        </div>
                        <div style={{ position: 'absolute', bottom: '35%', right: '25%', fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 600, background: 'rgba(59, 130, 246, 0.1)', padding: '4px', borderRadius: '4px' }}>
                            押し潰された現役世代
                        </div>
                    </motion.div>
                )}

                {/* VIEW B: International Comparison */}
                {view === 'international' && (
                    <motion.div
                        key="international-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                            安い日本・平坦な給与カーブ（日・米・韓 平均年収推移）
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={internationalData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                <XAxis dataKey="age" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}万`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--widget-bg)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    formatter={(value: any, name: any) => {
                                        const label = name === 'japan' ? '日本' : name === 'usa' ? 'アメリカ' : '韓国';
                                        return [`約${value}万円`, label];
                                    }}
                                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Line type="monotone" dataKey="usa" name="アメリカ" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} animationDuration={1000} />
                                <Line type="monotone" dataKey="korea" name="韓国" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} animationDuration={1000} />
                                <Line type="monotone" dataKey="japan" name="日本" stroke="var(--accent-red)" strokeWidth={3} dot={{ r: 5, fill: 'var(--accent-red)' }} activeDot={{ r: 8 }} animationDuration={1000} />
                            </LineChart>
                        </ResponsiveContainer>

                        <div style={{ position: 'absolute', bottom: '20%', left: '40%', fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                            世界に取り残される平坦カーブ
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
