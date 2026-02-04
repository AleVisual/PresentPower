import React, { useState } from 'react';
import { Play, LogIn, LayoutList, Settings2, Menu, Plus, MoreVertical, Sun, Moon } from 'lucide-react';
import ExportMenu from './ExportMenu';
import RecorderMenu from './RecorderMenu';
import ProjectMenu from './ProjectMenu';

const EditorHeader = ({
    setIsPreviewMode,
    slides,
    setSlides,
    audioFile,
    setAudioFile,
    isRecordingActive,
    setIsRecordingActive,
    setCurrentSlideIndex,
    showAlert,
    projectHandle,
    setProjectHandle,
    user,
    onLogout,
    toggleSlideList,
    togglePropertiesPanel,
    showSlideList,
    showPropertiesPanel,
    addSlide,
    theme,
    toggleTheme,
    setIsNewProjectModalOpen
}) => {
    const [showMobileTools, setShowMobileTools] = useState(false);
    const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'I';

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-2 lg:px-8 transition-colors duration-300 relative z-[60]">
            <div className="flex items-center space-x-1 lg:space-x-3 min-w-0 flex-shrink">
                {/* Botón Menu para Diapositivas en móvil */}
                <div className="flex items-center lg:hidden bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    <button
                        onClick={toggleSlideList}
                        className={`p-2 rounded-lg transition-colors ${showSlideList ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        title="Diapositivas"
                    >
                        <LayoutList size={20} />
                    </button>
                    <button
                        onClick={addSlide}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                        title="Nueva Diapositiva"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <img
                    src={`${import.meta.env.BASE_URL}assets/logo.png`}
                    alt="Logo"
                    className="block h-7 lg:h-8 w-auto object-contain hover:scale-105 transition-transform cursor-pointer flex-shrink-0"
                />

                {/* Avatar para móviles / Nombre para escritorio */}
                <div className="flex items-center space-x-2 min-w-0">
                    <div className="md:hidden w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                        {userInitial}
                    </div>
                    <div className="hidden md:flex items-center space-x-2 min-w-0 max-w-[120px] lg:max-w-[150px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
                            {user?.username || 'Invitado'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
                {/* Herramientas para Escritorio (Ocultas en móviles pequeños) */}
                <div className="hidden sm:flex items-center space-x-1.5 scale-[0.85] lg:scale-100 origin-right">
                    <ProjectMenu
                        slides={slides}
                        setSlides={setSlides}
                        audioFile={audioFile}
                        setAudioFile={setAudioFile}
                        setCurrentSlideIndex={setCurrentSlideIndex}
                        showAlert={showAlert}
                        projectHandle={projectHandle}
                        setProjectHandle={setProjectHandle}
                        onNewProjectClick={() => setIsNewProjectModalOpen(true)}
                    />
                    <RecorderMenu
                        isRecordingActive={isRecordingActive}
                        setIsRecordingActive={setIsRecordingActive}
                        setIsPreviewMode={setIsPreviewMode}
                        setCurrentSlideIndex={setCurrentSlideIndex}
                    />
                    <ExportMenu slides={slides} audioFile={audioFile} showAlert={showAlert} />
                </div>

                {/* Botón "Más Herramientas" para móviles */}
                <button
                    onClick={() => setShowMobileTools(!showMobileTools)}
                    className={`sm:hidden p-2 rounded-lg transition-colors ${showMobileTools ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800'}`}
                    title="Herramientas"
                >
                    <Menu size={20} />
                </button>

                <button
                    onClick={() => setIsPreviewMode(true)}
                    className="flex items-center space-x-1 px-2 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[10px] lg:text-xs font-bold shadow-sm transition-all shadow-blue-500/20 flex-shrink-0"
                    title="Presentar"
                >
                    <Play size={16} /> <span className="hidden md:inline">Presentar</span>
                </button>

                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5"></div>

                {/* Botón Propiedades para móvil */}
                <button
                    onClick={togglePropertiesPanel}
                    className={`lg:hidden p-2 rounded-lg transition-colors ${showPropertiesPanel ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    title="Propiedades"
                >
                    <Settings2 size={20} />
                </button>

                {/* Alternancia de Tema (Sol/Luna) - Desktop & Tablet */}
                <button
                    onClick={toggleTheme}
                    className="flex p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                >
                    {theme === 'dark' ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-indigo-600" />}
                </button>

                <button
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0 ml-1"
                    title="Cerrar Sesión"
                >
                    <LogIn size={20} className="transform rotate-180" />
                </button>
            </div>

            {/* Panel de Herramientas Móvil (Desplegable) */}
            {showMobileTools && (
                <div className="sm:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xl z-50 p-4 animate-in slide-in-from-top-4 duration-200">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acciones Rápidas</span>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setShowMobileTools(false)} className="text-slate-400 p-1">
                                    <Plus size={18} className="rotate-45" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Proyecto</span>
                                <ProjectMenu
                                    slides={slides}
                                    setSlides={setSlides}
                                    audioFile={audioFile}
                                    setAudioFile={setAudioFile}
                                    setCurrentSlideIndex={setCurrentSlideIndex}
                                    showAlert={showAlert}
                                    projectHandle={projectHandle}
                                    setProjectHandle={setProjectHandle}
                                    showText={true}
                                    onNewProjectClick={() => setIsNewProjectModalOpen(true)}
                                />
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Grabación</span>
                                <RecorderMenu
                                    isRecordingActive={isRecordingActive}
                                    setIsRecordingActive={setIsRecordingActive}
                                    setIsPreviewMode={setIsPreviewMode}
                                    setCurrentSlideIndex={setCurrentSlideIndex}
                                    showText={true}
                                />
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Exportar</span>
                                <ExportMenu slides={slides} audioFile={audioFile} showAlert={showAlert} showText={true} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default EditorHeader;
