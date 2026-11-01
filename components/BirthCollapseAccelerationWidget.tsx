'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend
} from 'recharts';
import WidgetFooter from './WidgetFooter';

// Comparison between IPSS (社人研) prior medium projection vs Actual MHLW Japanese domestic births (万人)
// IPSS previously projected ~68万 births around 2038-2039; actual hit 68.6万 in 2024 and 67.1万 in 2025 (15 years ahead of schedule)
const birthTrajectoryData = [
    { year: '2015', govProjection: 100.5, actualBirths: 100.6, deaths: 129.0 },
    { year: '2018', govProjection: 94.0, actualBirths: 91.8, deaths: 136.2 },
    { year: '2020', govProjection: 88.5, actualBirths: 84.1, deaths: 137.2 },
    { year: '2022', govProjection: 85.0, actualBirths: 77.1, deaths: 156.9 },
    { year: '2024', govProjection: 81.5, actualBirths: 68.6, deaths: 160.5 },
    { year: '2025', govProjection: 79.8, actualBirths: 67.1, deaths: 158.9 },
];

export default function BirthCollapseAccelerationWidget() {
    const [view, setView] = useState<'acceleration' | 'naturalDecline'>('acceleration');
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setView((prev) => (prev === 'acceleration' ? 'naturalDecline' : 'acceleration'));
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
                        <span style={{ color: 'var(--accent-red)' }}>👶</span> 出生数67万人ショック（推計15年前倒し）
                    </h2>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {view === 'acceleration'
                            ? '政府の楽観シナリオを15年も前倒しで下回る「少子化の垂直落下」'
                            : '年間死亡158.9万人 vs 出生67.1万人 ＝ 毎年91.8万人（1県分）が消滅'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px' }}>
                    <button
                        onClick={() => setView('acceleration')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none',
                            background: view === 'acceleration' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'acceleration' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'acceleration' ? 700 : 500,
                        }}
                    >
                        推計との乖離
                    </button>
                    <button
                        onClick={() => setView('naturalDecline')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none',
                            background: view === 'naturalDecline' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'naturalDecline' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'naturalDecline' ? 700 : 500,
                        }}
                    >
                        死亡と出生の差
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
                <AnimatePresence mode="wait">
                    {view === 'acceleration' && (
                        <motion.div
                            key="acceleration-view"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={birthTrajectoryData} margin={{ top: 16, right: 16, left: -18, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis domain={[60, 108]} tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}万`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.78rem' }}
                                        formatter={(val: any, name: any) => [`${val}万人`, name]}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    <Line type="monotone" dataKey="govProjection" name="旧政府推計シナリオ" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="actualBirths" name="実際の日本人出生数" stroke="#ef4444" strokeWidth={3.5} dot={{ r: 4.5, fill: '#ef4444' }}>
                                        <LabelList dataKey="actualBirths" position="bottom" formatter={(v: any) => `${v}万`} style={{ fontSize: '9px', fill: '#ef4444', fontWeight: 800 }} />
                                    </Line>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {view === 'naturalDecline' && (
                        <motion.div
                            key="naturalDecline-view"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={birthTrajectoryData} margin={{ top: 16, right: 16, left: -18, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis domain={[50, 175]} tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}万`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.78rem' }}
                                        formatter={(val: any, name: any) => [`${val}万人`, name]}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    <Bar dataKey="deaths" name="年間死亡数(万人)" fill="rgba(15, 23, 42, 0.22)" radius={[4, 4, 0, 0]}>
                                        <LabelList dataKey="deaths" position="top" formatter={(v: any) => `${v}万`} style={{ fontSize: '9px', fill: '#334155', fontWeight: 700 }} />
                                    </Bar>
                                    <Bar dataKey="actualBirths" name="年間出生数(万人)" fill="rgba(239, 68, 68, 0.78)" radius={[4, 4, 0, 0]}>
                                        <LabelList dataKey="actualBirths" position="top" formatter={(v: any) => `${v}万`} style={{ fontSize: '9px', fill: '#ef4444', fontWeight: 800 }} />
                                    </Bar>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.7rem', background: 'rgba(239, 68, 68, 0.06)', borderRadius: '8px', borderLeft: '4px solid var(--accent-red)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--accent-red)' }}>政府が「2039年頃」と想定していた68万人割れが2024〜2025年に現実化。</strong>社会保障制度の前提となる人口推計そのものが根底から崩れています。
            </div>

            <WidgetFooter
                sourceName="厚生労働省「人口動態統計」(2024・2025最新) / 社人研推計"
                sourceUrl="https://www.mhlw.go.jp/toukei/list/81-1a.html"
                shareText="【少子化15年前倒し】政府が「2039年頃」と予測していた出生数68万人割れがすでに現実化（最新67.1万人）。年間死亡数158.9万人に対し毎年91.8万人が自然減しています。"
                isPaused={isPaused}
            />
        </div>
    );
}
