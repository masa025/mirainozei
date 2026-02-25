'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin } from 'lucide-react';

const RISKY_PREFECTURES = [
    { pref: '青森県', rate: '77.5%', count: '31/40 市町村' },
    { pref: '秋田県', rate: '76.0%', count: '19/25 市町村' },
    { pref: '山形県', rate: '74.3%', count: '26/35 市町村' },
    { pref: '島根県', rate: '73.7%', count: '14/19 市町村' },
    { pref: '高知県', rate: '73.5%', count: '25/34 市町村' },
];

const NOTABLE_CITIES = [
    { name: '豊島区 (東京都)', memo: '2014年に23区で唯一指定され激震が走った' },
    { name: '函館市 (北海道)', memo: '観光名所ながら深刻な若年女性減少' },
    { name: '小樽市 (北海道)', memo: '道内の主要都市でも消滅可能性' },
    { name: '熱海市 (静岡県)', memo: 'リゾート地としての再起を図るも厳しい現実' },
    { name: '夕張市 (北海道)', memo: '財政破綻から続く極端な人口流出' }
];

export default function DisappearingCitiesWidget() {
    const [showCities, setShowCities] = useState(false);

    useEffect(() => {
        // Toggle between prefectures and notable cities every 8 seconds
        const interval = setInterval(() => {
            setShowCities(prev => !prev);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="widget" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 className="widget-title" style={{ color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--accent-red)" />
                消滅可能性都市 (人口戦略会議 2024)
            </h2>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                2050年までに「20〜39歳の若年女性が半減」し、最終的に消滅する可能性が高いと推計された<strong style={{ color: 'var(--accent-red)' }}>全国744の自治体</strong>（全自治体の約4割）。
            </p>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="popLayout">
                    {!showCities ? (
                        <motion.div
                            key="prefectures"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                                自治体消滅リスクの高い都道府県 トップ5
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {RISKY_PREFECTURES.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-primary)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{idx + 1}. {item.pref}</div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-red)' }}>{item.rate}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{item.count}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="cities"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                                誰もが知る著名な「消滅可能性都市」
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {NOTABLE_CITIES.map((city, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', background: 'var(--surface-primary)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            <MapPin size={14} color="var(--accent-orange)" /> {city.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            {city.memo}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
