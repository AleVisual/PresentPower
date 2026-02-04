import React, { useState } from 'react';
import { Save, Download, FileType, ChevronDown, MonitorPlay } from 'lucide-react';
import PptxGenJS from 'pptxgenjs';

const ExportMenu = ({ slides, audioFile, showAlert, showText = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    // --- 2. Exportar a HTML (Web Player Profesional) ---
    const exportToHtml = async () => {
        // Preparar recursos
        let base64Icon = null;

        try {
            base64Icon = await fetch('/assets/icono.ico').then(r => r.blob()).then(blob => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            });
        } catch (e) {
            console.error("Error al cargar icono para exportación:", e);
        }

        const processedSlides = [];
        for (const slide of slides) {
            let base64Img = null;
            if (slide.customImage) {
                try {
                    base64Img = await blobToBase64(slide.customImage);
                } catch (e) {
                    console.error("Error al procesar imagen para HTML:", e);
                }
            }
            processedSlides.push({ ...slide, customImage: base64Img });
        }

        let base64Audio = null;
        if (audioFile) {
            try {
                base64Audio = await blobToBase64(audioFile);
            } catch (e) {
                console.error("Error al procesar audio para HTML:", e);
            }
        }

        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentación Profesional</title>
    ${base64Icon ? `<link rel="icon" type="image/x-icon" href="${base64Icon}">` : ''}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=Outfit:wght@400;700;800&family=Playfair+Display:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; overflow: hidden; background: #000; color: white; margin: 0; }
        .slide-container { position: relative; height: 100vh; width: 100vw; overflow: hidden; perspective: 1500px; }
        .slide { 
            position: absolute; inset: 0; display: none; height: 100%; width: 100%; 
            flex-direction: column; align-items: center; justify-content: center; 
            padding: 4rem; text-align: center; background-size: cover; background-position: center;
            backface-visibility: hidden;
        }
        .slide.active { display: flex; }
        
        /* --- BIBLIOTECA RADICAL DE ANIMACIONES --- */
        [class*="animate-"] { opacity: 0; animation-duration: var(--duration, 0.8s); animation-delay: var(--delay, 0s); animation-fill-mode: forwards; }
        
        .animate-fade-up { animation-name: fadeUp; }
        .animate-pop { animation-name: pop; animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-blur { animation-name: blurIn; }
        .animate-bounce { animation-name: bounceText; animation-iteration-count: infinite; opacity: 1; }
        .animate-glitch { animation-name: glitch; animation-iteration-count: infinite; opacity: 1; }
        .animate-swing { animation-name: swing; transform-origin: top center; }
        .animate-flicker { animation-name: flicker; }
        .animate-scale-in { animation-name: scaleIn; }
        .animate-rotate-3d { animation-name: rotate3d; }
        .animate-focus { animation-name: focusIn; }
        .animate-zoom-out { animation-name: zoomOut; }
        .animate-slide-right { animation-name: slideRightIn; }
        .animate-slide-left { animation-name: slideLeftIn; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        @keyframes blurIn { from { opacity: 0; filter: blur(20px); transform: scale(1.1); } to { opacity: 1; filter: blur(0); transform: scale(1); } }
        @keyframes bounceText { 0%, 100% { transform: translateY(-15%); } 50% { transform: translateY(0); } }
        @keyframes glitch { 0% { transform: translate(0); } 20% { transform: translate(-3px, 2px); } 40% { transform: translate(-3px, -2px); } 60% { transform: translate(3px, 2px); } 100% { transform: translate(0); } }
        @keyframes swing { 0% { transform: rotate(-45deg); opacity: 0; } 100% { transform: rotate(0); opacity: 1; } }
        @keyframes flicker { 0%, 19.9%, 22%, 62.9%, 65%, 100% { opacity: 1; } 20%, 21.9%, 63%, 64.9% { opacity: 0; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(2.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes rotate3d { from { opacity: 0; transform: rotateX(90deg); } to { opacity: 1; transform: rotateX(0); } }
        @keyframes focusIn { from { opacity: 0; filter: blur(30px); transform: scale(1.3); } to { opacity: 1; filter: blur(0); transform: scale(1); } }
        @keyframes zoomOut { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideRightIn { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideLeftIn { from { opacity: 0; transform: translateX(150px); } to { opacity: 1; transform: translateX(0); } }

        /* --- TRANSICIONES DE ESCENA --- */
        .transition-fade { animation: sceneFade 0.8s ease-in-out; }
        .transition-zoom { animation: sceneZoom 0.8s ease-in-out; }
        .transition-slide-h { animation: sceneSlideH 0.8s cubic-bezier(0.7, 0, 0.3, 1); }
        .transition-slide-v { animation: sceneSlideV 0.8s cubic-bezier(0.7, 0, 0.3, 1); }
        .transition-rotate { animation: sceneRotate 1s ease-out; }
        .transition-flip { animation: sceneFlip 1s ease-out; }
        .transition-newspaper { animation: sceneNews 1.2s ease-in-out; }
        .transition-cube-h { animation: sceneCube 1s ease-in-out; transform-origin: center right; }

        @keyframes sceneFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sceneZoom { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes sceneSlideH { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes sceneSlideV { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes sceneRotate { from { transform: rotate(-180deg) scale(0); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }
        @keyframes sceneFlip { from { transform: rotateY(90deg); opacity: 0; } to { transform: rotateY(0); opacity: 1; } }
        @keyframes sceneNews { from { transform: scale(0) rotate(1080deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
        @keyframes sceneCube { from { transform: rotateY(90deg) translateX(50%); opacity: 0; } to { transform: rotateY(0) translateX(0); opacity: 1; } }

        /* --- UI MODERNA --- */
        .controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); backdrop-filter: blur(15px); padding: 12px 30px; border-radius: 999px; display: flex; align-items: center; gap: 25px; z-index: 1000; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,1); transition: 0.4s; }
        .controls.hide { opacity: 0; transform: translate(-50%, 50px); pointer-events: none; }
        button { background: transparent; border: none; color: #fff; cursor: pointer; font-size: 0.85rem; font-weight: 800; padding: 10px 20px; border-radius: 12px; transition: 0.3s; text-transform: uppercase; letter-spacing: 0.1em; }
        button:hover { background: rgba(255,255,255,0.15); color: #3b82f6; }
        .progress { position: fixed; top: 0; left: 0; height: 5px; background: linear-gradient(to right, #3b82f6, #8b5cf6); transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1001; }
        .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 1; }
        .content { z-index: 10; width: 100%; max-width: 1100px; padding: 3rem; position: relative; }
        .auto-badge { position: fixed; top: 30px; right: 30px; background: #3b82f6; color: white; padding: 6px 16px; border-radius: 999px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; z-index: 1000; box-shadow: 0 0 20px rgba(59,130,246,0.4); display: none; opacity: 0; transition: opacity 0.3s, transform 0.2s, background 0.2s; cursor: pointer; }
        .auto-badge.visible { display: block; opacity: 1; }
        .auto-badge:hover { background: #2563eb; transform: scale(1.05); }
        .auto-badge:active { transform: scale(0.95); }
    </style>
</head>
<body>
    <div class="progress" id="pBar"></div>
    <div class="slide-container" id="app"></div>
    <div class="auto-badge" id="aBadge" onclick="restart()">Auto Advance</div>
    
    <div class="controls" id="ctrls">
        <button onclick="prev()">Anterior</button>
        <span id="cnt" style="font-size:1rem; font-weight:900; min-width: 80px; text-align: center; color: #64748b;"></span>
        <button onclick="next()">Siguiente</button>
    </div>

    ${base64Audio ? `<audio id="bgm" loop src="${base64Audio}"></audio>` : ''}

    <script>
        const slides = ${JSON.stringify(processedSlides)};
        let cur = 0, started = false, timer = null, uiTimer = null, badgeTimer = null, initialVol = 1;

        function render(idx) {
            if (timer) clearTimeout(timer);
            if (badgeTimer) clearTimeout(badgeTimer);
            
            const s = slides[idx];
            const app = document.getElementById('app');
            const b = document.getElementById('aBadge');
            
            // Lógica de Badge: Solo mostrar al principio si no ha comenzado y es automático
            if (!started && s.autoAdvance && idx === 0) {
                b.style.display = 'block';
                b.innerHTML = 'Auto Advance';
                setTimeout(() => b.classList.add('visible'), 10);
            } else {
                b.classList.remove('visible');
                setTimeout(() => { if (!b.classList.contains('visible')) b.style.display = 'none'; }, 300);
            }

            const bg = s.customImage ? \`background-image: url('\${s.customImage}');\` : '';
            const trans = s.transition && s.transition !== 'none' ? \`transition-\${s.transition}\` : 'transition-fade';
            const dur = (s.textAnimationDuration || 0.8) + 's';
            const del = (s.textAnimationDelay || 0) + 's';
            const anim = s.textAnimation && s.textAnimation !== 'none' ? \`animate-\${s.textAnimation}\` : '';
            
            app.innerHTML = \`
                <div class="slide active \${s.background || 'bg-slate-900'} \${trans} relative overflow-hidden" style="\${bg}">
                    \${s.customImage ? '<div class="overlay"></div>' : ''}
                    <div class="content relative w-full h-full">
                         <h1 class="\${anim} absolute" style="left:\${s.titlePos?.x || 5}%; top:\${s.titlePos?.y || 35}%; width:\${s.titleWidth || 90}%; height:\${s.titleHeight || 12}%; font-size:\${s.titleFontSize || 80}px; color:\${s.titleColor || s.textColor || '#fff'}; font-weight:\${s.titleBold ? '900' : '900'}; font-style:\${s.titleItalic ? 'italic' : 'normal'}; font-family:\${s.fontFamily || 'Outfit'}; text-align:center; display:flex; align-items:center; justify-content:center; overflow:visible; --duration:\${dur}; --delay:\${del};">\${s.content}</h1>
                         <p class="\${anim} absolute" style="left:\${s.subtitlePos?.x || 10}%; top:\${s.subtitlePos?.y || 55}%; width:\${s.subtitleWidth || 80}%; height:\${s.subtitleHeight || 25}%; font-size:\${s.subtitleFontSize || 40}px; color:\${s.subtitleColor || s.textColor || '#fff'}; font-weight:\${s.subtitleBold ? 'bold' : 'normal'}; font-style:\${s.subtitleItalic ? 'italic' : 'normal'}; opacity:0.8; font-family:\${s.fontFamily || 'Inter'}; text-align:center; line-height:1.2; overflow:visible; --duration:\${dur}; --delay:\${parseFloat(del) + 0.5}s;">\${s.subtitle}</p>
                    </div>
                </div>
            \`;
            
            document.getElementById('cnt').innerText = \`\${idx + 1} / \${slides.length}\`;
            document.getElementById('pBar').style.width = \`\${((idx + 1) / slides.length) * 100}%\`;

            const isLast = idx === slides.length - 1;

            // Automatización
            if (s.autoAdvance) {
                if (isLast) {
                    timer = setTimeout(() => {
                        fadeOutMusic();
                        // Mostrar badge al finalizar con texto de "Reiniciar"
                        b.innerHTML = 'Reiniciar Presentación';
                        b.style.display = 'block';
                        setTimeout(() => b.classList.add('visible'), 10);
                    }, (s.autoAdvanceDelay || 5) * 1000);
                } else {
                    timer = setTimeout(() => { if (cur < slides.length - 1) next(); }, (s.autoAdvanceDelay || 5) * 1000);
                }
            }

            const m = document.getElementById('bgm');
            if (!started && m) {
                initialVol = m.volume;
                const start = () => { 
                    m.play().catch(e => console.log(e)); 
                    started = true; 
                    // Ocultar badge al iniciar
                    b.classList.remove('visible');
                    setTimeout(() => b.style.display = 'none', 300);
                    document.removeEventListener('click', start); 
                };
                document.addEventListener('click', start);
            }
        }

        function restart() {
            cur = 0;
            const m = document.getElementById('bgm');
            if (m) {
                m.volume = initialVol;
                m.currentTime = 0;
                m.play().catch(e => console.log(e));
            }
            started = true; // Mantener estado de "empezado" para que no pida clic de nuevo necesariamente
            render(0);
        }

        function fadeOutMusic() {
            const m = document.getElementById('bgm');
            if (!m) return;
            let vol = m.volume;
            const interval = setInterval(() => {
                if (vol > 0.05) {
                    vol -= 0.05;
                    m.volume = vol;
                } else {
                    m.pause();
                    clearInterval(interval);
                }
            }, 100);
        }

        function next() { if (cur < slides.length - 1) { cur++; render(cur); } }
        function prev() { if (cur > 0) { cur--; render(cur); } }

        function showUI() {
            document.body.style.cursor = 'default';
            document.getElementById('ctrls').classList.remove('hide');
            clearTimeout(uiTimer);
            uiTimer = setTimeout(() => {
                document.body.style.cursor = 'none';
                document.getElementById('ctrls').classList.add('hide');
            }, 3000);
        }

        document.addEventListener('mousemove', showUI);
        document.addEventListener('click', showUI);
        document.addEventListener('keydown', (e) => {
            showUI();
            if(e.key === 'ArrowRight' || e.key === ' ') next();
            if(e.key === 'ArrowLeft') prev();
        });

        render(0);
        showUI();
    </script>
</body>
</html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Presentacion_Final_${Date.now()}.html`;
        a.click();
        setIsOpen(false);
        showAlert("¡Exportación Lista!", "El reproductor HTML se ha descargado correctamente.", "success");
    };

    // --- Helper: Convertir Blob a Base64 ---
    const blobToBase64 = (blobUrl) => {
        return new Promise((resolve, reject) => {
            fetch(blobUrl)
                .then(r => r.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                })
                .catch(reject);
        });
    };

    // --- 3. Exportar a PowerPoint (PPTX) ---
    const exportToPptx = async () => {
        const pptx = new PptxGenJS();

        for (const slide of slides) {
            const pptSlide = pptx.addSlide();

            // Mapeo de Fondo
            if (slide.customImage) {
                try {
                    const base64Img = await blobToBase64(slide.customImage);
                    pptSlide.background = { data: base64Img };
                } catch (error) {
                    console.error("Error al procesar imagen para PPTX:", error);
                    pptSlide.background = { color: "000000" }; // Fallback oscuro
                }
            } else {
                // Mapeo de colores de Tailwind a Hex
                const bgMap = {
                    'bg-white': 'FFFFFF',
                    'bg-slate-100': 'F1F5F9',
                    'bg-slate-900': '0F172A',
                    'bg-red-500': 'EF4444',
                    'bg-blue-500': '3B82F6',
                    'bg-emerald-500': '10B981',
                    'bg-amber-500': 'F59E0B',
                    'bg-indigo-500': '6366F1',
                    'from-blue-600': '2563EB',
                    'from-purple-500': 'A855F7',
                    'from-gray-700': '374151',
                    'from-emerald-400': '34D399'
                };

                let bgColor = 'FFFFFF';
                Object.keys(bgMap).forEach(key => {
                    if (slide.background.includes(key)) bgColor = bgMap[key];
                });

                pptSlide.background = { color: bgColor };
            }

            // Título
            pptSlide.addText(slide.content, {
                x: 0.5, y: 1.0, w: '90%', h: 1.5,
                fontSize: slide.titleFontSize || 80,
                color: (slide.titleColor || slide.textColor || '#ffffff').replace('#', ''),
                bold: slide.titleBold || true, // Título siempre algo bold en PPTX por defecto
                italic: slide.titleItalic || false,
                align: 'center',
                fontFace: (slide.fontFamily || 'Arial').split(',')[0].replace(/"/g, '')
            });

            // Subtítulo
            pptSlide.addText(slide.subtitle, {
                x: 1, y: 3.5, w: '80%', h: 2,
                fontSize: slide.subtitleFontSize || 40,
                color: (slide.subtitleColor || slide.textColor || '#ffffff').replace('#', ''),
                bold: slide.subtitleBold || false,
                italic: slide.subtitleItalic || false,
                align: 'center',
                fontFace: (slide.fontFamily || 'Arial').split(',')[0].replace(/"/g, '')
            });
        }

        pptx.writeFile({ fileName: `presentacion_${Date.now()}.pptx` });
        setIsOpen(false);
        showAlert("¡PowerPoint Listo!", "Tu presentación se ha convertido a .pptx con éxito.", "success");
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 transition-all"
            >
                <Save size={18} />
                <span className={showText ? 'inline' : 'hidden sm:inline'}>Exportar</span>
                <ChevronDown size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Opciones de Exportación</span>
                    </div>

                    <button onClick={exportToHtml} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-3 transition-colors text-slate-700 dark:text-slate-300">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <MonitorPlay size={18} />
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Exportar a Web</span>
                            <span className="block text-xs text-slate-400 dark:text-slate-500">Reproductor HTML portable</span>
                        </div>
                    </button>

                    <button onClick={exportToPptx} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-3 transition-colors text-slate-700 dark:text-slate-300">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                            <FileType size={18} />
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">PowerPoint</span>
                            <span className="block text-xs text-slate-400 dark:text-slate-500">Archivo .pptx compatible</span>
                        </div>
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
    );
};

export default ExportMenu;
