'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, UserIcon } from 'lucide-react';

const SUPPORT_DATA = {
    baseDate: new Date("2025-01-01T00:00:00").getTime(),
    workerVal: 71707000,
    workerPerSec: -0.016,
    elderVal: 36532000,
    elderPerSec: 0.006
};

export default function SupportRatioWidget() {
    const [ratio, setRatio] = useState<number>(0);

    useEffect(() => {
        const updateData = () => {
            const now = new Date().getTime();
            const secSinceBase = (now - SUPPORT_DATA.baseDate) / 1000;

            const currentWorker = SUPPORT_DATA.workerVal + (secSinceBase * SUPPORT_DATA.workerPerSec);
            const currentElder = SUPPORT_DATA.elderVal + (secSinceBase * SUPPORT_DATA.elderPerSec);

            setRatio(currentWorker / currentElder);
        };

        updateData(); // Initial calculation
        const interval = setInterval(updateData, 100); // 100ms for smooth live updates (doesn't need to be 10ms)
        return () => clearInterval(interval);
    }, []);

    if (ratio === 0) return null;

    const wholeWorkers = Math.floor(ratio);
    const fractionalWorker = ratio - wholeWorkers;

    return (
        <div className="widget" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <h2 className="widget-title" style={{ color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="live-indicator"></div>
                現役世代の負担増（支える人数）
            </h2>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                    高齢者1人を支える現役世代（15〜64歳）
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }} className="tabular-nums">
                        {ratio.toFixed(5)}
                    </span>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>人</span>
                </div>

                {/* Visualizer matching the old site logic */}
                <div style={{ padding: '1.5rem 1rem', background: 'var(--surface-primary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>

                    {/* Elderly Person Icon */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={36} color="var(--accent-orange)" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-orange)' }}>高齢者1人</span>
                    </div>

                    <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--border-color), transparent)' }} />

                    {/* Running Worker Icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Render Whole Workers */}
                        {[...Array(wholeWorkers)].map((_, i) => (
                            <motion.div
                                key={`worker-${i}`}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <User size={36} color="var(--accent-blue)" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)' }}>現役</span>
                            </motion.div>
                        ))}

                        {/* Render Fractional Worker Fading In/Out */}
                        {fractionalWorker > 0.05 && (
                            <motion.div
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                    opacity: fractionalWorker // Bind opacity to the exact fractional amount
                                }}
                            >
                                <User size={36} color="var(--accent-blue)" />
                            </motion.div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
