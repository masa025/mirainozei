'use client';
import { useState, useEffect } from 'react';
import WidgetFooter from './WidgetFooter';

export default function PopulationTicker() {
    // Latest Total Population (~123,500,000) & Latest MHLW Vital Statistics (2025: 671,236 births vs ~1,589,000 deaths = -918,000 natural decline/year)
    const INITIAL_POPULATION = 123540000;
    const [population, setPopulation] = useState(INITIAL_POPULATION);

    useEffect(() => {
        const interval = setInterval(() => {
            setPopulation((p) => p - 1);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const formattedPop = new Intl.NumberFormat('ja-JP').format(population);

    return (
        <div className="widget" style={{ borderTop: '4px solid var(--accent-blue)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div>
                <h2 className="widget-title">
                    <span style={{ color: 'var(--accent-blue)' }}>📉</span> 国内総人口と自然減の加速
                </h2>
                <div style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="tabular-nums outfit" style={{ fontSize: 'clamp(1.9rem, 3vw, 2.85rem)', fontWeight: 900, color: 'var(--accent-blue)' }}>
                        {formattedPop}
                    </span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-secondary)', marginLeft: '0.4rem' }}>人</span>
                </div>

                {/* Latest 2024/2025 MHLW Vital Statistics Highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239, 68, 68, 0.07)', padding: '0.6rem 0.8rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>👶 日本人年間出生数 (最新)</span>
                        <span className="tabular-nums" style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--accent-red)' }}>
                            67万1,236人 <span style={{ fontSize: '0.7rem' }}>(70万人割れ)</span>
                        </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.05)', padding: '0.6rem 0.8rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>📉 年間自然減 (死亡−出生)</span>
                        <span className="tabular-nums" style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                            -91.8万人 / 年 <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>(1日-2,515人)</span>
                        </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(249, 115, 22, 0.07)', padding: '0.6rem 0.8rem', borderRadius: '10px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>📊 合計特殊出生率 (最新)</span>
                        <span className="tabular-nums" style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--accent-orange)' }}>
                            1.14 <span style={{ fontSize: '0.7rem' }}>(過去最低を更新)</span>
                        </span>
                    </div>
                </div>
            </div>

            <WidgetFooter
                sourceName="厚生労働省「人口動態統計」/ 総務省「人口推計」"
                sourceUrl="https://www.mhlw.go.jp/toukei/list/81-1a.html"
                shareText="【出生数67.1万人・自然減91.8万人】最新の人口動態統計で日本人の国内出生数は67万1,236人と70万人を大きく割り込み、年間約91.8万人（香川県1県分）が消滅するペースに突入。"
            />
        </div>
    );
}
