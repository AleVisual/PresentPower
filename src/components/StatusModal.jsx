import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const StatusModal = ({
    isOpen,
    onClose,
    type = 'success',
    title,
    message,
    duration = 4000
}) => {
    // Auto-cerrar después de la duración especificada
    useEffect(() => {
        if (isOpen && duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    const variants = {
        success: {
            icon: <CheckCircle2 size={40} className="text-emerald-500" />,
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-100 dark:border-emerald-800',
            accent: 'bg-emerald-500'
        },
        error: {
            icon: <AlertCircle size={40} className="text-rose-500" />,
            bg: 'bg-rose-50 dark:bg-rose-900/20',
            border: 'border-rose-100 dark:border-rose-800',
            accent: 'bg-rose-500'
        },
        info: {
            icon: <Info size={40} className="text-blue-500" />,
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-100 dark:border-blue-800',
            accent: 'bg-blue-500'
        }
    };

    const config = variants[type] || variants.info;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none">
                    {/* Backdrop (solo visible si queremos bloquear interacción, aquí no la bloqueamos para ser menos intrusivos) */}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className={`pointer-events-auto relative w-full max-w-sm ${config.bg} ${config.border} border-2 backdrop-blur-md rounded-2xl shadow-2xl p-6 overflow-hidden`}
                    >
                        {/* Barra de progreso inferior */}
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: duration / 1000, ease: "linear" }}
                            className={`absolute bottom-0 left-0 h-1.5 ${config.accent} opacity-60`}
                        />

                        <div className="flex items-start space-x-4">
                            <div className="shrink-0 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                {config.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                                    {title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="shrink-0 p-1 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StatusModal;
