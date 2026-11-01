'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList
} from 'recharts';
import WidgetFooter from './WidgetFooter';

// Data based on MEXT (文部科学省「児童生徒の問題行動・不登校等生徒指導上の諸課題に関する調査」) & CFA/MEXT Budget
// budget: いじめ対策・相談体制等関連予算 (億円)
// totalCases: いじめ認知件数 (万件)
// serious: いじめ重大事態件数 (件)
// truancy: 小中高の不登校児童生徒数 (万人)
// resolutionRate: 報告上のいじめ解消率 (%)
const metricsData = [
    { year: '2019', budget: 70, totalCases: 61.2, serious: 723, truancy: 18.1, resolutionRate: 79.5 },
    { year: '2020', budget: 72, totalCases: 51.7, serious: 514, truancy: 19.6, resolutionRate: 77.0 },
    { year: '2021', budget: 75, totalCases: 61.5, serious: 705, truancy: 24.5, resolutionRate: 80.1 },
    { year: '2022', budget: 80, totalCases: 68.2, serious: 919, truancy: 29.9, resolutionRate: 78.0 },
    { year: '2023', budget: 85, totalCases: 73.3, serious: 1306, truancy: 34.6, resolutionRate: 77.5 },
    { year: '2024(確定)', budget: 88, totalCases: 76.9, serious: 1405, truancy: 35.4, resolutionRate: 77.0 },
];

