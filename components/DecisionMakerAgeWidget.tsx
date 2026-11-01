'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import WidgetFooter from './WidgetFooter';

export default function DecisionMakerAgeWidget() {
    const [view, setView] = useState<'ceo' | 'diet'>('ceo');
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const viewInterval = setInterval(() => {
            setView((v) => (v === 'ceo' ? 'diet' : 'ceo'));
        }, 11000);
        return () => clearInterval(viewInterval);
    }, [isPaused]);

    // Latest Tokyo Shoko Research (TSR) CEO Age Survey (average 63.81 yrs, 70s+80s = 44.3%, 60s+ = 71.9%)
    const ceoData = [
        { name: '80歳以上', value: 12.5, color: '#991b1b' },
        { name: '70代', value: 31.8, color: '#dc2626' },
        { name: '60代', value: 27.6, color: '#f97316' },
        { name: '50代', value: 19.4, color: '#fcd34d' },
        { name: '40代', value: 7.2, color: '#60a5fa' },
        { name: '30代以下', value: 1.5, color: '#3b82f6' },
    ];

    // Diet Members Age Distribution (House of Representatives & House of Councillors combined leadership/members)
    const dietData = [
        { name: '80歳以上', value: 4.8, color: '#991b1b' },
        { name: '70代', value: 24.2, color: '#dc2626' },
        { name: '60代', value: 29.5, color: '#f97316' },
        { name: '50代', value: 28.1, color: '#fcd34d' },
        { name: '40代', value: 10.3, color: '#60a5fa' },
        { name: '30代以下', value: 3.1, color: '#3b82f6' },
    ];

    const activeData = view === 'ceo' ? ceoData : dietData;
    const over60Percent = activeData
        .filter((d) => ['80歳以上', '70代', '60代'].includes(d.name))
        .reduce((sum, item) => sum + item.value, 0);

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
        const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

        if (percent < 0.05) return null;

        return (
            <text x={x} y={y} fill="white" fontSize="11" fontWeight="bold" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div
            className="widget"
            style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', gap: '0.5rem' }}>
                <div>
                    <h2 className="widget-title" style={{ marginBottom: '0.15rem', fontSize: '1.05rem' }}>
                        <span style={{ color: 'var(--accent-orange)' }}>👨‍🦳</span> 意思決定層の高齢化（社長・国会議員）
                    </h2>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0 }}>
                        過半数が60歳以上。「30年後の日本に責任を持たない世代」による意思決定構造
                    </p>
                </div>

                {/* View Toggles */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px', zIndex: 10 }}>
                    <button
                        onClick={() => setView('ceo')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none',
                            background: view === 'ceo' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'ceo' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'ceo' ? 700 : 500,
                        }}
                    >
                        企業社長
                    </button>
                    <button
                        onClick={() => setView('diet')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none',
                            background: view === 'diet' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'diet' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'diet' ? 700 : 500,
                        }}
                    >
                        国会議員
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: '230px' }}>
                <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, right: 0, bottom: 16, left: 0 }}>
                            <Pie
                                data={activeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={96}
                                fill="#8884d8"
                                dataKey="value"
                                stroke="rgba(255,255,255,0.9)"
                                strokeWidth={2}
                                animationDuration={900}
                            >
                                {activeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                                formatter={(value: any) => [`${value}%`, '構成比']}
                            />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '10px', bottom: -2 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Highlight stat overlay */}
                <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(239, 68, 68, 0.09)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.4rem 0.65rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent-red)', fontWeight: 700 }}>60歳以上の割合</span>
                    <span className="tabular-nums" style={{ fontSize: '1.3rem', color: 'var(--accent-red)', fontWeight: 900, lineHeight: 1.1 }}>
                        {over60Percent.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
                        {view === 'ceo' ? '社長平均: 63.81歳 / 休廃業: 74.98歳' : '30代以下は全体のわずか3.1%'}
                    </span>
                </div>
            </div>

            <WidgetFooter
                sourceName="東京商工リサーチ「全国社長の年齢調査(最新)」/ 衆参両院議員統計"
                sourceUrl="https://www.tsr-net.co.jp/news/analysis/"
                shareText={`【意思決定者の高齢化】日本の企業社長の平均年齢は63.81歳と過去最高を更新し、60歳以上が全体の71.9%（国会議員も約58.5%）。30代以下はわずか数%しかいません。`}
                isPaused={isPaused}
            />
        </div>
    );
}
