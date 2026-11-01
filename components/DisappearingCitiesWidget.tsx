'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin } from 'lucide-react';
import WidgetFooter from './WidgetFooter';

const RISKY_PREFECTURES = [
    { pref: '青森県', rate: '77.5%', count: '31/40 市町村' },
    { pref: '秋田県', rate: '76.0%', count: '19/25 市町村' },
    { pref: '山形県', rate: '74.3%', count: '26/35 市町村' },
    { pref: '島根県', rate: '73.7%', count: '14/19 市町村' },
    { pref: '高知県', rate: '73.5%', count: '25/34 市町村' },
];

const NOTABLE_CITIES = [
    { name: '函館市・小樽市 (北海道)', memo: '北海道を代表する観光都市でも若年女性が5割超減少予測' },
    { name: '熱海市 (静岡県)', memo: '首都圏近郊リゾート地ながら少子高齢化で消滅可能性指定' },
    { name: '鎌倉市・逗子市 (神奈川県)', memo: 'ブランド住宅地でも若年女性の流出・高齢化が深刻化' },
    { name: '夕張市 (北海道)', memo: '財政破綻後の急激な人口流出とインフラ維持限界の象徴' },
    { name: '東京23区の大半 (ブラックホール型)', memo: '2024年分析で地方から若者を吸い上げるが出生率が極端に低い自治体と警告' },
];

export default function DisappearingCitiesWidget() {
    const [showCities, setShowCities] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setShowCities((prev) => !prev);
        }, 9000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div
            className="widget"
            style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <h2 className="widget-title" style={{ color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.05rem' }}>
                        <AlertTriangle size={18} color="var(--accent-red)" />
                        消滅可能性自治体 744（全自治体の43%）
                    </h2>

                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px' }}>
                        <button
                            onClick={() => setShowCities(false)}
                            style={{
                                padding: '3px 7px',
                                fontSize: '0.7rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                border: 'none',
                                background: !showCities ? 'rgba(255,255,255,0.9)' : 'transparent',
                                color: !showCities ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontWeight: !showCities ? 700 : 500,
                            }}
                        >
                            県別率
                        </button>
                        <button
                            onClick={() => setShowCities(true)}
                            style={{
                                padding: '3px 7px',
                                fontSize: '0.7rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                border: 'none',
                                background: showCities ? 'rgba(255,255,255,0.9)' : 'transparent',
                                color: showCities ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontWeight: showCities ? 700 : 500,
                            }}
                        >
                            注目都市
                        </button>
                    </div>
                </div>

                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.45 }}>
                    2050年までに「20〜39歳の若年女性が半減」し、存続が困難と推計された<strong style={{ color: 'var(--accent-red)' }}>全国744自治体</strong>（令和6年・人口戦略会議レポート）。
                </p>

                <div style={{ position: 'relative', minHeight: '235px' }}>
                    <AnimatePresence mode="wait">
                        {!showCities ? (
                            <motion.div
                                key="prefectures"
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 15 }}
                                transition={{ duration: 0.35 }}
                            >
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                                    消滅可能性自治体の割合が高い都道府県 ワースト5
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {RISKY_PREFECTURES.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.75)', padding: '0.4rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {idx + 1}. {item.pref}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>({item.count})</span>
                                                <span className="tabular-nums" style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--accent-red)' }}>
                                                    {item.rate}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="cities"
                                initial={{ opacity: 0, x: 15 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -15 }}
                                transition={{ duration: 0.35 }}
                            >
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                                    著名な「消滅可能性自治体」と都市部の「ブラックホール型」
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.38rem' }}>
                                    {NOTABLE_CITIES.map((city, idx) => (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', background: 'rgba(255, 255, 255, 0.75)', padding: '0.4rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                <MapPin size={13} color="var(--accent-orange)" /> {city.name}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{city.memo}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <WidgetFooter
                sourceName="人口戦略会議「地方自治体『持続可能性』分析レポート(2024)」"
                sourceUrl="https://www.hit-north.or.jp/information/2024/04/24/2147/"
                shareText="【全国744自治体が消滅危機】人口戦略会議の最新分析で、2050年までに若年女性が半減する「消滅可能性自治体」は744（全体の約4割）。地方だけでなく都市部も人口を消費するブラックホール型と警告されています。"
                isPaused={isPaused}
            />
        </div>
    );
}
