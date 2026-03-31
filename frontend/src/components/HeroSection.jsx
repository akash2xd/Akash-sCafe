import imgSrc from "../assets/Front1_ai.png";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: '100svh' }}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={imgSrc}
          className="w-full h-full object-cover object-center scale-110"
          alt="Background"
        />
      </div>

      {/* Gradient Overlay — blends into warm page background */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0d0b08]/20 via-[#0d0b08]/40 to-[#0d0b08]"></div>

      {/* Warm tint overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-tr from-amber-900/10 via-transparent to-orange-900/10"></div>

      {/* Text Content Layer */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-white tracking-wider drop-shadow-2xl"
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontWeight: 400,
            fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
            textShadow: "0 0 40px rgba(212, 165, 116, 0.15), 0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          AKASH's Cafe
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#d4a574] to-transparent mt-4 mb-4"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[#d4a574]/70 uppercase tracking-[0.35em] font-heading font-medium"
          style={{
            fontSize: "clamp(0.85rem, 2.5vw, 1.4rem)",
          }}
        >
          India
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 z-20 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-[#d4a574]/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;