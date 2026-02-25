'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { year: '1990', working: 8590, elderly: 1490 },
    { year: '2000', working: 8622, elderly: 2201 },
    { year: '2010', working: 8173, elderly: 2948 },
    { year: '2020', working: 7406, elderly: 3619 },
    { year: '2030', working: 6875, elderly: 3716 },
    { year: '2040', working: 5978, elderly: 3921 },
    { year: '2050', working: 5275, elderly: 3764 },
];

export default function DemographicChart() {
    return (
        <div className="widget" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 className="widget-title" style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    人口構造の変遷（1990年〜2050年推計）
                </h2>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--accent-blue)' }}>■ 青色：生産年齢人口（15〜64歳の 現役世代）</span>
                    <span style={{ color: 'var(--accent-orange)' }}>■ 赤色：老年人口（65歳以上の 高齢者）</span>
                </div>
            </div>
            <div style={{ flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorWorking" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.2} />
                            </linearGradient>
                            <linearGradient id="colorElderly" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-orange)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--accent-orange)" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis dataKey="year" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 100}M`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--surface-main)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                            itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
                            labelStyle={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600 }}
                            formatter={(value: number | string | undefined) => [`${value}万人`, '']}
                        />
                        <Area type="monotone" name="生産年齢人口 (15-64歳)" dataKey="working" stroke="var(--accent-blue)" strokeWidth={2} fillOpacity={1} fill="url(#colorWorking)" />
                        <Area type="monotone" name="老年人口 (65歳以上)" dataKey="elderly" stroke="var(--accent-orange)" strokeWidth={2} fillOpacity={1} fill="url(#colorElderly)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
