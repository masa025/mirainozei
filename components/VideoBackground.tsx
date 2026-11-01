'use client';
import { useState, useEffect } from 'react';

const HISTORICAL_VIDEOS = [
    {
        id: '0UMxkrzhQo4',
        era: 'ARCHIVE 01',
        name: '大正・昭和初期：近代化の夜明け',
    },
    {
        id: 'TA9UbUnvT-k',
        era: 'ARCHIVE 02',
        name: '1950年代：戦後復興と熱気',
    },
    {
        id: '1P7JWx8pMHg',
        era: 'ARCHIVE 03',
        name: '1960年代：高度経済成長期',
    },
    {
        id: 'FQXY6vm0ECI',
        era: 'ARCHIVE 04',
        name: '1970年代：安定成長と大衆文化',
    },
    {
        id: 'mUISJk4MZeo',
        era: 'ARCHIVE 05',
        name: '1980年代：バブル経済の絶頂',
    },
    {
        id: 'wkwPcdxpd50',
        era: 'ARCHIVE 06',
        name: '1990年代：バブル崩壊と失われた10年',
    },
    {
        id: 'SoA5td8UU30',
        era: 'PRESENT 07',
        name: '2010年代：スマホ普及と都市の風景',
    },
    {
        id: 'K5ksHjgH4D8',
        era: 'PRESENT 08',
        name: '2020年代：転換期の東京',
    },
    {
        id: '5lwwaBPHLQg',
        era: 'FUTURE 09',
        name: '近未来予測：限界集落とインフラ老朽化',
    },
    {
        id: 'rZApWh2Igk4',
        era: 'FUTURE 10',
        name: '近未来予測：労働人口激減と自動化社会',
    },
    {
        id: 'IfD8M9pJGOM',
        era: 'FUTURE 11',
        name: '近未来予測：気候変動と環境インフラ危機',
    },
];

export default function VideoBackground() {
    const [isMounted, setIsMounted] = useState(false);
    const [videoIndex, setVideoIndex] = useState(4); // Default 1980s or random on mount

    useEffect(() => {
        setIsMounted(true);
        const randomIndex = Math.floor(Math.random() * HISTORICAL_VIDEOS.length);
        setVideoIndex(randomIndex);
    }, []);

    if (!isMounted) return null;

    const currentVideo = HISTORICAL_VIDEOS[videoIndex];

    const handleNextEra = () => {
        setVideoIndex((prev) => (prev + 1) % HISTORICAL_VIDEOS.length);
    };

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: -100,
                    backgroundColor: '#090d16',
                    overflow: 'hidden',
                }}
            >
                {/* 1. YouTube iframe stretched to cover the screen continuously */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) scale(1.04)',
                        width: '100vw',
                        height: '56.25vw',
                        minHeight: '100vh',
                        minWidth: '177.77vh',
                        pointerEvents: 'none',
                        zIndex: 0,
                        filter: 'saturate(1.08) contrast(1.04)',
                    }}
                >
                    <iframe
                        key={currentVideo.id}
                        src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&mute=1&loop=1&playlist=${currentVideo.id}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                        style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        title="Historical and Future Japan Background Video"
                    />
                </div>

                {/* 2. Spatial Atmospheric Gradient Overlay — preserves video motion & color while guaranteeing card legibility */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'radial-gradient(circle at 50% 25%, rgba(248, 250, 252, 0.22) 0%, rgba(15, 23, 42, 0.42) 65%, rgba(9, 13, 22, 0.65) 100%)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        zIndex: 1,
                    }}
                />

                {/* 3. Subtle Fine Film Grain for Editorial Depth */}
                <div
                    className="video-overlay"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.22,
                        mixBlendMode: 'overlay',
                        zIndex: 2,
                        backgroundImage:
                            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                    }}
                />
            </div>

            {/* 4. Interactive Era Switcher Pill (bottom-left) */}
            <button
                onClick={handleNextEra}
                title="クリックして背景の時代映像を切り替え"
                style={{
                    position: 'fixed',
                    bottom: '1.1rem',
                    left: '1.25rem',
                    zIndex: 45,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#f8fafc',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    background: 'rgba(15, 23, 42, 0.72)',
                    padding: '0.45rem 0.85rem',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    borderRadius: '999px',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
            >
                <span
                    style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        background: 'rgba(59, 130, 246, 0.35)',
                        color: '#93c5fd',
                        padding: '2px 6px',
                        borderRadius: '999px',
                        border: '1px solid rgba(147, 197, 253, 0.3)',
                    }}
                >
                    {currentVideo.era}
                </span>
                <span>{currentVideo.name}</span>
                <span style={{ opacity: 0.75, fontSize: '0.7rem' }}>⏭ 映像切替</span>
            </button>
        </>
    );
}
