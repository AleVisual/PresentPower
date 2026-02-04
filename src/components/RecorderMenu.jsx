import React, { useState, useRef, useEffect } from 'react';
import { Video, StopCircle, Settings } from 'lucide-react';
import { recorderInstance } from '../utils/recorderLogic';

const RecorderMenu = ({
    isRecordingActive,
    setIsRecordingActive,
    setIsPreviewMode,
    setCurrentSlideIndex,
    showText = false
}) => {
    const [showSettings, setShowSettings] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [config, setConfig] = useState({
        fps: 30,
        quality: '720p',
        bitrate: 2500000
    });

    const timerRef = useRef(null);
    const menuRef = useRef(null);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Escuchar el evento de parada automática desde App.jsx
    useEffect(() => {
        const handleAutoStop = () => {
            if (isRecordingActive) {
                stopRecording();
            }
        };
        window.addEventListener('stop-presentation-recording', handleAutoStop);
        return () => window.removeEventListener('stop-presentation-recording', handleAutoStop);
    }, [isRecordingActive]);

    const stopRecording = async () => {
        const blob = await recorderInstance.stop();
        if (blob) {
            recorderInstance.download(blob, `presentacion_power_${new Date().getTime()}.mp4`);
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsRecordingActive(false);
        setRecordingTime(0);
    };

    const toggleRecording = async () => {
        if (isRecordingActive) {
            await stopRecording();
        } else {
            const success = await recorderInstance.start({
                fps: config.fps,
                videoBitsPerSecond: config.bitrate
            });

            if (success) {
                setCurrentSlideIndex(0);
                setIsPreviewMode(true);
                setIsRecordingActive(true);

                setRecordingTime(0);
                timerRef.current = setInterval(() => {
                    setRecordingTime(prev => prev + 1);
                }, 1000);
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Clases dinámicas extraídas para mayor limpieza
    const buttonBaseClass = "flex items-center space-x-2 px-4 py-2 transition-all font-medium text-sm";
    const recordButtonClass = isRecordingActive
        ? `${buttonBaseClass} bg-red-600 text-white hover:bg-red-700`
        : `${buttonBaseClass} bg-indigo-600 text-white hover:bg-indigo-700`;

    const getQualityClass = (qId) => {
        const base = "text-xs p-2 rounded-lg border transition-all";
        return config.quality === qId
            ? `${base} bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 font-bold`
            : `${base} bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400`;
    };

    const getFpsClass = (fps) => {
        const base = "flex-1 text-xs py-1.5 rounded-lg border transition-all";
        return config.fps === fps
            ? `${base} bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-bold`
            : `${base} bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400`;
    };

    return (
        <div className="relative flex items-center" ref={menuRef}>
            {isRecordingActive && (
                <div className="mr-3 flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-800 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
                        {formatTime(recordingTime)}
                    </span>
                </div>
            )}

            <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button onClick={toggleRecording} className={recordButtonClass}>
                    {isRecordingActive ? (
                        <>
                            <StopCircle size={18} />
                            <span className={showText ? 'inline' : 'hidden sm:inline'}>Detener</span>
                        </>
                    ) : (
                        <>
                            <Video size={18} />
                            <span className={showText ? 'inline' : 'hidden sm:inline'}>Grabar</span>
                        </>
                    )}
                </button>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="px-2 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border-l border-slate-200 dark:border-slate-700 transition-colors"
                    title="Configuración de grabación"
                >
                    <Settings size={18} className={showSettings ? 'rotate-90 transition-transform' : 'transition-transform'} />
                </button>
            </div>

            {showSettings && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-[110] p-4 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                        <Settings size={14} className="mr-2" /> Ajustes de Video
                    </h4>

                    <div className="space-y-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/50 rounded-xl">
                            <h5 className="text-[11px] text-red-700 dark:text-red-400 font-black uppercase mb-2 flex items-center">
                                <span className="mr-2">⚠️</span> PASOS PARA GRABAR BIEN:
                            </h5>
                            <div className="space-y-2 text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                                <div className="flex items-start">
                                    <span className="bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] mr-2 mt-0.5 shrink-0">1</span>
                                    <p>Pulsa el botón de arriba y elige <span className="font-bold underline">"Pestaña de Chrome"</span>.</p>
                                </div>
                                <div className="flex items-start">
                                    <span className="bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] mr-2 mt-0.5 shrink-0">2</span>
                                    <p>Haz clic en el nombre <span className="font-bold text-red-600 dark:text-red-400">"Presentación Power"</span> para seleccionarlo.</p>
                                </div>
                                <div className="flex items-start">
                                    <span className="bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] mr-2 mt-0.5 shrink-0">3</span>
                                    <p>Marca la casilla <span className="font-bold underline">"Compartir audio"</span> (abajo a la izquierda).</p>
                                </div>
                                <div className="flex items-start">
                                    <span className="bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] mr-2 mt-0.5 shrink-0">4</span>
                                    <p>Finalmente, pulsa el botón azul <span className="font-bold underline">"Compartir"</span>.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-2 uppercase tracking-tighter">Calidad (Recomendado: Fluido)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setConfig({ ...config, quality: '720p', bitrate: 2000000 })} className={getQualityClass('720p')}>
                                    720p (Sin Lag)
                                </button>
                                <button onClick={() => setConfig({ ...config, quality: '1080p', bitrate: 4000000 })} className={getQualityClass('1080p')}>
                                    1080p (HQ)
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-2 uppercase">Fotogramas</label>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setConfig({ ...config, fps: 30 })} className={getFpsClass(30)}>
                                    30 FPS
                                </button>
                                <button onClick={() => setConfig({ ...config, fps: 60 })} className={getFpsClass(60)}>
                                    60 FPS
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] text-slate-400 leading-relaxed italic">
                                * Nota: La presentación se grabará automáticamente al iniciar.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecorderMenu;
