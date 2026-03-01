'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { BlogPost } from '@/lib/api';

// Fallback blog content for when API is not available
const fallbackPosts: Record<string, BlogPost> = {
  'getting-started-kubernetes-devops': {
    id: 1,
    title: 'Getting Started with Kubernetes: A DevOps Guide',
    slug: 'getting-started-kubernetes-devops',
    content: `# Getting Started with Kubernetes

Kubernetes has become the de facto standard for container orchestration. In this guide, we'll explore the fundamentals of Kubernetes and how it fits into modern DevOps practices.

## What is Kubernetes?

Kubernetes (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.

## Key Concepts

- **Pods**: The smallest deployable unit
- **Services**: Network abstraction for pods
- **Deployments**: Declarative updates for pods
- **ConfigMaps & Secrets**: Configuration management

## Setting Up Your First Cluster

Using \`kubeadm\` or managed services like EKS, AKS, or GKE, you can quickly set up a production-ready cluster.

## Best Practices

1. Use namespaces for isolation
2. Implement resource limits
3. Set up RBAC
4. Use Helm for package management
5. Implement health checks`,
    excerpt: 'A comprehensive guide to getting started with Kubernetes for DevOps engineers.',
    tags: 'kubernetes,devops,containers,orchestration',
    published: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  'terraform-best-practices-production': {
    id: 2,
    title: 'Terraform Best Practices for Production Infrastructure',
    slug: 'terraform-best-practices-production',
    content: `# Terraform Best Practices

Managing infrastructure as code with Terraform requires discipline and best practices. Here's what I've learned from managing production infrastructure.

## State Management

Always use remote state backends like S3 with DynamoDB locking.

## Module Structure

Organize your code into reusable modules with clear interfaces.

## Security

- Never commit secrets
- Use variables for sensitive values
- Implement least-privilege IAM policies

## CI/CD Integration

Automate your Terraform workflows with plan/apply pipelines.`,
    excerpt: 'Essential Terraform best practices for managing production infrastructure.',
    tags: 'terraform,iac,devops,aws,infrastructure',
    published: true,
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z',
  },
  'cicd-github-actions-guide': {
    id: 3,
    title: 'Building CI/CD Pipelines with GitHub Actions',
    slug: 'cicd-github-actions-guide',
    content: `# CI/CD with GitHub Actions

GitHub Actions provides a powerful, integrated CI/CD solution. Let's build a production-ready pipeline.

## Workflow Structure

Define workflows in \`.github/workflows/\` using YAML syntax.

## Key Features

- Matrix builds
- Reusable workflows
- Environment protection rules
- Secret management

## Example Pipeline

A typical pipeline includes: lint, test, build, deploy stages with proper gating.`,
    excerpt: 'Learn how to build robust CI/CD pipelines using GitHub Actions.',
    tags: 'github-actions,cicd,automation,devops',
    published: true,
    created_at: '2024-03-05T00:00:00Z',
    updated_at: '2024-03-05T00:00:00Z',
  },
};

const defaultLinks = {
  linkedin: 'https://www.linkedin.com/in/kamalesh-d-4b0444219/',
  github: 'https://github.com/kkamalesh117',
  medium: 'https://medium.com/@kkamalesh117',
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      try {
        const res = await fetch(`${apiUrl}/blog/${slug}`);
        if (res.ok) {
          setPost(await res.json());
        } else {
          setPost(fallbackPosts[slug] || null);
        }
      } catch {
        setPost(fallbackPosts[slug] || null);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
          <Link href="/#blog" className="text-[#00d4ff] hover:underline">
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <article className="pt-32 pb-24 max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-white/40 hover:text-[#00d4ff] transition-colors mb-8"
          >
            <HiArrowLeft /> Back to blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-mono text-white/30">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.split(',').map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-[#00d4ff]/60"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>

          <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:text-white prose-p:text-white/60 prose-strong:text-white/80 prose-code:text-[#00d4ff] prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#111] prose-pre:border prose-pre:border-white/5 prose-a:text-[#00d4ff] prose-li:text-white/60">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </motion.div>
      </article>
      <Footer {...defaultLinks} />
    </div>
  );
}
