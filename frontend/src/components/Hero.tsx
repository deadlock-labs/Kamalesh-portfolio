'use client';

import { motion } from 'framer-motion';
import { FaLinkedin, FaMedium, FaGithub, FaEnvelope } from 'react-icons/fa';
import { HiChevronDown } from 'react-icons/hi';

interface HeroProps {
  name: string;
  title: string;
  bio: string;
  linkedin: string;
  github: string;
  medium: string;
  email: string;
}

export default function Hero({ name, title, bio, linkedin, github, medium, email }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#06b6d4]/5 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Terminal-style greeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-sm font-mono text-white/60">
            ~/portfolio<span className="cursor-blink text-[#06b6d4]">_</span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
        >
          <span className="text-white">Hi, I&apos;m </span>
          <span className="gradient-text glow-text">{name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/40 font-light mb-4"
        >
          {title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base md:text-lg text-white/30 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {bio}
        </motion.p>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          {[
            { icon: FaLinkedin, href: linkedin, label: 'LinkedIn' },
            { icon: FaGithub, href: github, label: 'GitHub' },
            { icon: FaMedium, href: medium, label: 'Medium' },
            { icon: FaEnvelope, href: `mailto:${email}`, label: 'Email' },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#06b6d4] hover:border-[#06b6d4]/30 hover:bg-[#06b6d4]/5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
              aria-label={label}
            >
              <Icon size={20} />
            </a>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white font-medium hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300 hover:scale-105"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300"
          >
            Get In Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="flex flex-col items-center gap-2 text-white/20 hover:text-white/40 transition-colors">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <HiChevronDown size={20} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
