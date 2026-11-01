'use client';
import { useState, useEffect } from 'react';
import WidgetFooter from './WidgetFooter';

const ASSETS = [
    { name: '公立小学校（新設・全面改築）', cost: 1500000000, unit: '校', icon: '🏫' },
    { name: '最新型・高規格消防ポンプ車', cost: 40000000, unit: '台', icon: '🚒' },
    { name: '都市型・認可保育園（新設）', cost: 300000000, unit: '園', icon: '👶' },
];

export default function OpportunityCostWidget() {
    const [assetIndex, setAssetIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const assetSwap = setInterval(() => {
            setAssetIndex((prev) => (prev + 1) % ASSETS.length);
        }, 8000);
        return () => clearInterval(assetSwap);
    }, [isPaused]);

    const activeAsset = ASSETS[assetIndex];
    const todaysDebt = 86400000000; // 864億円 / 日
    const dailyPurchaseCount = Math.floor(todaysDebt / activeAsset.cost);

    return (
        <div
            className="widget"
            style={{ borderLeft: '4px solid var(--accent-orange)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <h2 className="widget-title" style={{ margin: 0, fontSize: '1.05rem' }}>
                        <span style={{ color: 'var(--accent-orange)' }}>💡</span> オポチュニティ・コスト（機会費用）
                    </h2>

                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px' }}>
                        {ASSETS.map((item, idx) => (
                            <button
                                key={item.name}
                                onClick={() => setAssetIndex(idx)}
                                style={{
                                    padding: '3px 7px',
                                    fontSize: '0.7rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    border: 'none',
                                    background: assetIndex === idx ? 'rgba(255,255,255,0.9)' : 'transparent',
                                    color: assetIndex === idx ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    fontWeight: assetIndex === idx ? 700 : 500,
                                }}
                            >
                                {item.icon}
                            </button>
                        ))}
                    </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.9rem', lineHeight: 1.5 }}>
                    国の借金が1日で増える額（<strong>約864億円</strong>）および国債利払い費があれば、毎日これだけの未来投資が可能です：
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.78)', padding: '1rem 1.1rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '2.75rem', lineHeight: 1 }}>{activeAsset.icon}</div>
                    <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            {activeAsset.name}
                        </div>
                        <div className="tabular-nums outfit" style={{ fontSize: '1.55rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px' }}>
                            毎日 <span style={{ color: 'var(--accent-orange)' }}>{dailyPurchaseCount.toLocaleString()}</span> {activeAsset.unit}分
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
                            （1{activeAsset.unit}あたり約 {new Intl.NumberFormat('ja-JP').format(activeAsset.cost / 10000)}万円 で試算）
                        </div>
                    </div>
                </div>
            </div>

            <WidgetFooter
                sourceName="財務省「日本の財政関係資料」/ 文科省・総務省 公共施設単価推計"
                sourceUrl="https://www.mof.go.jp/policy/budget/fiscal_condition/related_data/index.html"
                shareText={`【機会費用の喪失】国の借金が1日で増える約864億円があれば、「${activeAsset.name}」を毎日${dailyPurchaseCount}${activeAsset.unit}ずつ新設できます。過去のツケが未来への投資を奪っています。`}
                isPaused={isPaused}
            />
        </div>
    );
}
