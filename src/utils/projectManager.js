/**
 * Clase para gestionar la exportación e importación de proyectos (.ppproj) 
 * que son básicamente archivos ZIP conteniendo el JSON y los assets binarios.
 * Se asume que JSZip está disponible globalmente a través de un script en index.html
 */
export class ProjectManager {
    /**
     * Empaqueta el proyecto en un archivo ZIP
     * @param {Array} slides - Diapositivas
     * @param {string} audioFileUrl - URL (Blob) del audio actual
     * @returns {Promise<Blob>} - El archivo ZIP resultante
     */
    async exportProject(slides, audioFileUrl) {
        // @ts-ignore
        const JSZip = window.JSZip;
        if (!JSZip) {
            throw new Error("Librería de compresión no disponible");
        }

        const zip = new JSZip();
        const assetsFolder = zip.folder("assets");

        // 1. Procesar imágenes de diapositivas
        const processedSlides = [];
        for (const slide of slides) {
            const newSlide = { ...slide };

            if (slide.customImage && slide.customImage.startsWith('blob:')) {
                try {
                    const response = await fetch(slide.customImage);
                    const blob = await response.blob();
                    const fileName = `img_${slide.id}_${Date.now()}.bin`;
                    assetsFolder.file(fileName, blob);
                    newSlide.customImage = `assets/${fileName}`; // Referencia interna
                } catch (e) {
                    console.error("Error al empaquetar imagen:", e);
                }
            }
            processedSlides.push(newSlide);
        }

        // 2. Procesar audio
        let audioConfig = null;
        if (audioFileUrl && audioFileUrl.startsWith('blob:')) {
            try {
                const response = await fetch(audioFileUrl);
                const blob = await response.blob();
                const fileName = `music_${Date.now()}.bin`;
                assetsFolder.file(fileName, blob);
                audioConfig = { path: `assets/${fileName}`, name: "music.mp3" };
            } catch (e) {
                console.error("Error al empaquetar audio:", e);
            }
        }

        // 3. Crear el JSON del proyecto
        const projectData = {
            version: "1.0.2",
            slides: processedSlides,
            audio: audioConfig,
            timestamp: Date.now()
        };

        zip.file("project.json", JSON.stringify(projectData, null, 2));

        return await zip.generateAsync({ type: "blob" });
    }

    /**
     * Guarda el proyecto directamente en un handle de archivo (sobrescritura)
     */
    async saveToHandle(handle, slides, audioFileUrl) {
        const blob = await this.exportProject(slides, audioFileUrl);
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
    }

    /**
     * Abre el selector de guardar archivo y devuelve el handle
     */
    async getNewFileHandle() {
        if (!window.showSaveFilePicker) return null;
        return await window.showSaveFilePicker({
            suggestedName: `proyecto_${Date.now()}.ppproj`,
            types: [{
                description: 'Presentación Power Project',
                accept: { 'application/octet-stream': ['.ppproj'] },
            }],
        });
    }

    /**
     * Abre el selector de abrir archivo y devuelve el handle
     */
    async getOpenFileHandle() {
        if (!window.showOpenFilePicker) return null;
        const [handle] = await window.showOpenFilePicker({
            types: [{
                description: 'Presentación Power Project',
                accept: { 'application/octet-stream': ['.ppproj'] },
            }],
            multiple: false
        });
        return handle;
    }

    /**
     * Desempaqueta un archivo de proyecto y restaura los Blobs
     * @param {File|Blob} zipFile - Archivo .ppproj
     * @returns {Promise<Object>} - Datos cargados { slides, audioUrl }
     */
    async importProject(zipFile) {
        // @ts-ignore
        const JSZip = window.JSZip;
        if (!JSZip) {
            throw new Error("Librería de compresión no disponible");
        }

        const zip = await JSZip.loadAsync(zipFile);

        // 1. Cargar JSON
        const projectJsonStr = await zip.file("project.json").async("string");
        const projectData = JSON.parse(projectJsonStr);

        // 2. Restaurar Imágenes
        const restoredSlides = [];
        for (const slide of projectData.slides) {
            const newSlide = { ...slide };
            if (slide.customImage && slide.customImage.startsWith('assets/')) {
                try {
                    const file = zip.file(slide.customImage);
                    if (file) {
                        const blob = await file.async("blob");
                        newSlide.customImage = URL.createObjectURL(blob);
                    }
                } catch (e) {
                    console.error("Error al restaurar imagen:", e);
                }
            }
            restoredSlides.push(newSlide);
        }

        // 3. Restaurar Audio
        let restoredAudioUrl = null;
        if (projectData.audio && projectData.audio.path) {
            try {
                const file = zip.file(projectData.audio.path);
                if (file) {
                    const blob = await file.async("blob");
                    restoredAudioUrl = URL.createObjectURL(blob);
                }
            } catch (e) {
                console.error("Error al restaurar audio:", e);
            }
        }

        return {
            slides: restoredSlides,
            audioUrl: restoredAudioUrl
        };
    }

    /**
     * Utilidad para descargar el proyecto
     */
    download(blob, filename = 'mi_proyecto.ppproj') {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
}

export const projectManager = new ProjectManager();
