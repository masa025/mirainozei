'use client';
import { useState, useEffect } from 'react';

export default function TaxBalanceTicker() {
    const SPENDING_PER_SEC = 3550000; // rough estimation based on 112T budget
    const REVENUE_PER_SEC = 2190000;  // rough estimation based on 69T tax revenue

    const [spending, setSpending] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        const int = setInterval(() => {
            setSpending(s => s + SPENDING_PER_SEC);
            setRevenue(r => r + REVENUE_PER_SEC);
        }, 1000);
        return () => clearInterval(int);
    }, []);

    const deficit = spending - revenue;

    return (
        <div className="widget">
            <h2 className="widget-title">
                <span style={{ color: 'var(--text-primary)' }}>⚖️</span> 今この瞬間の国家予算（税収 vs 支出）
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                ※ページを開いてからの累積シミュレーション
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        <span>税収 (Tax Revenue)</span>
                        <span style={{ color: 'var(--accent-blue)' }}>+ ¥{new Intl.NumberFormat('ja-JP').format(revenue)}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '60%', height: '100%', backgroundColor: 'var(--accent-blue)' }}></div>
                    </div>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        <span>支出 (Gov Spending)</span>
                        <span style={{ color: 'var(--accent-orange)' }}>- ¥{new Intl.NumberFormat('ja-JP').format(spending)}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--accent-orange)' }}></div>
                    </div>
                </div>

                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>生み出された赤字:</span>
                    <span className="live-value" style={{ color: 'var(--accent-red)', fontSize: '1.2rem' }}>
                        ¥{new Intl.NumberFormat('ja-JP').format(deficit)}
                    </span>
                </div>
            </div>
        </div>
    );
}
