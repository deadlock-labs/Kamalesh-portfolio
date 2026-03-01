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
import type { Profile, Skill, Experience as ExpType, Project, BlogPost, MediumPost } from '@/lib/api';

// Fallback data when API is not available
const fallbackProfile: Profile = {
  id: 1,
  name: 'Kamalesh D',
  title: 'DevOps Engineer & Technical Blogger',
  bio: 'Passionate DevOps Engineer with expertise in cloud infrastructure, CI/CD pipelines, container orchestration, and infrastructure as code. I write about DevOps practices, cloud-native technologies, and automation on Medium. Dedicated to building reliable, scalable systems and sharing knowledge with the developer community.',
  email: 'kkamalesh117@gmail.com',
  linkedin: 'https://www.linkedin.com/in/kamalesh-d-4b0444219/',
  github: 'https://github.com/kkamalesh117',
  medium: 'https://medium.com/@kkamalesh117',
  avatar: '/avatar.png',
};

const fallbackSkills: Skill[] = [
  { id: 1, name: 'Docker', category: 'Containers & Orchestration', level: 90, icon: 'docker' },
  { id: 2, name: 'Kubernetes', category: 'Containers & Orchestration', level: 85, icon: 'kubernetes' },
  { id: 3, name: 'Helm', category: 'Containers & Orchestration', level: 82, icon: 'helm' },
  { id: 4, name: 'Terraform', category: 'Infrastructure as Code', level: 88, icon: 'terraform' },
  { id: 5, name: 'Ansible', category: 'Infrastructure as Code', level: 82, icon: 'ansible' },
  { id: 6, name: 'AWS', category: 'Cloud Platforms', level: 90, icon: 'aws' },
  { id: 7, name: 'Azure', category: 'Cloud Platforms', level: 78, icon: 'azure' },
  { id: 8, name: 'GCP', category: 'Cloud Platforms', level: 75, icon: 'gcp' },
  { id: 9, name: 'Jenkins', category: 'CI/CD', level: 88, icon: 'jenkins' },
  { id: 10, name: 'GitHub Actions', category: 'CI/CD', level: 92, icon: 'github' },
  { id: 11, name: 'GitLab CI', category: 'CI/CD', level: 85, icon: 'gitlab' },
  { id: 12, name: 'ArgoCD', category: 'CI/CD', level: 78, icon: 'argocd' },
  { id: 13, name: 'Linux', category: 'Operating Systems', level: 92, icon: 'linux' },
  { id: 14, name: 'Python', category: 'Programming', level: 85, icon: 'python' },
  { id: 15, name: 'Go', category: 'Programming', level: 80, icon: 'go' },
  { id: 16, name: 'Bash', category: 'Programming', level: 90, icon: 'bash' },
  { id: 17, name: 'Prometheus', category: 'Monitoring & Logging', level: 85, icon: 'prometheus' },
  { id: 18, name: 'Grafana', category: 'Monitoring & Logging', level: 88, icon: 'grafana' },
  { id: 19, name: 'ELK Stack', category: 'Monitoring & Logging', level: 80, icon: 'elastic' },
  { id: 20, name: 'Nginx', category: 'Web Servers', level: 85, icon: 'nginx' },
];

const fallbackExperiences: ExpType[] = [
  {
    id: 1,
    company: 'Cloud Infrastructure Projects',
    role: 'DevOps Engineer',
    duration: '2022 - Present',
    description: 'Designed and maintained cloud infrastructure on AWS using Terraform and CloudFormation. Implemented CI/CD pipelines with Jenkins and GitHub Actions. Managed Kubernetes clusters for microservices deployment. Automated infrastructure provisioning reducing deployment time by 70%.',
    sort_order: 1,
  },
  {
    id: 2,
    company: 'Open Source & Community',
    role: 'Technical Blogger & Contributor',
    duration: '2021 - Present',
    description: 'Active technical blogger on Medium covering DevOps practices, cloud-native technologies, and automation. Contributing to open-source DevOps tools and sharing knowledge with the developer community through articles and tutorials.',
    sort_order: 2,
  },
];

