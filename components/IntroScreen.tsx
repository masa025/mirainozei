'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroScreenProps {
    onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Keep the intro visible for a few seconds so the user can read it, 
        // then trigger the fade out.
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 4500); // 4.5 seconds read time

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence onExitComplete={onComplete}>
            {isVisible && (
                <motion.div
                    key="intro-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }} // Slow, dramatic fade out
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Frost Glass Background
                        backdropFilter: 'blur(30px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '2rem'
                    }}
                >
                    {/* Staggered text fade in */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                        style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <h1 className="outfit" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(90deg, #0f172a, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 4px 30px rgba(59, 130, 246, 0.2)' }}>
                            日本の「今」を直視する
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1.5, delay: 1.5, ease: 'easeOut' }}
                        style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.4rem)', maxWidth: '800px', lineHeight: 1.8, fontWeight: 500 }}
                    >
                        為替、気象、地震といった不変の「現実」と共に、<br />
                        進行し続ける日本の財政・社会課題の生データをリアルタイムで配信します。
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 3 }}
                        style={{ marginTop: '3rem' }}
                    >
                        <div className="live-pulse" style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-blue)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-blue)' }}></div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
