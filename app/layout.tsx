import type { Metadata } from 'next';
import './globals.css';
import TimelineBackground from '../components/TimelineBackground';

export const metadata: Metadata = {
    metadataBase: new URL('https://mirainozei.netlify.app'), // Replace with actual production domain
    title: {
        default: 'ミライノゼイ | リアルタイム・データダッシュボード',
        template: '%s | ミライノゼイ'
    },
    description: '日本の「今」を数字で直視するライブダッシュボード。公的債務、人口動態、インフラ老朽化の現状を毎秒更新されるリアルタイムデータで可視化します。',
    keywords: ['日本', '税金', '公的債務', '人口減少', '少子高齢化', 'シルバー民主主義', 'インフラ老朽化', 'リアルタイム', 'ダッシュボード'],
    authors: [{ name: 'Mirainozei Project' }],
    creator: 'Mirainozei Project',
    publisher: 'Mirainozei Project',
    openGraph: {
        title: 'ミライノゼイ | リアルタイム・データダッシュボード',
        description: '日本の「今」を数字で直視するライブダッシュボード。公的債務、人口動態、インフラの現状を可視化。',
        url: 'https://mirainozei.netlify.app',
        siteName: 'ミライノゼイ',
        images: [
            {
                url: '/og-image.png', // You will need to place an actual image in the public/ folder
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
        site: '@mirainozei',
        creator: '@mirainozei',
        title: 'ミライノゼイ | リアルタイム・日本の現在地',
        description: '1秒ごとに増え続ける国の借金、減り続ける人口。日本の現実を直視するためのライブ・データ・ダッシュボード。',
        images: ['/og-image.png'], // Same image or a specific twitter one
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
        icon: '/favicon.ico', // standard favicon
        apple: '/apple-icon.png', // for iOS home screen
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
                <TimelineBackground />
                <header className="header">
                    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)', marginRight: '8px' }}></span>
                            ミライノゼイ
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, marginLeft: '0.75rem', letterSpacing: '0.05em' }}>LIVE DASHBOARD</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            <a href="https://x.com/mirainozei" target="_blank" rel="noopener noreferrer" className="header-link">
                                <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></svg>
                                公式
                            </a>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="live-indicator" style={{ width: '8px', height: '8px' }}></div> 更新: リアルタイム</span>
                        </div>
                    </div>
                </header>

                <main className="dashboard-layout">
                    {children}
                </main>
            </body>
        </html>
    );
}
