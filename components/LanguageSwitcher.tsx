'use client';

import { useEffect, useState, useRef } from 'react';

type Lang = 'ja' | 'en';

// Precision terminology & chart label dictionary for instant, accurate translation of headings, units, and SVG chart axes
const EXACT_DICTIONARY: Record<string, string> = {
    'ミライノゼイ': 'MIRAINOZEI',
    '公的統計・世代会計に基づく構造可視化': 'Structural Visualization Based on Official Statistics & Generational Accounting',
    '日本の「今」を数字で直視する': 'Facing Japan’s Reality Through Hard Numbers',
    '国の借金（公的債務残高）': 'National Public Debt (JGBs & Borrowings)',
    '国民1人あたりの借金時計': 'Public Debt Per Capita Clock',
    '世代別：生涯の純負担（受益と負担の格差）': 'Generational Accounting: Lifetime Net Burden vs. Benefit',
    '国民負担率の推移（租税＋社会保険料）': 'National Burden Ratio (Taxes + Social Security)',
    '実質賃金 vs 物価指数（CPI）': 'Real Wages vs. Consumer Price Index (CPI)',
    '円の購買力・実質実効為替レート': 'Purchasing Power of Yen & Real Effective Exchange Rate',
    '年間出生数の崩壊と15年前倒しショック': 'Birth Collapse: 15 Years Ahead of Official Projections',
    'デジタル赤字（IT・クラウド海外流出）': 'Digital Trade Deficit (Cloud & AI Outflow)',
    'いじめ対策予算と重大事態・不登校の推移': 'Anti-Bullying Budget vs. Serious Incidents & Truancy',
    '教育予算（対GDP比）と国際学力調査（PISA）': 'Education Spending (% of GDP) vs. PISA Rankings',
    '企業の新陳代謝（休廃業・倒産・開廃業率）': 'Corporate Metabolism (Closures, Bankruptcies & Entry/Exit)',
    '意思決定層の高齢化（社長・国会議員の平均年齢）': 'Aging Decision-Makers (Avg. Age of CEOs & Lawmakers)',
    '現役世代と高齢者の支え合い比率（騎馬戦型から肩車型へ）': 'Worker-to-Retiree Support Ratio',
    '消滅可能性自治体（20〜39歳女性人口が半減する自治体）': 'Municipalities at Risk of Disappearance',
    '生産年齢人口と高齢者人口の長期推移': 'Long-Term Working-Age vs. Elderly Population',
    '都道府県別：現在人口と2050年推計人口': 'Prefectural Population: Current vs. 2050 Projection',
    '全国インフラ老朽化（空き家900万戸・水道管老朽化）': 'Aging Infrastructure (9M Vacant Homes & Water Pipes)',
    '橋梁・道路インフラの通行止め・予防保全マップ': 'Critical Bridge & Road Infrastructure Maintenance Map',
    '気候変動：1980年代平年値と現在の猛暑比較': 'Climate Shift: 1980s Baseline vs. Current Temperatures',
    'リアルタイム地震モニター（気象庁データ）': 'Real-Time Earthquake Monitor (JMA Feed)',
    '日本の構造課題・経済ニュース': 'Japan Structural & Economic News Feed',
    '国内推移': 'Domestic Trend',
    '国際比較': 'Global Comparison',
    '実質賃金': 'Real Wage',
    '消費者物価(CPI)': 'CPI (Inflation)',
    '生産年齢人口 (15-64歳)': 'Working-Age (15-64)',
    '高齢者人口 (65歳以上)': 'Elderly (65+)',
    '⏭ 次へ': '⏭ Next',
    '📺 出典': '📺 Source',
};

