'use client';
import { useState, useEffect } from 'react';
import WidgetFooter from './WidgetFooter';

export default function PersonalDebtCounter() {
    // Latest MOF debt (1,346.68T JPY) / Latest total population (~123.5M)
    const INITIAL_DEBT = 1346683300000000;
    const DEBT_RATE = 1000000;
    const INITIAL_POPULATION = 123500000;
    const POP_RATE = -1;

    const [debt, setDebt] = useState(INITIAL_DEBT);
    const [pop, setPop] = useState(INITIAL_POPULATION);

    useEffect(() => {
        const dInt = setInterval(() => setDebt((d) => d + DEBT_RATE), 1000);
        const pInt = setInterval(() => setPop((p) => p + POP_RATE), 3500);
        return () => {
            clearInterval(dInt);
            clearInterval(pInt);
        };
    }, []);

    const perCapita = debt / pop;
    const formattedPerCapita = new Intl.NumberFormat('ja-JP').format(Math.floor(perCapita));
    const perWorker = debt / 73900000; // Working-age population (~7,390万人)
    const formattedPerWorker = new Intl.NumberFormat('ja-JP').format(Math.floor(perWorker));

    return (
        <div
            className="widget"
            style={{
                background: 'linear-gradient(145deg, rgba(185, 28, 28, 0.94) 0%, rgba(127, 29, 29, 0.96) 100%)',
                color: '#ffffff',
                border: '1px solid rgba(252, 165, 165, 0.35)',
                boxShadow: '0 20px 40px -15px rgba(185, 28, 28, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
            }}
        >
            <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(0, 0, 0, 0.28)', color: '#fecaca', padding: '3px 10px', borderRadius: '999px', marginBottom: '0.6rem' }}>
                    ⚠️ PER CAPITA PUBLIC DEBT
                </div>
                <h2 className="widget-title" style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    国民1人あたりの公的債務負担
                </h2>

                <div
                    style={{
                        marginTop: '0.5rem',
                        background: 'rgba(0, 0, 0, 0.25)',
                        padding: '1rem 1.15rem',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                    }}
                >
                    <div style={{ fontSize: '0.72rem', color: '#fca5a5', fontWeight: 700, marginBottom: '0.2rem' }}>
                        赤ちゃんを含む国民1人あたり（約1,090万円）
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fca5a5' }}>¥</span>
                        <span className="tabular-nums outfit" style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.55rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.05 }}>
                            {formattedPerCapita}
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: '0.65rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '0.7rem 1rem',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <span style={{ fontSize: '0.76rem', color: '#fee2e2', fontWeight: 600 }}>現役世代（15〜64歳）1人あたり</span>
                    <span className="tabular-nums" style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fde047' }}>
                        ¥{formattedPerWorker}
                    </span>
                </div>

                <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.75rem', lineHeight: 1.5 }}>
                    国の借金（1,346.7兆円）が毎秒増え続ける一方、それを支える分母の人口が年間約92万人ペースで減少しているため、1人あたりの負担は二重に加速しています。
                </p>
            </div>

            <div style={{ marginTop: '0.75rem', paddingTop: '0.55rem', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#fecaca' }}>
                <span>📚 出典: 財務省・総務省人口推計</span>
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `【1人あたり借金1,090万円突破】国の借金1,346.7兆円を人口で割ると、国民1人あたり約1,090万円（現役世代1人あたり約1,822万円）に到達。#ミライノゼイ https://mirainozei.netlify.app`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline' }}
                >
                    Xでシェア
                </a>
            </div>
        </div>
    );
}
