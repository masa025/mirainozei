'use client';
import { motion } from 'framer-motion';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

// Data representing the paradoxical relationship between anti-bullying budget and recognized cases
const bullyingData = [
    { year: '2013', budget: 40, cases: 18.6 },
    { year: '2015', budget: 42, cases: 22.6 },
    { year: '2017', budget: 48, cases: 41.4 },
    { year: '2019', budget: 55, cases: 61.2 },
    { year: '2021', budget: 60, cases: 50.0 }, // Drop due to school closures (COVID)
    { year: '2022', budget: 65, cases: 68.2 }, // Record High
    { year: '2023', budget: 70, cases: 73.2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'var(--widget-bg, rgba(255,255,255,0.9))', padding: '10px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <p style={{ fontWeight: 800, margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{label}年度</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-blue)' }}>対策予算: <span style={{ fontWeight: 700 }}>約 {payload[0].value} 億円</span></p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-red)' }}>いじめ認知件数: <span style={{ fontWeight: 700 }}>{payload[1].value} 万件</span></p>
            </div>
        );
    }
    return null;
};

export default function AntiBullyingWidget() {
    return (
        <div className="widget" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', fontWeight: 600 }}>
                    いじめ対策予算 vs 認知件数
                </h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    予算は増え、いじめも増える
                </div>
            </div>

            {/* Chart Area */}
            <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                    対策予算の増加と比例して認知件数も過去最多を更新し続ける矛盾
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '12px', height: '12px', background: 'rgba(37, 99, 235, 0.3)', borderRadius: '2px' }}></div>
                        対策予算 (億円)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '12px', height: '3px', background: 'var(--accent-red)', borderRadius: '2px' }}></div>
                        いじめ件数 (万件)
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={bullyingData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false} />

                        {/* Left Axis: Budget (Bar) */}
                        <YAxis
                            yAxisId="left"
                            tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 80]}
                        />
                        {/* Right Axis: Cases (Line) */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 80]}
                        />

                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />

                        <Bar yAxisId="left" dataKey="budget" name="対策予算(億円)" fill="var(--accent-blue)" fillOpacity={0.3} radius={[4, 4, 0, 0]} animationDuration={1000} />
                        <Line yAxisId="right" type="monotone" dataKey="cases" name="いじめ認知件数(万件)" stroke="var(--accent-red)" strokeWidth={3} dot={{ r: 5, fill: 'var(--accent-red)' }} activeDot={{ r: 8 }} animationDuration={1000} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Conclusion / Insight Footer */}
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(249, 115, 22, 0.05)', borderRadius: '8px', borderLeft: '4px solid var(--accent-orange)' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--accent-orange)' }}>「対策予算」が自己目的化する構造。</strong>教員の負担軽減やICT導入などの名目で予算は増え続けるが、現場の根本的ないじめ解決には繋がっていない現状を示唆しています。「認知件数の増加＝積極的認知」という建前も限界を迎えています。
                </p>
            </div>
        </div>
    );
}
