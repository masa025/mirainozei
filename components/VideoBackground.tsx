'use client';
import { useState, useEffect } from 'react';

interface EraVideo {
    id: string;
    era: string;
    category: 'ARCHIVE' | 'PRESENT' | 'COLLAPSE' | 'FUTURE';
    name: string;
    sourceChannel: string;
}

const HISTORICAL_VIDEOS: EraVideo[] = [
    {
        id: '0UMxkrzhQo4',
        era: 'ARCHIVE 1910s',
        category: 'ARCHIVE',
        name: '大正・昭和初期：近代化の夜明け（1910年代・東京カラー化映像）',
        sourceChannel: 'NASS Archive',
    },
    {
        id: 'MUOPBMxjwh0',
        era: 'ARCHIVE 1930s',
        category: 'ARCHIVE',
        name: '1930年代：戦前・昭和モダンの銀座と浅草（カラー復元記録）',
        sourceChannel: '昭和モダンアーカイブ',
    },
    {
        id: 'TA9UbUnvT-k',
        era: 'ARCHIVE 1956',
        category: 'ARCHIVE',
        name: '1956年：戦後復興と昭和31年の東京（銀座・丸の内・浅草）',
        sourceChannel: 'Tokyo Archive 60fps',
    },
    {
        id: '6cj8Y2wRgpA',
        era: 'ARCHIVE 1964',
        category: 'ARCHIVE',
        name: '1964年：東京五輪と高度経済成長の熱気（銀座・British Pathé）',
        sourceChannel: 'British Pathé',
    },
    {
        id: '1P7JWx8pMHg',
        era: 'ARCHIVE 1965',
        category: 'ARCHIVE',
        name: '1965年：高度経済成長期の東京と暮らし（昭和40年アーカイブ）',
        sourceChannel: 'Tokyo Archive 60fps',
    },
    {
        id: 'FQXY6vm0ECI',
        era: 'ARCHIVE 1970s',
        category: 'ARCHIVE',
        name: '1970年代：雨の東京ストリートと高層ビル群の誕生',
        sourceChannel: '70s Japan Archive',
    },
    {
        id: 'mUISJk4MZeo',
        era: 'ARCHIVE 1980s',
        category: 'ARCHIVE',
        name: '1980年代：バブル経済の絶頂とジャパン・アズ・ナンバーワン',
        sourceChannel: '80s HD Archive',
    },
    {
        id: 'KJQsGpCDX54',
        era: 'ARCHIVE 1992',
        category: 'ARCHIVE',
        name: '1992年：バブル崩壊直後の東京の日常風景',
        sourceChannel: 'Tokyo 1992 Archive',
    },
    {
        id: 'wkwPcdxpd50',
        era: 'ARCHIVE 1994',
        category: 'ARCHIVE',
        name: '1994年：失われた30年の始まり・90年代東京の記録（ITN Archive）',
        sourceChannel: 'ITN Archive',
    },
    {
        id: 'gaW3TlTEECk',
        era: 'ARCHIVE 2000s',
        category: 'ARCHIVE',
        name: '2000年代：平成デフレ不況とガラケー・IT黎明期の東京',
        sourceChannel: '2000s Tokyo Archive',
    },
    {
        id: 'K5ksHjgH4D8',
        era: 'ARCHIVE 2020',
        category: 'ARCHIVE',
        name: '2020年：コロナ禍・緊急事態宣言で無人となった原宿ストリート',
        sourceChannel: 'Tokyo Street Archive',
    },
    {
        id: '0nTO4zSEpOs',
        era: 'PRESENT 2020s',
        category: 'PRESENT',
        name: '2020年代：現代の東京・渋谷ナイトウォーク（インバウンドとネオン街）',
        sourceChannel: 'VIRTUAL JAPAN',
    },
    {
        id: '0qH6cUbsnak',
        era: 'PRESENT 2020s',
        category: 'PRESENT',
        name: '現代：一極集中する巨大都市・東京の上空8Kタイムラプス',
        sourceChannel: 'Tokyo Aerial 8K',
    },
    {
        id: 'rb0zOstIiyU',
        era: 'COLLAPSE 01',
        category: 'COLLAPSE',
        name: '人口減少の象徴：かつて人口密度世界一だった「軍艦島（端島）」の廃墟群',
        sourceChannel: '4K Drone Archive',
    },
    {
        id: 'DBVTwL185u0',
        era: 'COLLAPSE 02',
        category: 'COLLAPSE',
        name: '地方衰退の現実：放置された巨大温泉街・鬼怒川廃墟群ドローン空撮',
        sourceChannel: 'Drone Japan 4K',
    },
    {
        id: 'BSdyecIafkU',
        era: 'COLLAPSE 03',
        category: 'COLLAPSE',
        name: '限界集落・廃村の現実：地図から消えゆく北関東・鬼怒木集落の記録',
        sourceChannel: 'Japan Ruins 4K',
    },
    {
        id: 'u2BfVmmaWvk',
        era: 'FUTURE 01',
        category: 'FUTURE',
        name: '近未来予測：労働人口激減と日本の産業用ロボット（FANUC）完全自動化工場',
        sourceChannel: 'FANUC Official',
    },
    {
        id: '8nqU_qDomFk',
        era: 'FUTURE 02',
        category: 'FUTURE',
        name: '近未来予測：気候変動と激甚化する日本の巨大台風・高潮災害',
        sourceChannel: 'Japan Disaster Archive 4K',
    },
];

