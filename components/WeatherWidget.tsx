'use client';
import { useState, useEffect } from 'react';
import { Flame, Snowflake } from 'lucide-react';

// Source: JMA (Japan Meteorological Agency) Tokyo monthly mean temp (1981-1990 avg)
const TOKYO_1980s_AVG_TEMP = [
    5.2,  // Jan
    5.6,  // Feb
    8.5,  // Mar
    14.1, // Apr
    18.6, // May
    21.4, // Jun
    25.2, // Jul
    27.1, // Aug
    23.2, // Sep
    17.6, // Oct
    12.6, // Nov
    7.9   // Dec
];

export default function WeatherWidget() {
    const [temp, setTemp] = useState<number | null>(null);
    const [anomaly, setAnomaly] = useState<number | null>(null);
    const [condition, setCondition] = useState<string>('取得中...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch weather for Tokyo using free Open-Meteo API
        const fetchWeather = async () => {
            try {
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true&timezone=Asia%2FTokyo');
                const data = await res.json();

                if (data.current_weather) {
                    const currentTemp = data.current_weather.temperature;
                    setTemp(currentTemp);

                    // Calculate Anomaly based on the current month
                    const currentMonth = new Date().getMonth(); // 0 - 11
                    const baselineTemp = TOKYO_1980s_AVG_TEMP[currentMonth];
                    const diff = currentTemp - baselineTemp;
                    setAnomaly(diff);

                    // Simple weather code mapping (WMO weather interpretation codes)
                    const code = data.current_weather.weathercode;
                    let text = "晴れ";
                    if (code >= 1 && code <= 3) text = "曇り";
                    if (code >= 45 && code <= 48) text = "霧";
                    if (code >= 51 && code <= 67) text = "雨";
                    if (code >= 71 && code <= 77) text = "雪";
                    if (code >= 95) text = "雷雨";
                    setCondition(text);
                }
            } catch (error) {
                setCondition('取得失敗');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        // Refresh every 30 mins
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Format the anomaly display
    let anomalyColor = 'var(--text-secondary)';
    let anomalyVisual = null;
    let anomalySign = "";

    if (anomaly !== null) {
        if (anomaly > 0) {
            anomalyColor = 'var(--accent-red)';
            anomalySign = "+";
            anomalyVisual = <Flame size={14} style={{ color: anomalyColor }} />;
        } else if (anomaly < 0) {
            anomalyColor = 'var(--accent-blue)';
            anomalyVisual = <Snowflake size={14} style={{ color: anomalyColor }} />;
        }
    }

    return (
        <div className="widget" style={{ flex: 1, backgroundColor: 'var(--surface-secondary)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2 className="widget-title" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span><span style={{ color: 'var(--accent-blue)' }}>🌤</span> 東京の現在の天気</span>
            </h2>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                    <span style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }} className="tabular-nums">
                        {temp !== null ? `${temp.toFixed(1)}°C` : '--'}
                    </span>
                    <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {condition}
                    </span>
                </div>

                {/* Global Warming Impact Area */}
                {anomaly !== null && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'var(--surface-main)', border: `1px solid ${anomaly > 2.0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)'}` }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600 }}>
                            環境債務（1980年代同月平均比）
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700, color: anomalyColor }} className="tabular-nums">
                            {anomalyVisual} {anomalySign}{anomaly.toFixed(1)}°C
                        </div>
                    </div>
                )}
            </div>

            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', textAlign: 'right' }}>
                過去データ: JMA | 現在: Open-Meteo
            </div>
        </div>
    );
}
