import type { Metadata } from 'next';
import './globals.css';
import VideoBackground from '../components/VideoBackground';
import LanguageSwitcher from '../components/LanguageSwitcher';

export const metadata: Metadata = {
    metadataBase: new URL('https://mirainozei.netlify.app'),
    title: {
        default: 'ミライノゼイ | 日本の財政・人口・構造課題データ',
        template: '%s | ミライノゼイ',
    },
    description:
        '日本の「今」と「未来」を数字で直視するデータダッシュボード。公的債務1,317兆円、国民負担率45.8%、出生数68.6万人、世代間格差、インフラ老朽化の現状を最新公的統計に基づき可視化します。',
    keywords: [
        '日本',
        '税金',
        '公的債務',
        '国民負担率',
        '人口減少',
        '少子高齢化',
        'シルバー民主主義',
        'インフラ老朽化',
        '世代間格差',
        'ダッシュボード',
        'ミライノゼイ',
    ],
    authors: [{ name: 'Mirainozei Project' }],
    creator: 'Mirainozei Project',
    publisher: 'Mirainozei Project',
    openGraph: {
        title: 'ミライノゼイ | 日本の財政・人口・構造課題データ（全27指標）',
        description:
            '増え続ける国の借金（1,317兆円超）、高止まりする国民負担率（45.8%）、15年前倒しで進む少子化（68.6万人）、広がる世代間格差。最新公的統計で日本の現在地を解剖するダッシュボード。',
        url: 'https://mirainozei.netlify.app',
        siteName: 'ミライノゼイ',
        images: [
            {
                url: '/og-image.png?v=2',
                width: 1200,
                height: 630,
                type: 'image/png',
                alt: 'ミライノゼイ — 日本の「今」と「未来」を数字で直視するダッシュボード',
            },
        ],
        locale: 'ja_JP',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ミライノゼイ | 日本の「今」と「未来」を数字で直視するダッシュボード',
        description:
            '増え続ける国の借金、減り続ける人口、静かに進行する「日本の構造危機」の全貌を27の最新公的統計と時代映像で可視化。',
        images: ['/og-image.png?v=2'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.svg', type: 'image/svg+xml' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        shortcut: ['/favicon.ico'],
        apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body>
                <VideoBackground />
                <header className="header">
                    <div className="container header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
                            <img
                                src="/icon.svg"
                                alt="ミライノゼイ アイコン"
                                width={26}
                                height={26}
                                style={{
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.18)',
                                    flexShrink: 0,
                                }}
                            />
                            <span
                                className="outfit header-brand-title"
                                style={{
                                    fontSize: '1.35rem',
                                    fontWeight: 900,
                                    letterSpacing: '-0.04em',
                                    color: 'var(--text-primary)',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                ミライノゼイ
                            </span>
                            <span
                                className="header-badge"
                                style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    background: 'rgba(15, 23, 42, 0.06)',
                                    border: '1px solid rgba(15, 23, 42, 0.08)',
                                    letterSpacing: '0.04em',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                JAPAN STRUCTURAL DATA ARCHIVE
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                            <span className="header-tagline" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                公的統計・世代会計に基づく構造可視化
                            </span>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </header>

                <main className="dashboard-layout">
                    <div className="container">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    );
}
