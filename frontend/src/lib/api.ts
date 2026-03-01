const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  linkedin: string;
  github: string;
  medium: string;
  avatar: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string;
  sort_order: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  link: string;
  image: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediumPost {
  title: string;
  link: string;
  description: string;
  pub_date: string;
  thumbnail: string;
}

async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  return fetchAPI<Profile>('/profile');
}

export async function getSkills(): Promise<Skill[]> {
  return (await fetchAPI<Skill[]>('/skills')) || [];
}

export async function getExperiences(): Promise<Experience[]> {
  return (await fetchAPI<Experience[]>('/experiences')) || [];
}

export async function getProjects(): Promise<Project[]> {
  return (await fetchAPI<Project[]>('/projects')) || [];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await fetchAPI<BlogPost[]>('/blog')) || [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return fetchAPI<BlogPost>(`/blog/${slug}`);
}

export async function getMediumPosts(): Promise<MediumPost[]> {
  return (await fetchAPI<MediumPost[]>('/medium')) || [];
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}
