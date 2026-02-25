'use client';
import { useState, useEffect } from 'react';

const ASSETS = [
    { name: '公立小学校', cost: 1500000000, icon: '🏫' },
    { name: '消防車', cost: 40000000, icon: '🚒' },
    { name: '保育園', cost: 300000000, icon: '👶' },
];

export default function OpportunityCostWidget() {
    const DEBT_RATE_PER_SEC = 1000000;
    const [debtGeneratedIdly, setDebtGeneratedIdly] = useState(0);
    const [assetIndex, setAssetIndex] = useState(0);

    useEffect(() => {
        // We simulate total daily debt logic but for visual sake, count up from page load
        const int = setInterval(() => {
            setDebtGeneratedIdly(prev => prev + DEBT_RATE_PER_SEC);
        }, 1000);

        // Swap asset comparison every 10 seconds
        const assetSwap = setInterval(() => {
            setAssetIndex(prev => (prev + 1) % ASSETS.length);
        }, 10000);

        return () => { clearInterval(int); clearInterval(assetSwap); };
    }, []);

    const activeAsset = ASSETS[assetIndex];

    // Calculate how many of the asset could be bought with the debt generated today (simulated as 86.4B yen/day)
    // But to make it live and relatable, let's show how much of the asset is lost while viewing.
    const percentComplete = Math.min((debtGeneratedIdly / activeAsset.cost) * 100, 100);
    const todaysDebt = 86400000000; // 86.4 Billion a day
    const dailyPurchaseCount = Math.floor(todaysDebt / activeAsset.cost);

    return (
        <div className="widget" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
            <h2 className="widget-title">
                <span style={{ color: 'var(--accent-orange)' }}>💡</span> オポチュニティ・コスト（機会費用）
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                国の借金が一日で増える額（<strong>約864億円</strong>）があれば、以下の公共インフラを毎日これだけ整備できます。
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--surface-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '3rem', lineHeight: 1 }}>{activeAsset.icon}</div>
                <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {activeAsset.name} : <span className="text-orange">{dailyPurchaseCount}</span> 個
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                        （1つあたり約 {new Intl.NumberFormat('ja-JP').format(activeAsset.cost / 100000000)}億円 で計算）
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                ※将来世代が本来得られたかもしれない投資です。
            </div>
        </div>
    );
}
