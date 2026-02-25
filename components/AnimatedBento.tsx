'use client';
import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export default function AnimatedBento({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="bento-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
}

export function AnimatedCard({ children, className = "", style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
    // A wrapper that handles both the staggered entrance and the custom CSS properties for hover glow
    return (
        <motion.div
            className={className}
            style={style}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                // Search down for .widget or .tracing-border-widget
                const target = e.currentTarget.querySelector('.widget, .tracing-border-widget') as HTMLElement;
                if (target) {
                    target.style.setProperty('--mouse-x', `${x}px`);
                    target.style.setProperty('--mouse-y', `${y}px`);
                }
            }}
        >
            {children}
        </motion.div>
    );
}
