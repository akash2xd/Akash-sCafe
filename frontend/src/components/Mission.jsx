import React from 'react';
import missionIMG from "../assets/mission_aesthetic.png";
import { MISSION } from '../constants';
import { motion } from 'framer-motion';

const Mission = () => {
    return (
        <section
            id='mission'
            className='scroll-mt-24 py-20 relative'
        >
            <div className='container mx-auto text-center px-4 lg:px-0'>
                {/* Animated Section Title */}
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className='mb-12 text-3xl lg:text-5xl font-heading font-bold text-[#f0e6d8]'
                >
                    Our Mission
                </motion.h2>

                <div className='relative flex items-center justify-center max-w-5xl mx-auto'>

                    {/* Animated Image Wrapper */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        viewport={{ once: true }}
                        className='relative w-full rounded-[2rem] overflow-hidden group shadow-2xl shadow-[#d4a574]/10'
                    >

                        {/* High-Quality Image instead of Video */}
                        <img
                            src={missionIMG}
                            alt="Our Mission"
                            className='w-full h-[500px] lg:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105'
                        />

                        {/* Cinematic Overlay Gradients */}
                        <div className='absolute inset-0 bg-gradient-to-t from-[#0d0b08]/90 via-[#0d0b08]/40 to-transparent pointer-events-none'></div>
                        <div className='absolute inset-0 bg-[#d4a574]/10 mix-blend-overlay pointer-events-none'></div>

                        {/* Text Content Overlay */}
                        <div className='absolute inset-0 flex items-center justify-center p-6'>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className='bg-[#1a1714]/60 backdrop-blur-md border border-[#d4a574]/20 rounded-3xl p-8 lg:p-12 max-w-2xl transform transition-all group-hover:border-[#d4a574]/40 hover:shadow-[0_0_30px_rgba(212,165,116,0.15)]'
                            >
                                <p className='text-xl lg:text-2xl leading-relaxed tracking-wide text-white/95 font-serif italic'>
                                    "{MISSION}"
                                </p>
                                {/* Decorative divider line */}
                                <div className='mt-8 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#d4a574] to-transparent opacity-60'></div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Mission;