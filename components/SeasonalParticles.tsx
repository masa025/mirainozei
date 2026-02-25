'use client';
import { useEffect, useRef } from 'react';

// A dynamic particle system that changes based on the user's current month.
export default function SeasonalParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const month = new Date().getMonth(); // 0-11

        // Determine season
        // Spring (Mar:2, Apr:3, May:4)
        // Summer (Jun:5, Jul:6, Aug:7)
        // Autumn (Sep:8, Oct:9, Nov:10)
        // Winter (Dec:11, Jan:0, Feb:1)

        let season = 'spring'; // default
        if (month >= 2 && month <= 4) season = 'spring';
        else if (month >= 5 && month <= 7) season = 'summer';
        else if (month >= 8 && month <= 10) season = 'autumn';
        else season = 'winter';

        const particles: Particle[] = [];
        const numParticles = season === 'winter' ? 150 : (season === 'spring' ? 80 : 50);

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            rotation: number;
            rotationSpeed: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height - height;
                this.rotation = Math.random() * 360;

                if (season === 'winter') { // Snow
                    this.size = Math.random() * 3 + 1;
                    this.speedX = (Math.random() - 0.5) * 1;
                    this.speedY = Math.random() * 1 + 0.5;
                    this.rotationSpeed = 0;
                } else if (season === 'spring') { // Sakura
                    this.size = Math.random() * 8 + 4;
                    this.speedX = Math.random() * 2 - 1;
                    this.speedY = Math.random() * 1.5 + 0.5;
                    this.rotationSpeed = Math.random() * 2 - 1;
                } else if (season === 'summer') { // Fireflies / Light Dust
                    this.size = Math.random() * 2 + 1;
                    this.speedX = (Math.random() - 0.5) * 0.5;
                    this.speedY = (Math.random() - 0.5) * 0.5 - 0.2; // slight float up
                    this.rotationSpeed = 0;
                } else { // Autumn leaves
                    this.size = Math.random() * 10 + 5;
                    this.speedX = Math.random() * 3 - 1.5;
                    this.speedY = Math.random() * 2 + 1;
                    this.rotationSpeed = Math.random() * 3 - 1.5;
                }
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                // Wrap around
                if (this.y > height + 20) {
                    this.y = -20;
                    this.x = Math.random() * width;
                }
                if (this.y < -20) {
                    this.y = height + 20;
                    this.x = Math.random() * width;
                }
                if (this.x > width + 20) this.x = -20;
                if (this.x < -20) this.x = width + 20;
            }

            draw(context: CanvasRenderingContext2D) {
                context.save();
                context.translate(this.x, this.y);
                context.rotate((this.rotation * Math.PI) / 180);

                if (season === 'winter') {
                    // Snowball
                    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    context.beginPath();
                    context.arc(0, 0, this.size, 0, Math.PI * 2);
                    context.fill();
                } else if (season === 'spring') {
                    // Sakura Petal
                    context.fillStyle = 'rgba(255, 183, 197, 0.8)';
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
                    context.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
                    context.fill();
                } else if (season === 'summer') {
                    // Glow bug
                    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, this.size);
                    gradient.addColorStop(0, 'rgba(255, 255, 150, 1)');
                    gradient.addColorStop(1, 'rgba(255, 255, 150, 0)');
                    context.fillStyle = gradient;
                    context.beginPath();
                    context.arc(0, 0, this.size, 0, Math.PI * 2);
                    context.fill();
                } else {
                    // Autumn leaf (simple ovalish shape)
                    context.fillStyle = 'rgba(210, 105, 30, 0.8)'; // subtle orange/brown
                    context.beginPath();
                    context.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
                    context.fill();
                }

                context.restore();
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 5 // sits above the background images but below the overlay
            }}
        />
    );
}
