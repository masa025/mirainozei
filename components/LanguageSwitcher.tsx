'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

type Lang = 'ja' | 'en';

const HAS_JAPANESE_REGEX = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/;

// Precision terminology & UI dictionary for instant 0ms translation of headings, intro, nav, units, and SVG chart axes
const EXACT_DICTIONARY: Record<string, string> = {
    'ミライノゼイ': 'MIRAINOZEI',
    '公的統計・世代会計に基づく構造可視化': 'Structural Visualization Based on Official Statistics & Generational Accounting',
    '日本の「今」を直視する': 'Facing Japan’s Structural Reality',
    'ダッシュボードを開く →': 'Open Dashboard →',
    '国家債務 1,346.7兆円と「日本円の購買力」の現在地': 'National Debt (¥1,346.7T) & Purchasing Power of the Yen',
    '財務省・日銀・気象庁・地震情報': 'MOF, BOJ, JMA & Real-Time Seismic Data',
    '個人の実質負担（五公五民）と手取り・賃金の停滞': 'Personal Tax/Social Burden (~50%) & Real Wage Stagnation',
    '年齢・年収別シミュレーション / 国税庁・厚労省統計': 'Age/Income Simulator — NTA & MHLW Official Data',
    '構造的根本原因：予算の非効率・世代間格差・デジタル赤字・シルバー民主主義': 'Root Causes: Inefficient Spending, Generational Gap & Silver Democracy',
    '内閣府世代会計・文科省令和6年度確定値・国際収支統計': 'Cabinet Office Generational Accounting, MEXT & Balance of Payments',
    '出生数67万人ショック・デジタル国富流出・インフラ老朽化': 'Birth Collapse, Digital Trade Deficit & Aging Infrastructure',
    '厚労省人口動態統計(最新) / 国交省インフラ長寿命化計画': 'MHLW Vital Statistics & MLIT Infrastructure Longevity Plan',
    'あなたの街と世代の「数字」を知っていますか？': 'Do You Know the Hard Numbers for Your Region & Generation?',
    'X (Twitter) でシェアして問う': 'Share & Discuss on X (Twitter)',
    'この現実をシェア': 'Share on X',
    '🔥 国の借金・時計': '🔥 Debt Clock',
    '🧮 1秒自分事診断': '🧮 Burden Sim',
    '💸 賃金・社保の罠': '💸 Wages & Tax',
    '🏛️ 予算と世代格差': '🏛️ Gen. Gap',
    '🗾 人口・インフラ': '🗾 Demo & Infra',
    '国の公的債務残高（国債・借入金・政府短期証券）': 'National Public Debt (JGBs, Borrowings & Financing Bills)',
    '最新公表：約1,346.7兆円（過去最高更新）': 'Latest Official Total: ¥1,346.7T (Record High)',
    '毎秒の増加ペース': 'Increase Per Second',
    '1日あたりの借金増': 'Daily Debt Increase',
    '国債費（利払い・償還）': 'Annual Debt Service (Interest & Redemption)',
    '国民1人あたりの公的債務負担': 'Public Debt Burden Per Capita',
    '世代別の収入格差・停滞': 'Generational Income Gap & Flat Wage Curve',
    '実質賃金の推移と国際比較': 'Real Wage Trend & G7 Comparison',
    '国家予算の収支（税収 vs 歳出）': 'National Budget Balance (Tax Revenue vs. Spending)',
    '閲覧中に生み出された財政赤字': 'Fiscal Deficit Accumulated While Viewing',
    '過去最高の税収でも歳出膨張に追いつかず借金で補填': 'Even record tax revenues cannot keep up with ballooning spending',
    'オポチュニティ・コスト（機会費用）': 'Opportunity Cost of Daily Debt Service',
    '世代別の「政治力」格差（シルバー民主主義）': 'Generational Voting Power Gap (Silver Democracy)',
    'デジタル赤字6.8兆円（国富の海外流出）': '¥6.8T Digital Trade Deficit (Outflow to Big Tech)',
    '老朽化橋梁マップ（首都圏・判定区分IV抜粋）': 'Critical Aging Bridges Map (Category IV — Urgent Action)',
    '最新の地震情報（P2P地震情報）': 'Latest Earthquake Feed (JMA / P2P Seismic Network)',
    '最新の経済・社会ニュース': 'Latest Economic & Structural News',
    '国内推移': 'Domestic',
    '国際比較': 'Global',
    '過去比較': 'Historical',
    '実質賃金': 'Real Wage',
    '消費者物価(CPI)': 'CPI (Inflation)',
    '生産年齢人口 (15-64歳)': 'Working-Age (15-64)',
    '高齢者人口 (65歳以上)': 'Elderly (65+)',
    '⏭ 次へ': '⏭ Next',
    '📺 出典': '📺 Source',
};

