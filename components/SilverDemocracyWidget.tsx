'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import WidgetFooter from './WidgetFooter';

const data = [
    { ageGroup: '20代', population: 1180, turnout: 33, votes: 389, color: 'var(--accent-blue)' },
    { ageGroup: '30代', population: 1350, turnout: 43, votes: 580, color: 'var(--accent-blue)' },
    { ageGroup: '40代', population: 1720, turnout: 50, votes: 860, color: '#64748b' },
    { ageGroup: '50代', population: 1680, turnout: 58, votes: 974, color: '#64748b' },
    { ageGroup: '60代', population: 1550, turnout: 71, votes: 1100, color: 'var(--accent-orange)' },
    { ageGroup: '70代以上', population: 2780, turnout: 60, votes: 1668, color: 'var(--accent-red)' },
];

export default function SilverDemocracyWidget() {
    const [selectedIdx, setSelectedIdx] = useState<number>(0); // Default 20代
    const selected = data[selectedIdx];
    const elderlyVotes = data[5].votes; // 1668万票
    const ratio = (elderlyVotes / selected.votes).toFixed(1);

    return (
        <div className="widget" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <h2 className="widget-title" style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--accent-red)' }}>🗳️</span> 世代別の「政治力」格差（シルバー民主主義）
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                人口 × 投票率 = <strong style={{ color: 'var(--text-primary)' }}>「実際の投票数（政治家が恐れる票田）」</strong>。年代をタップして比較：
            </p>

            {/* Interactive Age Group Selector */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                {data.slice(0, 5).map((item, idx) => (
                    <button
                        key={item.ageGroup}
                        onClick={() => setSelectedIdx(idx)}
                        style={{
                            padding: '2px 8px',
                            fontSize: '0.7rem',
                            borderRadius: '999px',
                            border: selectedIdx === idx ? '1px solid var(--accent-blue)' : '1px solid rgba(0,0,0,0.1)',
                            background: selectedIdx === idx ? 'rgba(37, 99, 235, 0.12)' : 'rgba(255,255,255,0.6)',
                            color: selectedIdx === idx ? 'var(--accent-blue)' : 'var(--text-secondary)',
                            fontWeight: selectedIdx === idx ? 700 : 500,
                            cursor: 'pointer',
                        }}
                    >
                        {item.ageGroup} (投票率{item.turnout}%)
                    </button>
                ))}
            </div>

            <div style={{ flexGrow: 1, minHeight: '190px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, left: -12, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
                        <XAxis type="number" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}万`} />
                        <YAxis type="category" dataKey="ageGroup" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-primary)', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} width={72} />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                            formatter={(value: any, name: any, props: any) => {
                                if (name === 'votes') return [`${value}万票 (人口${props.payload.population}万人 × 投票率${props.payload.turnout}%)`, '推定投票力'];
                                return [value, name];
                            }}
                        />
                        <Bar dataKey="votes" name="votes" radius={[0, 4, 4, 0]} animationDuration={1000}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    fillOpacity={index === selectedIdx || index === 5 ? 1 : 0.55}
                                />
                            ))}
                            <LabelList dataKey="votes" position="right" formatter={(v: any) => `${v}万票`} style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--text-primary)' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ marginTop: '0.4rem', fontSize: '0.73rem', color: 'var(--accent-red)', fontWeight: 700, textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.08)', padding: '6px 8px', borderRadius: '6px' }}>
                70代以上の票数（1,668万票）は、{selected.ageGroup}（{selected.votes}万票）の <span style={{ textDecoration: 'underline', fontSize: '0.82rem' }}>約{ratio}倍</span>。
            </div>

            <WidgetFooter
                sourceName="総務省「国政選挙年代別投票率」・人口推計"
                sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/news/sonota/nendaibetsu/"
                shareText={`【シルバー民主主義の現実】人口×投票率で算出すると、70代以上の票数(1,668万票)は${selected.ageGroup}(${selected.votes}万票)の約${ratio}倍。20代・30代を合計しても70代単独に勝てません。`}
            />
        </div>
    );
}
