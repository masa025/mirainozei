'use client';
import { useState, useEffect } from 'react';
import { Home, Droplet, Building2 } from 'lucide-react';
import WidgetFooter from './WidgetFooter';

// Updated with latest official statistics:
// 1. MIC (総務省「令和5年住宅・土地統計調査」確定値): 全国空き家数 900万2,000戸 (過去最多・空き家率13.84%・うち放置空き家385.6万戸)
// 2. MLIT/MHLW (国交省・厚労省 水道統計最新値): 法定耐用年数(40年)超え水道管 約17万6,100km (全管路約74万kmの23.8%・年間約2万件の漏水・破損事故)
// 3. MIC (総務省 公共施設状況調査): 公共施設延床面積 約5.9億㎡
const DATA = {
    pop: { baseDate: new Date('2026-01-01T00:00:00').getTime(), baseVal: 123500000, perSec: -0.029 },
    akiya: { baseDate: new Date('2024-10-01T00:00:00').getTime(), baseVal: 9002000, perSec: 0.0022 },
    pipe: { baseDate: new Date('2025-04-01T00:00:00').getTime(), baseVal: 176100, perSec: 0.00018 },
    facility: { totalArea: 590000000, costPerSqm: 4800 },
};

export default function InfrastructureStatusWidget() {
    const [data, setData] = useState({
        akiyaCount: 0,
        akiyaRate: 0,
        pipeCount: 0,
        pipeRate: 0,
        areaPerCapita: 0,
        costPerCapita: 0,
    });

    useEffect(() => {
        const updateData = () => {
            const now = new Date().getTime();

            const secSincePop = (now - DATA.pop.baseDate) / 1000;
            const currentPop = DATA.pop.baseVal + secSincePop * DATA.pop.perSec;

            const secSinceAkiya = (now - DATA.akiya.baseDate) / 1000;
            const currentAkiya = DATA.akiya.baseVal + secSinceAkiya * DATA.akiya.perSec;
            const akiyaRate = (currentAkiya / 65020000) * 100; // 6,502万戸 total dwellings

            const secSincePipe = (now - DATA.pipe.baseDate) / 1000;
            const currentPipe = DATA.pipe.baseVal + secSincePipe * DATA.pipe.perSec;
            const pipeRate = (currentPipe / 740000) * 100; // 740k km total water pipes

            const areaPerCapita = DATA.facility.totalArea / currentPop;
            const costPerCapita = areaPerCapita * DATA.facility.costPerSqm;

            setData({
                akiyaCount: currentAkiya,
                akiyaRate,
                pipeCount: currentPipe,
                pipeRate,
                areaPerCapita,
                costPerCapita,
            });
        };

        updateData();
        const interval = setInterval(updateData, 500);
        return () => clearInterval(interval);
    }, []);

    if (data.akiyaCount === 0) return null;

    return (
        <div className="widget" style={{ height: '100%', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
                <h2 className="widget-title" style={{ color: 'var(--text-primary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>
                    <div className="live-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-orange)', boxShadow: '0 0 8px var(--accent-orange)' }}></div>
                    全国インフラ老朽化・空き家メーター
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.05rem' }}>
                    {/* Akiya (Vacant Houses) */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 700 }}>
                                <Home size={15} /> 全国空き家数（過去最多・900万戸突破）
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                                <span className="tabular-nums outfit" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                                    {Math.floor(data.akiyaCount).toLocaleString()}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>戸</span>
                            </div>
                        </div>
                        <div style={{ height: '7px', background: 'rgba(15, 23, 42, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${data.akiyaRate}%`, background: 'var(--accent-orange)', borderRadius: '999px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '3px' }}>
                            <span>放置空き家: 385.6万戸</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-orange)' }}>全住宅の {data.akiyaRate.toFixed(2)}% (約7戸に1戸)</span>
                        </div>
                    </div>

                    {/* Aging Pipes */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 700 }}>
                                <Droplet size={15} /> 法定耐用年数(40年)超え水道管
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                                <span className="tabular-nums outfit" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                                    {Math.floor(data.pipeCount).toLocaleString()}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>km</span>
                            </div>
                        </div>
                        <div style={{ height: '7px', background: 'rgba(15, 23, 42, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${data.pipeRate}%`, background: 'var(--accent-blue)', borderRadius: '999px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '3px' }}>
                            <span>漏水・破損事故: 年間約2万件</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>全水道管の {data.pipeRate.toFixed(1)}% (地球4.4周分)</span>
                        </div>
                    </div>

                    {/* Public Facility Maintenance */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.35rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 700 }}>
                                <Building2 size={15} /> 公共ハコモノ維持負担（人口減で1人あたり急増）
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                                <span className="tabular-nums outfit" style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                                    {data.areaPerCapita.toFixed(3)}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>㎡/人</span>
                            </div>
                        </div>
                        <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(239, 68, 68, 0.06)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>国民1人あたり年間維持・更新費推計</span>
                            <span className="tabular-nums" style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--accent-red)' }}>
                                約 {Math.floor(data.costPerCapita).toLocaleString()} 円/年
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <WidgetFooter
                sourceName="総務省「住宅・土地統計調査(最新確定値)」/ 国交省「水道統計」"
                sourceUrl="https://www.stat.go.jp/data/jyutaku/index.html"
                shareText={`【インフラ崩壊の現実】全国の空き家数は過去最多の900万戸突破（約7戸に1戸）、法定耐用年数40年を超えた老朽化水道管は約17.6万km（全体の約24%）に到達しています。`}
            />
        </div>
    );
}