const SUBSTRING_REPLACEMENTS: Array<[RegExp, string]> = [
    [/📚 出典:\s*/g, '📚 Source: '],
    [/出典:\s*/g, 'Source: '],
    [/（令和7・8年度当初予算フレーム）/g, ' (FY2025/2026 Initial Budget)'],
    [/財務省/g, 'Ministry of Finance (MOF)'],
    [/総務省/g, 'Ministry of Internal Affairs (MIC)'],
    [/厚生労働省/g, 'MHLW'],
    [/厚労省/g, 'MHLW'],
    [/文部科学省/g, 'Ministry of Education (MEXT)'],
    [/文科省/g, 'MEXT'],
    [/経済産業省/g, 'METI'],
    [/国土交通省/g, 'MLIT'],
    [/国交省/g, 'MLIT'],
    [/国税庁/g, 'National Tax Agency (NTA)'],
    [/国立社会保障・人口問題研究所/g, 'IPSS'],
    [/社人研/g, 'IPSS'],
    [/内閣府/g, 'Cabinet Office'],
    [/日本銀行/g, 'Bank of Japan (BOJ)'],
    [/日銀/g, 'BOJ'],
    [/気象庁/g, 'JMA'],
    [/東京商工リサーチ/g, 'Tokyo Shoko Research'],
    [/人口戦略会議/g, 'Population Strategy Council'],
    [/(\d+(?:,\d+)*(?:\.\d+)?)兆円/g, '¥$1T'],
    [/(\d+(?:,\d+)*(?:\.\d+)?)兆/g, '¥$1T'],
    [/(\d+(?:,\d+)*(?:\.\d+)?)億円/g, '¥$100M'],
    [/(\d+(?:,\d+)*(?:\.\d+)?)万円/g, '¥$10K'],
    [/(\d+(?:,\d+)*(?:\.\d+)?)万人/g, '$10K people'],
    [/(\d{4})年度/g, 'FY$1'],
    [/(\d{4})年/g, '$1'],
    [/現在/g, 'Current'],
    [/推計人口/g, 'Est. Population'],
    [/推計/g, 'Proj.'],
    [/過去最多/g, 'Record High'],
    [/過去最高/g, 'Record High'],
    [/過去最少/g, 'Record Low'],
    [/過去最低/g, 'Record Low'],
    [/ワースト(\d+)位/g, 'Worst #$1'],
    [/減少率/g, 'Decline Rate'],
    [/最大震度/g, 'Max Intensity'],
    [/発生/g, ' Automatic'],
    [/1ドル\s*=/g, '1 USD ='],
    [/円安水準/g, 'Undervalued'],
    [/社長/g, 'CEOs'],
    [/国会議員/g, 'Lawmakers'],
    [/60歳以上の割合/g, 'Share Aged 60+'],
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

function clearAllGoogleTranslateCookies() {
    if (typeof document === 'undefined') return;
    const host = window.location.hostname;
    const parts = host.split('.');
    const domains = new Set<string>(['', host, `.${host}`]);
    if (parts.length >= 2) {
        const rootDomain = parts.slice(-2).join('.');
        domains.add(rootDomain);
        domains.add(`.${rootDomain}`);
    }
    for (const d of domains) {
        const domainAttr = d ? `; domain=${d}` : '';
        document.cookie = `googtrans=; path=/${domainAttr}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
        document.cookie = `googtrans=/ja/ja; path=/${domainAttr}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
    }
}

function setGoogleTranslateCookie(targetLang: Lang) {
    if (typeof document === 'undefined') return;
    if (targetLang === 'en') {
        const host = window.location.hostname;
        document.cookie = `googtrans=/ja/en; path=/; max-age=31536000`;
        if (host && host !== 'localhost') {
            document.cookie = `googtrans=/ja/en; path=/; domain=${host}; max-age=31536000`;
            document.cookie = `googtrans=/ja/en; path=/; domain=.${host}; max-age=31536000`;
        }
    } else {
        clearAllGoogleTranslateCookies();
    }
}

function triggerGoogleTranslateCombo(targetLang: Lang): boolean {
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (!combo) return false;
    const desired = targetLang === 'en' ? 'en' : 'ja';
    if (combo.value !== desired) {
        combo.value = desired;
        combo.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return true;
}

function syncUrlLangParam(targetLang: Lang) {
    if (typeof window === 'undefined') return;
    try {
        const url = new URL(window.location.href);
        if (targetLang === 'en') {
            url.searchParams.set('lang', 'en');
        } else {
            url.searchParams.delete('lang');
        }
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch {
        // Ignore URL construction errors
    }
}

export default function LanguageSwitcher() {
    const [lang, setLang] = useState<Lang>('ja');
    const langRef = useRef<Lang>('ja');
    const originalTextsRef = useRef<WeakMap<Node, string>>(new WeakMap());

    const applyDomDictionary = useCallback((targetLang: Lang) => {
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
                // Only capture original if we haven't stored it yet AND it contains Japanese characters
                if (!originalTextsRef.current.has(node)) {
                    if (!HAS_JAPANESE_REGEX.test(raw)) continue;
                    originalTextsRef.current.set(node, raw);
                }
                const sourceText = originalTextsRef.current.get(node);
                if (!sourceText) continue;

                const trimmed = sourceText.trim();
                let nextValue = sourceText;

                if (EXACT_DICTIONARY[trimmed]) {
                    nextValue = sourceText.replace(trimmed, EXACT_DICTIONARY[trimmed]);
                } else {
                    for (const [pattern, replacement] of SUBSTRING_REPLACEMENTS) {
                        nextValue = nextValue.replace(pattern, replacement);
                    }
                }

                if (node.nodeValue !== nextValue) {
                    node.nodeValue = nextValue;
                }
            } else {
                const orig = originalTextsRef.current.get(node);
                if (orig !== undefined && node.nodeValue !== orig) {
                    node.nodeValue = orig;
                }
            }
        }
    }, []);

    // Initialize Google Website Translator and detect initial language
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
            if (langRef.current === 'en') {
                setTimeout(() => triggerGoogleTranslateCombo('en'), 150);
            }
        };

        if (!document.getElementById('google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }

        const params = new URLSearchParams(window.location.search);
        const queryLang = params.get('lang');
        const savedLang = localStorage.getItem('mirainozei_lang') as Lang | null;
        const browserLang = (navigator.language || 'ja').toLowerCase();

        let initialLang: Lang = 'ja';
        if (queryLang === 'en' || queryLang === 'ja') {
            initialLang = queryLang;
            localStorage.setItem('mirainozei_lang', queryLang);
        } else if (savedLang === 'en' || savedLang === 'ja') {
            initialLang = savedLang;
        } else if (!browserLang.startsWith('ja')) {
            initialLang = 'en';
        }

        langRef.current = initialLang;
        setLang(initialLang);

        if (initialLang === 'en') {
            setGoogleTranslateCookie('en');
            applyDomDictionary('en');
            // Poll briefly until Google Translate combo is ready
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                applyDomDictionary('en');
                if (triggerGoogleTranslateCombo('en') || attempts > 20) {
                    clearInterval(poll);
                }
            }, 350);
            return () => clearInterval(poll);
        } else {
            clearAllGoogleTranslateCookies();
        }
    }, [applyDomDictionary]);

    // Observe newly mounted DOM nodes (e.g. when IntroScreen finishes and the 27 widgets mount)
    useEffect(() => {
        if (lang !== 'en' || typeof document === 'undefined') return;

        applyDomDictionary('en');

        let rafId: number | null = null;
        const observer = new MutationObserver(() => {
            if (langRef.current !== 'en') return;
            if (rafId !== null) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = null;
                applyDomDictionary('en');
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        const interval = setInterval(() => {
            if (langRef.current === 'en') {
                applyDomDictionary('en');
                triggerGoogleTranslateCombo('en');
            }
        }, 2000);

        return () => {
            observer.disconnect();
            if (rafId !== null) cancelAnimationFrame(rafId);
            clearInterval(interval);
        };
    }, [lang, applyDomDictionary]);

    const handleSwitchLanguage = (nextLang: Lang) => {
        langRef.current = nextLang;
        setLang(nextLang);
        localStorage.setItem('mirainozei_lang', nextLang);

        // Update URL BEFORE any reload so ?lang=en never traps the user in English!
        syncUrlLangParam(nextLang);
        setGoogleTranslateCookie(nextLang);

        if (nextLang === 'en') {
            applyDomDictionary('en');
            if (!triggerGoogleTranslateCombo('en')) {
                let retries = 0;
                const retryTimer = setInterval(() => {
                    retries++;
                    applyDomDictionary('en');
                    if (triggerGoogleTranslateCombo('en') || retries > 15) {
                        clearInterval(retryTimer);
                    }
                }, 300);
            }
        } else {
            // Switching to Japanese (JP):
            clearAllGoogleTranslateCookies();
            applyDomDictionary('ja');
            triggerGoogleTranslateCombo('ja');

            // If Google Translate mutated the DOM (<html class="translated-ltr"> or <font> wrappers),
            // navigate cleanly to the URL without ?lang=en to restore pristine Japanese DOM
            const isGoogleMutated =
                document.documentElement.classList.contains('translated-ltr') ||
                document.documentElement.classList.contains('translated-rtl') ||
                Boolean(document.querySelector('font[ style ], .goog-te-combo'));

            if (isGoogleMutated) {
                const cleanUrl = new URL(window.location.href);
                cleanUrl.searchParams.delete('lang');
                window.location.replace(cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
            }
        }
    };

    return (
        <div
            data-no-translate="true"
            translate="no"
            className="notranslate"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                flexShrink: 0,
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
                    background: 'rgba(15, 23, 42, 0.08)',
                    border: '1px solid rgba(15, 23, 42, 0.14)',
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
                        padding: '4px 9px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        background: lang === 'ja' ? '#0f172a' : 'transparent',
                        color: lang === 'ja' ? '#f8fafc' : '#475569',
                        boxShadow: lang === 'ja' ? '0 2px 6px rgba(15, 23, 42, 0.2)' : 'none',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.2,
                    }}
                >
                    🇯🇵 JP
                </button>
                <button
                    type="button"
                    onClick={() => handleSwitchLanguage('en')}
                    title="Switch to English"
                    style={{
                        border: 'none',
                        borderRadius: '999px',
                        padding: '4px 9px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        background: lang === 'en' ? '#2563eb' : 'transparent',
                        color: lang === 'en' ? '#ffffff' : '#475569',
                        boxShadow: lang === 'en' ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.2,
                    }}
                >
                    🌐 EN
                </button>
            </div>
        </div>
    );
}
