import React from "react";
import { CUSINES } from "../constants";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.15 },
  },
};

const Expertise = () => {
  return (
    <motion.section
      id="expertise"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="container mx-auto px-4 scroll-mt-24"
    >
      {/* Section Title */}
      <motion.h2
        variants={fadeInUp}
        className="my-8 text-center text-3xl tracking-tighter lg:text-4xl font-heading font-bold text-[#f0e6d8]"
      >
        Our Expertise
      </motion.h2>

      {/* Animated List of Cuisines */}
      <motion.div variants={containerVariants}>
        {CUSINES.map((cusine, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="flex items-center py-8 group"
          >
            {/* Gradient divider between items */}
            {index > 0 && (
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a574]/15 to-transparent" />
            )}

            {/* Image Animation */}
            <motion.div
              initial={{ rotate: -5, scale: 0.9 }}
              whileInView={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-1/3 flex-shrink-0"
            >
              <motion.img
                src={cusine.image}
                alt={cusine.title}
                className="w-full h-64 object-cover rounded-3xl shadow-lg ring-1 ring-[#d4a574]/5 group-hover:ring-[#d4a574]/20 transition-all duration-500"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.25 }}
              />
            </motion.div>

            {/* Text Section */}
            <motion.div className="pl-8">
              <motion.h3
                variants={fadeInUp}
                className="text-2xl uppercase tracking-tighter font-heading font-bold gradient-text"
              >
                {cusine.title}
              </motion.h3>
              <motion.p
                variants={fadeInUp}
                className="mt-4 text-lg tracking-tighter text-[#b8a898]"
              >
                {cusine.description}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom gradient line */}
      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#d4a574]/15 to-transparent" />
    </motion.section>
  );
};

export default Expertise;