'use client';
import { useState, useEffect } from 'react';
import WidgetFooter from './WidgetFooter';

export default function DebtClock() {
    // Latest MOF figure (June 2026 release): 1,346兆6,833億円 (1,346,683,300,000,000 JPY)
    const INITIAL_DEBT = 1346683300000000;
    const DEBT_PER_SECOND = 1000000;
    const [debt, setDebt] = useState(INITIAL_DEBT);

    useEffect(() => {
        const tickRate = DEBT_PER_SECOND / 10;
        const interval = setInterval(() => {
            setDebt((prev) => prev + tickRate);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const formattedStr = new Intl.NumberFormat('ja-JP').format(Math.floor(debt));
    const debtInTrillions = (debt / 1_000_000_000_000).toFixed(1);

    return (
        <div
            className="tracing-border-widget"
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <div className="tracing-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        <h2 className="widget-title" style={{ fontSize: '1.15rem', margin: 0 }}>
                            <div className="live-indicator"></div>
                            国の公的債務残高（国債・借入金・政府短期証券）
                        </h2>
                        <span
                            style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                color: 'var(--accent-red)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                padding: '3px 10px',
                                borderRadius: '999px',
                            }}
                        >
                            最新公表：約1,346.7兆円（過去最高更新）
                        </span>
                    </div>

                    <div
                        style={{
                            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.92))',
                            padding: '1.5rem 1.75rem',
                            borderRadius: '18px',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            boxShadow: 'inset 0 2px 14px rgba(0, 0, 0, 0.5), 0 14px 32px rgba(15, 23, 42, 0.16)',
                            marginBottom: '1.25rem',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em' }}>
                                NATIONAL PUBLIC DEBT TOTAL (約 {debtInTrillions} 兆円)
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#cbd5e1', fontWeight: 600 }}>
                                内国債 1,211.7兆 / 借入金 40.5兆 / 政府短期証券 94.4兆
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', fontWeight: 700, color: '#f87171' }}>¥</span>
                            <div
                                className="tabular-nums outfit"
                                style={{
                                    fontSize: 'clamp(1.7rem, 3.5vw, 3.25rem)',
                                    fontWeight: 900,
                                    color: '#ffffff',
                                    lineHeight: 1.05,
                                    letterSpacing: '-0.02em',
                                    textShadow: '0 2px 18px rgba(239, 68, 68, 0.4)',
                                }}
                            >
                                {formattedStr}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Metrics Grid */}
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div style={{ background: 'rgba(255, 255, 255, 0.78)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>毎秒の増加ペース</div>
                            <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-red)', marginTop: '2px' }}>
                                + ¥1,000,000 / 秒
                            </div>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.78)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>1日あたりの借金増</div>
                            <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                                約 864 億円 / 日
                            </div>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.78)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>国債費（利払い・償還）</div>
                            <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-orange)', marginTop: '2px' }}>
                                約 28.2 兆円 / 年
                            </div>
                        </div>
                    </div>

                    <WidgetFooter
                        sourceName="財務省「国債及び借入金並びに政府短期証券現在高」(最新1,346.7兆円)"
                        sourceUrl="https://www.mof.go.jp/jgbs/reference/gbb/index.htm"
                        shareText="【国の借金総額：1,346.7兆円】財務省最新公表データで日本の公的債務残高は約1,346兆6,833億円と過去最高を更新。赤ちゃんから高齢者まで1人あたり約1,090万円の負担です。"
                    />
                </div>
            </div>
        </div>
    );
}