// Custom Tooltip for View A (Budget vs Total Cases & Truancy)
const TooltipA = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.96)', padding: '10px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <p style={{ fontWeight: 800, margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{label}年度</p>
                {payload.map((entry: any, i: number) => (
                    <p key={i} style={{ margin: 0, fontSize: '0.8rem', color: entry.color || 'var(--text-primary)' }}>
                        {entry.name}: <span style={{ fontWeight: 700 }}>{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

type ViewMode = 'viewA' | 'viewB' | 'viewC' | 'cause';

export default function BullyingPreventionWidget() {
    const [view, setView] = useState<ViewMode>('viewA');
    const [isPaused, setIsPaused] = useState(false);

    // Auto-toggle views every 8 seconds unless paused by hover/touch
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setView(prev => {
                if (prev === 'viewA') return 'viewB';
                if (prev === 'viewB') return 'viewC';
                if (prev === 'viewC') return 'cause';
                return 'viewA';
            });
        }, 8000);
        return () => clearInterval(interval);
    }, [isPaused]);

    const renderHeader = () => {
        switch (view) {
            case 'viewA':
                return {
                    subtitle: 'いじめ対策予算 vs 認知件数・不登校',
                    title: '予算増でも過去最多の逆行',
                    desc: '対策予算を増やしても認知73万件・不登校34.6万人と過去最悪を更新'
                };
            case 'viewB':
                return {
                    subtitle: '対策予算 vs 重大事態（命の危機）',
                    title: '防げない「重大事態」の倍増',
                    desc: 'わずか4年で1.8倍（1,306件）へ急増した生命・心身の深刻被害'
                };
            case 'viewC':
                return {
                    subtitle: '報告解消率80% vs 重大事態急増',
                    title: '形骸化する「解消率」の闇',
                    desc: '「約8割が解決」と報告される裏で、深刻事案と不登校が過去最多'
                };
            case 'cause':
                return {
                    subtitle: 'なぜ予算が現場を救えないのか？',
                    title: 'アリバイ対策の3大構造欠陥',
                    desc: 'ハコモノ相談窓口と隠蔽インセンティブが生む教育行政の限界'
                };
        }
    };

    const headerContent = renderHeader();

    return (
        <div
            className="widget"
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            {/* Header & Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <h3 style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.15rem', fontWeight: 600 }}>
                        🛡️ {headerContent.subtitle}
                    </h3>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {headerContent.title}
                    </div>
                </motion.div>

                {/* Manual View Toggles */}
                <div style={{ display: 'flex', gap: '0.2rem', background: 'rgba(0,0,0,0.05)', padding: '0.2rem', borderRadius: '20px' }}>
                    {(['viewA', 'viewB', 'viewC', 'cause'] as ViewMode[]).map((mode, index) => (
                        <button
                            key={mode}
                            onClick={() => setView(mode)}
                            style={{
                                padding: '0.2rem 0.55rem',
                                fontSize: '0.72rem',
                                borderRadius: '15px',
                                background: view === mode ? 'rgba(37, 99, 235, 0.14)' : 'transparent',
                                color: view === mode ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                fontWeight: view === mode ? 700 : 500,
                                border: view === mode ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {['全体・不登校', '重大事態', '解消率の闇', '原因解説'][index]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart / Content Area */}
            <div style={{ flex: 1, position: 'relative', minHeight: '225px' }}>
                <AnimatePresence mode="wait">

                    {/* VIEW A: Budget vs Total Cases & Truancy */}
                    {view === 'viewA' && (
                        <motion.div
                            key="viewA"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                                {headerContent.desc}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '10px', height: '10px', background: 'rgba(37, 99, 235, 0.35)', borderRadius: '2px' }}></div>
                                    対策予算(億円)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '10px', height: '3px', background: 'var(--accent-red)', borderRadius: '2px' }}></div>
                                    いじめ認知(万件)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '10px', height: '3px', background: '#7c3aed', borderRadius: '2px' }}></div>
                                    不登校数(万人)
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={metricsData} margin={{ top: 16, right: 8, left: -22, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[10, 85]} />
                                    <RechartsTooltip content={<TooltipA />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                    <Bar yAxisId="left" dataKey="budget" name="対策予算(億円)" fill="var(--accent-blue)" fillOpacity={0.3} radius={[4, 4, 0, 0]} animationDuration={900}>
                                        <LabelList dataKey="budget" position="top" formatter={(v: any) => `${v}億`} style={{ fontSize: '9px', fill: 'var(--accent-blue)', fontWeight: 700 }} />
                                    </Bar>
                                    <Line yAxisId="right" type="monotone" dataKey="totalCases" name="認知件数(万件)" stroke="var(--accent-red)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-red)' }} animationDuration={900}>
                                        <LabelList dataKey="totalCases" position="top" formatter={(v: any) => `${v}万`} style={{ fontSize: '9px', fill: 'var(--accent-red)', fontWeight: 700 }} />
                                    </Line>
                                    <Line yAxisId="right" type="monotone" dataKey="truancy" name="不登校児童生徒(万人)" stroke="#7c3aed" strokeWidth={2.5} strokeDasharray="4 2" dot={{ r: 3.5, fill: '#7c3aed' }} animationDuration={900} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* VIEW B: Budget vs Serious Incidents */}
                    {view === 'viewB' && (
                        <motion.div
                            key="viewB"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                                {headerContent.desc}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.35rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '10px', height: '10px', background: 'rgba(37, 99, 235, 0.35)', borderRadius: '2px' }}></div>
                                    対策予算(億円)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '10px', height: '3px', background: '#d97706', borderRadius: '2px' }}></div>
                                    いじめ重大事態(件)
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={metricsData} margin={{ top: 16, right: 8, left: -22, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[400, 1600]} />
                                    <RechartsTooltip content={<TooltipA />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                    <Bar yAxisId="left" dataKey="budget" name="対策予算(億円)" fill="var(--accent-blue)" fillOpacity={0.3} radius={[4, 4, 0, 0]} animationDuration={900} />
                                    <Line yAxisId="right" type="monotone" dataKey="serious" name="重大事態(件)" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: '#d97706' }} animationDuration={900}>
                                        <LabelList dataKey="serious" position="top" formatter={(v: any) => `${v}件`} style={{ fontSize: '9px', fill: '#b45309', fontWeight: 800 }} />
                                    </Line>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* VIEW C: Resolution Rate vs Serious Incidents */}
                    {view === 'viewC' && (
                        <motion.div
                            key="viewC"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                                {headerContent.desc}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.35rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '10px', height: '10px', background: 'rgba(16, 185, 129, 0.25)', borderRadius: '2px' }}></div>
                                    報告上の解消率(%)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '10px', height: '3px', background: '#d97706', borderRadius: '2px' }}></div>
                                    重大事態(件)
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={metricsData} margin={{ top: 16, right: 8, left: -22, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[60, 100]} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[400, 1600]} />
                                    <RechartsTooltip content={<TooltipA />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                    <Area yAxisId="left" type="monotone" dataKey="resolutionRate" name="報告解消率(%)" fill="#10b981" fillOpacity={0.18} stroke="#10b981" animationDuration={900} />
                                    <Line yAxisId="right" type="monotone" dataKey="serious" name="重大事態(件)" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: '#d97706' }} animationDuration={900}>
                                        <LabelList dataKey="serious" position="top" formatter={(v: any) => `${v}件`} style={{ fontSize: '9px', fill: '#b45309', fontWeight: 800 }} />
                                    </Line>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* VIEW D: Structural Causes */}
                    {view === 'cause' && (
                        <motion.div
                            key="cause"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '4px' }}
                        >
                            <div style={{ background: 'rgba(239, 68, 68, 0.06)', borderRadius: '8px', padding: '0.6rem 0.75rem', borderLeft: '3px solid var(--accent-red)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--accent-red)', marginBottom: '2px' }}>
                                    ①「3ヶ月で解消」という形骸化ルール
                                </div>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    文科省定義では「3ヶ月間行為が止み、被害者が苦痛を感じていなければ解消」とみなされるため、表面的な謝罪会で「解消率77%」が作られる一方、水面下で深刻化し重大事態（1,306件）へ爆発しています。
                                </p>
                            </div>
                            <div style={{ background: 'rgba(37, 99, 235, 0.06)', borderRadius: '8px', padding: '0.6rem 0.75rem', borderLeft: '3px solid var(--accent-blue)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--accent-blue)', marginBottom: '2px' }}>
                                    ② 外部委託・相談窓口の「ハコモノ予算化」
                                </div>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    増額された予算の多くはSNS相談システム委託や非常勤カウンセラーの短時間配置に消え、実際に介入する現場教員の長時間労働や人員不足は放置されています。
                                </p>
                            </div>
                            <div style={{ background: 'rgba(245, 158, 11, 0.06)', borderRadius: '8px', padding: '0.6rem 0.75rem', borderLeft: '3px solid #d97706' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#b45309', marginBottom: '2px' }}>
                                    ③ 被害者が逃げ、加害者が守られる逆転構造
                                </div>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    学校教育法第35条の「加害児童への出席停止措置」は全国でほぼ適用されず、結果として被害児童側が不登校（34.6万人）に追い込まれる不条理が続いています。
                                </p>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Conclusion / Insight Footer */}
            <div style={{ marginTop: '0.65rem', padding: '0.55rem 0.75rem', background: 'rgba(245, 158, 11, 0.06)', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    <strong style={{ color: '#d97706' }}>令和6年度最新調査：認知76.9万件・重大事態1,405件・不登校35.4万人と全て過去最悪を更新。</strong>表面的な「解消率8割」やハコモノ予算の限界が露呈しています。
                </p>
            </div>

            <WidgetFooter
                sourceName="文部科学省「問題行動・不登校調査」(令和6年度最新確定値)"
                sourceUrl="https://www.mext.go.jp/a_menu/shotou/seitoshidou/1302902.htm"
                shareText="【文科省最新調査】いじめ対策予算を増やし続けた結果、認知件数は76.9万件、命に関わる「重大事態」は1,405件、不登校は35.4万人とすべて過去最多を更新。"
                isPaused={isPaused}
            />
        </div>
    );
}
