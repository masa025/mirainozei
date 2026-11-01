'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';
import WidgetFooter from './WidgetFooter';

// Historical progression of Social Insurance Rate (Pension + Health + Nursing Care, Employer + Employee combined %)
// and the widening gap ("Crocodile Mouth" / ワニの口) between Company Total Labor Cost Index (2000=100) and Worker Net Take-Home Pay Index (2000=100)
const wedgeData = [
    { year: '2000', laborCostIdx: 100.0, takeHomeIdx: 100.0, socialInsRate: 21.5 },
    { year: '2005', laborCostIdx: 99.5, takeHomeIdx: 96.2, socialInsRate: 23.4 },
    { year: '2010', laborCostIdx: 99.8, takeHomeIdx: 93.1, socialInsRate: 25.8 },
    { year: '2015', laborCostIdx: 101.2, takeHomeIdx: 90.4, socialInsRate: 28.9 },
    { year: '2020', laborCostIdx: 102.5, takeHomeIdx: 88.5, socialInsRate: 30.1 },
    { year: '2025', laborCostIdx: 104.0, takeHomeIdx: 86.8, socialInsRate: 30.8 },
];

export default function SocialInsuranceWedgeWidget() {
    const [view, setView] = useState<'wedge' | 'trick'>('wedge');
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setView(prev => (prev === 'wedge' ? 'trick' : 'wedge'));
        }, 9000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div
            className="widget"
            style={{ height: '400px', display: 'flex', flexDirection: 'column' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            <div className="widget-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', gap: '0.5rem' }}>
                <div>
                    <h2 className="widget-title" style={{ marginBottom: '0.15rem', fontSize: '1.05rem' }}>
                        <span style={{ color: 'var(--accent-red)' }}>🐊</span> 社会保険料と手取りの「ワニの口」
                    </h2>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {view === 'wedge'
                            ? '会社の人件費が増えても「手取り」が減り続けるステルス増税'
                            : 'なぜ気づかれないのか？「労使折半」という最大のカラクリ'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px' }}>
                    <button
                        onClick={() => setView('wedge')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none',
                            background: view === 'wedge' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'wedge' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'wedge' ? 700 : 500,
                        }}
                    >
                        ワニの口推移
                    </button>
                    <button
                        onClick={() => setView('trick')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none',
                            background: view === 'trick' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'trick' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'trick' ? 700 : 500,
                        }}
                    >
                        カラクリ解説
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
                <AnimatePresence mode="wait">
                    {view === 'wedge' && (
                        <motion.div
                            key="wedge-view"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                <span>🔵 会社支払人件費(指数)</span>
                                <span>🟢 実質手取り指数(2000年=100)</span>
                                <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>🔴 社保料率(労使計%)</span>
                            </div>

                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={wedgeData} margin={{ top: 14, right: 10, left: -22, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" domain={[80, 110]} tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="right" orientation="right" domain={[15, 35]} tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.78rem' }}
                                    />
                                    <Area yAxisId="left" type="monotone" dataKey="laborCostIdx" name="会社人件費指数" stroke="#2563eb" fill="rgba(37, 99, 235, 0.12)" strokeWidth={2.5} />
                                    <Area yAxisId="left" type="monotone" dataKey="takeHomeIdx" name="実質手取り指数" stroke="#10b981" fill="rgba(16, 185, 129, 0.15)" strokeWidth={2.5}>
                                        <LabelList dataKey="takeHomeIdx" position="bottom" formatter={(v: any) => `${v}`} style={{ fontSize: '9px', fill: '#059669', fontWeight: 700 }} />
                                    </Area>
                                    <Line yAxisId="right" type="monotone" dataKey="socialInsRate" name="社会保険料率(労使計%)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }}>
                                        <LabelList dataKey="socialInsRate" position="top" formatter={(v: any) => `${v}%`} style={{ fontSize: '9px', fill: '#ef4444', fontWeight: 800 }} />
                                    </Line>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {view === 'trick' && (
                        <motion.div
                            key="trick-view"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem', paddingRight: '4px' }}
                        >
                            <div style={{ background: 'rgba(239, 68, 68, 0.06)', borderRadius: '8px', padding: '0.65rem 0.75rem', borderLeft: '3px solid var(--accent-red)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--accent-red)', marginBottom: '2px' }}>
                                    ① 給与明細に書かれない「会社負担分15.5%」
                                </div>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    社会保険料は「労使折半」の名の下に、半分が会社負担として天引き前に徴収されます。経済学的にはこれも本来あなたの賃金原資であり、実質約30.8%が徴収されています。
                                </p>
                            </div>
                            <div style={{ background: 'rgba(37, 99, 235, 0.06)', borderRadius: '8px', padding: '0.65rem 0.75rem', borderLeft: '3px solid var(--accent-blue)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--accent-blue)', marginBottom: '2px' }}>
                                    ② 消費税増税より遥かに重い「サイレント引き上げ」
                                </div>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    税率変更には国会での大議論が必要ですが、社会保険料率の引き上げや「子ども・子育て支援金」の上乗せは「保険料」の名目で毎年のように静かに強行されます。
                                </p>
                            </div>
                            <div style={{ background: 'rgba(249, 115, 22, 0.06)', borderRadius: '8px', padding: '0.65rem 0.75rem', borderLeft: '3px solid var(--accent-orange)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--accent-orange)', marginBottom: '2px' }}>
                                    ③ 賃上げしても手取りが増えない元凶
                                </div>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    企業が苦労して人件費を増やしても、拡大し続ける社会保険料と累進課税に吸い取られ、現役世代の可処分所得（消費力）は25年間で13%以上目減りしています。
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <WidgetFooter
                sourceName="厚生労働省・協会けんぽ保険料率推移 / 財務省統計"
                sourceUrl="https://www.mhlw.go.jp/"
                shareText="【ステルス増税の正体】会社が払う人件費は維持されても、社会保険料率（労使計約30.8%）の急騰によって現役世代の実質手取りは2000年比で86.8まで低下中。"
                isPaused={isPaused}
            />
        </div>
    );
}
