import React, { memo } from 'react';
import { Plus, Trash2 } from 'lucide-react';

// Memoized Thumbnail Component
const SlideThumbnail = memo(({ slide, index, isActive, onClick, onDelete }) => {
    return (
        <div
            onClick={() => onClick(index)}
            className={`group relative cursor-pointer border-2 rounded-md transition-all overflow-hidden ${isActive ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
        >
            <div
                style={slide.customImage ? { backgroundImage: `url(${slide.customImage})`, backgroundSize: 'cover' } : {}}
                className={`h-24 ${slide.background} flex items-center justify-center p-2 relative`}
            >
                {slide.customImage && <div className="absolute inset-0 bg-black/20"></div>}
                <span className="text-[10px] text-center font-bold text-white relative z-10 truncate max-w-full drop-shadow-md">
                    {slide.content}
                </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-1 text-[10px] flex justify-between items-center transition-colors">
                <span className="text-slate-600 dark:text-slate-400">Diapo {index + 1}</span>
                <button
                    onClick={(e) => onDelete(index, e)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </div>
    );
});

const SlideList = ({ slides, currentSlideIndex, setCurrentSlideIndex, addSlide, deleteSlide }) => {
    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col cursor-default select-none transition-colors duration-300">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <h2 className="font-bold text-slate-600 dark:text-slate-400">Diapositivas</h2>
                <button
                    onClick={addSlide}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {slides.map((slide, index) => (
                    <SlideThumbnail
                        key={slide.id}
                        slide={slide}
                        index={index}
                        isActive={currentSlideIndex === index}
                        onClick={setCurrentSlideIndex}
                        onDelete={deleteSlide}
                    />
                ))}
            </div>
        </aside>
    );
};

export default SlideList;
