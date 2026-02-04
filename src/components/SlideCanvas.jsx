import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import SlideTransition from './SlideTransition';
import AnimatedText from './AnimatedText';
import DraggableText from './DraggableText';
import { getTextConfiguration, VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from '../utils/coordinateSystem';

const SlideCanvas = ({
    slide,
    isPreview = false,
    updateSlide,
    currentSlideIndex,
    totalSlides,
    nextSlide,
    prevSlide,
    setIsPreviewMode,
    isRecordingActive = false
}) => {
    // Determinar si el fondo es oscuro para ajustar el color del texto (fallback si no hay color definido)
    const isDark = slide.customImage || (slide.background && (slide.background.includes('black') || slide.background.includes('indigo') || slide.background.includes('blue') || slide.background.includes('slate') || slide.background.includes('gray')));
    const defaultTextColor = isDark ? '#ffffff' : '#1e293b';

    const containerStyle = slide.customImage ? {
        backgroundImage: `url(${slide.customImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    } : {};

    // Obtención de configuraciones de texto (ahora en píxeles virtuales)
    const titleConfig = getTextConfiguration(slide, 'title');
    const subtitleConfig = getTextConfiguration(slide, 'subtitle');

    const containerRef = React.useRef(null);
    const [scale, setScale] = React.useState(1);

    // Calcular escala basada en 1920px (base del lienzo virtual)
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                setScale(containerRef.current.offsetWidth / VIRTUAL_WIDTH);
            }
        };
        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);
        updateScale();
        return () => observer.disconnect();
    }, []);

    // Get text effect for text animations
    const textEffect = slide.textAnimation || 'none';

    // Optimización de rendimiento: deshabilitar sombras pesadas si se está grabando
    const shadowClass = isRecordingActive ? '' : 'shadow-2xl';
    const roundedClass = isPreview ? 'rounded-none' : (isRecordingActive ? 'rounded-none' : 'rounded-lg');

    return (
        <SlideTransition
            effect={slide.transition}
            slideKey={slide.id + (isPreview ? '_preview' : '')}
            duration={slide.transitionDuration || 1}
        >
            <div
                ref={containerRef}
                style={containerStyle}
                className={`w-full h-full slide-canvas-container ${slide.background} relative overflow-hidden ${shadowClass} ${roundedClass}`}
            >
                {/* Capa de oscurecimiento si hay imagen para que el texto sea legible */}
                {/* Eliminado capa de oscurecimiento para máxima fidelidad visual de bordes */}

                {/* LIENZO VIRTUAL ESCALADO */}
                <div
                    style={{
                        width: VIRTUAL_WIDTH,
                        height: VIRTUAL_HEIGHT,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                    className="pointer-events-none"
                >
                    <AnimatePresence mode="wait">
                        <div key={slide.id + (isPreview ? '_preview' : '')} className="w-full h-full relative pointer-events-auto"
                            style={{
                                fontFamily: slide.fontFamily || 'sans-serif'
                            }}
                        >

                            {/* TÍTULO */}
                            <DraggableText
                                position={titleConfig.position}
                                width={titleConfig.width}
                                height={titleConfig.height}
                                onUpdate={({ x, y, width, height }) => updateSlide({
                                    titlePos: { x, y },
                                    titleWidth: width,
                                    titleHeight: height
                                })}
                                isPreview={isPreview}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {isPreview ? (
                                        <AnimatedText
                                            text={slide.content}
                                            type={textEffect}
                                            delay={slide.textAnimationDelay || 0}
                                            duration={slide.textAnimationDuration || 1}
                                            className="font-bold w-full h-full flex items-center justify-center text-center overflow-visible"
                                            style={{
                                                fontSize: (slide.titleFontSize || 80) + 'px',
                                                lineHeight: 1,
                                                padding: 0,
                                                margin: 0,
                                                color: slide.titleColor || slide.textColor || defaultTextColor,
                                                fontWeight: slide.titleBold ? 'bold' : 'bold',
                                                fontStyle: slide.titleItalic ? 'italic' : 'normal',
                                                textShadow: isRecordingActive ? 'none' : '0 2px 4px rgba(0,0,0,0.3)'
                                            }}
                                        />
                                    ) : (
                                        <textarea
                                            disabled={isPreview}
                                            value={slide.content}
                                            onChange={(e) => updateSlide({ content: e.target.value })}
                                            className="bg-transparent font-bold w-full h-full focus:outline-none focus:ring-0 rounded-none p-2 m-0 border-none placeholder:text-current/30 cursor-text shadow-none text-center block resize-none overflow-auto scrollbar-hide"
                                            style={{
                                                fontSize: (slide.titleFontSize || 80) + 'px',
                                                lineHeight: 1.1,
                                                textAlign: 'center',
                                                color: slide.titleColor || slide.textColor || defaultTextColor,
                                                fontWeight: slide.titleBold ? 'bold' : 'bold',
                                                fontStyle: slide.titleItalic ? 'italic' : 'normal',
                                                userSelect: 'text'
                                            }}
                                            placeholder="Título..."
                                            spellCheck={true}
                                            lang="es"
                                            rows={1}
                                        />
                                    )}
                                </div>
                            </DraggableText>

                            {/* SUBTÍTULO */}
                            <DraggableText
                                position={subtitleConfig.position}
                                width={subtitleConfig.width}
                                height={subtitleConfig.height}
                                onUpdate={({ x, y, width, height }) => updateSlide({
                                    subtitlePos: { x, y },
                                    subtitleWidth: width,
                                    subtitleHeight: height
                                })}
                                isPreview={isPreview}
                            >
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                                    {isPreview ? (
                                        <AnimatedText
                                            text={slide.subtitle}
                                            type={textEffect}
                                            delay={(slide.textAnimationDelay || 0) + 0.5}
                                            duration={slide.textAnimationDuration || 1}
                                            className="w-full h-full flex items-center justify-center text-center overflow-visible"
                                            style={{
                                                fontSize: (slide.subtitleFontSize || 40) + 'px',
                                                lineHeight: 1.2,
                                                padding: 0,
                                                margin: 0,
                                                color: slide.subtitleColor || slide.textColor || defaultTextColor,
                                                fontWeight: slide.subtitleBold ? 'bold' : 'normal',
                                                fontStyle: slide.subtitleItalic ? 'italic' : 'normal',
                                                textShadow: isRecordingActive ? 'none' : '0 2px 4px rgba(0,0,0,0.3)'
                                            }}
                                        />
                                    ) : (
                                        <textarea
                                            disabled={isPreview}
                                            value={slide.subtitle}
                                            onChange={(e) => updateSlide({ subtitle: e.target.value })}
                                            className="bg-transparent w-full h-full focus:outline-none focus:ring-0 rounded-none p-2 m-0 border-none placeholder:text-current/30 cursor-text shadow-none text-center pointer-events-auto block resize-none overflow-auto scrollbar-hide"
                                            style={{
                                                fontSize: (slide.subtitleFontSize || 40) + 'px',
                                                lineHeight: 1.2,
                                                textAlign: 'center',
                                                color: slide.subtitleColor || slide.textColor || defaultTextColor,
                                                fontWeight: slide.subtitleBold ? 'bold' : 'normal',
                                                fontStyle: slide.subtitleItalic ? 'italic' : 'normal',
                                                userSelect: 'text'
                                            }}
                                            placeholder="Subtítulo..."
                                            spellCheck={true}
                                            lang="es"
                                            rows={1}
                                        />
                                    )}
                                </div>
                            </DraggableText>
                        </div>
                    </AnimatePresence>
                </div>

                {isPreview && !isRecordingActive && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 opacity-0 hover:opacity-100 transition-opacity bg-black/50 text-white p-2 rounded-full z-20">
                        <button onClick={prevSlide} className="p-2 hover:bg-white/20 rounded-full"><ChevronLeft /></button>
                        <span>{currentSlideIndex + 1} / {totalSlides}</span>
                        <button onClick={nextSlide} className="p-2 hover:bg-white/20 rounded-full"><ChevronRight /></button>
                        <button onClick={() => setIsPreviewMode(false)} className="p-2 hover:bg-red-500/50 rounded-full"><X size={20} /></button>
                    </div>
                )}
            </div>
        </SlideTransition>
    );
};

export default SlideCanvas;
