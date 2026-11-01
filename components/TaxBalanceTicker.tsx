'use client';
import { useState, useEffect } from 'react';
import WidgetFooter from './WidgetFooter';

export default function TaxBalanceTicker() {
    // Based on latest FY2025/2026 General Account Budget Frame:
    // Annual Spending: ~115.5兆円 (approx 3,662,000 JPY / sec)
    // Annual Tax Revenue: ~78.4兆円 (approx 2,486,000 JPY / sec)
    // Annual Deficit (New Bond Issuance / Non-tax gap): ~37.1兆円 (approx 1,176,000 JPY / sec)
    const SPENDING_PER_SEC = 3662000;
    const REVENUE_PER_SEC = 2486000;

    const [spending, setSpending] = useState(SPENDING_PER_SEC);
    const [revenue, setRevenue] = useState(REVENUE_PER_SEC);

    useEffect(() => {
        const int = setInterval(() => {
            setSpending((s) => s + SPENDING_PER_SEC);
            setRevenue((r) => r + REVENUE_PER_SEC);
        }, 1000);
        return () => clearInterval(int);
    }, []);

    const deficit = spending - revenue;

    return (
        <div className="widget" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <h2 className="widget-title" style={{ margin: 0, fontSize: '1.05rem' }}>
                        <span style={{ color: 'var(--text-primary)' }}>⚖️</span> 国家予算の収支（税収 vs 歳出）
                    </h2>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-orange)', background: 'rgba(249, 115, 22, 0.1)', padding: '2px 8px', borderRadius: '999px' }}>
                        歳出115.5兆 vs 税収78.4兆円
                    </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    ※ページを開いてからの累積シミュレーション（毎秒約118万円の赤字国債依存）
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            <span>税収 (年間約78.4兆円ペース)</span>
                            <span className="tabular-nums" style={{ color: 'var(--accent-blue)' }}>
                                + ¥{new Intl.NumberFormat('ja-JP').format(revenue)}
                            </span>
                        </div>
                        <div style={{ width: '100%', height: '9px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: '67.9%', height: '100%', backgroundColor: 'var(--accent-blue)', borderRadius: '999px' }}></div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            <span>歳出 (年間約115.5兆円ペース)</span>
                            <span className="tabular-nums" style={{ color: 'var(--accent-orange)' }}>
                                - ¥{new Intl.NumberFormat('ja-JP').format(spending)}
                            </span>
                        </div>
                        <div style={{ width: '100%', height: '9px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--accent-orange)', borderRadius: '999px' }}></div>
                        </div>
                    </div>

                    <div style={{ marginTop: '0.35rem', padding: '0.75rem 0.9rem', background: 'rgba(239, 68, 68, 0.06)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem' }}>
                        <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>閲覧中に生み出された財政赤字</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>過去最高の税収でも歳出膨張に追いつかず借金で補填</div>
                        </div>
                        <span className="tabular-nums outfit" style={{ color: 'var(--accent-red)', fontSize: '1.25rem', fontWeight: 900, whiteSpace: 'nowrap' }}>
                            -¥{new Intl.NumberFormat('ja-JP').format(deficit)}
                        </span>
                    </div>
                </div>
            </div>

            <WidgetFooter
                sourceName="財務省「一般会計予算（令和7・8年度当初予算フレーム）」"
                sourceUrl="https://www.mof.go.jp/policy/budget/budger_workflow/budget/index.html"
                shareText="【過去最高税収でも赤字】国の一般会計は税収約78.4兆円に対し歳出約115.5兆円。毎秒約118万円ずつ財政赤字（将来世代への借金）が積み上がっています。"
            />
        </div>
    );
}
