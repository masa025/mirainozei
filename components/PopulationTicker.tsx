'use client';
import { useState, useEffect } from 'react';

export default function PopulationTicker() {
    // Current approximate total population 124 million
    const INITIAL_POPULATION = 124000000;
    // Decrease of roughly 800,000 per year = ~2.5 per 100 seconds, so roughly 1 person every ~40 seconds. For dramatic live effect let's simulate 1 every 5 seconds for demonstration.
    const [population, setPopulation] = useState(INITIAL_POPULATION);

    useEffect(() => {
        const interval = setInterval(() => {
            setPopulation(p => p - 1);
        }, 5000); // Decreses every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const formattedPop = new Intl.NumberFormat('ja-JP').format(population);

    return (
        <div className="widget" style={{ borderTop: '4px solid var(--accent-blue)' }}>
            <h2 className="widget-title">
                <span style={{ color: 'var(--accent-blue)' }}>⬇</span> リアルタイム国内総人口（推計）
            </h2>
            <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                <span className="live-value text-blue" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}>
                    {formattedPop}
                </span>
                <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>人</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '1rem' }}>
                <span>総務省人口推計ベース</span>
                <span style={{ background: 'var(--bg-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>※シミュレーション値</span>
            </div>
        </div>
    );
}
