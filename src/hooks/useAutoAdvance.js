import { useEffect } from 'react';
import { getSlideDelay, secondsToMs } from '../utils/slideTimer';

const useAutoAdvance = ({
    slides,
    currentSlideIndex,
    isPlaying,
    onNext
}) => {
    useEffect(() => {
        // Solo ejecutar si estamos en modo presentación (play) y hay slides
        if (!isPlaying || !slides || slides.length === 0) return;

        const currentSlide = slides[currentSlideIndex];

        // Si no tenemos slide actual o el auto-advance está desactivado, no hacemos nada
        if (!currentSlide || !currentSlide.autoAdvance) return;

        // Obtenemos el tiempo de espera validado usando la utilidad
        const delayMs = secondsToMs(currentSlide.autoAdvanceDelay);

        // Configuramos el timer
        const timer = setTimeout(() => {
            onNext();
        }, delayMs);

        // Limpieza: cancelar timer si cambiamos de slide, paramos la presentación o desmontamos
        return () => clearTimeout(timer);
    }, [currentSlideIndex, isPlaying, slides, onNext]);
};

export default useAutoAdvance;
