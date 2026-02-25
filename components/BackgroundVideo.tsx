'use client';

export default function BackgroundVideo() {
    return (
        <div className="video-background-container">
            {/* 
        Using a placeholder high-quality public domain/creative commons stock video URL 
        In production, you'd replace this with a highly optimized self-hosted video of Tokyo.
      */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="time-travel-video"
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-buildings-and-skyscrapers-in-tokyo-4404-large.mp4" type="video/mp4" />
                お使いのブラウザは動画のバックグラウンド再生をサポートしていません。
            </video>
            {/* Fallback/Overlay mesh gradient over the video for that modern glass feel */}
            <div className="video-overlay" />
        </div>
    );
}
