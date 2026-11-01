'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
    { id: 'section-hook', label: '🔥 国の借金・時計' },
    { id: 'section-simulator', label: '🧮 1秒自分事診断' },
    { id: 'section-pain', label: '💸 賃金・社保の罠' },
    { id: 'section-root-cause', label: '🏛️ 予算と世代格差' },
    { id: 'section-collapse', label: '🗾 人口・インフラ' },
];

export default function SectionJumpNav() {
    const [visible, setVisible] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('section-hook');

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 240);

            for (let i = SECTIONS.length - 1; i >= 0; i--) {
                const el = document.getElementById(SECTIONS[i].id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 260) {
                        setActiveSection(SECTIONS[i].id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 88;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.nav
                    aria-label="セクション移動ナビゲーション"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.25 }}
                    style={{
                        position: 'fixed',
                        bottom: '1.1rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 60,
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28)',
                        borderRadius: '999px',
                        padding: '0.35rem 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        maxWidth: '94vw',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {SECTIONS.map((sec) => {
                        const isActive = activeSection === sec.id;
                        return (
                            <button
                                key={sec.id}
                                onClick={() => scrollToSection(sec.id)}
                                style={{
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.38rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.73rem',
                                    fontWeight: isActive ? 800 : 600,
                                    background: isActive ? 'var(--accent-blue)' : 'transparent',
                                    color: isActive ? '#ffffff' : '#cbd5e1',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {sec.label}
                            </button>
                        );
                    })}
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
