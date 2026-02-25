'use client';
import { useEffect, useRef } from 'react';

// A dynamic Sakura (Cherry Blossom) HTML5 Canvas Background that transitions from Past (Sepia) to Future (Vibrant)
export default function SakuraBackground() {
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

        const petals: Petal[] = [];
        const numPetals = 80; // Performance friendly count

        class Petal {
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
                this.size = Math.random() * 8 + 4;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 1.5 + 0.5;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 2 - 1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                // Wrap around
                if (this.y > height) {
                    this.y = -20;
                    this.x = Math.random() * width;
                }
                if (this.x > width + 20) this.x = -20;
                if (this.x < -20) this.x = width + 20;
            }

            draw(context: CanvasRenderingContext2D) {
                context.save();
                context.translate(this.x, this.y);
                context.rotate((this.rotation * Math.PI) / 180);

                // Draw petal shape
                context.beginPath();
                context.moveTo(0, 0);
                context.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
                context.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
                context.fill();
                context.restore();
            }
        }

        for (let i = 0; i < numPetals; i++) {
            petals.push(new Petal());
        }

        let animationFrameId: number;

        const render = () => {
            // Very light pinkish-white background that shifts
            ctx.clearRect(0, 0, width, height);

            // We will handle the overall "Past to Future" color shift via a CSS animation on the container, 
            // but we draw the petals with a base soft pink color.
            ctx.fillStyle = 'rgba(255, 183, 197, 0.7)'; // Sakura pink

            petals.forEach(petal => {
                petal.update();
                petal.draw(ctx);
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
        <div className="sakura-background-container">
            <canvas ref={canvasRef} className="sakura-canvas" />
            <div className="sakura-overlay" />
        </div>
    );
}
