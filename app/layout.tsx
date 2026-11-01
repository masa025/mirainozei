import type { Metadata } from 'next';
import './globals.css';
import VideoBackground from '../components/VideoBackground';

export const metadata: Metadata = {
    metadataBase: new URL('https://mirainozei.netlify.app'),
    title: {
        default: 'ミライノゼイ | 日本の財政・人口・構造課題データ',
        template: '%s | ミライノゼイ',
    },
    description: '日本の「今」を数字で直視するデータダッシュボード。公的債務、実質負担率、世代間格差、人口動態、インフラ老朽化の現状を公的統計に基づき可視化します。',
    keywords: ['日本', '税金', '公的債務', '人口減少', '少子高齢化', 'シルバー民主主義', 'インフラ老朽化', '世代間格差', 'ダッシュボード'],
    authors: [{ name: 'Mirainozei Project' }],
    creator: 'Mirainozei Project',
    publisher: 'Mirainozei Project',
    openGraph: {
        title: 'ミライノゼイ | 日本の財政・人口・構造課題データ',
        description: '日本の「今」を数字で直視するデータダッシュボード。公的債務、世代間格差、人口動態、インフラの現状を可視化。',
        url: 'https://mirainozei.netlify.app',
        siteName: 'ミライノゼイ',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'ミライノゼイ ダッシュボードのプレビュー画像',
            },
        ],
        locale: 'ja_JP',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ミライノゼイ | 日本の現在地',
        description: '増え続ける国の借金、減り続ける人口、広がる世代間格差。日本の現実を直視するためのデータ・ダッシュボード。',
        images: ['/og-image.png'],
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
        icon: '/favicon.ico',
        apple: '/apple-icon.png',
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
                    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '11px',
                                    height: '11px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #2563eb, #ef4444)',
                                    boxShadow: '0 0 12px rgba(37, 99, 235, 0.5)',
                                }}
                            />
                            <span
                                className="outfit"
                                style={{
                                    fontSize: '1.35rem',
                                    fontWeight: 900,
                                    letterSpacing: '-0.04em',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                ミライノゼイ
                            </span>
                            <span
                                style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    background: 'rgba(15, 23, 42, 0.06)',
                                    border: '1px solid rgba(15, 23, 42, 0.08)',
                                    letterSpacing: '0.04em',
                                }}
                            >
                                JAPAN STRUCTURAL DATA ARCHIVE
                            </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            公的統計・世代会計に基づく構造可視化
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
