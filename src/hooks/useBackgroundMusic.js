import { useEffect, useRef } from 'react';

/**
 * Custom hook para gestionar la música de fondo en modo presentación
 * @param {string|null} audioFile - URL del archivo de audio
 * @param {boolean} isPlaying - Si está en modo presentación
 * @param {number} volume - Volumen (0.0 a 1.0)
 */
const useBackgroundMusic = ({ audioFile, isPlaying, volume = 0.5 }) => {
    const audioRef = useRef(null);

    // Inicializar el elemento de audio
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true; // Repetir la música
        }

        return () => {
            // Cleanup: detener y limpiar el audio al desmontar
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    // Actualizar la fuente del audio cuando cambia el archivo
    useEffect(() => {
        if (audioRef.current && audioFile) {
            audioRef.current.src = audioFile;
        }
    }, [audioFile]);

    // Controlar reproducción según el estado de presentación
    useEffect(() => {
        if (!audioRef.current || !audioFile) return;

        if (isPlaying) {
            // Intentar reproducir (puede fallar por políticas del navegador)
            audioRef.current.play().catch(err => {
                console.warn('No se pudo reproducir el audio automáticamente:', err);
            });
        } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Reiniciar al inicio
        }
    }, [isPlaying, audioFile]);

    // Actualizar volumen
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, volume));
        }
    }, [volume]);

    return audioRef;
};

export default useBackgroundMusic;
