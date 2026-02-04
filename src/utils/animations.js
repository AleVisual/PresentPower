export const slideVariants = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    },
    'slide-h': {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '-100%' }
    },
    'slide-v': {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '-100%' }
    },
    zoom: {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.5, opacity: 0 }
    },
    rotate: {
        initial: { rotate: -90, scale: 0.5, opacity: 0 },
        animate: { rotate: 0, scale: 1, opacity: 1 },
        exit: { rotate: 90, scale: 0.5, opacity: 0 }
    },
    flip: {
        initial: { rotateY: 90, opacity: 0 },
        animate: { rotateY: 0, opacity: 1 },
        exit: { rotateY: -90, opacity: 0 }
    },
    bounce: {
        initial: { y: -500, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 500, opacity: 0 }
    },
    'cube-h': {
        initial: { opacity: 0, rotateY: 90, x: '50%', scale: 0.8 },
        animate: { opacity: 1, rotateY: 0, x: 0, scale: 1 },
        exit: { opacity: 0, rotateY: -90, x: '-50%', scale: 0.8 }
    },
    'cube-v': {
        initial: { opacity: 0, rotateX: 90, y: '50%', scale: 0.8 },
        animate: { opacity: 1, rotateX: 0, y: 0, scale: 1 },
        exit: { opacity: 0, rotateX: -90, y: '-50%', scale: 0.8 }
    },
    'newspaper': {
        initial: { scale: 0, rotate: 720, opacity: 0 },
        animate: { scale: 1, rotate: 0, opacity: 1 },
        exit: { scale: 5, rotate: -720, opacity: 0 }
    },
    'parallax-slide': {
        initial: { x: '100%', scale: 1.2 },
        animate: { x: 0, scale: 1 },
        exit: { x: '-100%', scale: 0.8 }
    },
    'dissolve-blur': {
        initial: { opacity: 0, filter: 'blur(20px)' },
        animate: { opacity: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, filter: 'blur(20px)' }
    },
    'zoom-rotate': {
        initial: { scale: 0, rotate: -180, opacity: 0 },
        animate: { scale: 1, rotate: 0, opacity: 1 },
        exit: { scale: 2, rotate: 180, opacity: 0 }
    }
};

export const textVariants = {
    'none': {
        initial: { opacity: 1 },
        animate: { opacity: 1 }
    },
    'fade-up': {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 }
    },
    'pop': {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 }
    },
    'blur': {
        initial: { opacity: 0, filter: 'blur(10px)' },
        animate: { opacity: 1, filter: 'blur(0px)' }
    },
    'bounce': {
        initial: { opacity: 0, scale: 0.3, y: -50 },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', damping: 12, stiffness: 200 }
        }
    },
    'scale-in': {
        initial: { opacity: 0, scale: 2 },
        animate: { opacity: 1, scale: 1 }
    },
    'swing': {
        initial: { opacity: 0, rotate: -45, originX: '50%', originY: 0 },
        animate: {
            opacity: 1,
            rotate: 0,
            transition: { type: 'spring', damping: 10, stiffness: 100 }
        }
    },
    'flicker': {
        initial: { opacity: 0 },
        animate: {
            opacity: [0, 1, 0.4, 0.9, 0.2, 1],
            transition: { times: [0, 0.2, 0.4, 0.6, 0.8, 1], duration: 0.8 }
        }
    },
    'glitch': {
        initial: { opacity: 0, x: 0, y: 0 },
        animate: {
            opacity: 1,
            x: [0, -2, 2, -1, 3, 0],
            y: [0, 1, -1, 2, -2, 0],
            scale: [1, 1.02, 0.98, 1.03, 1],
            transition: { duration: 0.5 }
        }
    },
    'slide-right': {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 }
    },
    'slide-left': {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 }
    },
    'rotate-3d': {
        initial: { opacity: 0, rotateX: 90 },
        animate: { opacity: 1, rotateX: 0 }
    },
    'zoom-out': {
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: 1 }
    },
    'focus': {
        initial: { opacity: 0, filter: 'blur(15px)', scale: 1.2 },
        animate: { opacity: 1, filter: 'blur(0px)', scale: 1 }
    }
};

// Helper to get transition config
export const getTransitionConfig = (duration, delay = 0, effectType = 'default') => {
    const baseConfig = {
        duration: duration,
        delay: delay,
        ease: effectType === 'pop' ? [0.34, 1.56, 0.64, 1] : // Elastic ease for pop
            effectType === 'fade-up' ? [0.22, 1, 0.36, 1] : // Smooth ease for fade-up
                'easeInOut'
    };

    return baseConfig;
};
