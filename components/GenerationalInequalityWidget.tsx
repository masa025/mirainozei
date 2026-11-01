'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell, LabelList } from 'recharts';
import WidgetFooter from './WidgetFooter';

const generationalData = [
    { generation: '70歳以上', netBenefit: 4500, label: '+4500万円' },
    { generation: '60代', netBenefit: 1500, label: '+1500万円' },
    { generation: '50代', netBenefit: -500, label: '-500万円' },
    { generation: '40代', netBenefit: -1500, label: '-1500万円' },
    { generation: '30代', netBenefit: -2300, label: '-2300万円' },
    { generation: '20代', netBenefit: -2800, label: '-2800万円' },
    { generation: '将来世代', netBenefit: -4000, label: '-4000万円' },
];

const renderCustomBarLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const isPositive = value > 0;
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
        <div className="widget" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                <div>
                    <h2 className="widget-title" style={{ marginBottom: '0.15rem' }}>
                        <span style={{ color: 'var(--accent-orange)' }}>⚖️</span> 受益と負担の「世代間格差」
                    </h2>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-tertiary)' }}>
                        生涯を通じた政府サービス(年金・医療)と税・保険料の差額推計
                    </div>
                </div>

                {/* View Toggles */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px' }}>
                    <button
                        onClick={() => setView('chart')}
                        style={{
                            padding: '4px 8px', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'chart' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'chart' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'chart' ? 700 : 500,
                            boxShadow: view === 'chart' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        }}
                    >
                        生涯純負担
                    </button>
                    <button
                        onClick={() => setView('cause')}
                        style={{
                            padding: '4px 8px', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                            background: view === 'cause' ? 'rgba(255,255,255,0.9)' : 'transparent',
                            color: view === 'cause' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: view === 'cause' ? 700 : 500,
                            boxShadow: view === 'cause' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        }}
                    >
                        格差の原因
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: '240px' }}>
                <AnimatePresence mode="wait">
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
                                    margin={{ top: 5, right: 62, left: 8, bottom: 18 }}
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
                                        width={58}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}
                                        formatter={(value: any) => [`${value > 0 ? '+' : ''}${value} 万円`, '生涯純受益(負担)']}
                                    />
                                    <ReferenceLine x={0} stroke="var(--text-tertiary)" strokeWidth={2} />
                                    <Bar dataKey="netBenefit" radius={[0, 4, 4, 0]} animationDuration={1000} barSize={22}>
                                        {generationalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.netBenefit >= 0 ? 'var(--accent-blue)' : 'var(--accent-red)'} fillOpacity={0.82} />
                                        ))}
                                        <LabelList dataKey="netBenefit" content={renderCustomBarLabel} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                                ※プラスは「受益超過（もらい得）」、マイナスは「負担超過（払い損）」
                            </div>
                        </motion.div>
                    )}

                    {view === 'cause' && (
                        <motion.div
                            key="cause-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflowY: 'auto', paddingRight: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}
                        >
                            <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', padding: '0.65rem 0.75rem', borderLeft: '4px solid var(--accent-red)' }}>
                                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--accent-red)', fontSize: '0.82rem' }}>1. 賦課方式（仕送り型）の構造的限界</h4>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    現役世代が高齢者へ仕送りする賦課方式は、人口ピラミッドが逆転した現在、少数の若者に巨額の社会保険料負担を強いる構造へと変質しています。
                                </p>
                            </div>

                            <div style={{ background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', padding: '0.65rem 0.75rem', borderLeft: '4px solid var(--accent-blue)' }}>
                                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--accent-blue)', fontSize: '0.82rem' }}>2. シルバー民主主義による改革先送り</h4>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    最大の票田である高齢者層の窓口負担適正化や給付見直しは選挙で不利になるため先送りされ、声なき現役・将来世代へ負担が集中しています。
                                </p>
                            </div>

                            <div style={{ background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px', padding: '0.65rem 0.75rem', borderLeft: '4px solid var(--accent-orange)' }}>
                                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--accent-orange)', fontSize: '0.82rem' }}>3. 赤字国債という「将来世代へのツケ回し」</h4>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                    社会保障費の不足分を赤字国債で穴埋めし続けた結果、これから生まれる将来世代は生まれた瞬間から生涯-4,000万円超の純負担を背負わされます。
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <WidgetFooter
                sourceName="内閣府「経済財政白書」世代会計推計"
                sourceUrl="https://www5.cao.go.jp/keizai3/whitepaper.html"
                shareText="【世代間格差の現実】70歳以上が生涯「＋4,500万円のもらい得」である一方、20代は「－2,800万円」、将来世代は「－4,000万円の払い損」という構造的不条理。"
            />
        </div>
    );
}
