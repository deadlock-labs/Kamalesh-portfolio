'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaDocker, FaAws, FaLinux, FaPython, FaJenkins, FaGitlab } from 'react-icons/fa';
import {
  SiKubernetes,
  SiTerraform,
  SiAnsible,
  SiGooglecloud,
  SiGithubactions,
  SiPrometheus,
  SiGrafana,
  SiElastic,
  SiNginx,
  SiHelm,
  SiArgo,
  SiGo,
  SiGnubash,
} from 'react-icons/si';
import { VscAzure } from 'react-icons/vsc';

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  docker: <FaDocker />,
  kubernetes: <SiKubernetes />,
  terraform: <SiTerraform />,
  ansible: <SiAnsible />,
  aws: <FaAws />,
  azure: <VscAzure />,
  gcp: <SiGooglecloud />,
  jenkins: <FaJenkins />,
  github: <SiGithubactions />,
  gitlab: <FaGitlab />,
  linux: <FaLinux />,
  python: <FaPython />,
  go: <SiGo />,
  bash: <SiGnubash />,
  prometheus: <SiPrometheus />,
  grafana: <SiGrafana />,
  elastic: <SiElastic />,
  nginx: <SiNginx />,
  helm: <SiHelm />,
  argocd: <SiArgo />,
};

export default function Skills({ skills }: { skills: Skill[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Group skills by category
  const grouped = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-[#06b6d4] tracking-wider uppercase">Tech Stack</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-xl mx-auto">
            Tools and technologies I use to build, deploy, and maintain scalable infrastructure
          </p>
        </motion.div>

        <div className="space-y-12">
          {Object.entries(grouped).map(([category, categorySkills], catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: catIdx * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white/60 mb-4 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-[#06b6d4]/30" />
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill, idx) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: catIdx * 0.1 + idx * 0.05 }}
                    className="glass-card p-5 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-xl text-[#06b6d4] group-hover:scale-110 transition-transform">
                        {iconMap[skill.icon] || <span className="text-sm">⚡</span>}
                      </div>
                      <span className="font-medium text-white/90">{skill.name}</span>
                      <span className="ml-auto text-sm font-mono text-white/30">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 1.2, delay: catIdx * 0.1 + idx * 0.05, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
