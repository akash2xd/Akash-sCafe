// src/components/Footer.jsx
import React from "react";
import { SOCIAL_MEDIA_LINKS } from "../constants";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const Footer = () => {
  const complianceLinks = [
    { to: "/contact", label: "Contact Us" },
    { to: "/terms", label: "Terms & Conditions" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/refund", label: "Cancellation & Refund Policy" },
    { to: "/delivery", label: "Shipping & Delivery Policy" },
  ];

  return (
    <motion.div
      className="mb-8 mt-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      {/* Gradient Divider */}
      <div className="max-w-4xl mx-auto mb-12 h-px bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent" />

      {/* Social Media Icons */}
      <motion.div
        variants={staggerContainer}
        className="flex items-center justify-center gap-8 mb-8"
      >
        {SOCIAL_MEDIA_LINKS.map((link, index) => (
          <motion.a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeInUp}
            whileHover={{ scale: 1.2, color: "#d4a574" }}
            transition={{ duration: 0.25 }}
            className="text-[#8a7d72] hover:text-[#d4a574] transition-colors"
          >
            {link.icon}
          </motion.a>
        ))}
      </motion.div>

      {/* Primary Footer Navigation Links */}
      <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-sm tracking-widest uppercase">
        <Link to="/dishes" className="text-[#8a7d72] hover:text-[#d4a574] transition-colors">Menu</Link>
        <span className="text-[#2e261d]">|</span>
        <Link to="/ratings" className="text-[#8a7d72] hover:text-[#d4a574] transition-colors">Rate Us</Link>
        <span className="text-[#2e261d]">|</span>
        <Link to="/gallery" className="text-[#8a7d72] hover:text-[#d4a574] transition-colors">Gallery</Link>
      </motion.div>

      {/* Compliance Links */}
      <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8 text-xs sm:text-sm tracking-wide">
        {complianceLinks.map((link, index) => (
          <React.Fragment key={link.to}>
            <Link to={link.to} className="text-[#8a7d72] hover:text-[#d4a574]/80 transition-colors">
              {link.label}
            </Link>
            {index < complianceLinks.length - 1 && <span className="text-[#231e17]">|</span>}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Copyright Text */}
      <motion.p
        variants={fadeInUp}
        className="text-center tracking-tighter text-[#8a7d72]"
      >
        &copy; AKASH's Cafe. All rights reserved.
      </motion.p>
    </motion.div>
  );
};

export default Footer;