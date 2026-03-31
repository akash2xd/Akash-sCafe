import React from "react";
import about from "../assets/about.jpeg";
import { ABOUT } from "../constants";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section
      id="about"
      className="container mx-auto mb-8 px-4 lg:px-0 scroll-mt-24"
    >
      {/* Section Title Animation */}
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mb-8 text-center text-3xl tracking-tighter lg:text-4xl font-heading font-bold text-[#f0e6d8]"
      >
        About Us
      </motion.h2>

      <div className="flex flex-wrap items-center">
        {/* Image with Smooth Animation */}
        <motion.div
          initial={{ opacity: 0, x: -100, rotate: -5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full p-4 lg:w-1/2"
        >
          <div className="relative group">
            <img
              src={about}
              className="rounded-3xl shadow-lg lg:rotate-3 transition-transform duration-500 group-hover:rotate-0"
              alt="About Us"
            />
            {/* Subtle glow ring on hover */}
            <div className="absolute inset-0 rounded-3xl lg:rotate-3 group-hover:rotate-0 transition-all duration-500 ring-1 ring-[#d4a574]/0 group-hover:ring-[#d4a574]/20 group-hover:shadow-xl group-hover:shadow-[#d4a574]/5" />
          </div>
        </motion.div>

        {/* Text Section with Staggered Animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, x: 100 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
            },
          }}
          className="w-full px-2 lg:w-1/2"
        >
          {/* Animated Header */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="text-4xl tracking-tighter lg:text-6xl font-heading font-bold text-[#f0e6d8]"
          >
            {ABOUT.header}
          </motion.h2>

          {/* Animated Divider — warm gold gradient */}
          <motion.div
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.4 } },
            }}
            className="mb-8 mt-2 h-1.5 w-36 origin-left rounded-full bg-gradient-to-r from-[#d4a574] to-[#c08552] lg:rotate-3"
          ></motion.div>

          {/* Animated Paragraph */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="m-8 text-2xl leading-relaxed tracking-tight text-[#b8a898]"
          >
            {ABOUT.content}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;