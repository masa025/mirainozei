'use client';
import { useState, useEffect } from 'react';
import { Home, Droplet, Building2 } from 'lucide-react';

// Data from old JS
const DATA = {
    pop: { baseDate: new Date("2026-01-01T00:00:00").getTime(), baseVal: 122950000, perSec: -0.01902 },
    akiya: { baseDate: new Date("2023-10-01T00:00:00").getTime(), baseVal: 9000000, perSec: 0.002 },
    pipe: { baseDate: new Date("2024-04-01T00:00:00").getTime(), baseVal: 162800, perSec: 0.00015 },
    facility: { totalArea: 590000000, costPerSqm: 4500 }
};

export default function InfrastructureStatusWidget() {
    const [data, setData] = useState({ akiyaCount: 0, akiyaRate: 0, pipeCount: 0, pipeRate: 0, areaPerCapita: 0, costPerCapita: 0 });

    useEffect(() => {
        const updateData = () => {
            const now = new Date().getTime();

            const secSincePop = (now - DATA.pop.baseDate) / 1000;
            const currentPop = DATA.pop.baseVal + (secSincePop * DATA.pop.perSec);

            const secSinceAkiya = (now - DATA.akiya.baseDate) / 1000;
            const currentAkiya = DATA.akiya.baseVal + (secSinceAkiya * DATA.akiya.perSec);
            const akiyaRate = (currentAkiya / 65000000) * 100; // 65M total houses

            const secSincePipe = (now - DATA.pipe.baseDate) / 1000;
            const currentPipe = DATA.pipe.baseVal + (secSincePipe * DATA.pipe.perSec);
            const pipeRate = (currentPipe / 740000) * 100; // 740k km total pipes

            const areaPerCapita = DATA.facility.totalArea / currentPop;
            const costPerCapita = areaPerCapita * DATA.facility.costPerSqm; // Approx 4500 yen per sqm annually

            setData({
                akiyaCount: currentAkiya,
                akiyaRate,
                pipeCount: currentPipe,
                pipeRate,
                areaPerCapita,
                costPerCapita
            });
        };

        updateData(); // initial
        const interval = setInterval(updateData, 500); // 500ms is fine for slow moving infrastructure numbers
        return () => clearInterval(interval);
    }, []);

    if (data.akiyaCount === 0) return null;

    return (
        <div className="widget" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 className="widget-title" style={{ color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="live-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-orange)', boxShadow: '0 0 8px var(--accent-orange)' }}></div>
                全国インフラ崩壊メーター
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, justifyContent: 'center' }}>

                {/* Akiya (Vacant Houses) */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                            <Home size={16} /> 全国空き家数
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                            <span className="tabular-nums" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {Math.floor(data.akiyaCount).toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>戸</span>
                        </div>
                    </div>
                    <div style={{ height: '6px', background: 'var(--surface-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${data.akiyaRate}%`, background: 'var(--accent-orange)', borderRadius: '4px', transition: 'width 0.2s' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'right', marginTop: '4px' }}>全住宅の {data.akiyaRate.toFixed(2)}%</div>
                </div>

                {/* Aging Pipes */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                            <Droplet size={16} /> 耐用年数超え水道管
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                            <span className="tabular-nums" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {Math.floor(data.pipeCount).toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>km</span>
                        </div>
                    </div>
                    <div style={{ height: '6px', background: 'var(--surface-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${data.pipeRate}%`, background: 'var(--accent-blue)', borderRadius: '4px', transition: 'width 0.2s' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'right', marginTop: '4px' }}>全水道管の {data.pipeRate.toFixed(2)}%</div>
                </div>

                {/* Public Facility Maintenance */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                            <Building2 size={16} /> 公共施設面積 (1人あたり)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                            <span className="tabular-nums" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {data.areaPerCapita.toFixed(3)}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>㎡</span>
                        </div>
                    </div>
                    <div style={{ padding: '0.75rem', background: 'var(--surface-primary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1人当たり維持費目安(年)</span>
                        <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--accent-red)' }}>
                            約 {Math.floor(data.costPerCapita).toLocaleString()} 円
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
