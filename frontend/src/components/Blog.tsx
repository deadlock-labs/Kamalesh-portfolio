'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiExternalLink } from 'react-icons/hi';
import { FaMedium } from 'react-icons/fa';

interface MediumPost {
  title: string;
  link: string;
  description: string;
  pub_date: string;
}

export default function Blog({
  mediumPosts,
}: {
  mediumPosts: MediumPost[];
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="blog" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-[#06b6d4] tracking-wider uppercase">Articles</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">
            Blog & <span className="gradient-text">Writings</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-xl mx-auto">
            Technical articles on DevOps, cloud infrastructure, and automation
          </p>
        </motion.div>

        {/* Medium Posts */}
        {mediumPosts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white/60 mb-6 flex items-center gap-2">
              <FaMedium className="text-[#06b6d4]" />
              Medium Articles
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediumPosts.slice(0, 6).map((post, idx) => (
                <motion.a
                  key={idx}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card p-6 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FaMedium className="text-white/30" />
                      <span className="text-xs font-mono text-white/30">
                        {post.pub_date
                          ? new Date(post.pub_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : ''}
                      </span>
                    </div>
                    <HiExternalLink className="text-white/20 group-hover:text-[#06b6d4] transition-colors" />
                  </div>
                  <h4 className="text-base font-semibold text-white mb-2 group-hover:text-[#06b6d4] transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-white/30 text-sm leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* Fallback if empty */}
        {mediumPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/30">Loading articles from Medium...</p>
          </div>
        )}
      </div>
    </section>
  );
}
