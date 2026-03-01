'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingDown, AlertTriangle, TrendingUp } from 'lucide-react';

// Hardcoded demographic data based on the National Institute of Population and Social Security Research (IPSS) 2023 projections
// Data format: [Current Population (approx 2020/2023), Projected 2050 Population]
const PREFECTURE_DATA: Record<string, { current: number; pro2050: number; name: string }> = {
    'Hokkaido': { name: '北海道', current: 5224614, pro2050: 3820000 },
    'Aomori': { name: '青森県', current: 1237984, pro2050: 740000 },
    'Iwate': { name: '岩手県', current: 1210534, pro2050: 810000 },
    'Miyagi': { name: '宮城県', current: 2301996, pro2050: 1860000 },
    'Akita': { name: '秋田県', current: 959502, pro2050: 530000 },
    'Yamagata': { name: '山形県', current: 1068027, pro2050: 670000 },
    'Fukushima': { name: '福島県', current: 1833152, pro2050: 1140000 },
    'Ibaraki': { name: '茨城県', current: 2867009, pro2050: 2280000 },
    'Tochigi': { name: '栃木県', current: 1933146, pro2050: 1530000 },
    'Gunma': { name: '群馬県', current: 1939110, pro2050: 1510000 },
    'Saitama': { name: '埼玉県', current: 7344765, pro2050: 6510000 },
    'Chiba': { name: '千葉県', current: 6284480, pro2050: 5540000 },
    'Tokyo': { name: '東京都', current: 14047594, pro2050: 14400000 }, // Tokyo is an outlier (slight growth/plateau)
    'Kanagawa': { name: '神奈川県', current: 9237337, pro2050: 8250000 },
    'Niigata': { name: '新潟県', current: 2201272, pro2050: 1530000 },
    'Toyama': { name: '富山県', current: 1034814, pro2050: 760000 },
    'Ishikawa': { name: '石川県', current: 1132526, pro2050: 920000 },
    'Fukui': { name: '福井県', current: 766863, pro2050: 580000 },
    'Yamanashi': { name: '山梨県', current: 809974, pro2050: 610000 },
    'Nagano': { name: '長野県', current: 2048011, pro2050: 1540000 },
    'Gifu': { name: '岐阜県', current: 1978742, pro2050: 1500000 },
    'Shizuoka': { name: '静岡県', current: 3633202, pro2050: 2790000 },
    'Aichi': { name: '愛知県', current: 7542415, pro2050: 6760000 },
    'Mie': { name: '三重県', current: 1770254, pro2050: 1350000 },
    'Shiga': { name: '滋賀県', current: 1413610, pro2050: 1250000 },
    'Kyoto': { name: '京都府', current: 2578087, pro2050: 2060000 },
    'Osaka': { name: '大阪府', current: 8837685, pro2050: 7370000 },
    'Hyogo': { name: '兵庫県', current: 5465002, pro2050: 4420000 },
    'Nara': { name: '奈良県', current: 1324473, pro2050: 1000000 },
    'Wakayama': { name: '和歌山県', current: 922584, pro2050: 610000 },
    'Tottori': { name: '鳥取県', current: 553407, pro2050: 400000 },
    'Shimane': { name: '島根県', current: 671126, pro2050: 480000 },
    'Okayama': { name: '岡山県', current: 1888432, pro2050: 1480000 },
    'Hiroshima': { name: '広島県', current: 2799702, pro2050: 2210000 },
    'Yamaguchi': { name: '山口県', current: 1342059, pro2050: 940000 },
    'Tokushima': { name: '徳島県', current: 719559, pro2050: 490000 },
    'Kagawa': { name: '香川県', current: 950244, pro2050: 710000 },
    'Ehime': { name: '愛媛県', current: 1334841, pro2050: 950000 },
    'Kochi': { name: '高知県', current: 691527, pro2050: 450000 },
    'Fukuoka': { name: '福岡県', current: 5135214, pro2050: 4560000 },
    'Saga': { name: '佐賀県', current: 811442, pro2050: 640000 },
    'Nagasaki': { name: '長崎県', current: 1312317, pro2050: 940000 },
    'Kumamoto': { name: '熊本県', current: 1738301, pro2050: 1370000 },
    'Oita': { name: '大分県', current: 1123852, pro2050: 840000 },
    'Miyazaki': { name: '宮崎県', current: 1069576, pro2050: 790000 },
    'Kagoshima': { name: '鹿児島県', current: 1588256, pro2050: 1140000 },
    'Okinawa': { name: '沖縄県', current: 1467480, pro2050: 1420000 }
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        <MapPin size={22} strokeWidth={2.5} style={{ color: isDeclining ? '#fca5a5' : '#93c5fd' }} />
                        {regionData.name} のリアルタイム人口推計
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', marginLeft: '2rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>※IPアドレスから推定された地域を表示しています（実際と異なる場合があります）</span>
                    </div>
                </div>
                {isDeclining ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#ffed4a', fontWeight: 800, background: 'rgba(0, 0, 0, 0.4)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255, 237, 74, 0.3)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        <AlertTriangle size={16} strokeWidth={2.5} />
                        減少率 全国ワースト {regionData.rank}位
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: '#60a5fa', fontWeight: 800, background: 'rgba(0, 0, 0, 0.4)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                        <TrendingUp size={16} strokeWidth={2.5} /> 人口維持・増加予測 ({regionData.rank}位)
                    </div>
                )}
            </div>

            {/* 2. Main Visual Data Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.2fr', alignItems: 'center', gap: '2rem', zIndex: 10 }}>

                {/* Current */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CURRENT 推計人口</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                        <motion.span
                            key={simulatedCurrent}
                            initial={isDeclining ? { color: '#ff8a8a', scale: 1.02 } : { color: '#ffffff', scale: 1 }}
                            animate={{ color: '#ffffff', scale: 1 }}
                            transition={{ duration: 0.8 }}
                            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                        >
                            {simulatedCurrent.toLocaleString()}
                        </motion.span>
                        <span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: 800 }}>人</span>
                    </div>
                </div>

                {/* Decline Visual Progress Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2050 ESTIMATE (IPSS)</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                        <span style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.7rem)', fontWeight: 800, color: '#94a3b8', fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em', opacity: 0.9, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            {regionData.pro2050.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 800 }}>人</span>
                    </div>
                </div>

            </div>

            {/* Subtle Gradient Background Effect for Red Alarm - Made darker for contrast */}
            {isDeclining && (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, background: 'radial-gradient(circle at center, transparent 30%, rgba(220, 38, 38, 0.15) 100%)', pointerEvents: 'none', zIndex: 0 }} />
            )}
        </div>
    );
}
