'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import WidgetFooter from './WidgetFooter';

// MOF / BOJ Balance of Payments: Digital-related Deficit (Cloud, OS, App Store, Digital Ads, Streaming) in Trillion JPY (兆円)
const digitalDeficitData = [
    { year: '2014', deficit: 2.0 },
    { year: '2016', deficit: 2.6 },
    { year: '2018', deficit: 3.3 },
    { year: '2020', deficit: 4.1 },
    { year: '2022', deficit: 4.9 },
    { year: '2024', deficit: 6.4 },
    { year: '2025(推)', deficit: 6.8 },
];

export default function DigitalTradeDeficitWidget() {
    const [view, setView] = useState<'chart' | 'structure'>('chart');
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setView((prev) => (prev === 'chart' ? 'structure' : 'chart'));
        }, 9000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div
            className="widget"
            style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', gap: '0.5rem' }}>
                <div>
                    <h2 className="widget-title" style={{ marginBottom: '0.15rem', fontSize: '1.05rem' }}>
                        <span style={{ color: 'var(--accent-blue)' }}>🌐</span> デジタル赤字6.8兆円（国富の海外流出）
                    </h2>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {view === 'chart'
                            ? '10年で3.4倍に膨張。インバウンド黒字を帳消しにする構造的円売り'
                            : 'なぜ日本人が働くほど海外ビッグテックにお金が吸い上げられるのか'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px' }}>
                    <button
                        onClick={() => setView('chart')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none',
                            background: view === 'chart' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'chart' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'chart' ? 700 : 500,
                        }}
                    >
                        赤字額の推移
                    </button>
                    <button
                        onClick={() => setView('structure')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none',
                            background: view === 'structure' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'structure' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'structure' ? 700 : 500,
                        }}
                    >
                        流出の内訳
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
                <AnimatePresence mode="wait">
                    {view === 'chart' && (
                        <motion.div
                            key="chart-view"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={digitalDeficitData} margin={{ top: 18, right: 12, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis domain={[0, 8]} tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `-${v}兆`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.78rem' }}
                                        formatter={(val: any) => [`-${val}兆円 / 年`, 'デジタル収支赤字']}
                                    />
                                    <Bar dataKey="deficit" radius={[5, 5, 0, 0]} animationDuration={900}>
                                        {digitalDeficitData.map((entry, idx) => (
                                            <Cell key={idx} fill={idx >= 5 ? 'var(--accent-red)' : 'var(--accent-blue)'} fillOpacity={0.82} />
                                        ))}
                                        <LabelList dataKey="deficit" position="top" formatter={(v: any) => `-${v}兆`} style={{ fontSize: '9px', fontWeight: 800, fill: 'var(--text-primary)' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {view === 'structure' && (
                        <motion.div
                            key="structure-view"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem', paddingRight: '4px' }}
                        >
                            <div style={{ background: 'rgba(239, 68, 68, 0.06)', borderRadius: '8px', padding: '0.65rem 0.75rem', borderLeft: '3px solid var(--accent-red)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--accent-red)', marginBottom: '2px' }}>
                                    ① クラウド・AI基盤の全面外資依存（AWS / Azure / Google）
                                </div>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    行政システム（ガバメントクラウド）から民間企業の基幹システム、生成AI利用料まで米ビッグテックへの支払いが毎年数兆円規模で増加しています。
                                </p>
                            </div>
                            <div style={{ background: 'rgba(37, 99, 235, 0.06)', borderRadius: '8px', padding: '0.65rem 0.75rem', borderLeft: '3px solid var(--accent-blue)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--accent-blue)', marginBottom: '2px' }}>
                                    ② スマホ経済圏・SNS広告・サブスクの「デジタル年貢」
                                </div>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    iOS/Androidのアプリ決済手数料、YouTube・Instagram等のWeb広告費、動画・音楽配信サービスの利用料が24時間365日ドル買い・円売りを発生させています。
                                </p>
                            </div>
                            <div style={{ background: 'rgba(249, 115, 22, 0.06)', borderRadius: '8px', padding: '0.65rem 0.75rem', borderLeft: '3px solid var(--accent-orange)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--accent-orange)', marginBottom: '2px' }}>
                                    ③ インバウンド観光の稼ぎ（約5〜6兆円）が丸ごと消滅
                                </div>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    外国人観光客が日本で落とした外貨とほぼ同額〜それ以上の国富が、デジタル赤字として自動的に海外へ流出する構造に陥っています。
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.7rem', background: 'rgba(37, 99, 235, 0.06)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--accent-blue)' }}>新陳代謝の欠如が招いた「第2のエネルギー赤字」。</strong>国内のIT人材・次世代産業への投資を怠った結果、毎年約6.8兆円が海外へ流出しています。
            </div>

            <WidgetFooter
                sourceName="財務省・日本銀行「国際収支統計」デジタル関連収支"
                sourceUrl="https://www.mof.go.jp/policy/international_policy/reference/balance_of_payments/index.htm"
                shareText="【デジタル赤字6.8兆円の衝撃】クラウド・OS・SNS広告・サブスクなど海外IT巨人への支払超過が10年で3倍以上の約6.8兆円へ膨張。インバウンドの稼ぎが丸ごと海外へ流出しています。"
                isPaused={isPaused}
            />
        </div>
    );
}
