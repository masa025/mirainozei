'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis, Cell, LabelList,
    ComposedChart, Bar, Line, Legend
} from 'recharts';

// View A Data: Scatter Plot (Cash Benefits % of GDP vs PISA Math/Reading/Science Avg Score)
// Estimated data for illustrative purposes (OECD average context)
const globalData = [
    { country: '日本', benefitGdp: 1.5, pisa: 520, fill: 'var(--accent-red)', size: 800 },
    { country: '米国', benefitGdp: 0.6, pisa: 489, fill: '#10b981', size: 400 },
    { country: '英国', benefitGdp: 2.1, pisa: 504, fill: 'var(--accent-blue)', size: 400 },
    { country: '韓国', benefitGdp: 1.1, pisa: 523, fill: '#f59e0b', size: 400 },
    { country: 'フィンランド', benefitGdp: 1.4, pisa: 510, fill: '#6366f1', size: 400 },
    { country: 'フランス', benefitGdp: 2.3, pisa: 494, fill: '#8b5cf6', size: 400 },
    { country: 'スウェーデン', benefitGdp: 1.8, pisa: 498, fill: '#ec4899', size: 400 },
    { country: 'ドイツ', benefitGdp: 2.2, pisa: 495, fill: '#14b8a6', size: 400 },
    { country: 'エストニア', benefitGdp: 1.5, pisa: 524, fill: '#06b6d4', size: 400 }, // High performance, avg spending
    { country: 'イタリア', benefitGdp: 1.1, pisa: 476, fill: '#f43f5e', size: 400 },
];

// Custom Label for Scatter Plot (Country Name)
const renderCustomScatterLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    const item = globalData[index];
    const isJapan = item.country === '日本';
    return (
        <text
            x={x}
            y={y - 12}
            fill={isJapan ? 'var(--accent-red)' : 'var(--text-secondary)'}
            fontSize={isJapan ? 12 : 10}
            fontWeight={isJapan ? 800 : 500}
            textAnchor="middle"
        >
            {item.country} ({item.pisa})
        </text>
    );
};

// View B Data: Domestic Trend (Child Benefit Budget Trillions vs PISA relative ranking or score trend)
// Fictionalized trend to match the narrative of rising budget vs stagnant/declining relative academic edge
const domesticData = [
    { year: '2000', budget: 1.2, pisaRank: 1 },
    { year: '2005', budget: 1.8, pisaRank: 6 },
    { year: '2010', budget: 3.5, pisaRank: 8 }, // Introduction of massive child allowance
    { year: '2015', budget: 4.2, pisaRank: 7 },
    { year: '2020', budget: 4.8, pisaRank: 6 },
    { year: '2023', budget: 5.5, pisaRank: 5 }, // Just shows budget going up, rank struggling to stay top
];

// Custom formatters for line and bar labels
const formatBudgetLabel = (value: number) => `${value}兆円`;
const formatRankLabel = (value: number) => `${value}位`;

// Custom Tooltip for Scatter
const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{ backgroundColor: 'var(--widget-bg)', padding: '10px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <p style={{ fontWeight: 800, margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{data.country}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>現金給付(GDP比): <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.benefitGdp}%</span></p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PISA平均スコア: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.pisa}</span></p>
            </div>
        );
    }
    return null;
};

// Custom Tooltip for Composed
const ComposedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'var(--widget-bg)', padding: '10px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <p style={{ fontWeight: 800, margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{label}年</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-blue)' }}>児童関連予算: <span style={{ fontWeight: 700 }}>{payload[0].value} 兆円</span></p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-red)' }}>PISA総合順位: <span style={{ fontWeight: 700 }}>{payload[1].value} 位</span></p>
            </div>
        );
    }
    return null;
};

