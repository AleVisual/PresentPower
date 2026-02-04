import { Palette, Upload, Layout, Type, Music, Volume2, X, Clock, Sun, Moon, Bold, Italic } from 'lucide-react';
import { formatTime, calculateTotalPresentationTime } from '../utils/slideTimer';

const FONTS = [
    { name: 'Sans Serif (Default)', value: 'sans-serif' },
    { name: 'Serif', value: 'serif' },
    { name: 'Monospace', value: 'monospace' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Tahoma', value: 'Tahoma, sans-serif' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
    { name: 'Segoe UI', value: '"Segoe UI", sans-serif' }
];

const PropertiesPanel = ({
    slides,
    currentSlide,
    theme,
    toggleTheme,
    updateSlide,
    triggerFileInput,
    handleImageUpload,
    fileInputRef,
    audioFile,
    audioVolume,
    setAudioVolume,
    triggerAudioInput,
    handleAudioUpload,
    audioInputRef,
    removeAudio
}) => {
    return (
        <aside className="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-lg z-10 transition-colors duration-300">
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                            <Palette size={14} className="mr-2" /> Fondo y Estilo
                        </h3>

                    </div>

                    <div className="mb-3">
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">IMAGEN DE FONDO</label>
                        <button
                            onClick={triggerFileInput}
                            className="w-full flex items-center justify-center space-x-2 p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <Upload size={16} />
                            <span className="text-xs font-medium">Subir Imagen</span>
                        </button>
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mb-1">COLOR DE FONDO</label>
                        <select
                            onChange={(e) => updateSlide({ background: e.target.value, customImage: null })}
                            value={currentSlide.customImage ? 'custom' : currentSlide.background}
                            className="w-full p-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                        >
                            {currentSlide.customImage && <option value="custom">Imagen Personalizada</option>}
                            <option value="bg-white">Blanco</option>
                            <option value="bg-slate-100">Gris Claro</option>
                            <option value="bg-slate-900">Oscuro (Slate)</option>
                            <option value="bg-red-500">Rojo Intenso</option>
                            <option value="bg-blue-500">Azul Brillante</option>
                            <option value="bg-emerald-500">Esmeralda</option>
                            <option value="bg-amber-500">Ámbar</option>
                            <option value="bg-indigo-500">Índigo</option>
                            <option value="bg-gradient-to-r from-blue-500 to-indigo-600">Gradiente Azul-Índigo</option>
                            <option value="bg-gradient-to-r from-purple-500 to-pink-500">Gradiente Púrpura-Rosa</option>
                            <option value="bg-gradient-to-br from-gray-700 via-gray-900 to-black">Gradiente Oscuro</option>
                            <option value="bg-gradient-to-r from-emerald-400 to-cyan-400">Gradiente Océano</option>
                        </select>
                    </div>

                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                        <Type size={14} className="mr-2" /> Tipografía
                    </h3>
                    <select
                        className="w-full p-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-sans mb-2"
                        value={currentSlide.fontFamily || 'sans-serif'}
                        onChange={(e) => updateSlide({ fontFamily: e.target.value })}
                    >
                        {FONTS.map(font => (
                            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                {font.name}
                            </option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mb-1">TAMAÑO TÍTULO</label>
                            <input
                                type="number"
                                min="12"
                                max="200"
                                className="w-full p-1.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                                value={currentSlide.titleFontSize || 80}
                                onChange={(e) => updateSlide({ titleFontSize: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mb-1">TAMAÑO TEXTO</label>
                            <input
                                type="number"
                                min="12"
                                max="200"
                                className="w-full p-1.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                                value={currentSlide.subtitleFontSize || 40}
                                onChange={(e) => updateSlide({ subtitleFontSize: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1 flex items-center justify-between">
                            <span>EFECTO DE TEXTO</span>
                            <span className="text-[9px] text-amber-500 font-medium">⭐ Recomendado</span>
                        </label>
                        <select
                            className="w-full p-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                            value={currentSlide.textAnimation || 'none'}
                            onChange={(e) => updateSlide({ textAnimation: e.target.value })}
                        >
                            <option value="none">Ninguno</option>
                            <option value="typewriter">
                                {['rotate', 'flip', 'cube-h', 'cube-v'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                Máquina de Escribir
                            </option>
                            <optgroup label="Básicos">
                                <option value="fade-up">
                                    {['fade', 'zoom', 'parallax-slide', 'dissolve-blur', 'zoom-rotate'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Aparición Suave (Fade Up)
                                </option>
                                <option value="pop">
                                    {['slide-h', 'slide-v', 'bounce', 'newspaper', 'zoom'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Pop (Zoom Rápido)
                                </option>
                                <option value="blur">
                                    {['fade', 'dissolve-blur', 'focus'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Desenfoque (Blur)
                                </option>
                            </optgroup>
                            <optgroup label="Dinámicos">
                                <option value="bounce">
                                    {['bounce', 'slide-v'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Rebote Elástico
                                </option>
                                <option value="scale-in">
                                    {['zoom', 'zoom-rotate', 'newspaper'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Escala (Zoom Fuera)
                                </option>
                                <option value="swing">
                                    {['rotate', 'newspaper'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Péndulo (Swing)
                                </option>
                                <option value="flicker">
                                    {['glitch', 'flip', 'rotate'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Parpadeo (Flicker)
                                </option>
                            </optgroup>
                            <optgroup label="Premium">
                                <option value="glitch">
                                    {['flip', 'cube-h', 'cube-v', 'glitch'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Glitch (Interferencia)
                                </option>
                                <option value="focus">
                                    {['fade', 'zoom', 'dissolve-blur', 'parallax-slide'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Enfoque (Focus)
                                </option>
                                <option value="rotate-3d">
                                    {['flip', 'cube-h', 'cube-v'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Giro 3D
                                </option>
                                <option value="zoom-out">
                                    {['zoom-rotate', 'newspaper'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Zoom Extendido
                                </option>
                                <option value="slide-right">
                                    {['slide-h', 'parallax-slide'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Deslizar Derecha
                                </option>
                                <option value="slide-left">
                                    {['slide-h', 'parallax-slide'].includes(currentSlide.transition) ? '⭐ ' : ''}
                                    Deslizar Izquierda
                                </option>
                            </optgroup>
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">
                            RETRASO DE ANIMACIÓN: {currentSlide.textAnimationDelay || 0}s
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="3"
                            step="0.1"
                            value={currentSlide.textAnimationDelay || 0}
                            onChange={(e) => updateSlide({ textAnimationDelay: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">
                            DURACIÓN DEL EFECTO: {currentSlide.textAnimationDuration || 1}s
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.5"
                            value={currentSlide.textAnimationDuration || 1}
                            onChange={(e) => updateSlide({ textAnimationDuration: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                        <Palette size={14} className="mr-2" /> Colores de Texto
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <div className="flex-1 flex items-center space-x-2 p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex flex-col flex-1">
                                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight mb-1">Color Título</label>
                                    <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                                        {currentSlide.titleColor || currentSlide.textColor || '#ffffff'}
                                    </span>
                                </div>
                                <input
                                    type="color"
                                    value={currentSlide.titleColor || currentSlide.textColor || '#ffffff'}
                                    onChange={(e) => updateSlide({ titleColor: e.target.value })}
                                    className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                    title="Color del Título"
                                />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <button
                                    onClick={() => updateSlide({ titleBold: !currentSlide.titleBold })}
                                    className={`p-1.5 rounded transition-all ${currentSlide.titleBold ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-200'}`}
                                    title="Negrita"
                                >
                                    <Bold size={14} />
                                </button>
                                <button
                                    onClick={() => updateSlide({ titleItalic: !currentSlide.titleItalic })}
                                    className={`p-1.5 rounded transition-all ${currentSlide.titleItalic ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-200'}`}
                                    title="Cursiva"
                                >
                                    <Italic size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="flex-1 flex items-center space-x-2 p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex flex-col flex-1">
                                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight mb-1">Color Subtítulo</label>
                                    <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                                        {currentSlide.subtitleColor || currentSlide.textColor || '#ffffff'}
                                    </span>
                                </div>
                                <input
                                    type="color"
                                    value={currentSlide.subtitleColor || currentSlide.textColor || '#ffffff'}
                                    onChange={(e) => updateSlide({ subtitleColor: e.target.value })}
                                    className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                    title="Color del Subtítulo"
                                />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <button
                                    onClick={() => updateSlide({ subtitleBold: !currentSlide.subtitleBold })}
                                    className={`p-1.5 rounded transition-all ${currentSlide.subtitleBold ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-200'}`}
                                    title="Negrita"
                                >
                                    <Bold size={14} />
                                </button>
                                <button
                                    onClick={() => updateSlide({ subtitleItalic: !currentSlide.subtitleItalic })}
                                    className={`p-1.5 rounded transition-all ${currentSlide.subtitleItalic ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-200'}`}
                                    title="Cursiva"
                                >
                                    <Italic size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                        <Layout size={14} className="mr-2" /> Transición
                    </h3>
                    <select
                        className="w-full p-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                        value={currentSlide.transition}
                        onChange={(e) => updateSlide({ transition: e.target.value })}
                    >
                        <option value="none">Sin animación</option>
                        <optgroup label="Básicos">
                            <option value="fade">Desvanecer</option>
                            <option value="slide-h">Deslizar Lateral</option>
                            <option value="slide-v">Deslizar Vertical</option>
                            <option value="dissolve-blur">Disolución Blur</option>
                        </optgroup>
                        <optgroup label="3D & Rotación">
                            <option value="cube-h">Cubo 3D (Horizontal)</option>
                            <option value="cube-v">Cubo 3D (Vertical)</option>
                            <option value="flip">Voltear 3D</option>
                            <option value="rotate">Girar</option>
                        </optgroup>
                        <optgroup label="Cinemáticos">
                            <option value="newspaper">Periódico (Spin)</option>
                            <option value="parallax-slide">Parallax (Profundidad)</option>
                            <option value="zoom-rotate">Zoom Giratorio</option>
                            <option value="zoom">Zoom Suave</option>
                            <option value="bounce">Rebotar</option>
                        </optgroup>
                    </select>

                    <div className="mt-4">
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">
                            VELOCIDAD (DURACIÓN): {currentSlide.transitionDuration || 1}s
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.5"
                            value={currentSlide.transitionDuration || 1}
                            onChange={(e) => updateSlide({ transitionDuration: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                    </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 mt-4 transition-colors">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                        <Clock size={14} />
                        Automatización
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer" htmlFor="auto-advance">
                            Avance Automático
                        </label>
                        <input
                            id="auto-advance"
                            type="checkbox"
                            checked={currentSlide.autoAdvance || false}
                            onChange={(e) => updateSlide({ autoAdvance: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    </div>

                    {currentSlide.autoAdvance && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div>
                                <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mb-1 uppercase tracking-tight">
                                    DURACIÓN DE DIAPOSITIVA (segundos)
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="1"
                                        max="600"
                                        className="w-20 p-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                                        value={currentSlide.autoAdvanceDelay || 5}
                                        onChange={(e) => updateSlide({ autoAdvanceDelay: parseInt(e.target.value) || 1 })}
                                    />
                                    <span className="text-xs font-medium text-slate-500">
                                        = {formatTime(currentSlide.autoAdvanceDelay || 5)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {[3, 5, 10, 15, 30, 60].map(time => (
                                    <button
                                        key={time}
                                        onClick={() => updateSlide({ autoAdvanceDelay: time })}
                                        className={`px-2 py-1 text-[10px] rounded border transition-colors ${currentSlide.autoAdvanceDelay === time
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {time >= 60 ? `${time / 60}m` : `${time}s`}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                                    <span>Tiempo total de presentación:</span>
                                    <span className="text-slate-600 dark:text-slate-300 font-bold">{formatTime(calculateTotalPresentationTime(slides))}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 mt-4">
                    <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                        Nota: Las imágenes se mantienen mientras la pestaña esté abierta.
                    </p>
                </div>

                {/* MÚSICA DE FONDO */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 mt-4 transition-colors">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                        <Music size={14} />
                        Música de Fondo
                    </h3>

                    <button
                        onClick={triggerAudioInput}
                        className="w-full py-2 px-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <Music size={16} />
                        {audioFile ? 'Cambiar Música' : 'Cargar Música'}
                    </button>

                    {audioFile && (
                        <>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-xs text-green-600 font-medium">✓ Música cargada</span>
                                <button
                                    onClick={removeAudio}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    title="Quitar música"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="mt-3">
                                <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1 flex items-center gap-1">
                                    <Volume2 size={12} />
                                    VOLUMEN: {Math.round(audioVolume * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={audioVolume}
                                    onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Hidden file inputs */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                />

                {/* AUTOR Y VERSIÓN */}
                <div className="pt-6 pb-2 mt-auto border-t border-slate-100 dark:border-slate-800/50">
                    <p className="text-[9px] text-slate-300 dark:text-slate-600 font-medium text-center uppercase tracking-[0.2em]">
                        Desarrollado por <span className="text-slate-400 dark:text-slate-500">Alejandro Bajuk</span>
                    </p>
                    <p className="text-[8px] text-slate-300 dark:text-slate-700 font-bold text-center mt-1">
                        VERSION v1.0.1
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default PropertiesPanel;