export default function VideoBackground() {
    const [isMounted, setIsMounted] = useState(false);
    const [videoIndex, setVideoIndex] = useState(6); // Default 1980s before randomizing on mount

    useEffect(() => {
        setIsMounted(true);
        const randomIndex = Math.floor(Math.random() * HISTORICAL_VIDEOS.length);
        setVideoIndex(randomIndex);
    }, []);

    if (!isMounted) return null;

    const currentVideo = HISTORICAL_VIDEOS[videoIndex];

    const handlePrevEra = () => {
        setVideoIndex((prev) => (prev - 1 + HISTORICAL_VIDEOS.length) % HISTORICAL_VIDEOS.length);
    };

    const handleNextEra = () => {
        setVideoIndex((prev) => (prev + 1) % HISTORICAL_VIDEOS.length);
    };

    const badgeColor =
        currentVideo.category === 'COLLAPSE'
            ? { bg: 'rgba(239, 68, 68, 0.35)', text: '#fca5a5', border: 'rgba(252, 165, 165, 0.35)' }
            : currentVideo.category === 'FUTURE'
              ? { bg: 'rgba(245, 158, 11, 0.35)', text: '#fcd34d', border: 'rgba(252, 211, 77, 0.35)' }
              : currentVideo.category === 'PRESENT'
                ? { bg: 'rgba(16, 185, 129, 0.35)', text: '#6ee7b7', border: 'rgba(110, 231, 183, 0.35)' }
                : { bg: 'rgba(59, 130, 246, 0.35)', text: '#93c5fd', border: 'rgba(147, 197, 253, 0.35)' };

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
                        title={currentVideo.name}
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

            {/* 4. Interactive Era Switcher Dock (bottom-left) */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '1rem',
                    left: '1rem',
                    zIndex: 45,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#f8fafc',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    background: 'rgba(15, 23, 42, 0.82)',
                    padding: '0.38rem 0.65rem',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    borderRadius: '999px',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    maxWidth: 'calc(100vw - 2rem)',
                }}
            >
                <span
                    style={{
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        background: badgeColor.bg,
                        color: badgeColor.text,
                        padding: '2px 7px',
                        borderRadius: '999px',
                        border: `1px solid ${badgeColor.border}`,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                >
                    {currentVideo.era} ({videoIndex + 1}/{HISTORICAL_VIDEOS.length})
                </span>

                {/* Direct Dropdown Selector for all 18 verified eras/videos */}
                <select
                    aria-label="背景の時代映像を選択"
                    value={videoIndex}
                    onChange={(e) => setVideoIndex(Number(e.target.value))}
                    style={{
                        background: 'transparent',
                        color: '#f8fafc',
                        border: 'none',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        outline: 'none',
                        maxWidth: '280px',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                    }}
                >
                    {HISTORICAL_VIDEOS.map((vid, idx) => (
                        <option
                            key={vid.id}
                            value={idx}
                            style={{ background: '#0f172a', color: '#f8fafc' }}
                        >
                            [{vid.era}] {vid.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handlePrevEra}
                    title="前の時代映像へ"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#f8fafc',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        borderRadius: '999px',
                        padding: '2px 7px',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexShrink: 0,
                    }}
                >
                    ⏮
                </button>
                <button
                    onClick={handleNextEra}
                    title="次の時代映像へ切替"
                    style={{
                        background: 'rgba(59, 130, 246, 0.28)',
                        color: '#dbeafe',
                        border: '1px solid rgba(147, 197, 253, 0.35)',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                >
                    ⏭ 次へ
                </button>

                <a
                    href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`映像出典: ${currentVideo.sourceChannel} (YouTubeで開く)`}
                    style={{
                        color: '#94a3b8',
                        fontSize: '0.62rem',
                        textDecoration: 'none',
                        paddingLeft: '2px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                >
                    📺 出典
                </a>
            </div>
        </>
    );
}
