'use client';
import { useState, useEffect } from 'react';
import { Flame, Snowflake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CITIES = [
    {
        id: 'tokyo',
        name: '東京',
        lat: 35.6895,
        lon: 139.6917,
        avg1980s: [5.2, 5.6, 8.5, 14.1, 18.6, 21.4, 25.2, 27.1, 23.2, 17.6, 12.6, 7.9]
    },
    {
        id: 'osaka',
        name: '大阪',
        lat: 34.6937,
        lon: 135.5023,
        avg1980s: [5.8, 5.9, 9.0, 14.8, 19.4, 23.2, 27.2, 28.4, 24.4, 18.7, 13.2, 8.3]
    },
    {
        id: 'nagoya',
        name: '名古屋',
        lat: 35.1815,
        lon: 136.9066,
        avg1980s: [4.3, 4.7, 8.2, 14.1, 18.8, 22.5, 26.2, 27.3, 23.4, 17.4, 11.9, 6.7]
    },
    {
        id: 'sapporo',
        name: '札幌',
        lat: 43.0618,
        lon: 141.3545,
        avg1980s: [-3.8, -3.2, 0.4, 6.9, 12.2, 16.5, 20.3, 22.1, 18.0, 11.6, 4.7, -1.1]
    },
    {
        id: 'fukuoka',
        name: '福岡',
        lat: 33.5902,
        lon: 130.4017,
        avg1980s: [6.4, 7.1, 10.1, 14.9, 19.2, 22.8, 27.0, 28.0, 24.2, 18.9, 13.5, 8.7]
    }
];

interface WeatherData {
    temp: number;
    condition: string;
    anomaly: number;
}

export default function WeatherWidget() {
    const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
    const [loading, setLoading] = useState(true);
    const [currentCityIndex, setCurrentCityIndex] = useState(0);

    const parseCondition = (code: number) => {
        if (code >= 1 && code <= 3) return "曇り";
        if (code >= 45 && code <= 48) return "霧";
        if (code >= 51 && code <= 67) return "雨";
        if (code >= 71 && code <= 77) return "雪";
        if (code >= 95) return "雷雨";
        return "晴れ";
    };

    useEffect(() => {
        const fetchAllWeather = async () => {
            try {
                const results: Record<string, WeatherData> = {};
                const currentMonth = new Date().getMonth(); // 0 - 11

                await Promise.all(CITIES.map(async (city) => {
                    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=Asia%2FTokyo`);
                    const data = await res.json();

                    if (data.current_weather) {
                        const temp = data.current_weather.temperature;
                        const baselineTemp = city.avg1980s[currentMonth];
                        const anomaly = temp - baselineTemp;
                        const condition = parseCondition(data.current_weather.weathercode);

                        results[city.id] = { temp, condition, anomaly };
                    }
                }));

                setWeatherData(results);
            } catch (error) {
                console.error('Failed to fetch weather data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllWeather();
        // Refresh API every 30 mins
        const apiInterval = setInterval(fetchAllWeather, 30 * 60 * 1000);
        return () => clearInterval(apiInterval);
    }, []);

    // Auto-cycling removed as per user request for manual selection.

    const currentCity = CITIES[currentCityIndex];
    const cityWeather = weatherData[currentCity.id];

    let anomalyColor = 'var(--text-secondary)';
    let anomalyVisual = null;
    let anomalySign = "";

    if (cityWeather && cityWeather.anomaly !== null) {
        if (cityWeather.anomaly > 0) {
            anomalyColor = 'var(--accent-red)';
            anomalySign = "+";
            anomalyVisual = <Flame size={14} style={{ color: anomalyColor }} />;
        } else if (cityWeather.anomaly < 0) {
            anomalyColor = 'var(--accent-blue)';
            anomalyVisual = <Snowflake size={14} style={{ color: anomalyColor }} />;
        }
    }

    return (
        <div className="widget" style={{ flex: 1, backgroundColor: 'var(--surface-secondary)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2 className="widget-title" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--accent-blue)' }}>🌤</span> 日本の現在の天気
                </span>

                {/* Location Selector */}
                <select
                    value={currentCityIndex}
                    onChange={(e) => setCurrentCityIndex(Number(e.target.value))}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        outline: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    {CITIES.map((city, idx) => (
                        <option key={city.id} value={idx} style={{ color: '#000' }}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </h2>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}
                        >
                            取得中...
                        </motion.div>
                    ) : cityWeather ? (
                        <motion.div
                            key={currentCity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}
                        >
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.2rem' }}>
                                {currentCity.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                                <span style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }} className="tabular-nums">
                                    {cityWeather.temp.toFixed(1)}°C
                                </span>
                                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    {cityWeather.condition}
                                </span>
                            </div>

                            {/* Global Warming Impact Area */}
                            <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'var(--surface-main)', border: `1px solid ${cityWeather.anomaly > 2.0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)'}` }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600 }}>
                                    環境債務（1980年代同月平均比）
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700, color: anomalyColor }} className="tabular-nums">
                                    {anomalyVisual} {anomalySign}{cityWeather.anomaly.toFixed(1)}°C
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ textAlign: 'center', color: 'var(--text-secondary)' }}
                        >
                            データ取得エラー
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', textAlign: 'right' }}>
                過去データ: JMA | 現在: Open-Meteo
            </div>
        </div>
    );
}