const fallbackProjects: Project[] = [
  { id: 1, title: 'Kubernetes Auto-Scaler', description: 'Custom Kubernetes horizontal pod autoscaler with predictive scaling based on traffic patterns and resource utilization metrics.', tech_stack: 'Kubernetes,Go,Prometheus,Grafana', link: 'https://github.com/kkamalesh117', image: '' },
  { id: 2, title: 'CI/CD Pipeline Framework', description: 'Reusable CI/CD pipeline templates for multi-cloud deployments supporting Docker, Kubernetes, and serverless architectures.', tech_stack: 'Jenkins,GitHub Actions,Docker,Terraform', link: 'https://github.com/kkamalesh117', image: '' },
  { id: 3, title: 'Infrastructure Monitoring Dashboard', description: 'Comprehensive monitoring solution with custom Grafana dashboards, Prometheus alerting, and automated incident response.', tech_stack: 'Prometheus,Grafana,Python,AlertManager', link: 'https://github.com/kkamalesh117', image: '' },
  { id: 4, title: 'GitOps Deployment Platform', description: 'Fully automated GitOps deployment platform using ArgoCD, Helm, and Kubernetes for zero-downtime deployments.', tech_stack: 'ArgoCD,Helm,Kubernetes,Terraform', link: 'https://github.com/kkamalesh117', image: '' },
];

const fallbackBlogPosts: BlogPost[] = [
  { id: 1, title: 'Getting Started with Kubernetes: A DevOps Guide', slug: 'getting-started-kubernetes-devops', content: '', excerpt: 'A comprehensive guide to getting started with Kubernetes for DevOps engineers, covering key concepts and best practices.', tags: 'kubernetes,devops,containers,orchestration', published: true, created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z' },
  { id: 2, title: 'Terraform Best Practices for Production Infrastructure', slug: 'terraform-best-practices-production', content: '', excerpt: 'Essential Terraform best practices for managing production infrastructure safely and efficiently.', tags: 'terraform,iac,devops,aws,infrastructure', published: true, created_at: '2024-02-10T00:00:00Z', updated_at: '2024-02-10T00:00:00Z' },
  { id: 3, title: 'Building CI/CD Pipelines with GitHub Actions', slug: 'cicd-github-actions-guide', content: '', excerpt: 'Learn how to build robust CI/CD pipelines using GitHub Actions for automated testing and deployment.', tags: 'github-actions,cicd,automation,devops', published: true, created_at: '2024-03-05T00:00:00Z', updated_at: '2024-03-05T00:00:00Z' },
];

export default function Home() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  const [experiences, setExperiences] = useState<ExpType[]>(fallbackExperiences);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(fallbackBlogPosts);
  const [mediumPosts, setMediumPosts] = useState<MediumPost[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, expRes, projRes, blogRes, mediumRes] = await Promise.allSettled([
          fetch(`${apiUrl}/profile`),
          fetch(`${apiUrl}/skills`),
          fetch(`${apiUrl}/experiences`),
          fetch(`${apiUrl}/projects`),
          fetch(`${apiUrl}/blog`),
          fetch(`${apiUrl}/medium`),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.ok) {
          setProfile(await profileRes.value.json());
        }
        if (skillsRes.status === 'fulfilled' && skillsRes.value.ok) {
          setSkills(await skillsRes.value.json());
        }
        if (expRes.status === 'fulfilled' && expRes.value.ok) {
          setExperiences(await expRes.value.json());
        }
        if (projRes.status === 'fulfilled' && projRes.value.ok) {
          setProjects(await projRes.value.json());
        }
        if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
          setBlogPosts(await blogRes.value.json());
        }
        if (mediumRes.status === 'fulfilled' && mediumRes.value.ok) {
          setMediumPosts(await mediumRes.value.json());
        }
      } catch {
        // Use fallback data
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
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
      <Blog posts={blogPosts} mediumPosts={mediumPosts} />
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
    </main>
  );
}
