'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiExternalLink } from 'react-icons/hi';

interface ProjectItem {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  link: string;
}

export default function Projects({ projects }: { projects: ProjectItem[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-[#06b6d4] tracking-wider uppercase">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-xl mx-auto">
            DevOps solutions and infrastructure projects I&apos;ve built
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-6 group relative overflow-hidden"
            >
              {/* Gradient accent top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4]/20 to-[#8b5cf6]/20 flex items-center justify-center">
                  <span className="text-[#06b6d4] text-lg">⚙</span>
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-[#06b6d4] transition-colors"
                  aria-label={`View ${project.title}`}
                >
                  <HiExternalLink size={20} />
                </a>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#06b6d4] transition-colors">
                {project.title}
              </h3>
              <p className="text-white/35 text-sm leading-relaxed mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tech_stack.split(',').map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-white/40"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
