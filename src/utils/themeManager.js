/**
 * themeManager.js
 * Utilidad para gestionar el modo oscuro y temas de la aplicación
 */

/**
 * Verifica si hay una preferencia de tema guardada en el sistema
 * @returns {string} - 'dark' o 'light'
 */
export const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';

    // 1. Verificar localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // 2. Verificar preferencia del sistema operativo
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
};

/**
 * Aplica el tema al elemento raíz (HTML)
 * @param {string} theme - 'dark' o 'light'
 */
export const applyTheme = (theme) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
};

/**
 * Alterna entre modo claro y oscuro (Solo devuelve el valor)
 * @param {string} currentTheme - El tema actual
 * @returns {string} - El nuevo tema
 */
export const toggleTheme = (currentTheme) => {
    return currentTheme === 'light' ? 'dark' : 'light';
};

/**
 * Obtiene las clases de CSS para componentes basados en el tema
 * @param {string} theme - 'dark' o 'light'
 * @returns {Object} - Objeto con mapeo de clases
 */
export const getThemeClasses = (theme) => {
    const isDark = theme === 'dark';

    return {
        // Fondos
        bgMain: isDark ? 'bg-slate-950' : 'bg-slate-100',
        bgPanel: isDark ? 'bg-slate-900' : 'bg-white',
        bgCard: isDark ? 'bg-slate-800' : 'bg-slate-50',

        // Bordes
        border: isDark ? 'border-slate-800' : 'border-slate-200',

        // Texto
        textPrimary: isDark ? 'text-slate-100' : 'text-slate-800',
        textSecondary: isDark ? 'text-slate-400' : 'text-slate-500',
        textMuted: isDark ? 'text-slate-500' : 'text-slate-400',
    };
};

export default {
    getInitialTheme,
    applyTheme,
    toggleTheme,
    getThemeClasses
};
