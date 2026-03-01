'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ExperienceItem {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-[#00d4ff] tracking-wider uppercase">Career</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">
            Work <span className="gradient-text">Experience</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00d4ff]/20 via-[#7c3aed]/20 to-transparent" />

          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className={`relative flex items-start mb-12 ${
                idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.5)] z-10" />

              <div className={`ml-14 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="glass-card p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                      <p className="text-[#00d4ff] text-sm font-medium">{exp.company}</p>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-white/40 mb-3">
                    {exp.duration}
                  </span>
                  <p className="text-white/40 text-sm leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
