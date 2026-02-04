import React from 'react';
import { motion } from 'framer-motion';
import { textVariants, getTransitionConfig } from '../utils/animations';

const AnimatedText = ({
    text,
    type = 'none',
    delay = 0,
    duration = 1,
    className,
    style
}) => {
    // Si no hay texto, no renderizamos nada
    if (!text) return null;

    // --- EFFECT: TYPEWRITER (Letra por Letra) ---
    if (type === 'typewriter') {
        const sentence = {
            initial: { opacity: 1 },
            animate: {
                opacity: 1,
                transition: {
                    delayChildren: delay,
                    staggerChildren: 0.05,
                },
            },
        };

        const letter = {
            initial: { opacity: 0 },
            animate: {
                opacity: 1,
            },
        };

        return (
            <motion.div
                className={className}
                style={style}
                variants={sentence}
                initial="initial"
                animate="animate"
            >
                {text.split('').map((char, index) => (
                    <motion.span key={index} variants={letter}>
                        {char}
                    </motion.span>
                ))}
            </motion.div>
        );
    }

    // --- OTHER EFFECTS: Solo animaciones que NO afecten posición ---
    const variants = textVariants[type] || textVariants['none'];
    const transitionConfig = getTransitionConfig(duration, delay, type);

    // Crear variantes seguras que NUNCA muevan el elemento
    const safeVariants = {
        initial: {
            opacity: variants.initial?.opacity ?? 0,
            scale: variants.initial?.scale ?? 1,
            filter: variants.initial?.filter ?? 'blur(0px)',
            rotateX: variants.initial?.rotateX ?? 0,
            // NUNCA usar x, y, rotate (en 2D) que afectan posición
        },
        animate: {
            opacity: variants.animate?.opacity ?? 1,
            scale: variants.animate?.scale ?? 1,
            filter: variants.animate?.filter ?? 'blur(0px)',
            rotateX: variants.animate?.rotateX ?? 0,
            // NUNCA usar x, y, rotate (en 2D) que afectan posición
        }
    };

    return (
        <motion.div
            className={className}
            style={style}
            initial="initial"
            animate="animate"
            variants={safeVariants}
            transition={transitionConfig}
        >
            {text}
        </motion.div>
    );
};

export default AnimatedText;
