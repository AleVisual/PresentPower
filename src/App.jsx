import React, { useState, useEffect, useRef, useCallback } from 'react';
import SlideCanvas from './components/SlideCanvas';
import SlideList from './components/SlideList';
import PropertiesPanel from './components/PropertiesPanel';
import EditorHeader from './components/EditorHeader';
import StatusModal from './components/StatusModal';
import useAutoAdvance from './hooks/useAutoAdvance';
import useBackgroundMusic from './hooks/useBackgroundMusic';
import themeManager from './utils/themeManager';
import AuthView from './components/AuthView';
import NewProjectModal from './components/NewProjectModal';

const App = () => {
    // --- Estado de Autenticación ---
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('pp_session');
        return saved ? JSON.parse(saved) : null;
    });

    // --- Estado de la Aplicación ---
    const [theme, setTheme] = useState(themeManager.getInitialTheme());
    const [slides, setSlides] = useState([
        {
            id: '1',
            background: 'bg-gradient-to-br from-blue-600 to-indigo-800',
            customImage: null,
            content: '¡Bienvenidos Presentación Power!',
            subtitle: 'Tu editor de presentaciones interactivo',
            transition: 'fade',
            titleFontSize: 80,
            subtitleFontSize: 40,
            textColor: '#ffffff', // Legacy fallback
            titleColor: '#ffffff',
            subtitleColor: '#ffffff',
            titleBold: false,
            titleItalic: false,
            subtitleBold: false,
            subtitleItalic: false,
            textAnimation: 'none',
            textAnimationDelay: 0.5,
            textAnimationDuration: 1.0,
            transitionDuration: 1.0,
            autoAdvance: false,
            autoAdvanceDelay: 5,
            titlePos: { x: 110, y: 250 },
            subtitlePos: { x: 110, y: 520 },
            titleWidth: 1700,
            subtitleWidth: 1700,
            titleHeight: 250,
            subtitleHeight: 500
        }
    ]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isRecordingActive, setIsRecordingActive] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [audioVolume, setAudioVolume] = useState(0.5);
    const fileInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });
    const [projectHandle, setProjectHandle] = useState(null);
    const [showSlideList, setShowSlideList] = useState(false);
    const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

    const showAlert = useCallback((title, message, type = 'success') => {
        setAlertConfig({ isOpen: true, title, message, type });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
    }, []);

    // --- Auto Advance Hook Integration ---
    useAutoAdvance({
        slides,
        currentSlideIndex,
        isPlaying: isPreviewMode,
        onNext: () => {
            if (currentSlideIndex < slides.length - 1) {
                setCurrentSlideIndex(prev => prev + 1);
            } else {
                setIsPreviewMode(false); // Stop at end of slideshow
                // Si estábamos grabando, detener la grabación automáticamente al finalizar
                if (isRecordingActive) {
                    window.dispatchEvent(new CustomEvent('stop-presentation-recording'));
                }
            }
        }
    });

    const currentSlide = slides[currentSlideIndex];

    // --- Background Music Hook Integration (Global) ---
    useBackgroundMusic({
        audioFile,
        isPlaying: isPreviewMode,
        volume: audioVolume
    });

    // --- Funciones de Gestión (Optimizadas con useCallback) ---
    const addSlide = useCallback(() => {
        setSlides(prevSlides => {
            const newSlide = {
                id: Date.now().toString(),
                background: 'bg-slate-900',
                customImage: null,
                content: 'Nueva Diapositiva',
                subtitle: 'Haz clic para editar el texto',
                transition: 'slide',
                titleFontSize: 80,
                subtitleFontSize: 40,
                textColor: '#ffffff', // Legacy fallback
                titleColor: '#ffffff',
                subtitleColor: '#ffffff',
                titleBold: false,
                titleItalic: false,
                subtitleBold: false,
                subtitleItalic: false,
                textAnimation: 'none',
                textAnimationDelay: 0.5,
                textAnimationDuration: 1.0,
                transitionDuration: 1.0,
                autoAdvance: false,
                autoAdvanceDelay: 5,
                titlePos: { x: 5, y: 35 },
                subtitlePos: { x: 10, y: 55 },
                titleWidth: 90,
                subtitleWidth: 80,
                titleHeight: 12,
                subtitleHeight: 25
            };
            return [...prevSlides, newSlide];
        });
        setCurrentSlideIndex(prev => prev + 1);
    }, []);

    const deleteSlide = useCallback((index, e) => {
        e.stopPropagation();
        setSlides(prev => {
            if (prev.length === 1) return prev;
            return prev.filter((_, i) => i !== index);
        });
        setCurrentSlideIndex(prev => (prev > 0 ? prev - 1 : 0));
    }, []);

    const updateSlide = useCallback((updatedFields) => {
        setSlides(prevSlides => {
            const newSlides = [...prevSlides];
            if (currentSlideIndex >= 0 && currentSlideIndex < newSlides.length) {
                newSlides[currentSlideIndex] = {
                    ...newSlides[currentSlideIndex],
                    ...updatedFields
                };
            }
            return newSlides;
        });
    }, [currentSlideIndex]);

    const toggleSlideList = useCallback(() => {
        setShowSlideList(prev => !prev);
        setShowPropertiesPanel(false);
    }, []);

    const togglePropertiesPanel = useCallback(() => {
        setShowPropertiesPanel(prev => !prev);
        setShowSlideList(false);
    }, []);

    // --- Carga de Imagen Local (Biblioteca de Windows) ---
    const handleImageUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            updateSlide({ customImage: imageUrl, background: '' });
        }
    }, [updateSlide]);

    const triggerFileInput = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleAudioUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            const audioUrl = URL.createObjectURL(file);
            setAudioFile(audioUrl);
        }
    }, []);

    const triggerAudioInput = useCallback(() => {
        audioInputRef.current?.click();
    }, []);

    const removeAudio = useCallback(() => {
        if (audioFile) {
            URL.revokeObjectURL(audioFile);
            setAudioFile(null);
        }
    }, [audioFile]);

    // --- Lógica de Proyecto ---
    const handleCreateNewProject = useCallback(() => {
        setSlides([
            {
                id: '1',
                background: 'bg-gradient-to-br from-blue-600 to-indigo-800',
                customImage: null,
                content: '¡Bienvenidos Presentación Power!',
                subtitle: 'Tu editor de presentaciones interactivo',
                transition: 'fade',
                titleFontSize: 80,
                subtitleFontSize: 40,
                textColor: '#ffffff',
                titleColor: '#ffffff',
                subtitleColor: '#ffffff',
                titleBold: false,
                titleItalic: false,
                subtitleBold: false,
                subtitleItalic: false,
                textAnimation: 'none',
                textAnimationDelay: 0.5,
                textAnimationDuration: 1.0,
                transitionDuration: 1.0,
                autoAdvance: false,
                autoAdvanceDelay: 5,
                titlePos: { x: 110, y: 250 },
                subtitlePos: { x: 110, y: 520 },
                titleWidth: 1700,
                subtitleWidth: 1700,
                titleHeight: 250,
                subtitleHeight: 500
            }
        ]);
        setAudioFile(null);
        setProjectHandle(null);
        setCurrentSlideIndex(0);
        showAlert("Nuevo Proyecto", "Se ha creado un lienzo vacío con éxito.", "success");
    }, [showAlert]);

    // --- Gestión de Tema ---
    useEffect(() => {
        themeManager.applyTheme(theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => themeManager.toggleTheme(prev));
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('pp_session');
        setUser(null);
    }, []);

    // --- Navegación en Presentación ---
    // --- Gestión de Pantalla Completa Real ---
    const toggleFullScreen = useCallback((show) => {
        const docEl = document.documentElement;
        if (show) {
            if (!document.fullscreenElement) {
                docEl.requestFullscreen().catch(err => {
                    console.warn(`Fullscreen blocked: ${err.message}`);
                    // Fallback: al menos activamos el modo preview visual
                });
            }
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
        }
    }, []);

    const enterPreview = () => {
        setIsPreviewMode(true);
        toggleFullScreen(true);
    };

    const exitPreview = () => {
        setIsPreviewMode(false);
        toggleFullScreen(false);
    };

    const nextSlide = useCallback(() => {
        setCurrentSlideIndex(prev => (prev < slides.length - 1 ? prev + 1 : prev));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlideIndex(prev => (prev > 0 ? prev - 1 : prev));
    }, []);

    // Escuchar la tecla ESC para sincronizar estado de preview
    useEffect(() => {
        const handleFSChange = () => {
            if (!document.fullscreenElement && isPreviewMode) {
                setIsPreviewMode(false);
            }
        };
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => document.removeEventListener('fullscreenchange', handleFSChange);
    }, [isPreviewMode]);

    // --- Efectos de teclado ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isPreviewMode) {
                if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
                if (e.key === 'ArrowLeft') prevSlide();
                if (e.key === 'Escape') setIsPreviewMode(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPreviewMode, nextSlide, prevSlide]);

    if (!user) {
        return <AuthView onLogin={setUser} />;
    }

    if (!currentSlide) return null; // Safety check

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
            {/* --- Sidebar Izquierda: Miniaturas --- */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-[100] lg:z-0
                transition-transform duration-300 transform
                ${showSlideList ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <SlideList
                    slides={slides}
                    currentSlideIndex={currentSlideIndex}
                    setCurrentSlideIndex={(idx) => {
                        setCurrentSlideIndex(idx);
                        if (window.innerWidth < 1024) setShowSlideList(false);
                    }}
                    addSlide={addSlide}
                    deleteSlide={deleteSlide}
                />
            </div>

            {/* --- Main: Editor --- */}
            <main className="flex-1 flex flex-col relative bg-slate-100 dark:bg-slate-950">
                <EditorHeader
                    setIsPreviewMode={enterPreview}
                    slides={slides}
                    setSlides={setSlides}
                    audioFile={audioFile}
                    setAudioFile={setAudioFile}
                    isRecordingActive={isRecordingActive}
                    setIsRecordingActive={setIsRecordingActive}
                    setCurrentSlideIndex={setCurrentSlideIndex}
                    showAlert={showAlert}
                    projectHandle={projectHandle}
                    setProjectHandle={setProjectHandle}
                    user={user}
                    onLogout={handleLogout}
                    toggleSlideList={toggleSlideList}
                    togglePropertiesPanel={togglePropertiesPanel}
                    showSlideList={showSlideList}
                    showPropertiesPanel={showPropertiesPanel}
                    addSlide={addSlide}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    setIsNewProjectModalOpen={setIsNewProjectModalOpen}
                />

                <div className="flex-1 p-4 lg:p-12 flex items-center justify-center overflow-auto bg-slate-200/50 dark:bg-slate-900/50">
                    <div className="w-full max-w-6xl aspect-video shadow-2xl rounded-lg overflow-hidden">
                        <SlideCanvas
                            key={currentSlide.id}
                            slide={currentSlide}
                            updateSlide={updateSlide}
                            currentSlideIndex={currentSlideIndex}
                            totalSlides={slides.length}
                            isPreview={false}
                        />
                    </div>
                </div>

                {/* Overlay para móviles cuando los paneles están abiertos */}
                {(showSlideList || showPropertiesPanel) && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] lg:hidden"
                        onClick={() => {
                            setShowSlideList(false);
                            setShowPropertiesPanel(false);
                        }}
                    />
                )}
            </main>

            {/* --- Sidebar Derecha: Herramientas --- */}
            <div className={`
                fixed lg:relative inset-y-0 right-0 z-[100] lg:z-0
                transition-transform duration-300 transform
                ${showPropertiesPanel ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                <PropertiesPanel
                    slides={slides}
                    currentSlide={currentSlide}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    updateSlide={updateSlide}
                    triggerFileInput={triggerFileInput}
                    handleImageUpload={handleImageUpload}
                    fileInputRef={fileInputRef}
                    audioFile={audioFile}
                    audioVolume={audioVolume}
                    setAudioVolume={setAudioVolume}
                    triggerAudioInput={triggerAudioInput}
                    handleAudioUpload={handleAudioUpload}
                    audioInputRef={audioInputRef}
                    removeAudio={removeAudio}
                />
            </div>

            {/* --- Vista Previa Fullscreen --- */}
            {isPreviewMode && (
                <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden w-screen h-screen">
                    {/* Contenedor que mantiene el aspect ratio 16:9 sin importar el monitor */}
                    <div className="w-full h-full max-w-[177.78vh] max-h-[56.25vw] relative flex items-center justify-center bg-black">
                        <SlideCanvas
                            key={currentSlide.id + '_preview'}
                            slide={currentSlide}
                            isPreview={true}
                            currentSlideIndex={currentSlideIndex}
                            totalSlides={slides.length}
                            nextSlide={nextSlide}
                            prevSlide={prevSlide}
                            setIsPreviewMode={exitPreview}
                            isRecordingActive={isRecordingActive}
                        />
                    </div>
                </div>
            )}

            <StatusModal
                isOpen={alertConfig.isOpen}
                onClose={closeAlert}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
            />

            <NewProjectModal
                isOpen={isNewProjectModalOpen}
                onClose={() => setIsNewProjectModalOpen(false)}
                onConfirm={handleCreateNewProject}
            />
        </div>
    );
};

export default App;