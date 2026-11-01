'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import WidgetFooter from './WidgetFooter';

const SUPPORT_DATA = {
    baseDate: new Date('2025-01-01T00:00:00').getTime(),
    workerVal: 73100000, // Latest MIC estimate: ~7,310万人 (15-64歳)
    workerPerSec: -0.017,
    elderVal: 36240000, // Latest MIC estimate: ~3,624万人 (65歳以上・高齢化率29.3%過去最高)
    elderPerSec: 0.005,
};

export default function SupportRatioWidget() {
    const [ratio, setRatio] = useState<number>(0);

    useEffect(() => {
        const updateData = () => {
            const now = new Date().getTime();
            const secSinceBase = (now - SUPPORT_DATA.baseDate) / 1000;

            const currentWorker = SUPPORT_DATA.workerVal + secSinceBase * SUPPORT_DATA.workerPerSec;
            const currentElder = SUPPORT_DATA.elderVal + secSinceBase * SUPPORT_DATA.elderPerSec;

            setRatio(currentWorker / currentElder);
        };

        updateData();
        const interval = setInterval(updateData, 200);
        return () => clearInterval(interval);
    }, []);

    if (ratio === 0) return null;

    const wholeWorkers = Math.floor(ratio);
    const fractionalWorker = ratio - wholeWorkers;

    return (
        <div className="widget" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <div>
                <h2 className="widget-title" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>
                    <div className="live-indicator"></div>
                    現役世代の負担増（高齢者1人を支える人数）
                </h2>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                    65歳以上の高齢者1人を支える現役世代（15〜64歳）の数
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }} className="tabular-nums outfit">
                        {ratio.toFixed(5)}
                    </span>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 700 }}>人</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-red)', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '999px' }}>
                        高齢化率 29.3% (過去最高)
                    </span>
                </div>

                {/* Visualizer */}
                <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.78)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                        <User size={34} color="var(--accent-orange)" />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-orange)' }}>高齢者1人</span>
                    </div>

                    <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--border-color), transparent)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {[...Array(wholeWorkers)].map((_, i) => (
                            <motion.div
                                key={`worker-${i}`}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}
                            >
                                <User size={34} color="var(--accent-blue)" />
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-blue)' }}>現役</span>
                            </motion.div>
                        ))}

                        {fractionalWorker > 0.05 && (
                            <motion.div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    opacity: fractionalWorker,
                                }}
                            >
                                <User size={34} color="var(--accent-blue)" />
                                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent-blue)' }}>({(fractionalWorker * 100).toFixed(0)}%)</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Historical & Future Shift Summary */}
                <div className="grid grid-cols-3 gap-2" style={{ fontSize: '0.7rem', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.04)', padding: '0.4rem', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>1965年 (胴上げ型)</div>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>9.1人で1人</div>
                    </div>
                    <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                        <div style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>現在 (騎馬戦崩壊)</div>
                        <div style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>約2.0人で1人</div>
                    </div>
                    <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <div style={{ color: 'var(--accent-red)', fontWeight: 700 }}>2050年 (肩車型)</div>
                        <div style={{ fontWeight: 800, color: 'var(--accent-red)' }}>1.3人で1人</div>
                    </div>
                </div>
            </div>

            <WidgetFooter
                sourceName="内閣府「高齢社会白書」/ 社人研「日本の将来推計人口」"
                sourceUrl="https://www8.cao.go.jp/kourei/whitepaper/index-w.html"
                shareText={`【胴上げ型から肩車型へ】1965年には現役9.1人で高齢者1人を支えていた日本は、現在「約${ratio.toFixed(2)}人で1人」にまで悪化。2050年には「1.3人で1人」の肩車社会へ突入します。`}
            />
        </div>
    );
}
