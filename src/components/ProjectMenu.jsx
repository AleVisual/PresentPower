import React, { useState, useRef } from 'react';
import { FolderOpen, Save, ChevronDown, CheckCircle2, Loader2, FilePlus } from 'lucide-react';
import { projectManager } from '../utils/projectManager';

const ProjectMenu = ({
    slides,
    setSlides,
    audioFile,
    setAudioFile,
    setCurrentSlideIndex,
    showAlert,
    projectHandle,
    setProjectHandle,
    showText = false,
    onNewProjectClick
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    // Lógica para Guardar (Autoguardado si existe handle)
    const handleSave = async (forceNew = false) => {
        setIsProcessing(true);
        try {
            let currentHandle = projectHandle;

            // Si es un nuevo archivo o forzamos "Guardar como" o no existe la API (Safari/Firefox antiguos)
            if (forceNew || !currentHandle) {
                if (window.showSaveFilePicker) {
                    currentHandle = await projectManager.getNewFileHandle();
                    if (!currentHandle) return; // Usuario canceló
                    setProjectHandle(currentHandle);
                } else {
                    // Fallback para navegadores antiguos: descarga normal
                    const blob = await projectManager.exportProject(slides, audioFile);
                    projectManager.download(blob, `proyecto_${Date.now()}.ppproj`);
                    showAlert("Proyecto Guardado", "Archivo descargado correctamente.", "success");
                    return;
                }
            }

            // Sobrescribir el archivo
            await projectManager.saveToHandle(currentHandle, slides, audioFile);
            showAlert("Cambios Guardados", "El archivo se ha actualizado correctamente.", "success");
        } catch (error) {
            console.error("Error al guardar:", error);
            if (error.name !== 'AbortError') {
                showAlert("Error al guardar", "No se pudo actualizar el archivo. ¿Está abierto en otro programa?", "error");
            }
        } finally {
            setIsProcessing(false);
            setIsOpen(false);
        }
    };

    // Lógica para Abrir
    const handleOpen = async () => {
        try {
            let file;
            if (window.showOpenFilePicker) {
                const handle = await projectManager.getOpenFileHandle();
                if (!handle) return;
                setProjectHandle(handle);
                file = await handle.getFile();
            } else {
                // Fallback: usar el input file oculto
                fileInputRef.current.click();
                return;
            }

            await processProjectFile(file);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Error al abrir:", error);
                showAlert("Error", "No se pudo abrir el archivo.", "error");
            }
        } finally {
            setIsOpen(false);
        }
    };

    const processProjectFile = async (file) => {
        setIsProcessing(true);
        try {
            const data = await projectManager.importProject(file);
            setSlides(data.slides);
            setAudioFile(data.audioUrl);
            setCurrentSlideIndex(0);
            showAlert("Proyecto Cargado", "Todo el contenido se ha restaurado con éxito.", "success");
        } catch (error) {
            console.error("Procesando archivo:", error);
            showAlert("Error de lectura", "El archivo no parece un proyecto válido.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileChangeFallback = (e) => {
        const file = e.target.files[0];
        if (file) processProjectFile(file);
    };

    return (
        <div className="relative">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".ppproj"
                onChange={handleFileChangeFallback}
            />

            <button
                onClick={() => projectHandle ? handleSave(false) : setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${isOpen
                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    } text-slate-700 dark:text-slate-300 shadow-sm`}
                title={projectHandle ? "Guardar cambios (Sobrescribir)" : "Gestión de Proyecto"}
            >
                {isProcessing ? (
                    <Loader2 size={18} className="animate-spin text-blue-500" />
                ) : projectHandle ? (
                    <Save size={18} className="text-emerald-500" />
                ) : (
                    <Save size={18} className="text-blue-500" />
                )}
                <span>{projectHandle ? (
                    <span className={showText ? 'inline' : 'hidden sm:inline'}>Guardado</span>
                ) : (
                    <span className={showText ? 'inline' : 'hidden sm:inline'}>Gestión Proyecto</span>
                )}</span>
                {!projectHandle && <ChevronDown size={14} className={`ml-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                {projectHandle && (
                    <div
                        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                        className="ml-2 hover:bg-slate-200 dark:hover:bg-slate-700 p-0.5 rounded transition-colors"
                    >
                        <ChevronDown size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-[100] animate-in fade-in zoom-in-95">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onNewProjectClick();
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-3 transition-colors text-blue-600 dark:text-blue-400"
                    >
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <FilePlus size={18} />
                        </div>
                        <div>
                            <span className="block text-sm font-bold">Nuevo Proyecto</span>
                            <span className="block text-[10px] text-blue-400/70">Comenzar desde cero</span>
                        </div>
                    </button>

                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-4"></div>

                    <button
                        onClick={() => handleSave(false)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-3 transition-colors"
                    >
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Save size={18} />
                        </div>
                        <div>
                            <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                                {projectHandle ? 'Guardar Cambios' : 'Guardar (.ppproj)'}
                            </span>
                            <span className="block text-[10px] text-slate-400">
                                {projectHandle ? 'Actualizar archivo actual' : 'Elige dónde guardar'}
                            </span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleSave(true)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-3 transition-colors border-t border-slate-50 dark:border-slate-800/50"
                    >
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                            <Save size={18} />
                        </div>
                        <div>
                            <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">Guardar como...</span>
                            <span className="block text-[10px] text-slate-400">Crear un archivo nuevo</span>
                        </div>
                    </button>

                    <button
                        onClick={handleOpen}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-3 transition-colors border-t border-slate-50 dark:border-slate-800/50"
                    >
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <FolderOpen size={18} />
                        </div>
                        <div>
                            <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">Abrir Proyecto</span>
                            <span className="block text-[10px] text-slate-400">Cargar un archivo existente</span>
                        </div>
                    </button>

                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
    );
};

export default ProjectMenu;