const SUBSTRING_REPLACEMENTS: Array<[RegExp, string]> = [
    [/📚 出典:\s*/g, '📚 Source: '],
    [/（令和7・8年度当初予算フレーム）/g, ' (FY2025/2026 Initial Budget)'],
    [/財務省/g, 'Ministry of Finance (MOF)'],
    [/総務省/g, 'Ministry of Internal Affairs (MIC)'],
    [/厚生労働省/g, 'Ministry of Health, Labour & Welfare (MHLW)'],
    [/文部科学省/g, 'Ministry of Education (MEXT)'],
    [/経済産業省/g, 'Ministry of Economy, Trade & Industry (METI)'],
    [/国土交通省/g, 'Ministry of Land, Infrastructure & Transport (MLIT)'],
    [/国立社会保障・人口問題研究所/g, 'National Institute of Population & Social Security (IPSS)'],
    [/社人研/g, 'IPSS'],
    [/内閣府/g, 'Cabinet Office'],
    [/日本銀行/g, 'Bank of Japan (BOJ)'],
    [/気象庁/g, 'Japan Meteorological Agency (JMA)'],
    [/東京商工リサーチ/g, 'Tokyo Shoko Research (TSR)'],
    [/人口戦略会議/g, 'Population Strategy Council'],
    [/(\d+(?:\.\d+)?)兆円/g, '¥$1 Trillion'],
    [/(\d+(?:,\d+)*(?:\.\d+)?)億円/g, '¥$100M'],
    [/(\d+(?:,\d+)*(?:\.\d+)?)万円/g, '¥$10K'],
    [/(\d+(?:,\d+)*(?:\.\d+)?)万人/g, '$10K people'],
    [/(\d{4})年度/g, 'FY$1'],
    [/(\d{4})年/g, '$1'],
    [/現在/g, 'Current'],
    [/推計/g, 'Proj.'],
    [/過去最多/g, 'Record High'],
    [/過去最少/g, 'Record Low'],
];

declare global {
    interface Window {
        googleTranslateElementInit?: () => void;
        google?: {
            translate?: {
                TranslateElement?: new (
                    options: {
                        pageLanguage: string;
                        includedLanguages: string;
                        autoDisplay: boolean;
                    },
                    elementId: string
                ) => unknown;
            };
        };
    }
}

function setGoogleTranslateCookie(targetLang: Lang) {
    if (typeof document === 'undefined') return;
    const host = window.location.hostname;
    if (targetLang === 'en') {
        document.cookie = `googtrans=/ja/en; path=/; max-age=31536000`;
        if (host && host !== 'localhost') {
            document.cookie = `googtrans=/ja/en; path=/; domain=.${host}; max-age=31536000`;
        }
    } else {
        document.cookie = `googtrans=/ja/ja; path=/; max-age=0`;
        document.cookie = `googtrans=; path=/; max-age=0`;
        if (host && host !== 'localhost') {
            document.cookie = `googtrans=/ja/ja; path=/; domain=.${host}; max-age=0`;
            document.cookie = `googtrans=; path=/; domain=.${host}; max-age=0`;
        }
    }
}

function triggerGoogleTranslateCombo(targetLang: Lang) {
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo) {
        combo.value = targetLang === 'en' ? 'en' : 'ja';
        combo.dispatchEvent(new Event('change'));
    }
}

