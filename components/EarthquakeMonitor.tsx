'use client';
import { useState, useEffect } from 'react';

interface QuakeData {
    id: string;
    time: string;
    earthquake: {
        hypocenter: {
            name: string;
            magnitude: number;
        };
        maxScale: number;
    };
}

export default function EarthquakeMonitor() {
    const [quakes, setQuakes] = useState<QuakeData[]>([]);
    const [loading, setLoading] = useState(true);

    // Map P2P Quake MaxScale to standard JMA Seismic Intensity
    const scaleMapping: Record<number, string> = {
        10: '1', 20: '2', 30: '3', 40: '4', 45: '5弱', 50: '5強',
        55: '6弱', 60: '6強', 70: '7'
    };

    useEffect(() => {
        const fetchQuakes = async () => {
            try {
                const res = await fetch('https://api.p2pquake.net/v2/history?codes=551&limit=3');
                const data = await res.json();
                setQuakes(data);
            } catch (error) {
                console.error('Failed to fetch quakes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuakes();
        // Refresh every 5 minutes
        const interval = setInterval(fetchQuakes, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="widget" style={{ height: '100%', borderLeft: '4px solid var(--accent-red)' }}>
            <h2 className="widget-title" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--accent-red)' }}>🚨</span> 最新の地震情報（P2P地震情報）
            </h2>

            {loading ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>取得中...</div>
            ) : quakes.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)' }}>最近の地震データがありません</div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {quakes.map((q) => {
                        const timeObj = new Date(q.time);
                        const formattedTime = `${timeObj.getMonth() + 1}/${timeObj.getDate()} ${timeObj.getHours()}:${timeObj.getMinutes().toString().padStart(2, '0')}`;
                        const intensity = scaleMapping[q.earthquake.maxScale] || '不明';
                        const location = q.earthquake.hypocenter.name || '不明';

                        return (
                            <li key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-secondary)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formattedTime}発生</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{location}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>最大震度</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-red)' }}>{intensity}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.4 }}>
                現在も各地で地震が発生しています。対象となる老朽化インフラの対応は待ったなしの状況です。
            </div>
        </div>
    );
}
