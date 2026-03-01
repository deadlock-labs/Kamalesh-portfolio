'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { HiMail, HiLocationMarker } from 'react-icons/hi';
import { FaLinkedin, FaMedium, FaGithub } from 'react-icons/fa';

export default function Contact({
  email,
  linkedin,
  github,
  medium,
}: {
  email: string;
  linkedin: string;
  github: string;
  medium: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-[#06b6d4] tracking-wider uppercase">Connect</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-xl mx-auto">
            Have a project in mind or want to collaborate? Let&apos;s talk!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 flex items-center justify-center text-[#06b6d4]">
                  <HiMail size={20} />
                </div>
                <div>
                  <p className="text-sm text-white/40">Email</p>
                  <a href={`mailto:${email}`} className="text-white/80 hover:text-[#06b6d4] transition-colors text-sm">
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center text-[#8b5cf6]">
                  <HiLocationMarker size={20} />
                </div>
                <div>
                  <p className="text-sm text-white/40">Location</p>
                  <p className="text-white/80 text-sm">India</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <p className="text-sm text-white/40 mb-4">Follow me</p>
              <div className="flex gap-3">
                {[
                  { icon: FaLinkedin, href: linkedin, label: 'LinkedIn' },
                  { icon: FaGithub, href: github, label: 'GitHub' },
                  { icon: FaMedium, href: medium, label: 'Medium' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-[#06b6d4] hover:border-[#06b6d4]/20 transition-all"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#06b6d4]/30 focus:bg-white/[0.07] transition-all text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#06b6d4]/30 focus:bg-white/[0.07] transition-all text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#06b6d4]/30 focus:bg-white/[0.07] transition-all text-sm"
              />
              <textarea
                placeholder="Your message..."
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#06b6d4]/30 focus:bg-white/[0.07] transition-all text-sm resize-none"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white font-medium hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Sent!' : 'Send Message'}
              </button>
              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">Failed to send. Please try again.</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
