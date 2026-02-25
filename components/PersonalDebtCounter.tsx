'use client';
import { useState, useEffect } from 'react';

export default function PersonalDebtCounter() {
    const INITIAL_DEBT = 1293000000000000;
    const DEBT_RATE = 1000000;
    const INITIAL_POPULATION = 124000000;
    const POP_RATE = -1; // per 5 sec

    const [debt, setDebt] = useState(INITIAL_DEBT);
    const [pop, setPop] = useState(INITIAL_POPULATION);

    useEffect(() => {
        const dInt = setInterval(() => setDebt(d => d + DEBT_RATE), 1000);
        const pInt = setInterval(() => setPop(p => p + POP_RATE), 5000);
        return () => { clearInterval(dInt); clearInterval(pInt); };
    }, []);

    const perCapita = debt / pop;
    const formattedPerCapita = new Intl.NumberFormat('ja-JP').format(Math.floor(perCapita));

    return (
        <div className="widget" style={{ backgroundColor: 'var(--accent-red)', color: 'white' }}>
            <h2 className="widget-title" style={{ color: 'rgba(255,255,255,0.8)' }}>
                <span style={{ color: 'white' }}>⚠️</span> あなたが背負う公的債務（1人あたり）
            </h2>
            <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>¥</span>
                <span className="live-value" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)', color: 'white' }}>
                    {formattedPerCapita}
                </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                借金が毎秒増え、支える人口が減るため、<br />一人当たりの負担額は加速して増加しています。
            </div>
        </div>
    );
}
