'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import WidgetFooter from './WidgetFooter';

const data = [
    { year: '1990', working: 8590, elderly: 1490 },
    { year: '2000', working: 8622, elderly: 2201 },
    { year: '2010', working: 8173, elderly: 2948 },
    { year: '2020', working: 7509, elderly: 3603 },
    { year: '2025', working: 7310, elderly: 3624 },
    { year: '2030', working: 6875, elderly: 3716 },
    { year: '2040', working: 5978, elderly: 3928 },
    { year: '2050', working: 5275, elderly: 3764 },
];

export default function DemographicChart() {
    return (
        <div className="widget" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ marginBottom: '0.75rem' }}>
                <h2 className="widget-title" style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                    📈 人口構造の変遷（1990年〜2050年推計）
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 700 }}>
                    <span style={{ color: 'var(--accent-blue)' }}>■ 生産年齢人口（15〜64歳：現在7,310万人）</span>
                    <span style={{ color: 'var(--accent-orange)' }}>■ 老年人口（65歳以上：現在3,624万人）</span>
                </div>
            </div>

            <div style={{ flexGrow: 1, minHeight: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorWorking" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.75} />
                                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.15} />
                            </linearGradient>
                            <linearGradient id="colorElderly" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-orange)" stopOpacity={0.75} />
                                <stop offset="95%" stopColor="var(--accent-orange)" stopOpacity={0.15} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis dataKey="year" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis width={46} stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(value: number) => (value >= 10000 ? `${value / 10000}億` : `${value}万`)} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                            itemStyle={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.8rem' }}
                            labelStyle={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 700 }}
                            formatter={(value: any, name: any) => [`${Number(value).toLocaleString()}万人`, name]}
                        />
                        <ReferenceLine x="2025" stroke="var(--accent-red)" strokeDasharray="3 3" label={{ value: '現在', position: 'top', fill: 'var(--accent-red)', fontSize: 10, fontWeight: 700 }} />
                        <Area type="monotone" name="生産年齢人口 (15-64歳)" dataKey="working" stroke="var(--accent-blue)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWorking)" />
                        <Area type="monotone" name="老年人口 (65歳以上)" dataKey="elderly" stroke="var(--accent-orange)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorElderly)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <WidgetFooter
                sourceName="総務省「国勢調査」「人口推計」/ 社人研「日本の将来推計人口」"
                sourceUrl="https://www.stat.go.jp/data/jinsui/index.html"
                shareText="【生産年齢人口の崩壊】1995年に約8,700万人いた日本の現役世代（15〜64歳）は現在7,310万人へ減少し、2050年には5,275万人へ激減。一方65歳以上は3,600万人超で高止まりします。"
            />
        </div>
    );
}
