'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroScreenProps {
    onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3600);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence onExitComplete={onComplete}>
            {isVisible && (
                <motion.div
                    key="intro-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                    onClick={() => setIsVisible(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                        background:
                            'radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.88) 0%, rgba(241, 245, 249, 0.78) 100%)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '2rem',
                        cursor: 'pointer',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
                        style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <span
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                letterSpacing: '0.2em',
                                color: 'var(--accent-blue)',
                                marginBottom: '0.75rem',
                                padding: '4px 14px',
                                borderRadius: '999px',
                                background: 'rgba(37, 99, 235, 0.08)',
                                border: '1px solid rgba(37, 99, 235, 0.2)',
                            }}
                        >
                            MIRAINOZEI — STRUCTURAL DATA ARCHIVE
                        </span>
                        <h1
                            className="outfit"
                            style={{
                                fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            日本の「今」を直視する
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1.1, delay: 0.9, ease: 'easeOut' }}
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)',
                            maxWidth: '720px',
                            lineHeight: 1.8,
                            fontWeight: 500,
                        }}
                    >
                        公的債務、円の購買力、世代間の受益と負担、そして人口動態。<br />
                        私たちが向き合うべき日本の構造課題を、客観的な統計データで可視化します。
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                        onClick={() => setIsVisible(false)}
                        style={{
                            marginTop: '2.5rem',
                            padding: '0.55rem 1.25rem',
                            borderRadius: '999px',
                            border: '1px solid rgba(15, 23, 42, 0.15)',
                            background: 'rgba(255, 255, 255, 0.7)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        ダッシュボードを開く →
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
