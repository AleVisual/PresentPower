/**
 * Sistema de Coordenadas de Precisión Profesional (Lienzo Virtual 1920x1080)
 * 
 * Este sistema emula el comportamiento de herramientas como Photoshop o PowerPoint.
 * Se define una resolución base de 1920x1080 píxeles virtuales.
 * Todas las posiciones y tamaños se guardan en estos "píxeles virtuales".
 */

export const VIRTUAL_WIDTH = 1920;
export const VIRTUAL_HEIGHT = 1080;

/**
 * Normaliza una posición asegurando que esté dentro de los límites del lienzo virtual
 */
export const normalizePixelPosition = (pos) => {
    return {
        x: Math.max(0, Math.min(VIRTUAL_WIDTH, pos.x)),
        y: Math.max(0, Math.min(VIRTUAL_HEIGHT, pos.y))
    };
};

/**
 * Convierte porcentajes (legado) a píxeles virtuales
 */
export const legacyToPixels = (percentPos) => {
    if (!percentPos) return null;
    return {
        x: (percentPos.x / 100) * VIRTUAL_WIDTH,
        y: (percentPos.y / 100) * VIRTUAL_HEIGHT
    };
};

/**
 * Obtiene la configuración de un texto en píxeles virtuales
 */
export const getTextConfiguration = (slide, textType) => {
    const defaults = {
        title: { pos: { x: 110, y: 250 }, w: 1700, h: 250 },
        subtitle: { pos: { x: 110, y: 520 }, w: 1700, h: 500 }
    };

    const def = defaults[textType];

    // Obtener valores (si son menores a 101, asumimos que son porcentajes antiguos)
    let savedPos = slide[`${textType}Pos`];
    if (savedPos && savedPos.x <= 100 && savedPos.y <= 100) {
        savedPos = legacyToPixels(savedPos);
    }

    let savedW = slide[`${textType}Width`];
    if (savedW && savedW <= 100) savedW = (savedW / 100) * VIRTUAL_WIDTH;

    let savedH = slide[`${textType}Height`];
    if (savedH && savedH <= 100) savedH = (savedH / 100) * VIRTUAL_HEIGHT;

    return {
        position: savedPos || def.pos,
        width: savedW || def.w,
        height: savedH || def.h
    };
};

export default {
    VIRTUAL_WIDTH,
    VIRTUAL_HEIGHT,
    getTextConfiguration,
    normalizePixelPosition
};
