/**
 * Position Manager - Sistema de memoria de coordenadas
 * Maneja el cálculo y validación de posiciones de texto en las diapositivas
 */

/**
 * Valida y normaliza una posición
 * @param {Object} position - {x: number, y: number}
 * @returns {Object} Posición validada
 */
export const validatePosition = (position) => {
    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
        console.warn('⚠️ Posición inválida detectada:', position);
        return { x: 50, y: 50 }; // Centro por defecto
    }

    return {
        x: Math.max(0, Math.min(100, position.x)),
        y: Math.max(0, Math.min(100, position.y))
    };
};

/**
 * Valida dimensiones (ancho/alto)
 * @param {number} value - Valor en porcentaje
 * @param {number} min - Mínimo permitido
 * @param {number} max - Máximo permitido
 * @returns {number} Valor validado
 */
export const validateDimension = (value, min = 5, max = 100) => {
    if (typeof value !== 'number' || isNaN(value)) {
        console.warn('⚠️ Dimensión inválida:', value);
        return min;
    }
    return Math.max(min, Math.min(max, value));
};

/**
 * Obtiene la posición guardada de un texto con fallback
 * @param {Object} slide - Objeto de la diapositiva
 * @param {string} textType - 'title' o 'subtitle'
 * @returns {Object} Posición {x, y}
 */
export const getTextPosition = (slide, textType) => {
    const posKey = textType + 'Pos';
    const position = slide[posKey];

    // Defaults si no existe
    const defaults = {
        title: { x: 5, y: 35 },
        subtitle: { x: 10, y: 55 }
    };

    const validatedPosition = validatePosition(position || defaults[textType]);

    // Debug log
    console.log(`📍 ${textType} position:`, validatedPosition, '(slide:', slide.id.substring(0, 8) + '...)');

    return validatedPosition;
};

/**
 * Obtiene las dimensiones guardadas de un texto con fallback
 * @param {Object} slide - Objeto de la diapositiva
 * @param {string} textType - 'title' o 'subtitle'
 * @returns {Object} {width, height}
 */
export const getTextDimensions = (slide, textType) => {
    const widthKey = textType + 'Width';
    const heightKey = textType + 'Height';

    // Defaults
    const defaults = {
        title: { width: 90, height: 12 },
        subtitle: { width: 80, height: 25 }
    };

    const width = validateDimension(slide[widthKey] || defaults[textType].width, 5, 100);
    const height = validateDimension(slide[heightKey] || defaults[textType].height, 2, 100);

    // Debug log
    console.log(`📏 ${textType} dimensions:`, { width, height }, '(slide:', slide.id.substring(0, 8) + '...)');

    return { width, height };
};

/**
 * Verifica si las posiciones están siendo guardadas correctamente
 * @param {Object} slide - Diapositiva actual
 */
export const debugSlidePositions = (slide) => {
    console.group('🔍 DEBUG: Posiciones de Diapositiva', slide.id.substring(0, 8));
    console.log('Título:', {
        pos: slide.titlePos,
        width: slide.titleWidth,
        height: slide.titleHeight
    });
    console.log('Subtítulo:', {
        pos: slide.subtitlePos,
        width: slide.subtitleWidth,
        height: slide.subtitleHeight
    });
    console.groupEnd();
};

/**
 * Crea un objeto de actualización de posición
 * @param {string} textType - 'title' o 'subtitle'
 * @param {Object} position - {x, y}
 * @returns {Object} Objeto para updateSlide
 */
export const createPositionUpdate = (textType, position) => {
    const validatedPos = validatePosition(position);
    const key = textType + 'Pos';

    console.log(`💾 Guardando ${textType} en:`, validatedPos);

    return { [key]: validatedPos };
};

/**
 * Crea un objeto de actualización de dimensiones
 * @param {string} textType - 'title' o 'subtitle'
 * @param {number} width - Ancho en %
 * @param {number} height - Alto en %
 * @returns {Object} Objeto para updateSlide
 */
export const createDimensionUpdate = (textType, width, height) => {
    const validatedWidth = validateDimension(width, 5, 100);
    const validatedHeight = validateDimension(height, 2, 100);

    const widthKey = textType + 'Width';
    const heightKey = textType + 'Height';

    console.log(`📐 Guardando ${textType} dimensions:`, { width: validatedWidth, height: validatedHeight });

    return {
        [widthKey]: validatedWidth,
        [heightKey]: validatedHeight
    };
};
