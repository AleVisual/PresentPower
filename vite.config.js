import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/PresentPower/',
    plugins: [
        react()
    ],
    build: {
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            mangle: {
                toplevel: true,
            }
        },
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    }
})
