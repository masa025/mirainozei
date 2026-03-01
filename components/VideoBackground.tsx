'use client';
import { useState, useEffect } from 'react';

// Map time of day to historical eras in Japan using copyright-free/archive YouTube footage
const HISTORICAL_VIDEOS = [
    {
        id: '0UMxkrzhQo4', // 1910s archive
        name: '大正・昭和初期：近代化の夜明け'
    },
    {
        id: 'TA9UbUnvT-k', // 1950s color archive
        name: '1950年代：戦後復興と熱気'
    },
    {
        id: '1P7JWx8pMHg', // 1960s/70s archive
        name: '1960年代：高度経済成長期'
    },
    {
        id: 'FQXY6vm0ECI', // 1970s walk
        name: '1970年代：安定成長と大衆文化'
    },
    {
        id: 'C_qi8XVP8W0', // 1980s dynamic walk
        name: '1980年代：バブル経済の絶頂'
    },
    {
        id: 'wkwPcdxpd50', // 1990s walk
        name: '1990年代：バブル崩壊と失われた10年の始まり'
    },
    {
        id: '9l1mZ2Mv_s8', // 2010s
        name: '2010年代：震災復興とスマホ・SNSの普及'
    },
    {
        id: '2Y2uK5n0Gk8', // 2020s Shibuya transition
        name: '2020年代：パンデミックと新しい日常'
    },
    // --- FUTURE PREDICTIONS ---
    {
        id: 'UeZtlFeEcNg', // Abandoned city / ruins
        name: '近未来予測：限界集落とインフラ崩壊（空き家問題）'
    },
    {
        id: 'rZApWh2Igk4', // Factory automation / robotics
        name: '近未来予測：労働人口激減と完全自動化社会'
    },
    {
        id: 'LYubHpEMTPM', // Extreme weather / storm clouds
        name: '近未来予測：気候変動による環境インフラの危機'
    }
];

export default function VideoBackground() {
    const [isMounted, setIsMounted] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(HISTORICAL_VIDEOS[0]);

    useEffect(() => {
        setIsMounted(true);

        // Randomly select a video from the available historical eras on every load
        const randomIndex = Math.floor(Math.random() * HISTORICAL_VIDEOS.length);
        setCurrentVideo(HISTORICAL_VIDEOS[randomIndex]);
    }, []);

    // Prevent hydration mismatch
    if (!isMounted) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -100, backgroundColor: '#000', overflow: 'hidden' }}>

            {/* 1. YouTube iframe stretched to cover the screen */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh', pointerEvents: 'none', zIndex: 0 }}>
                <iframe
                    key={currentVideo.id} // Force re-render iframe if ID changes
                    src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&mute=1&loop=1&playlist=${currentVideo.id}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                    style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title="Background Video"
                />
            </div>

            {/* 2. Dark/Frost Overlay to ensure dashboard text readability */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.45)', // Slightly darker wash to unify standard qualities of old/new videos
                backdropFilter: 'blur(8px)', // Blur to keep focus on data
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 1
            }} />

            {/* 3. Contrast Mesh Overlay (for adding texture and reading contrast) */}
            <div className="video-overlay" style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.35,
                mixBlendMode: 'overlay',
                zIndex: 2,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
            }} />

            {/* 4. Era Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                zIndex: 10,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                background: 'rgba(255,255,255,0.7)',
                padding: '6px 12px',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: '4px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
                現在背景: {currentVideo.name}
            </div>
        </div>
    );
}
