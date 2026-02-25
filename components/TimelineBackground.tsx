'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SeasonalParticles from './SeasonalParticles';

// 15 copyright-free images from Unsplash categorized by Theme
const ERAS = [
    {
        name: '1980s (The Past)',
        images: [
            'https://images.unsplash.com/photo-1542051812871-34f448d59afc?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1558862116-41f2380fde2f?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1493976040372-50d2d0d1217c?q=80&w=2000&auto=format&fit=crop'
        ],
        cssClass: 'timeline-past'
    },
    {
        name: '2020s (The Present)',
        images: [
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542931287-023b92fa89b?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517154421773-0529729f15c5?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522850959516-58f958dde2c1?q=80&w=2000&auto=format&fit=crop'
        ],
        cssClass: 'timeline-present'
    },
    {
        name: '2050s (The Future)',
        images: [
            'https://images.unsplash.com/photo-1555580399-56b6bcebaec7?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1513511855635-43ea23b9d0fb?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=2000&auto=format&fit=crop'
        ],
        cssClass: 'timeline-future'
    }
];

export default function TimelineBackground() {
    const [eraIndex, setEraIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const [prevImage, setPrevImage] = useState<string | null>(null);

    // Initial random pick
    useEffect(() => {
        const initialImageIndex = Math.floor(Math.random() * ERAS[0].images.length);
        setImageIndex(initialImageIndex);
        setPrevImage(ERAS[0].images[initialImageIndex]); // start with same image
    }, []);

    useEffect(() => {
        // Crossfade every 12 seconds
        const interval = setInterval(() => {
            setEraIndex((prevEra) => {
                const nextEra = (prevEra + 1) % ERAS.length;
                setImageIndex((prevImgIndex) => {
                    // Before changing the current image, store it in prevImage
                    setPrevImage(ERAS[prevEra].images[prevImgIndex]);
                    return Math.floor(Math.random() * ERAS[nextEra].images.length);
                });
                return nextEra;
            });
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    const currentEra = ERAS[eraIndex];
    const currentImage = currentEra.images[imageIndex];

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -100, backgroundColor: '#000', overflow: 'hidden' }}>

            {/* Layer 1: Previous Image (Always rendered behind, slowly fading out/blurring) */}
            {prevImage && (
                <motion.div
                    key={`prev-${prevImage}`} // Key change resets animation
                    initial={{ opacity: 1, filter: 'blur(0px)', scale: 1.05 }}
                    animate={{ opacity: 0.5, filter: 'blur(10px)', scale: 1.1 }}
                    transition={{ duration: 6, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        backgroundImage: `url(${prevImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0
                    }}
                />
            )}

            {/* Layer 2: Current Image (Fading in with a blur-to-clear cinematic effect + infinite slow zoom) */}
            <motion.div
                key={`curr-${currentImage}`} // Key forces unmount/remount for animation trigger
                initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                transition={{
                    opacity: { duration: 4, ease: 'easeInOut' },
                    filter: { duration: 4, ease: 'easeOut' },
                    scale: { duration: 16, ease: 'linear' } // Slow Ken Burns zoom out spans longer than the interval
                }}
                style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url(${currentImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 1
                }}
                className={currentEra.cssClass}
            />

            {/* Dark Overlay to keep UI readable */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2 }} />

            {/* Seasonal Particles Layer (Sakura, Snow, etc) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none' }}>
                <SeasonalParticles />
            </div>

            {/* Mesh Overlay to keep UI highly readable */}
            <div className="video-overlay" style={{ opacity: 0.8, zIndex: 4 }} />

            {/* Subtle Era Indicator in bottom left */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 10, color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: '4px', backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                SYS_YEAR_SIMULATION: {currentEra.name}
            </div>
        </div>
    );
}
