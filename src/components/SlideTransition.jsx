import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideVariants } from '../utils/animations';

const SlideTransition = ({ children, effect, slideKey, duration = 1 }) => {
    // Default to fade if effect not found or 'none'
    const variant = slideVariants[effect] || slideVariants.fade;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={slideKey}
                className="w-full h-full"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variant}
                transition={{ duration: duration, ease: "easeInOut" }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default SlideTransition;
