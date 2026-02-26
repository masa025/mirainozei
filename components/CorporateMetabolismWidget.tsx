'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend } from 'recharts';

export default function CorporateMetabolismWidget() {
    // Current state simulating daily bankruptcies vs creations
    const [dailyExits, setDailyExits] = useState(0);
    const [dailyCreations, setDailyCreations] = useState(0);

    // Toggle between ticker and international comparison view
    const [view, setView] = useState<'ticker' | 'comparison'>('ticker');

    useEffect(() => {
        // Auto-toggle view every 15 seconds
        const viewInterval = setInterval(() => {
            setView(v => v === 'ticker' ? 'comparison' : 'ticker');
        }, 15000);

        // Simulate daily data ticking up (Based on 2024 METI White Paper, Entry and Exit rates are approx 3.9% - 5%)
        // Assuming ~3.5 million enterprises, 3.9% is roughly 136,500.

        const updateTicker = () => {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const msSinceStart = now.getTime() - startOfDay.getTime();
            const ratioOfDay = msSinceStart / (24 * 60 * 60 * 1000);

            // Estimated yearly totals (using ~4.0% entry, ~3.9% exit for realism)
            const yearlyExits = 136500; // Represents all exits: Suspensions, Dissolutions, Bankruptcies
            const yearlyCreations = 140000;

            // Daily targets (assuming 365 days)
            const targetDailyExits = yearlyExits / 365;
            const targetDailyCreations = yearlyCreations / 365;

            setDailyExits(Math.floor(targetDailyExits * ratioOfDay));
            setDailyCreations(Math.floor(targetDailyCreations * ratioOfDay));
        };

        updateTicker();
        const tickInterval = setInterval(updateTicker, 1000); // Update every second to feel 'live'

        return () => {
            clearInterval(viewInterval);
            clearInterval(tickInterval);
        };
    }, []);

    // Data for Metabolism Rate (Opening Rate + Closing Rate) Comparison
    // Source: General OECD/METI comparisons (Approximate for illustration)
    const internationalData = [
        { country: 'イギリス', entry: 12.1, exit: 10.5, total: 22.6 },
        { country: 'アメリカ', entry: 10.5, exit: 9.3, total: 19.8 },
        { country: 'ドイツ', entry: 7.2, exit: 6.4, total: 13.6 },
        { country: '日本', entry: 5.1, exit: 3.8, total: 8.9 }, // Notably low entry and exit = low metabolism
    ].sort((a, b) => b.total - a.total); // Sort by highest metabolism

    return (
        <div className="widget" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h2 className="widget-title">
                    <span style={{ color: 'var(--accent-orange)' }}>🔄</span> 企業の新陳代謝（開廃業）
                </h2>

                {/* View Toggles */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px' }}>
                    <button
                        onClick={() => setView('ticker')}
                        style={{
                            padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'ticker' ? 'var(--widget-bg)' : 'transparent',
                            color: view === 'ticker' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'ticker' ? 600 : 400,
                            boxShadow: view === 'ticker' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        本日推計
                    </button>
                    <button
                        onClick={() => setView('comparison')}
                        style={{
                            padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'comparison' ? 'var(--widget-bg)' : 'transparent',
                            color: view === 'comparison' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'comparison' ? 600 : 400,
                            boxShadow: view === 'comparison' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        国際比較
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>

                {/* VIEW A: Daily Ticker */}
                {view === 'ticker' && (
                    <motion.div
                        key="ticker-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '1.5rem' }}
                    >
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '-0.5rem' }}>
                            本日の推定件数 (0時起算)
                        </div>

                        {/* Exits */}
                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--accent-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>📉</span> 企業退出 (倒産・休廃業・解散)
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', lineHeight: 1 }}>
                                {dailyExits.toLocaleString()} <span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>件</span>
                            </div>

                            {/* subtle pulse effect for exits */}
                            <motion.div
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ position: 'absolute', right: '-10%', top: '-20%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}
                            />
                        </div>

                        {/* New Creations */}
                        <div style={{ background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.2)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>🌱</span> 新設法人・開業
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', lineHeight: 1 }}>
                                {dailyCreations.toLocaleString()} <span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>件</span>
                            </div>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                            ※年間統計（廃業率/開業率 約4%）に基づく1日あたりの推計値
                        </div>
                    </motion.div>
                )}

                {/* VIEW B: International Metabolism Rate */}
                {view === 'comparison' && (
                    <motion.div
                        key="comparison-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            開業率・廃業率の国際比較 (代謝の低さ)
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={internationalData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                                <YAxis dataKey="country" type="category" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} width={60} fontWeight={600} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{ backgroundColor: 'var(--widget-bg)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    formatter={(value: any, name: any) => [`${value}%`, name === 'entry' ? '開業率' : '廃業率']}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                {/* Stacked bars to show total "metabolism" (churn) */}
                                <Bar dataKey="entry" name="開業率" stackId="a" fill="var(--accent-blue)" radius={[0, 0, 0, 0]} animationDuration={1000} />
                                <Bar dataKey="exit" name="廃業率" stackId="a" fill="var(--text-tertiary)" radius={[0, 4, 4, 0]} animationDuration={1000} >
                                    {internationalData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.country === '日本' ? 'var(--accent-red)' : 'var(--text-tertiary)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        <div style={{ position: 'absolute', bottom: '0', right: '0', fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                            日本の著しい低代謝構造
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