export default function LanguageSwitcher() {
    const [lang, setLang] = useState<Lang>('ja');
    const originalTextsRef = useRef<WeakMap<Node, string>>(new WeakMap());

    // Apply or restore dictionary-based DOM & SVG text translation
    const applyDomDictionary = (targetLang: Lang) => {
        if (typeof document === 'undefined') return;
        document.documentElement.lang = targetLang;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                const tag = parent.tagName.toLowerCase();
                if (tag === 'script' || tag === 'style' || tag === 'noscript') {
                    return NodeFilter.FILTER_REJECT;
                }
                if (parent.closest('[data-no-translate="true"]')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            },
        });

        const textNodes: Text[] = [];
        let current = walker.nextNode();
        while (current) {
            textNodes.push(current as Text);
            current = walker.nextNode();
        }

        for (const node of textNodes) {
            const raw = node.nodeValue;
            if (!raw || !raw.trim()) continue;

            if (targetLang === 'en') {
                if (!originalTextsRef.current.has(node)) {
                    originalTextsRef.current.set(node, raw);
                }
                const sourceText = originalTextsRef.current.get(node) || raw;
                const trimmed = sourceText.trim();

                if (EXACT_DICTIONARY[trimmed]) {
                    node.nodeValue = sourceText.replace(trimmed, EXACT_DICTIONARY[trimmed]);
                } else {
                    let updated = sourceText;
                    for (const [pattern, replacement] of SUBSTRING_REPLACEMENTS) {
                        updated = updated.replace(pattern, replacement);
                    }
                    if (updated !== sourceText) {
                        node.nodeValue = updated;
                    }
                }
            } else {
                const orig = originalTextsRef.current.get(node);
                if (orig !== undefined) {
                    node.nodeValue = orig;
                }
            }
        }
    };

    // Load Google Website Translator script once for full-page neural translation
    useEffect(() => {
        if (typeof window === 'undefined') return;

        window.googleTranslateElementInit = () => {
            if (window.google?.translate?.TranslateElement) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'ja',
                        includedLanguages: 'en,ja',
                        autoDisplay: false,
                    },
                    'google_translate_element_hidden'
                );
            }
        };

        if (!document.getElementById('google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }

        // Auto-detect preferred language:
        // 1. ?lang=en or ?lang=ja query param
        // 2. Saved preference in localStorage
        // 3. Browser language (navigator.language) — if not Japanese, auto-enable English!
        const params = new URLSearchParams(window.location.search);
        const queryLang = params.get('lang');
        const savedLang = localStorage.getItem('mirainozei_lang') as Lang | null;
        const browserLang = (navigator.language || 'ja').toLowerCase();

        let initialLang: Lang = 'ja';
        if (queryLang === 'en' || queryLang === 'ja') {
            initialLang = queryLang;
        } else if (savedLang === 'en' || savedLang === 'ja') {
            initialLang = savedLang;
        } else if (!browserLang.startsWith('ja')) {
            initialLang = 'en';
        }

        if (initialLang === 'en') {
            setLang('en');
            setGoogleTranslateCookie('en');
            setTimeout(() => {
                applyDomDictionary('en');
                triggerGoogleTranslateCombo('en');
            }, 600);
        }
    }, []);

    // Keep observing dynamic chart/widget updates when in English mode
    useEffect(() => {
        if (lang !== 'en') return;

        applyDomDictionary('en');
        const timer = setInterval(() => {
            applyDomDictionary('en');
            triggerGoogleTranslateCombo('en');
        }, 1800);

        return () => clearInterval(timer);
    }, [lang]);

    const handleSwitchLanguage = (nextLang: Lang) => {
        if (nextLang === lang) return;
        setLang(nextLang);
        localStorage.setItem('mirainozei_lang', nextLang);
        setGoogleTranslateCookie(nextLang);

        if (nextLang === 'en') {
            applyDomDictionary('en');
            triggerGoogleTranslateCombo('en');
            setTimeout(() => triggerGoogleTranslateCombo('en'), 400);
        } else {
            applyDomDictionary('ja');
            triggerGoogleTranslateCombo('ja');
            // If Google Translate mutated the DOM deeply, reload cleanly to restore pristine Japanese state
            if (document.documentElement.classList.contains('translated-ltr')) {
                window.location.reload();
            }
        }
    };

    return (
        <div
            data-no-translate="true"
            className="notranslate"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
            }}
        >
            {/* Hidden mount node for Google Neural Website Translator */}
            <div
                id="google_translate_element_hidden"
                style={{
                    position: 'fixed',
                    top: '-9999px',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                    opacity: 0,
                    pointerEvents: 'none',
                }}
            />

            <div
                role="group"
                aria-label="Language Switcher / 言語切替"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'rgba(15, 23, 42, 0.07)',
                    border: '1px solid rgba(15, 23, 42, 0.12)',
                    borderRadius: '999px',
                    padding: '2px',
                    boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.06)',
                }}
            >
                <button
                    type="button"
                    onClick={() => handleSwitchLanguage('ja')}
                    title="日本語で表示 (Switch to Japanese)"
                    style={{
                        border: 'none',
                        borderRadius: '999px',
                        padding: '4px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        background: lang === 'ja' ? '#0f172a' : 'transparent',
                        color: lang === 'ja' ? '#f8fafc' : '#475569',
                        boxShadow: lang === 'ja' ? '0 2px 6px rgba(15, 23, 42, 0.2)' : 'none',
                    }}
                >
                    🇯🇵 JP
                </button>
                <button
                    type="button"
                    onClick={() => handleSwitchLanguage('en')}
                    title="Translate entire dashboard to English (Auto-enabled for non-Japanese browsers)"
                    style={{
                        border: 'none',
                        borderRadius: '999px',
                        padding: '4px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        background: lang === 'en' ? '#2563eb' : 'transparent',
                        color: lang === 'en' ? '#ffffff' : '#475569',
                        boxShadow: lang === 'en' ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
                    }}
                >
                    🌐 EN
                </button>
            </div>
        </div>
    );
}
