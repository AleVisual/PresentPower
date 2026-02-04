import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Move } from 'lucide-react';

/**
 * DraggableText Pro Ultra - Edición Estabilidad Total y Click-Through
 */
const DraggableText = ({
    position = { x: 100, y: 350 },
    width = 1720,
    height = 150,
    onUpdate,
    children,
    isPreview = false,
    className = ""
}) => {
    const dragControls = useDragControls();
    const dragOffset = React.useRef({ x: 0, y: 0 });
    const initialRect = React.useRef(null);

    const handleDragStart = (event, info) => {
        if (isPreview) return;
        const parent = event.target.closest('.slide-canvas-container');
        const element = event.target.closest('.group');
        if (!parent || !element) return;

        const parentRect = parent.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const canvasScale = parentRect.width / 1920;

        dragOffset.current = {
            x: (info.point.x - elementRect.left) / canvasScale,
            y: (info.point.y - elementRect.top) / canvasScale
        };
    };

    const handleDrag = (event, info) => {
        if (isPreview || !onUpdate) return;
        const parent = event.target.closest('.slide-canvas-container');
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        const canvasScale = rect.width / 1920;

        const x = Math.round((info.point.x - rect.left) / canvasScale - dragOffset.current.x);
        const y = Math.round((info.point.y - rect.top) / canvasScale - dragOffset.current.y);

        onUpdate({ x, y, width, height });
    };

    const handleResizeStart = (event) => {
        if (isPreview) return;
        event.stopPropagation();
        initialRect.current = {
            x: position.x,
            y: position.y,
            width: width,
            height: height
        };
    };

    const handleResizing = (event, info, direction) => {
        if (isPreview || !onUpdate || !initialRect.current) return;
        const parent = event.target.closest('.slide-canvas-container');
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        const canvasScale = rect.width / 1920;

        const mouseX = (info.point.x - rect.left) / canvasScale;
        const mouseY = (info.point.y - rect.top) / canvasScale;

        let newX = initialRect.current.x;
        let newY = initialRect.current.y;
        let newWidth = initialRect.current.width;
        let newHeight = initialRect.current.height;

        const right = initialRect.current.x + initialRect.current.width;
        const bottom = initialRect.current.y + initialRect.current.height;

        if (direction.includes('left')) {
            newX = Math.min(mouseX, right - 40);
            newWidth = right - newX;
        } else if (direction.includes('right')) {
            newWidth = Math.max(40, mouseX - initialRect.current.x);
        }

        if (direction.includes('top')) {
            newY = Math.min(mouseY, bottom - 40);
            newHeight = bottom - newY;
        } else if (direction.includes('bottom')) {
            newHeight = Math.max(40, mouseY - initialRect.current.y);
        }

        onUpdate({
            x: Math.round(newX),
            y: Math.round(newY),
            width: Math.round(newWidth),
            height: Math.round(newHeight)
        });
    };

    const handleStyle = {
        position: 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: '#3b82f6',
        border: '2px solid white',
        borderRadius: '50%',
        zIndex: 200,
        pointerEvents: 'auto',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
    };

    return (
        <motion.div
            drag={!isPreview}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${width}px`,
                height: `${height}px`,
                touchAction: 'none',
                zIndex: isPreview ? 10 : 20,
            }}
            className={`group ${className}`}
        >
            {!isPreview && (
                <>
                    {/* Borde reactivo que NO bloquea el interior */}
                    <div
                        className="absolute inset-0 border-2 border-blue-400/30 group-hover:border-blue-400 group-hover:opacity-100 rounded cursor-default z-0 pointer-events-none transition-all"
                    ></div>

                    {/* Botón de Mover - Única área de arrastre manual */}
                    <div
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            dragControls.start(e);
                        }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-1.5 opacity-0 group-hover:opacity-100 cursor-move transition-all active:scale-95 z-[160] text-xs font-black shadow-xl"
                    >
                        <Move size={14} className="mr-2" /> MOVER ELEMENTO
                    </div>

                    {/* MANEJADORES DE PRECISIÓN */}
                    <motion.div style={{ ...handleStyle, top: '-5px', left: '-5px', cursor: 'nwse-resize' }} drag dragMomentum={false} onDragStart={handleResizeStart} onDrag={(e, i) => handleResizing(e, i, 'top-left')} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <motion.div style={{ ...handleStyle, top: '-5px', right: '-5px', cursor: 'nesw-resize' }} drag dragMomentum={false} onDragStart={handleResizeStart} onDrag={(e, i) => handleResizing(e, i, 'top-right')} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <motion.div style={{ ...handleStyle, bottom: '-5px', left: '-5px', cursor: 'nesw-resize' }} drag dragMomentum={false} onDragStart={handleResizeStart} onDrag={(e, i) => handleResizing(e, i, 'bottom-left')} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <motion.div style={{ ...handleStyle, bottom: '-5px', right: '-5px', cursor: 'nwse-resize' }} drag dragMomentum={false} onDragStart={handleResizeStart} onDrag={(e, i) => handleResizing(e, i, 'bottom-right')} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    <motion.div style={{ ...handleStyle, top: 'calc(50% - 5px)', left: '-5px', cursor: 'ew-resize' }} drag="x" dragMomentum={false} onDragStart={handleResizeStart} onDrag={(e, i) => handleResizing(e, i, 'left')} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <motion.div style={{ ...handleStyle, top: 'calc(50% - 5px)', right: '-5px', cursor: 'ew-resize' }} drag="x" dragMomentum={false} onDragStart={handleResizeStart} onDrag={(e, i) => handleResizing(e, i, 'right')} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <motion.div style={{ ...handleStyle, left: 'calc(50% - 5px)', top: '-5px', cursor: 'ns-resize' }} drag="y" dragMomentum={false} onDragStart={handleResizeStart} onDrag={(e, i) => handleResizing(e, i, 'top')} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <motion.div style={{ ...handleStyle, left: 'calc(50% - 5px)', bottom: '-5px', cursor: 'ns-resize' }} drag="y" dragMomentum={false} onDragStart={handleResizeStart} onDrag={(e, i) => handleResizing(e, i, 'bottom')} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </>
            )}

            {/* Contenedor de contenido - Asegurar que reciba todos los eventos */}
            <div className="relative w-full h-full z-10 pointer-events-auto">
                {children}
            </div>
        </motion.div>
    );
};

export default DraggableText;
