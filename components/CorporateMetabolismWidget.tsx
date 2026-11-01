'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend } from 'recharts';
import WidgetFooter from './WidgetFooter';

export default function CorporateMetabolismWidget() {
    const [dailyExits, setDailyExits] = useState(0);
    const [dailyCreations, setDailyCreations] = useState(0);
    const [view, setView] = useState<'ticker' | 'comparison'>('ticker');
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const viewInterval = setInterval(() => {
            setView((v) => (v === 'ticker' ? 'comparison' : 'ticker'));
        }, 12000);
        return () => clearInterval(viewInterval);
    }, [isPaused]);

    useEffect(() => {
        const updateTicker = () => {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const msSinceStart = now.getTime() - startOfDay.getTime();
            const ratioOfDay = msSinceStart / (24 * 60 * 60 * 1000);

            // Based on METI Small & Medium Enterprise White Paper + TSR Latest Survey:
            // TSR confirmed 62,695 suspensions/dissolutions (record high) + 10,006 bankruptcies (first 10k+ in 11 yrs) + sole proprietor exits (~142,000 total exits/yr)
            const yearlyExits = 142000;
            const yearlyCreations = 145000;

            const targetDailyExits = yearlyExits / 365;
            const targetDailyCreations = yearlyCreations / 365;

            setDailyExits(Math.floor(targetDailyExits * ratioOfDay));
            setDailyCreations(Math.floor(targetDailyCreations * ratioOfDay));
        };

        updateTicker();
        const tickInterval = setInterval(updateTicker, 1000);
        return () => clearInterval(tickInterval);
    }, []);

    // Data for Metabolism Rate (Opening Rate + Closing Rate) Comparison
    // Source:的中小企業庁「中小企業白書」（雇用保険事業年報ベースおよび各国統計比較）
    const internationalData = [
        { country: 'イギリス', entry: 11.8, exit: 10.6, total: 22.4 },
        { country: 'アメリカ', entry: 10.4, exit: 9.1, total: 19.5 },
        { country: 'フランス', entry: 9.8, exit: 6.2, total: 16.0 },
        { country: 'ドイツ', entry: 6.9, exit: 6.3, total: 13.2 },
        { country: '日本', entry: 3.9, exit: 3.6, total: 7.5 },
    ];

    return (
        <div
            className="widget"
            style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            <div className="widget-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', gap: '0.5rem' }}>
                <div>
                    <h2 className="widget-title" style={{ marginBottom: '0.15rem', fontSize: '1.05rem' }}>
                        <span style={{ color: 'var(--accent-orange)' }}>🔄</span> 企業の新陳代謝と休廃業・倒産急増
                    </h2>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {view === 'ticker'
                            ? '休廃業・解散6.27万件(過去最多)、倒産1万件突破(11年ぶり)'
                            : '欧米の半分以下にとどまる日本の開業・廃業率（産業の新陳代謝不全）'}
                    </p>
                </div>

                {/* View Toggles */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px' }}>
                    <button
                        onClick={() => setView('ticker')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none',
                            background: view === 'ticker' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'ticker' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'ticker' ? 700 : 500,
                        }}
                    >
                        本日推計
                    </button>
                    <button
                        onClick={() => setView('comparison')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none',
                            background: view === 'comparison' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'comparison' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'comparison' ? 700 : 500,
                        }}
                    >
                        国際比較
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
                {view === 'ticker' && (
                    <motion.div
                        key="ticker-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '0.75rem' }}
                    >
                        {/* Exits */}
                        <div style={{ background: 'rgba(239, 68, 68, 0.06)', borderRadius: '12px', padding: '0.95rem 1.15rem', border: '1px solid rgba(239, 68, 68, 0.2)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--accent-red)', fontWeight: 700 }}>
                                    📉 本日の企業退出推計 (倒産・休廃業・解散)
                                </span>
                                <span style={{ fontSize: '0.68rem', color: 'var(--accent-red)', background: 'rgba(239, 68, 68, 0.12)', padding: '2px 7px', borderRadius: '999px', fontWeight: 700 }}>
                                    休廃業62,695件・倒産10,006件/年
                                </span>
                            </div>
                            <div className="tabular-nums outfit" style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.05 }}>
                                {dailyExits.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>件 (0時起算)</span>
                            </div>
                        </div>

                        {/* New Creations */}
                        <div style={{ background: 'rgba(37, 99, 235, 0.06)', borderRadius: '12px', padding: '0.95rem 1.15rem', border: '1px solid rgba(37, 99, 235, 0.2)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                                    🌱 本日の新設法人・開業推計
                                </span>
                                <span style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', background: 'rgba(37, 99, 235, 0.12)', padding: '2px 7px', borderRadius: '999px', fontWeight: 700 }}>
                                    開業率 約3.9% (欧米の約3分の1)
                                </span>
                            </div>
                            <div className="tabular-nums outfit" style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.05 }}>
                                {dailyCreations.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>件 (0時起算)</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === 'comparison' && (
                    <motion.div
                        key="comparison-view"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35 }}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={internationalData} layout="vertical" margin={{ top: 5, right: 24, left: 6, bottom: 16 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                                <YAxis dataKey="country" type="category" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} width={58} fontWeight={600} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    formatter={(value: any, name: any) => [`${value}%`, name === 'entry' ? '開業率' : '廃業率']}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                                <Bar dataKey="entry" name="開業率" stackId="a" fill="var(--accent-blue)" radius={[0, 0, 0, 0]} animationDuration={900} />
                                <Bar dataKey="exit" name="廃業率" stackId="a" fill="var(--text-tertiary)" radius={[0, 4, 4, 0]} animationDuration={900}>
                                    {internationalData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.country === '日本' ? 'var(--accent-red)' : 'var(--text-tertiary)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}
            </div>

            <WidgetFooter
                sourceName="中小企業庁「中小企業白書」/ 東京商工リサーチ「休廃業・解散・倒産調査」"
                sourceUrl="https://www.chusho.meti.go.jp/pamflet/hakusyo/"
                shareText="【産業の新陳代謝不全】日本の休廃業・解散は過去最多の62,695件、企業倒産も11年ぶりに1万件を突破する一方、開業率は3.9%と英米（10〜12%）の3分の1水準にとどまっています。"
                isPaused={isPaused}
            />
        </div>
    );
}