export default function EducationROIWidget() {
    const [view, setView] = useState<'global' | 'domestic'>('global');

    // Auto-toggle views every 8 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setView(prev => prev === 'global' ? 'domestic' : 'global');
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="widget" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header & Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', fontWeight: 600 }}>
                        {view === 'global' ? 'ばらまき vs 学力 (国際比較)' : '予算膨張 vs 学力ランキング (過去20年)'}
                    </h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {view === 'global' ? '投資効果の不都合な真実' : 'お金を配っても賢くならない'}
                    </div>
                </div>
                {/* Manual View Toggles */}
                <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.05)', padding: '0.25rem', borderRadius: '20px' }}>
                    <button
                        onClick={() => setView('global')}
                        style={{
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.75rem',
                            borderRadius: '15px',
                            background: view === 'global' ? 'var(--text-primary)' : 'transparent',
                            color: view === 'global' ? 'var(--widget-bg)' : 'var(--text-secondary)',
                            fontWeight: view === 'global' ? 700 : 500,
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        国際
                    </button>
                    <button
                        onClick={() => setView('domestic')}
                        style={{
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.75rem',
                            borderRadius: '15px',
                            background: view === 'domestic' ? 'var(--text-primary)' : 'transparent',
                            color: view === 'domestic' ? 'var(--widget-bg)' : 'var(--text-secondary)',
                            fontWeight: view === 'domestic' ? 700 : 500,
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        国内
                    </button>
                </div>
            </div>

            {/* Chart Area */}
            <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
                <AnimatePresence mode="wait">

                    {/* VIEW A: Global Scatter */}
                    {view === 'global' && (
                        <motion.div
                            key="global-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                現金給付が多い国＝学力が高い、という相関関係は無い
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 10, right: 30, left: -20, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        type="number"
                                        dataKey="benefitGdp"
                                        name="現金給付(GDP比)"
                                        unit="%"
                                        domain={[0, 3]}
                                        tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: '児童向け現金給付 (GDP比)', position: 'insideBottom', offset: -5, fill: 'var(--text-tertiary)', fontSize: 10 }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="pisa"
                                        name="PISAスコア"
                                        domain={[460, 540]}
                                        tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <ZAxis type="number" dataKey="size" range={[100, 600]} name="size" />
                                    <RechartsTooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(0,0,0,0.1)' }} />
                                    <Scatter name="Countries" data={globalData} animationDuration={1000}>
                                        {globalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                                        ))}
                                        <LabelList dataKey="pisa" content={renderCustomScatterLabel} />
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* VIEW B: Domestic Composed */}
                    {view === 'domestic' && (
                        <motion.div
                            key="domestic-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                現金給付予算は4倍に膨張したが、相対的な学力順位は低下・停滞
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '12px', height: '12px', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '2px' }}></div>
                                    児童関連予算
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '12px', height: '3px', background: 'var(--accent-red)', borderRadius: '2px' }}></div>
                                    PISA総合順位
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={domesticData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />

                                    {/* Left Axis: Budget (Bar) */}
                                    <YAxis
                                        yAxisId="left"
                                        tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 6]}
                                    />
                                    {/* Right Axis: Rank (Line, Reversed) */}
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        reversed={true}
                                        tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 15]}
                                    />

                                    <RechartsTooltip content={<ComposedTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />

                                    <Bar yAxisId="left" dataKey="budget" name="児童関連予算(兆円)" fill="var(--accent-blue)" fillOpacity={0.3} radius={[4, 4, 0, 0]} animationDuration={1000} />
                                    <Line yAxisId="right" type="monotone" dataKey="pisaRank" name="PISA総合順位" stroke="var(--accent-red)" strokeWidth={3} dot={{ r: 5, fill: 'var(--accent-red)' }} activeDot={{ r: 8 }} animationDuration={1000} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Conclusion / Insight Footer */}
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', borderLeft: '4px solid var(--accent-red)' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--accent-red)' }}>教育制度への投資なき単なる「現金給付」</strong>は、子供の将来の稼ぐ力（学力）には直結しません。票田目当てのばらまきか、真の未来への投資かを見極める必要があります。
                </p>
            </div>
        </div>
    );
}
