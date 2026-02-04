import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilePlus, X, AlertTriangle, Check } from 'lucide-react';

const NewProjectModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                >
                    {/* Header con gradiente */}
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />

                    <div className="p-8">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                            <FilePlus size={32} className="text-blue-600 dark:text-blue-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
                            ¿Crear nuevo proyecto?
                        </h2>

                        <p className="text-center text-slate-500 dark:text-slate-400 mb-8 px-4">
                            Se borrarán todas las diapositivas actuales. Asegúrate de haber guardado tus cambios antes de continuar.
                        </p>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center space-x-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/25"
                            >
                                <Check size={20} />
                                <span>Sí, crear nuevo</span>
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-all active:scale-95"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>

                    {/* Alerta inferior suave */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center space-x-3 px-8 border-t border-slate-100 dark:border-slate-800">
                        <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
                        <p className="text-[10px] text-slate-400 leading-tight">
                            Esta acción no se puede deshacer a menos que tengas el archivo .ppproj guardado en tu computadora.
                        </p>
                    </div>

                    {/* Botón de cerrar superior */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X size={20} />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default NewProjectModal;
