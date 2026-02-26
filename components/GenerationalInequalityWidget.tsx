'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell, LabelList } from 'recharts';

// Data based on estimates of "Generational Accounting" (世代会計) in Japan.
// Source: Cabinet Office / Various economic researchers (Approximate figures for illustrative purposes)
// Net Benefit = Lifetime Social Security Benefits (Pension, Medical, etc.) - Lifetime Burden (Taxes, Premiums)
const generationalData = [
    { generation: '70歳以上', netBenefit: 4500, label: '+4500万円' }, // massive positive
    { generation: '60代', netBenefit: 1500, label: '+1500万円' },
    { generation: '50代', netBenefit: -500, label: '-500万円' },
    { generation: '40代', netBenefit: -1500, label: '-1500万円' },
    { generation: '30代', netBenefit: -2300, label: '-2300万円' },
    { generation: '20代', netBenefit: -2800, label: '-2800万円' },
    { generation: '将来世代', netBenefit: -4000, label: '-4000万円' }, // massive negative
];

const renderCustomBarLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const isPositive = value > 0;
    // Position label slightly outside the bar
    const xPos = isPositive ? x + width + 5 : x - 5;

    return (
        <text
            x={xPos}
            y={y + height / 2}
            fill={isPositive ? 'var(--accent-blue)' : 'var(--accent-red)'}
            dy=".35em"
            textAnchor={isPositive ? 'start' : 'end'}
            fontSize={11}
            fontWeight={700}
        >
            {value > 0 ? '+' : ''}{value}万円
        </text>
    );
};

export default function GenerationalInequalityWidget() {
    const [view, setView] = useState<'chart' | 'cause'>('chart');

    return (
        <div className="widget" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h2 className="widget-title">
                        <span style={{ color: 'var(--accent-orange)' }}>⚖️</span> 受益と負担の「世代間格差」
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                        生涯を通じた政府サービス(年金・医療)と税・保険料の差額推計
                    </div>
                </div>

                {/* View Toggles */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px' }}>
                    <button
                        onClick={() => setView('chart')}
                        style={{
                            padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'chart' ? 'var(--widget-bg)' : 'transparent',
                            color: view === 'chart' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'chart' ? 600 : 400,
                            boxShadow: view === 'chart' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        生涯純負担
                    </button>
                    <button
                        onClick={() => setView('cause')}
                        style={{
                            padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'cause' ? 'var(--widget-bg)' : 'transparent',
                            color: view === 'cause' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'cause' ? 600 : 400,
                            boxShadow: view === 'cause' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        格差の原因
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <AnimatePresence mode="wait">
                    {/* VIEW A: Chart */}
                    {view === 'chart' && (
                        <motion.div
                            key="chart-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={generationalData}
                                    layout="vertical"
                                    margin={{ top: 10, right: 60, left: 10, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        type="number"
                                        stroke="var(--text-tertiary)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[-4500, 5000]}
                                        tickFormatter={(val) => `${val}万`}
                                    />
                                    <YAxis
                                        dataKey="generation"
                                        type="category"
                                        stroke="var(--text-secondary)"
                                        fontSize={11}
                                        fontWeight={600}
                                        tickLine={false}
                                        axisLine={false}
                                        width={60}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                        contentStyle={{ backgroundColor: 'var(--widget-bg)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}
                                        formatter={(value: any) => [`${value > 0 ? '+' : ''}${value} 万円`, '生涯純受益(負担)']}
                                    />
                                    <ReferenceLine x={0} stroke="var(--text-tertiary)" strokeWidth={2} />
                                    <Bar dataKey="netBenefit" radius={[0, 4, 4, 0]} animationDuration={1200} barSize={24}>
                                        {generationalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.netBenefit >= 0 ? 'var(--accent-blue)' : 'var(--accent-red)'} fillOpacity={0.8} />
                                        ))}
                                        <LabelList dataKey="netBenefit" content={renderCustomBarLabel} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                ※推計値。プラスは「もらい得（受益超過）」、マイナスは「払い損（負担超過）」
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW B: Structural Causes */}
                    {view === 'cause' && (
                        <motion.div
                            key="cause-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflowY: 'auto', paddingRight: '0.5rem' }}
                        >
                            <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid var(--accent-red)', marginBottom: '1rem' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-red)', fontSize: '0.9rem' }}>1. 賦課方式（仕送り型）の構造的限界</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    現在の日本の年金・医療制度は、現役世代がその時の高齢者を支える「賦課方式（ふかほうしき）」を採用しています。高度経済成長期のような「若者が多く、高齢者が少ない」時代を前提に設計されているため、少子高齢化が進んだ現在では、少数の若者で多数の高齢者を支えなければならず、現役世代の負担が幾何級数的に膨らんでいます。
                                </p>
                            </div>

                            <div style={{ background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid var(--accent-blue)', marginBottom: '1rem' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-blue)', fontSize: '0.9rem' }}>2. シルバー民主主義と抜本改革の先送り</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    政治家にとって、巨大な票田である「高齢者（逃げ切り世代）」に痛みを伴う改革（医療費窓口負担の引き上げや、年金支給額の適正化、資産課税など）を提案することは選挙での敗北を意味します。結果として高齢者に有利な制度が温存され、しわ寄せは声なき「将来世代」と「現役世代の社会保険料（実質的増税）」に押し付けられています。
                                </p>
                            </div>

                            <div style={{ background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid var(--accent-orange)' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-orange)', fontSize: '0.9rem' }}>3. 赤字国債という「将来へのツケ回し」</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    現在の社会保障費の不足分は、巨額の「赤字国債（国の借金）」を発行して補填されています。これは「今生きている私たちの生活費を、まだ生まれていない将来の子供たちに借金として背負わせている」ことに他ならず、彼らの可処分所得をさらに奪う負の連鎖を生んでいます。
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
