'use client';
import { useState, useEffect } from 'react';

export default function ExchangeRateWidget() {
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=JPY');
                const data = await res.json();
                if (data.rates && data.rates.JPY) {
                    setRate(data.rates.JPY);
                }
            } catch (error) {
                console.error('Failed to fetch exchange rate:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
        const interval = setInterval(fetchRate, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Static Data for Global Comparison
    const BIG_MAC_USD = 5.69;
    const BIG_MAC_JPY = 450; // Approximated current price
    const BIG_MAC_IMPLIED = BIG_MAC_JPY / BIG_MAC_USD;

    const AVG_WAGE_USD = 77000;
    const AVG_WAGE_UK = 54000;
    const AVG_WAGE_JPY = 42000; // Approximations in USD (OECD adjusted)

    return (
        <div className="widget" style={{ backgroundColor: 'var(--surface-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="widget-title" style={{ fontSize: '0.9rem', margin: 0 }}>
                    <span style={{ color: 'var(--accent-green)' }}>💵</span> 日本円の現在価値 (USD/JPY)
                </h2>
                {loading ? (
                    <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>取得中...</span>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                            {rate !== null ? rate.toFixed(2) : '---'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>円</span>
                    </div>
                )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Big Mac Index Block */}
                <div style={{ background: 'var(--surface-primary)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>🍔 ビッグマック指数換算（購買力平価）</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            適正レート推計: <strong style={{ color: 'var(--text-primary)' }}>1ドル = {BIG_MAC_IMPLIED.toFixed(2)}円</strong>
                        </div>
                        {rate !== null && (
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                                {-(((rate - BIG_MAC_IMPLIED) / rate) * 100).toFixed(1)}% 円安
                            </div>
                        )}
                    </div>
                </div>

                {/* Avg Wage Index Block */}
                <div style={{ background: 'var(--surface-primary)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>💼 平均年収の国際比較 (OECD推計)</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {[{ label: '🇯🇵 日本', val: AVG_WAGE_JPY, color: 'var(--accent-red)' }, { label: '🇬🇧 英国', val: AVG_WAGE_UK, color: 'var(--border-color)' }, { label: '🇺🇸 米国', val: AVG_WAGE_USD, color: 'var(--accent-blue)' }].map(item => (
                            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '40px', fontSize: '0.75rem', color: 'var(--text-primary)' }}>{item.label}</div>
                                <div style={{ flex: 1, height: '8px', background: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(item.val / AVG_WAGE_USD) * 100}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                                </div>
                                <div style={{ width: '45px', fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'right' }}>${(item.val / 1000).toFixed(0)}k</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', paddingTop: '0.25rem', textAlign: 'right' }}>
                レート: Frankfurter | 賃金: OECD 2023
            </div>
        </div>
    );
}
