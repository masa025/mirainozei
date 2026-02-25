'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { region: '東京', total: 1032, unaddressed: 421 },
    { region: '千葉', total: 1156, unaddressed: 602 },
    { region: '埼玉', total: 923, unaddressed: 450 },
    { region: '神奈川', total: 845, unaddressed: 312 },
];

export default function InfrastructureStats() {
    return (
        <div className="widget" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h2 className="widget-title" style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                老朽化が放置される緊急措置橋梁（首都圏）
            </h2>
            <div style={{ flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={true} vertical={false} />
                        <XAxis type="number" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis dataKey="region" type="category" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-primary)', fontWeight: 600, fontSize: 13 }} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: 'var(--bg-color)' }}
                            contentStyle={{ backgroundColor: 'var(--surface-main)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                            itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
                        />
                        <Bar name="措置未着手 (箇所)" dataKey="unaddressed" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--accent-red)' : 'rgba(220, 38, 38, 0.6)'} />
                            ))}
                        </Bar>
                        <Bar name="対象総数 (箇所)" dataKey="total" fill="var(--border-color)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'right' }}>
                ※判定IV（緊急措置段階）指定の橋梁における措置未着手件数
            </div>
        </div>
    );
}
