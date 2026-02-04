import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Sparkles, Monitor, Cpu } from 'lucide-react';

const FEATURE_DATA = [
    {
        title: "Gestión de Proyecto Pro",
        description: "Controla cada detalle de tu presentación: guarda, carga y exporta tus proyectos con un sistema de archivos inteligente y seguro.",
        image: `${import.meta.env.BASE_URL}images/GestiondeProyectos.png`,
        icon: <Star className="text-amber-400" size={24} />
    },
    {
        title: "Lienzo de Alta Precisión",
        description: "Edita textos y elementos con un sistema de coordenadas dinámico que se adapta a cualquier pantalla (Móvil, Tablet o PC).",
        image: `${import.meta.env.BASE_URL}images/Presentacion.png`,
        icon: <Monitor className="text-blue-400" size={24} />
    },
    {
        title: "Personalización Infinita",
        description: "Configura tu forma de grabar antes. Consejo: La calidad de la grabacion sera de acuerdo con tu GPU que poseas, si tu pc no posee buen GPU recomendacion es usar 720p, 30FPS",
        image: `${import.meta.env.BASE_URL}images/ConfiguracionGrabar.png`,
        icon: <Sparkles className="text-purple-400" size={24} />
    },
    {
        title: "Grabación MP4 Directa",
        description: "Captura tu presentación en video de alta calidad con un solo clic. Ideal para tutoriales, demos y redes sociales.",
        image: `${import.meta.env.BASE_URL}images/GrabaPresentacion.png`,
        icon: <Cpu className="text-emerald-400" size={24} />
    },
    {
        title: "Exportación Multiplataforma",
        description: "Lleva tus ideas a cualquier lugar: exporta a HTML interactivo o PowerPoint sin perder la fidelidad del diseño original.",
        image: `${import.meta.env.BASE_URL}images/ExportarProyecto.png`,
        icon: <CheckCircle2 className="text-indigo-400" size={24} />
    }
];

const FeatureShowcase = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl lg:text-5xl font-black mb-4"
                    >
                        Domina la <span className="text-blue-500">API</span> de Presentación
                    </motion.h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Descubre cómo nuestra herramienta transforma la forma en que creas contenido visual profesional. Potencia tu flujo de trabajo con tecnología de vanguardia.
                    </p>
                </div>

                <div className="space-y-32">
                    {FEATURE_DATA.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
                        >
                            {/* Texto */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-6 font-bold shadow-xl">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl lg:text-4xl font-bold mb-6 text-white leading-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-lg text-slate-400 leading-relaxed mb-8">
                                    {feature.description}
                                </p>
                                <div className="space-y-4">
                                    {["Optimización automática", "Diseño responsivo nativo", "Seguridad de datos"].map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 justify-center lg:justify-start">
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                            <span className="text-sm font-medium text-slate-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Imagen con efectos */}
                            <div className="flex-1 relative group w-full max-w-2xl">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                </div>

                                {/* Decoración flotante */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-6 -right-6 lg:-top-10 lg:-right-10 w-24 h-24 lg:w-32 lg:h-32 bg-blue-600/20 backdrop-blur-3xl rounded-full border border-white/10 flex items-center justify-center p-4 lg:p-6"
                                >
                                    <div className="w-full h-full rounded-full bg-blue-500/20 animate-pulse"></div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Decoración de fondo */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
        </section>
    );
};

export default FeatureShowcase;
