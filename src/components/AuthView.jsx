import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, Sparkles, Layers, Zap, LogIn } from 'lucide-react';
import FeatureShowcase from './FeatureShowcase';

const AuthView = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Efecto de fondo animado (estrellas/partículas suaves)
    const [particles, setParticles] = useState([]);
    useEffect(() => {
        const p = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            duration: Math.random() * 20 + 10
        }));
        setParticles(p);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulando delay para efecto Premium
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('pp_users') || '[]');

            if (isLogin) {
                // Lógica de Login
                const user = users.find(u => u.username === formData.username && u.password === formData.password);
                if (user) {
                    localStorage.setItem('pp_session', JSON.stringify(user));
                    onLogin(user);
                } else {
                    setError('Usuario o contraseña incorrectos');
                    setLoading(false);
                }
            } else {
                // Lógica de Registro
                if (users.find(u => u.username === formData.username)) {
                    setError('El nombre de usuario ya existe');
                    setLoading(false);
                } else {
                    const newUser = { ...formData, id: Date.now().toString() };
                    users.push(newUser);
                    localStorage.setItem('pp_users', JSON.stringify(users));
                    localStorage.setItem('pp_session', JSON.stringify(newUser));
                    onLogin(newUser);
                }
            }
        }, 1500);
    };

    return (
        <div className="relative min-h-screen w-full bg-[#0a0a0f] text-white selection:bg-blue-500/30 overflow-y-auto scroll-smooth">
            {/* --- Fondo Dinámico (Fijo) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-indigo-600/10 blur-[120px] rounded-full"></div>

                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0.1, x: `${p.x}vw`, y: `${p.y}vh` }}
                        animate={{
                            opacity: [0.1, 0.4, 0.1],
                            y: [`${p.y}vh`, `${p.y - 10}vh`, `${p.y}vh`]
                        }}
                        transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
                        className="absolute bg-white rounded-full"
                        style={{ width: p.size, height: p.size }}
                    />
                ))}
            </div>

            {/* --- Contenido Principal (Hero) --- */}
            <div className="container relative z-10 mx-auto px-6 py-12 lg:py-0 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* --- Left Side: Landing Content --- */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl text-center lg:text-left"
                >
                    <div className="flex flex-col items-center lg:items-start mb-8">
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            src="/assets/logo.png"
                            alt="Presentación Power Logo"
                            className="w-24 h-24 mb-6 object-contain drop-shadow-2xl"
                        />
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                            <Sparkles size={14} />
                            <span>Revolucionando Presentaciones</span>
                        </div>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                        PRESENTACIÓN <br />
                        <span className="text-blue-500">POWER</span>
                    </h1>

                    <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                        Crea experiencias visuales impacantes con precisión absoluta. El primer editor que combina la potencia del diseño profesional con la simplicidad de la web.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 mb-3 border border-blue-500/20">
                                <Zap size={24} />
                            </div>
                            <h4 className="font-bold text-sm mb-1">Ultra Rápido</h4>
                            <p className="text-xs text-slate-500">Renderizado instantáneo</p>
                        </div>
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 mb-3 border border-purple-500/20">
                                <Layers size={24} />
                            </div>
                            <h4 className="font-bold text-sm mb-1">Capas de Precisión</h4>
                            <p className="text-xs text-slate-500">Control pixel a pixel</p>
                        </div>
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-400 mb-3 border border-emerald-500/20">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="font-bold text-sm mb-1">Acceso Seguro</h4>
                            <p className="text-xs text-slate-500">Tus datos en tu navegador</p>
                        </div>
                    </div>
                </motion.div>

                {/* --- Right Side: Auth Card --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                        {/* Efecto de borde brillante */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">
                                {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratis'}
                            </h3>
                            <p className="text-slate-400 text-sm mb-8">
                                {isLogin ? 'Ingresa tus credenciales para continuar.' : 'Únete a la nueva era de las presentaciones.'}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Nombre de Usuario</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            required
                                            name="username"
                                            type="text"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                            placeholder="UsuarioEjemplo"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            required
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-4 flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>{isLogin ? 'Entrar Ahora' : 'Crear Cuenta Gratis'}</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                <p className="text-slate-500 text-xs">
                                    {isLogin ? "¿No tienes cuenta aún?" : "¿Ya eres usuario?"}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="ml-2 text-blue-400 hover:text-blue-300 font-bold"
                                    >
                                        {isLogin ? 'Regístrate Gratis' : 'Inicia Sesión'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- Nueva Sección: Galería de Características --- */}
            <FeatureShowcase />

            {/* Footer Simple */}
            <footer className="relative z-10 py-12 border-t border-white/5 bg-black/20 text-center">
                <p className="text-slate-500 text-sm">
                    &copy; 2026 Presentación Power - API de Diseño Visual Avanzado. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
};

export default AuthView;
