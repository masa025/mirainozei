'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingDown, AlertTriangle, TrendingUp } from 'lucide-react';

// Demographic data based on MIC (総務省統計局「人口推計」最新公表値) & IPSS (国立社会保障・人口問題研究所「日本の地域別将来推計人口（令和5年推計）」)
// Data format: [Current Population (latest MIC estimate), Projected 2050 Population (IPSS)]
const PREFECTURE_DATA: Record<string, { current: number; pro2050: number; name: string }> = {
    'Hokkaido': { name: '北海道', current: 5043000, pro2050: 3820000 },
    'Aomori': { name: '青森県', current: 1165000, pro2050: 740000 },
    'Iwate': { name: '岩手県', current: 1145000, pro2050: 810000 },
    'Miyagi': { name: '宮城県', current: 2248000, pro2050: 1860000 },
    'Akita': { name: '秋田県', current: 897000, pro2050: 530000 },
    'Yamagata': { name: '山形県', current: 1011000, pro2050: 670000 },
    'Fukushima': { name: '福島県', current: 1743000, pro2050: 1140000 },
    'Ibaraki': { name: '茨城県', current: 2806000, pro2050: 2280000 },
    'Tochigi': { name: '栃木県', current: 1885000, pro2050: 1530000 },
    'Gunma': { name: '群馬県', current: 1890000, pro2050: 1510000 },
    'Saitama': { name: '埼玉県', current: 7332000, pro2050: 6510000 },
    'Chiba': { name: '千葉県', current: 6278000, pro2050: 5540000 },
    'Tokyo': { name: '東京都', current: 14178000, pro2050: 14400000 }, // Tokyo is an outlier (slight growth/plateau)
    'Kanagawa': { name: '神奈川県', current: 9225000, pro2050: 8250000 },
    'Niigata': { name: '新潟県', current: 2099000, pro2050: 1530000 },
    'Toyama': { name: '富山県', current: 997000, pro2050: 760000 },
    'Ishikawa': { name: '石川県', current: 1101000, pro2050: 920000 },
    'Fukui': { name: '福井県', current: 739000, pro2050: 580000 },
    'Yamanashi': { name: '山梨県', current: 791000, pro2050: 610000 },
    'Nagano': { name: '長野県', current: 1987000, pro2050: 1540000 },
    'Gifu': { name: '岐阜県', current: 1916000, pro2050: 1500000 },
    'Shizuoka': { name: '静岡県', current: 3527000, pro2050: 2790000 },
    'Aichi': { name: '愛知県', current: 7460000, pro2050: 6760000 },
    'Mie': { name: '三重県', current: 1711000, pro2050: 1350000 },
    'Shiga': { name: '滋賀県', current: 1402000, pro2050: 1250000 },
    'Kyoto': { name: '京都府', current: 2523000, pro2050: 2060000 },
    'Osaka': { name: '大阪府', current: 8757000, pro2050: 7370000 },
    'Hyogo': { name: '兵庫県', current: 5337000, pro2050: 4420000 },
    'Nara': { name: '奈良県', current: 1285000, pro2050: 1000000 },
    'Wakayama': { name: '和歌山県', current: 880000, pro2050: 610000 },
    'Tottori': { name: '鳥取県', current: 531000, pro2050: 400000 },
    'Shimane': { name: '島根県', current: 642000, pro2050: 480000 },
    'Okayama': { name: '岡山県', current: 1831000, pro2050: 1480000 },
    'Hiroshima': { name: '広島県', current: 2714000, pro2050: 2210000 },
    'Yamaguchi': { name: '山口県', current: 1281000, pro2050: 940000 },
    'Tokushima': { name: '徳島県', current: 685000, pro2050: 490000 },
    'Kagawa': { name: '香川県', current: 917000, pro2050: 710000 },
    'Ehime': { name: '愛媛県', current: 1276000, pro2050: 950000 },
    'Kochi': { name: '高知県', current: 656000, pro2050: 450000 },
    'Fukuoka': { name: '福岡県', current: 5092000, pro2050: 4560000 },
    'Saga': { name: '佐賀県', current: 788000, pro2050: 640000 },
    'Nagasaki': { name: '長崎県', current: 1252000, pro2050: 940000 },
    'Kumamoto': { name: '熊本県', current: 1697000, pro2050: 1370000 },
    'Oita': { name: '大分県', current: 1084000, pro2050: 840000 },
    'Miyazaki': { name: '宮崎県', current: 1033000, pro2050: 790000 },
    'Kagoshima': { name: '鹿児島県', current: 1532000, pro2050: 1140000 },
    'Okinawa': { name: '沖縄県', current: 1466000, pro2050: 1420000 }
};

