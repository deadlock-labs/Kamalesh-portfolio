'use client';

import { FaLinkedin, FaMedium, FaGithub, FaHeart } from 'react-icons/fa';

export default function Footer({
  linkedin,
  github,
  medium,
}: {
  linkedin: string;
  github: string;
  medium: string;
}) {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-xs">
              K
            </div>
            <span className="text-white/50 text-sm">
              Kamalesh<span className="text-[#06b6d4]">.</span>dev
            </span>
          </div>

          <div className="flex items-center gap-4">
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
                className="text-white/30 hover:text-[#06b6d4] transition-colors"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          <p className="text-white/20 text-sm flex items-center gap-1">
            Built with <FaHeart className="text-[#06b6d4] text-xs" /> using Next.js & Go
          </p>
        </div>
      </div>
    </footer>
  );
}
