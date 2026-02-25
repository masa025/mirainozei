'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const data = [
    { ageGroup: '20代', population: 1180, turnout: 33, votes: 389, color: 'var(--accent-blue)' },
    { ageGroup: '30代', population: 1350, turnout: 43, votes: 580, color: 'var(--accent-blue)' },
    { ageGroup: '40代', population: 1720, turnout: 50, votes: 860, color: 'var(--text-tertiary)' },
    { ageGroup: '50代', population: 1680, turnout: 58, votes: 974, color: 'var(--text-tertiary)' },
    { ageGroup: '60代', population: 1550, turnout: 71, votes: 1100, color: 'var(--accent-orange)' },
    { ageGroup: '70代以上', population: 2780, turnout: 60, votes: 1668, color: 'var(--accent-red)' },
];

export default function SilverDemocracyWidget() {
    return (
        <div className="widget" style={{ height: '400px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <h2 className="widget-title" style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--accent-red)' }}>⚖️</span> 世代別の「政治力」格差（シルバー民主主義）
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                人口 × 投票率 = <strong style={{ color: 'var(--text-primary)' }}>「実際の投票数（政治を動かす力）」</strong>。<br />
                なぜ未来への投資より、現在の給付が優先されるのか？ 答えは有権者の数にあります。
            </p>

            <div style={{ flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
                        <XAxis type="number" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}万票`} />
                        <YAxis type="category" dataKey="ageGroup" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                        <Tooltip
                            cursor={{ fill: 'var(--surface-main)' }}
                            contentStyle={{ backgroundColor: 'var(--surface-main)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                            formatter={(value: number | string | undefined, name: string | undefined, props: any) => {
                                if (name === 'votes') return [`${value}万票 (投票率 ${props.payload.turnout}%)`, '推定投票力'];
                                return [value, name];
                            }}
                            labelStyle={{ color: 'var(--text-secondary)', fontWeight: 600, paddingBottom: '4px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}
                        />
                        <Bar
                            dataKey="votes"
                            name="votes"
                            radius={[0, 4, 4, 0]}
                            isAnimationActive={true}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 600, textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '6px', borderRadius: '4px' }}>
                「20代・30代合計」の票数よりも、「70代以上」単独の票数が圧倒的に多い。
            </div>
        </div>
    );
}