// Pre-calculate the ranking based on decline percentage (Worst decline = higher rank number, or let's say "Decline Rate Rank N / 47")
// Decline rate = (current - pro2050) / current. 
// We want to sort them so the highest decline rate is Rank 1.
interface RankedPrefecture {
    current: number;
    pro2050: number;
    name: string;
    key: string;
    declineRate: number;
    rank: number;
}

const RANKED_PREFECTURES: RankedPrefecture[] = Object.entries(PREFECTURE_DATA)
    .map(([key, data]) => ({
        key,
        ...data,
        declineRate: (data.current - data.pro2050) / data.current
    }))
    .sort((a, b) => b.declineRate - a.declineRate) // Worst decline first
    .map((item, index) => ({
        ...item,
        rank: index + 1 // 1 is worst, 47 is best (like Tokyo which is negative decline/growth)
    }));

// Re-map back to an object for easy lookup
const PREFECTURE_DATA_WITH_RANK: Record<string, RankedPrefecture> = {};
RANKED_PREFECTURES.forEach(p => {
    PREFECTURE_DATA_WITH_RANK[p.key] = p;
});

export default function RegionalPopulationWidget() {
    const [regionData, setRegionData] = useState<RankedPrefecture | null>(null);
    const [simulatedCurrent, setSimulatedCurrent] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                // Attempt to get user's region via free IP API
                let response = await fetch('http://ip-api.com/json/').catch(() => null);
                if (!response || !response.ok) {
                    response = await fetch('https://ipapi.co/json/').catch(() => null);
                }

                if (response && response.ok) {
                    const data = await response.json();
                    const regionRaw = data.regionName || data.region;

                    if (regionRaw && PREFECTURE_DATA_WITH_RANK[regionRaw]) {
                        setRegionData(PREFECTURE_DATA_WITH_RANK[regionRaw]);
                        setSimulatedCurrent(PREFECTURE_DATA_WITH_RANK[regionRaw].current);
                    } else {
                        // Fallback to Tokyo if IP region is not recognized or not in Japan
                        setRegionData(PREFECTURE_DATA_WITH_RANK['Tokyo']);
                        setSimulatedCurrent(PREFECTURE_DATA_WITH_RANK['Tokyo'].current);
                    }
                } else {
                    throw new Error("Geolocation failed");
                }
            } catch (error) {
                console.warn("Geolocation fallback to Tokyo.");
                setRegionData(PREFECTURE_DATA_WITH_RANK['Tokyo']);
                setSimulatedCurrent(PREFECTURE_DATA_WITH_RANK['Tokyo'].current);
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);

    // Ticking counter simulation (population decline logic)
    useEffect(() => {
        if (!regionData) return;

        // Roughly calculate how much the population decreases every 5 seconds to reach 2050 goal
        // Assuming current is 2024, years to 2050 = 26 years
        // Seconds in 26 years = 26 * 365 * 24 * 60 * 60 ≈ 820M seconds
        // Decrease per 5 seconds = ((current - 2050) / 820M) * 5 * accelerationFactor

        const diff = regionData.current - regionData.pro2050; // Positive if declining
        // We accelerate the visual ticking by a factor for dramatic effect in the dashboard
        const ACCELERATION = 20000;
        const dropPerInterval = Math.max(1, Math.floor((diff / 820000000) * 5 * ACCELERATION));

        const interval = setInterval(() => {
            setSimulatedCurrent(prev => {
                // If it's a growing prefecture like Tokyo (rare), it might increase slightly, but let's stick to the decline narrative if it is declining.
                if (diff > 0) return Math.max(regionData.pro2050, prev - dropPerInterval);
                return prev; // Tokyo remains relatively stable in this simulation
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [regionData]);

    if (loading || !regionData) {
        return (
            <div className="widget" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--widget-bg)', borderBottom: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', minHeight: '120px' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', fontWeight: 600 }}>対象地域をスキャン中...</span>
            </div>
        );
    }

    const maxPop = Math.max(regionData.current, regionData.pro2050);
    const isDeclining = regionData.current > regionData.pro2050;
    const difference = Math.abs(regionData.current - regionData.pro2050);
    const declinePercentage = ((difference / regionData.current) * 100).toFixed(1);

    // Bar Width Calculations
    const currentPercent = (simulatedCurrent / maxPop) * 100;
    const futurePercent = (regionData.pro2050 / maxPop) * 100;

    return (
        <div className="widget" style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            background: 'rgba(15, 23, 42, 0.7)', // Darker, more opaque glass
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            borderTop: `4px solid ${isDeclining ? '#ef4444' : '#3b82f6'}`, // Bright neon border top
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>

            {/* 1. Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', zIndex: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        <MapPin size={22} strokeWidth={2.5} style={{ color: isDeclining ? '#fca5a5' : '#93c5fd' }} />
                        <span>{regionData.name} の人口推計（現在〜2050年）</span>
                        <select
                            aria-label="都道府県を切り替え"
                            value={regionData.key}
                            onChange={(e) => {
                                const selected = PREFECTURE_DATA_WITH_RANK[e.target.value];
                                if (selected) {
                                    setRegionData(selected);
                                    setSimulatedCurrent(selected.current);
                                }
                            }}
                            style={{
                                marginLeft: '0.4rem',
                                background: 'rgba(15, 23, 42, 0.85)',
                                color: '#f8fafc',
                                border: '1px solid rgba(148, 163, 184, 0.4)',
                                borderRadius: '8px',
                                padding: '3px 8px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            {Object.entries(PREFECTURE_DATA_WITH_RANK).map(([key, pref]) => (
                                <option key={key} value={key}>
                                    {pref.name}（減少率{pref.rank}位）
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', marginLeft: '2rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>※IPアドレスから推定された地域を表示しています（プルダウンで任意の都道府県に切替可能）</span>
                    </div>
                </div>
                {isDeclining ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#ffed4a', fontWeight: 800, background: 'rgba(0, 0, 0, 0.4)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255, 237, 74, 0.3)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        <AlertTriangle size={16} strokeWidth={2.5} />
                        減少率 全国ワースト {regionData.rank}位
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: '#60a5fa', fontWeight: 800, background: 'rgba(0, 0, 0, 0.4)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                        <TrendingUp size={16} strokeWidth={2.5} /> 増加予測 {48 - regionData.rank}位
                    </div>
                )}
            </div>

            {/* 2. Main Visual Data Row - Made Responsive with Tailwind */}
            <div className="flex flex-col lg:grid lg:grid-cols-[1.2fr_2fr_1.2fr] items-center gap-6 lg:gap-8 z-10 w-full mt-2">

                {/* Current */}
                <div className="flex flex-col lg:items-start items-center w-full">
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CURRENT 推計人口</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                        <motion.span
                            key={simulatedCurrent}
                            initial={isDeclining ? { color: '#ff8a8a', scale: 1.02 } : { color: '#ffffff', scale: 1 }}
                            animate={{ color: '#ffffff', scale: 1 }}
                            transition={{ duration: 0.8 }}
                            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                        >
                            {simulatedCurrent.toLocaleString()}
                        </motion.span>
                        <span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: 800 }}>人</span>
                    </div>
                </div>

                {/* Decline Visual Progress Bar */}
                <div className="flex flex-col gap-3 w-full">
                    {/* The Bar Container */}
                    <div style={{ height: '14px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)' }}>
                        {/* 2050 Base Target Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${futurePercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: '#475569', borderRadius: '8px', opacity: 0.6 }}
                        />
                        {/* Current Progress Bar */}
                        <motion.div
                            animate={{ width: `${currentPercent}%` }}
                            transition={{ duration: 0.5, ease: "linear" }}
                            style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: isDeclining ? 'linear-gradient(90deg, #ef4444, #fca5a5)' : 'linear-gradient(90deg, #3b82f6, #93c5fd)', borderRadius: '8px', boxShadow: `0 0 10px ${isDeclining ? 'rgba(239, 68, 68, 0.5)' : 'rgba(59, 130, 246, 0.5)'}` }}
                        />
                    </div>
                    {/* Stats under the bar */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: isDeclining ? '#fca5a5' : '#93c5fd', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        {isDeclining ? <TrendingDown size={18} strokeWidth={3} /> : <TrendingUp size={18} strokeWidth={3} />}
                        <span style={{ fontSize: '1rem', fontWeight: 800 }}>
                            {isDeclining ? `2050年までに 約 ${difference.toLocaleString()} 人 (${declinePercentage}%) 減少` : `2050年までに 約 ${difference.toLocaleString()} 人 増加予測`}
                        </span>
                    </div>
                </div>

                {/* 2050 Projection */}
                <div className="flex flex-col lg:items-end items-center w-full lg:text-right text-center mt-2 lg:mt-0">
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2050 ESTIMATE (IPSS)</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                        <span style={{ fontSize: 'clamp(1.8rem, 4vw, 2.7rem)', fontWeight: 800, color: '#94a3b8', fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em', opacity: 0.9, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            {regionData.pro2050.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 800 }}>人</span>
                    </div>
                </div>

            </div>

            {/* 3. Seamless 2x-Duplicated Nationwide Ticker (Marquee) */}
            <div
                style={{
                    marginTop: '0.25rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 10,
                    maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                }}
            >
                <div className="seamless-marquee-track">
                    {[...RANKED_PREFECTURES.slice(0, 15), ...RANKED_PREFECTURES.slice(0, 15)].map((pref, idx) => (
                        <button
                            key={`${pref.key}-${idx}`}
                            onClick={() => {
                                setRegionData(pref);
                                setSimulatedCurrent(pref.current);
                            }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: 'rgba(255, 255, 255, 0.07)',
                                border: '1px solid rgba(255, 255, 255, 0.14)',
                                borderRadius: '999px',
                                padding: '3px 10px',
                                fontSize: '0.72rem',
                                color: '#e2e8f0',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <span style={{ color: '#f87171', fontWeight: 800 }}>ワースト{pref.rank}位</span>
                            <span style={{ fontWeight: 700 }}>{pref.name}</span>
                            <span style={{ color: '#fca5a5' }}>
                                (-{(pref.declineRate * 100).toFixed(1)}% / 2050年)
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Source Citation & Share Bar */}
            <div
                style={{
                    paddingTop: '0.6rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    fontSize: '0.7rem',
                    color: '#cbd5e1',
                    zIndex: 10,
                }}
            >
                <span
                    style={{
                        display: 'inline-block',
                        lineHeight: 1.45,
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontWeight: 500,
                    }}
                >
                    <span style={{ whiteSpace: 'nowrap' }}>📚 出典: </span>
                    <a
                        href="https://www.ipss.go.jp/pp-shicyoson/j/shicyoson23/t-page.asp"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#93c5fd', textDecoration: 'underline' }}
                    >
                        国立社会保障・人口問題研究所「日本の地域別将来推計人口」/ 総務省「人口推計(最新)」
                    </a>
                </span>

                <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `【${regionData.name}の人口推計】現在の推計人口約${regionData.current.toLocaleString()}人から、2050年には約${regionData.pro2050.toLocaleString()}人へ（${
                            isDeclining ? `-${declinePercentage}%減少・全国ワースト${regionData.rank}位` : '増加予測'
                        }）。\n#ミライノゼイ https://mirainozei.netlify.app`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.12)',
                        color: '#f8fafc',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        textDecoration: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" width="11" height="11" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z" />
                    </svg>
                    この現実をシェア
                </a>
            </div>

            {/* Subtle Gradient Background Effect for Red Alarm - Made darker for contrast */}
            {isDeclining && (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, background: 'radial-gradient(circle at center, transparent 30%, rgba(220, 38, 38, 0.15) 100%)', pointerEvents: 'none', zIndex: 0 }} />
            )}
        </div>
    );
}
