'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaServer, FaCloud, FaCogs, FaPenFancy } from 'react-icons/fa';

interface AboutProps {
  bio: string;
}

export default function About({ bio }: AboutProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const highlights = [
    {
      icon: FaServer,
      title: 'Infrastructure',
      desc: 'Building and managing scalable cloud infrastructure with IaC',
    },
    {
      icon: FaCloud,
      title: 'Cloud Native',
      desc: 'Kubernetes, Docker, and microservices architecture',
    },
    {
      icon: FaCogs,
      title: 'CI/CD',
      desc: 'Automated pipelines for testing, building, and deploying',
    },
    {
      icon: FaPenFancy,
      title: 'Tech Blogger',
      desc: 'Sharing DevOps knowledge and best practices on Medium',
    },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-[#00d4ff] tracking-wider uppercase">About Me</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">
            Who I <span className="gradient-text">Am</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 md:p-12 mb-12"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs font-mono text-white/30">about-me.md</span>
          </div>

          <div className="font-mono text-sm md:text-base leading-relaxed">
            <p className="text-white/50 mb-4">
              <span className="text-[#00d4ff]">$</span> cat about-me.md
            </p>
            <p className="text-white/60 leading-relaxed">{bio}</p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
              className="glass-card p-6 text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4ff]/10 to-[#7c3aed]/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="text-[#00d4ff] text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-white/30 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
