export type { Profile, Skill, Experience, Project, MediumPost } from '@/lib/data';

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

async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`/api${endpoint}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getProfile() {
  const { profile } = await import('@/lib/data');
  return profile;
}

export async function getSkills() {
  const { skills } = await import('@/lib/data');
  return skills;
}

export async function getExperiences() {
  const { experiences } = await import('@/lib/data');
  return experiences;
}

export async function getProjects() {
  const { projects } = await import('@/lib/data');
  return projects;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return fetchAPI<BlogPost>(`/blog/${slug}`);
}

export async function getMediumPosts() {
  return (await fetchAPI<import('@/lib/data').MediumPost[]>('/medium')) || [];
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}
