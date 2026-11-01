'use client';
import React from 'react';

interface WidgetFooterProps {
    sourceName: string;
    sourceUrl?: string;
    shareText: string;
    isPaused?: boolean;
}

export default function WidgetFooter({
    sourceName,
    sourceUrl,
    shareText,
    isPaused = false,
}: WidgetFooterProps) {
    const encodedShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${shareText}\n#ミライノゼイ https://mirainozei.netlify.app`
    )}`;

    return (
        <div
            style={{
                marginTop: '0.75rem',
                paddingTop: '0.6rem',
                borderTop: '1px solid rgba(148, 163, 184, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                fontSize: '0.7rem',
                color: 'var(--text-tertiary)',
                zIndex: 15,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span
                    style={{
                        display: 'inline-block',
                        lineHeight: 1.45,
                        background: 'rgba(15, 23, 42, 0.05)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                    }}
                >
                    <span style={{ whiteSpace: 'nowrap' }}>📚 出典: </span>
                    {sourceUrl ? (
                        <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}
                        >
                            {sourceName}
                        </a>
                    ) : (
                        <span>{sourceName}</span>
                    )}
                </span>

                {isPaused && (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            background: 'rgba(37, 99, 235, 0.1)',
                            color: 'var(--accent-blue)',
                            padding: '2px 6px',
                            borderRadius: '6px',
                            fontWeight: 600,
                        }}
                    >
                        ⏸ 自動切替停止中
                    </span>
                )}
            </div>

            <a
                href={encodedShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="このデータをX(Twitter)でシェアして問う"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    background: 'rgba(15, 23, 42, 0.08)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(15, 23, 42, 0.12)',
                }}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" width="11" height="11" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z" />
                </svg>
                この現実をシェア
            </a>
        </div>
    );
}
