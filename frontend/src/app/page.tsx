'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import DevOpsBackground from '@/components/DevOpsBackground';
import {
  profile as staticProfile,
  skills as staticSkills,
  experiences as staticExperiences,
  projects as staticProjects,
} from '@/lib/data';
import type { Profile, Skill, Experience as ExpType, Project, MediumPost } from '@/lib/data';

export default function Home() {
  const [profile] = useState<Profile>(staticProfile);
  const [skills] = useState<Skill[]>(staticSkills);
  const [experiences] = useState<ExpType[]>(staticExperiences);
  const [projects] = useState<Project[]>(staticProjects);
  const [mediumPosts, setMediumPosts] = useState<MediumPost[]>([]);

  useEffect(() => {
    const fetchMedium = async () => {
      try {
        const res = await fetch('/api/medium');
        if (res.ok) {
          setMediumPosts(await res.json());
        }
      } catch {
        // Medium posts are optional
      }
    };
    fetchMedium();
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] relative">
      <DevOpsBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero
          name={profile.name}
          title={profile.title}
          bio={profile.bio}
          linkedin={profile.linkedin}
          github={profile.github}
          medium={profile.medium}
          email={profile.email}
        />
        <About bio={profile.bio} />
        <Skills skills={skills} />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Blog mediumPosts={mediumPosts} />
        <Contact
          email={profile.email}
          linkedin={profile.linkedin}
          github={profile.github}
          medium={profile.medium}
        />
        <Footer
          linkedin={profile.linkedin}
          github={profile.github}
          medium={profile.medium}
        />
      </div>
    </main>
  );
}
