'use client';
import { useState, useEffect } from 'react';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source?: string;
}

export default function NewsWidget() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Google News RSS feed for Japan (Business/Economy focus via topic)
                // hl=ja & gl=JP : Japanese language and region
                // topic=CAAqBwgKMJW4_wow1r73Ag : Google News Topic for Japanese Business/Economy
                const rssUrl = encodeURIComponent('https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ja&gl=JP&ceid=JP:ja');
                const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

                const res = await fetch(apiUrl);
                const data = await res.json();

                if (data.status === 'ok' && data.items) {
                    // Take top 4 items
                    const items = data.items.slice(0, 4).map((item: any) => {
                        // Google News titles often append " - SourceName" at the end. Split that out if possible.
                        const parts = item.title.split(' - ');
                        const source = parts.length > 1 ? parts.pop() : 'Google News';
                        const cleanTitle = parts.join(' - ');

                        return {
                            title: cleanTitle,
                            link: item.link,
                            pubDate: item.pubDate,
                            source: source // Extracted source name
                        };
                    });
                    setNews(items);
                }
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
        // Refresh every 1 hour
        const interval = setInterval(fetchNews, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="widget" style={{ height: '100%', borderColor: 'var(--accent-orange)' }}>
            <h2 className="widget-title" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--accent-orange)' }}>📰</span> 最新の経済・社会ニュース
            </h2>

            {loading ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>取得中...</div>
            ) : news.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)' }}>ニュースを取得できませんでした</div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {news.map((item, index) => (
                        <li key={index} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'block', transition: 'color 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-blue)'}
                                onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
                            >
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--accent-orange)' }}>{item.source}</span>
                                    <span>{new Date(item.pubDate.replace(' ', 'T')).toLocaleString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {item.title}
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                <a href="https://news.google.com/?hl=ja&gl=JP&ceid=JP:ja" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
                    Googleニュースで見る &gt;
                </a>
            </div>
        </div>
    );
}
