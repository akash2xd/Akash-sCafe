import React, { useState, useEffect } from "react";
import { CONTACT } from "../constants";
import { motion } from "framer-motion";
import Loader from "./Loader";

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


const Contact = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <motion.div
      id="contact"
      initial="hidden"
      animate="visible"
      className="container mx-auto min-h-screen pt-32 pb-20 px-4"
    >
      <motion.h2
        variants={fadeInUp}
        className="mb-12 text-center text-4xl lg:text-5xl font-extrabold text-[#f0e6d8] font-heading"
      >
        Get In Touch
      </motion.h2>

      <motion.div
        variants={containerVariants}
        className="max-w-2xl mx-auto text-[#b8a898]"
      >
        {CONTACT.map((detail) => (
          <motion.div
            key={detail.key}
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="my-6 glass-card p-6 text-center text-xl tracking-tighter lg:text-2xl hover:border-[#d4a574]/20 transition-colors"
          >
            {detail.value}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Contact;