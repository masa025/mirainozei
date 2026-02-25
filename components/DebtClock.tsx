'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Advanced Graphical Debt Clock with Rolling Numbers
export default function DebtClock() {
    const INITIAL_DEBT = 1293214567890000;
    const DEBT_PER_SECOND = 1000000;
    const [debt, setDebt] = useState(INITIAL_DEBT);

    useEffect(() => {
        // Ticks up every 100ms for continuous graphical movement
        const tickRate = DEBT_PER_SECOND / 10;
        const interval = setInterval(() => {
            setDebt(prev => prev + tickRate);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const formattedStr = new Intl.NumberFormat('ja-JP').format(Math.floor(debt));
    // Split into components to animate individually (not absolutely necessary for true slot-machine, 
    // but a simpler blur-scale effect on rapid changes gives a high-end feel).

    return (
        <div className="tracing-border-widget" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="tracing-content">
                <h2 className="widget-title" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                    <div className="live-indicator"></div>
                    リアルタイム公的債務（国の借金）
                </h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 600, color: 'var(--text-secondary)' }}>¥</span>
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                        {/* Removed the key={formattedStr} and motion animation to prevent vertical shaking on every 10ms tick. 
                            Using strictly CSS tabular-nums for a solid, high-performance counting display. */}
                        <div
                            style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.03em' }}
                            className="tabular-nums"
                        >
                            {formattedStr}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>増加ペース</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-red)' }}>+ ¥1,000,000 / 秒</div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>
                        ※将来世代への<br />ツケの総額
                    </div>
                </div>
            </div>
        </div>
    );
}
