/**
 * Lógica para la grabación de la presentación a video (MP4/WebM)
 * Proporciona una interfaz simple para capturar pantalla y audio.
 */

export class PresentationRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.stream = null;
    }

    /**
     * Inicia la grabación capturando la pantalla (pestaña) y el audio opcional
     * @param {Object} options - Opciones de grabación (fps, quality)
     * @returns {Promise<boolean>} - True si la grabación se inició con éxito
     */
    async start(options = { fps: 30, videoBitsPerSecond: 4000000 }) {
        try {
            // Solicitar captura de pantalla optimizada para la pestaña
            this.stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: { ideal: options.fps },
                    cursor: 'never',
                    displaySurface: 'browser',
                    // Sugerir la pestaña actual y habilitar cambio de superficie
                },
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    suppressLocalAudioPlayback: false
                },
                // Parámetros de nivel superior para Chrome/Edge
                selfBrowserSurface: 'include',
                monitorTypeSurfaces: 'exclude', // EVITAR que graben "Toda la pantalla"
                surfaceSwitching: 'include',
                systemAudio: 'include'
            });

            this.recordedChunks = [];

            // Intentar usar H.264 si está disponible (más compatible con MP4), si no WebM
            const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=h264')
                ? 'video/mp4;codecs=h264'
                : 'video/webm;codecs=vp9,opus';

            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType,
                videoBitsPerSecond: options.videoBitsPerSecond
            });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.start(1000); // Guardar datos cada segundo
            return true;
        } catch (error) {
            console.error('Error al iniciar la grabación:', error);
            return false;
        }
    }

    /**
     * Detiene la grabación y devuelve el archivo resultante
     * @returns {Promise<Blob|null>} - El blob del video grabado
     */
    async stop() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
                resolve(null);
                return;
            }

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, {
                    type: this.mediaRecorder.mimeType
                });

                // Limpiar recursos
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }

                resolve(blob);
            };

            this.mediaRecorder.stop();
        });
    }

    /**
     * Utilidad para descargar el blob como un archivo
     * @param {Blob} blob - El video
     * @param {string} filename - Nombre del archivo
     */
    download(blob, filename = 'presentacion.mp4') {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = filename;
        a.click();

        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);
    }
}

export const recorderInstance = new PresentationRecorder();
