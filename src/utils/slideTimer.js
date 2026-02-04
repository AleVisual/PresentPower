/**
 * slideTimer.js
 * Utilidad para gestionar los temporizadores de avance automático de diapositivas
 */

/**
 * Constantes de configuración
 */
export const TIMER_CONFIG = {
    MIN_DELAY: 1,           // Mínimo 1 segundo
    MAX_DELAY: 300,         // Máximo 5 minutos (300 segundos)
    DEFAULT_DELAY: 5,       // Por defecto 5 segundos
    STEP: 1                 // Incremento de 1 segundo
};

/**
 * Valida que el tiempo de delay esté dentro de los límites permitidos
 * @param {number} delay - Tiempo en segundos
 * @returns {number} - Tiempo validado dentro de los límites
 */
export const validateDelay = (delay) => {
    if (typeof delay !== 'number' || isNaN(delay)) {
        return TIMER_CONFIG.DEFAULT_DELAY;
    }

    if (delay < TIMER_CONFIG.MIN_DELAY) {
        return TIMER_CONFIG.MIN_DELAY;
    }

    if (delay > TIMER_CONFIG.MAX_DELAY) {
        return TIMER_CONFIG.MAX_DELAY;
    }

    return Math.round(delay);
};

/**
 * Convierte segundos a milisegundos
 * @param {number} seconds - Tiempo en segundos
 * @returns {number} - Tiempo en milisegundos
 */
export const secondsToMs = (seconds) => {
    return validateDelay(seconds) * 1000;
};

/**
 * Formatea el tiempo en un formato legible (ej: "5s", "1m 30s", "2m")
 * @param {number} seconds - Tiempo en segundos
 * @returns {string} - Tiempo formateado
 */
export const formatTime = (seconds) => {
    const validSeconds = validateDelay(seconds);

    if (validSeconds < 60) {
        return `${validSeconds}s`;
    }

    const minutes = Math.floor(validSeconds / 60);
    const remainingSeconds = validSeconds % 60;

    if (remainingSeconds === 0) {
        return `${minutes}m`;
    }

    return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Calcula el tiempo total de la presentación basado en todas las diapositivas
 * @param {Array} slides - Array de diapositivas
 * @returns {number} - Tiempo total en segundos
 */
export const calculateTotalPresentationTime = (slides) => {
    if (!Array.isArray(slides) || slides.length === 0) {
        return 0;
    }

    return slides.reduce((total, slide) => {
        if (slide.autoAdvance) {
            return total + validateDelay(slide.autoAdvanceDelay || TIMER_CONFIG.DEFAULT_DELAY);
        }
        return total;
    }, 0);
};

/**
 * Obtiene el tiempo de delay de una diapositiva específica
 * @param {Object} slide - Objeto de diapositiva
 * @returns {number} - Tiempo de delay en segundos
 */
export const getSlideDelay = (slide) => {
    if (!slide || !slide.autoAdvance) {
        return 0;
    }

    return validateDelay(slide.autoAdvanceDelay || TIMER_CONFIG.DEFAULT_DELAY);
};

/**
 * Verifica si una diapositiva tiene avance automático habilitado
 * @param {Object} slide - Objeto de diapositiva
 * @returns {boolean} - True si el avance automático está habilitado
 */
export const isAutoAdvanceEnabled = (slide) => {
    return slide && slide.autoAdvance === true;
};

/**
 * Crea opciones predefinidas de tiempo para el selector
 * @returns {Array} - Array de objetos con valor y etiqueta
 */
export const getTimePresets = () => {
    return [
        { value: 3, label: '3 segundos (Rápido)' },
        { value: 5, label: '5 segundos (Normal)' },
        { value: 10, label: '10 segundos (Pausado)' },
        { value: 15, label: '15 segundos' },
        { value: 30, label: '30 segundos' },
        { value: 60, label: '1 minuto' },
        { value: 120, label: '2 minutos' },
        { value: 180, label: '3 minutos' },
        { value: 300, label: '5 minutos' }
    ];
};

/**
 * Calcula el progreso de tiempo transcurrido
 * @param {number} elapsed - Tiempo transcurrido en ms
 * @param {number} total - Tiempo total en ms
 * @returns {number} - Porcentaje de progreso (0-100)
 */
export const calculateProgress = (elapsed, total) => {
    if (total <= 0) return 0;
    const progress = (elapsed / total) * 100;
    return Math.min(100, Math.max(0, progress));
};

export default {
    TIMER_CONFIG,
    validateDelay,
    secondsToMs,
    formatTime,
    calculateTotalPresentationTime,
    getSlideDelay,
    isAutoAdvanceEnabled,
    getTimePresets,
    calculateProgress
};
