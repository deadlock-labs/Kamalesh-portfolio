package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB(dbPath string) {
	var err error
	DB, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	createTables()
	seedData()
	log.Println("Database initialized successfully")
}

func createTables() {
	tables := `
	CREATE TABLE IF NOT EXISTS profiles (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		title TEXT NOT NULL,
		bio TEXT,
		email TEXT,
		linkedin TEXT,
		github TEXT,
		medium TEXT,
		avatar TEXT
	);

	CREATE TABLE IF NOT EXISTS skills (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		category TEXT NOT NULL,
		level INTEGER DEFAULT 80,
		icon TEXT
	);

	CREATE TABLE IF NOT EXISTS experiences (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		company TEXT NOT NULL,
		role TEXT NOT NULL,
		duration TEXT,
		description TEXT,
		sort_order INTEGER DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS projects (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		description TEXT,
		tech_stack TEXT,
		link TEXT,
		image TEXT
	);

	CREATE TABLE IF NOT EXISTS blog_posts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		slug TEXT UNIQUE NOT NULL,
		content TEXT,
		excerpt TEXT,
		tags TEXT,
		published BOOLEAN DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS contacts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		subject TEXT,
		message TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`

	_, err := DB.Exec(tables)
	if err != nil {
		log.Fatal("Failed to create tables:", err)
	}
}

func seedData() {
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM profiles").Scan(&count)
	if err != nil || count > 0 {
		return
	}

	// Seed profile
	_, err = DB.Exec(`INSERT INTO profiles (name, title, bio, email, linkedin, github, medium, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		"Kamalesh D",
		"DevOps Engineer & Technical Blogger",
		"Passionate DevOps Engineer with expertise in cloud infrastructure, CI/CD pipelines, container orchestration, and infrastructure as code. I write about DevOps practices, cloud-native technologies, and automation on Medium. Dedicated to building reliable, scalable systems and sharing knowledge with the developer community.",
		"kkamalesh117@gmail.com",
		"https://www.linkedin.com/in/kamalesh-d-4b0444219/",
		"https://github.com/kkamalesh117",
		"https://medium.com/@kkamalesh117",
		"/avatar.png",
	)
	if err != nil {
		log.Println("Error seeding profile:", err)
	}

	// Seed skills
	skills := []struct {
		Name     string
		Category string
		Level    int
		Icon     string
	}{
		{"Docker", "Containers & Orchestration", 90, "docker"},
		{"Kubernetes", "Containers & Orchestration", 85, "kubernetes"},
		{"Terraform", "Infrastructure as Code", 88, "terraform"},
		{"Ansible", "Infrastructure as Code", 82, "ansible"},
		{"AWS", "Cloud Platforms", 90, "aws"},
		{"Azure", "Cloud Platforms", 78, "azure"},
		{"GCP", "Cloud Platforms", 75, "gcp"},
		{"Jenkins", "CI/CD", 88, "jenkins"},
		{"GitHub Actions", "CI/CD", 92, "github"},
		{"GitLab CI", "CI/CD", 85, "gitlab"},
		{"Linux", "Operating Systems", 92, "linux"},
		{"Python", "Programming", 85, "python"},
		{"Go", "Programming", 80, "go"},
		{"Bash", "Programming", 90, "bash"},
		{"Prometheus", "Monitoring & Logging", 85, "prometheus"},
		{"Grafana", "Monitoring & Logging", 88, "grafana"},
		{"ELK Stack", "Monitoring & Logging", 80, "elastic"},
		{"Nginx", "Web Servers", 85, "nginx"},
		{"Helm", "Containers & Orchestration", 82, "helm"},
		{"ArgoCD", "CI/CD", 78, "argocd"},
	}

	for _, s := range skills {
		_, err = DB.Exec("INSERT INTO skills (name, category, level, icon) VALUES (?, ?, ?, ?)",
			s.Name, s.Category, s.Level, s.Icon)
		if err != nil {
			log.Println("Error seeding skill:", err)
		}
	}

	// Seed experiences
	experiences := []struct {
		Company     string
		Role        string
		Duration    string
		Description string
		SortOrder   int
	}{
		{
			"Cloud Infrastructure Projects",
			"DevOps Engineer",
			"2022 - Present",
			"Designed and maintained cloud infrastructure on AWS using Terraform and CloudFormation. Implemented CI/CD pipelines with Jenkins and GitHub Actions. Managed Kubernetes clusters for microservices deployment. Automated infrastructure provisioning reducing deployment time by 70%.",
			1,
		},
		{
			"Open Source & Community",
			"Technical Blogger & Contributor",
			"2021 - Present",
			"Active technical blogger on Medium covering DevOps practices, cloud-native technologies, and automation. Contributing to open-source DevOps tools and sharing knowledge with the developer community through articles and tutorials.",
			2,
		},
	}

	for _, e := range experiences {
		_, err = DB.Exec("INSERT INTO experiences (company, role, duration, description, sort_order) VALUES (?, ?, ?, ?, ?)",
			e.Company, e.Role, e.Duration, e.Description, e.SortOrder)
		if err != nil {
			log.Println("Error seeding experience:", err)
		}
	}

	// Seed projects
	projects := []struct {
		Title       string
		Description string
		TechStack   string
		Link        string
		Image       string
	}{
		{
			"Kubernetes Auto-Scaler",
			"Custom Kubernetes horizontal pod autoscaler with predictive scaling based on traffic patterns and resource utilization metrics.",
			"Kubernetes,Go,Prometheus,Grafana",
			"https://github.com/kkamalesh117",
			"/projects/k8s-autoscaler.png",
		},
		{
			"CI/CD Pipeline Framework",
			"Reusable CI/CD pipeline templates for multi-cloud deployments supporting Docker, Kubernetes, and serverless architectures.",
			"Jenkins,GitHub Actions,Docker,Terraform",
			"https://github.com/kkamalesh117",
			"/projects/cicd-pipeline.png",
		},
		{
			"Infrastructure Monitoring Dashboard",
			"Comprehensive monitoring solution with custom Grafana dashboards, Prometheus alerting, and automated incident response.",
			"Prometheus,Grafana,Python,AlertManager",
			"https://github.com/kkamalesh117",
			"/projects/monitoring.png",
		},
		{
			"GitOps Deployment Platform",
			"Fully automated GitOps deployment platform using ArgoCD, Helm, and Kubernetes for zero-downtime deployments.",
			"ArgoCD,Helm,Kubernetes,Terraform",
			"https://github.com/kkamalesh117",
			"/projects/gitops.png",
		},
	}

	for _, p := range projects {
		_, err = DB.Exec("INSERT INTO projects (title, description, tech_stack, link, image) VALUES (?, ?, ?, ?, ?)",
			p.Title, p.Description, p.TechStack, p.Link, p.Image)
		if err != nil {
			log.Println("Error seeding project:", err)
		}
	}

	// Seed blog posts
	posts := []struct {
		Title   string
		Slug    string
		Content string
		Excerpt string
		Tags    string
	}{
		{
			"Getting Started with Kubernetes: A DevOps Guide",
			"getting-started-kubernetes-devops",
			"# Getting Started with Kubernetes\n\nKubernetes has become the de facto standard for container orchestration. In this guide, we'll explore the fundamentals of Kubernetes and how it fits into modern DevOps practices.\n\n## What is Kubernetes?\n\nKubernetes (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.\n\n## Key Concepts\n\n- **Pods**: The smallest deployable unit\n- **Services**: Network abstraction for pods\n- **Deployments**: Declarative updates for pods\n- **ConfigMaps & Secrets**: Configuration management\n\n## Setting Up Your First Cluster\n\nUsing `kubeadm` or managed services like EKS, AKS, or GKE, you can quickly set up a production-ready cluster.\n\n## Best Practices\n\n1. Use namespaces for isolation\n2. Implement resource limits\n3. Set up RBAC\n4. Use Helm for package management\n5. Implement health checks",
			"A comprehensive guide to getting started with Kubernetes for DevOps engineers, covering key concepts and best practices.",
			"kubernetes,devops,containers,orchestration",
		},
		{
			"Terraform Best Practices for Production Infrastructure",
			"terraform-best-practices-production",
			"# Terraform Best Practices\n\nManaging infrastructure as code with Terraform requires discipline and best practices. Here's what I've learned from managing production infrastructure.\n\n## State Management\n\nAlways use remote state backends like S3 with DynamoDB locking.\n\n## Module Structure\n\nOrganize your code into reusable modules with clear interfaces.\n\n## Security\n\n- Never commit secrets\n- Use variables for sensitive values\n- Implement least-privilege IAM policies\n\n## CI/CD Integration\n\nAutomate your Terraform workflows with plan/apply pipelines.",
			"Essential Terraform best practices for managing production infrastructure safely and efficiently.",
			"terraform,iac,devops,aws,infrastructure",
		},
		{
			"Building CI/CD Pipelines with GitHub Actions",
			"cicd-github-actions-guide",
			"# CI/CD with GitHub Actions\n\nGitHub Actions provides a powerful, integrated CI/CD solution. Let's build a production-ready pipeline.\n\n## Workflow Structure\n\nDefine workflows in `.github/workflows/` using YAML syntax.\n\n## Key Features\n\n- Matrix builds\n- Reusable workflows\n- Environment protection rules\n- Secret management\n\n## Example Pipeline\n\nA typical pipeline includes: lint, test, build, deploy stages with proper gating.",
			"Learn how to build robust CI/CD pipelines using GitHub Actions for automated testing and deployment.",
			"github-actions,cicd,automation,devops",
		},
	}

	for _, p := range posts {
		_, err = DB.Exec("INSERT INTO blog_posts (title, slug, content, excerpt, tags, published) VALUES (?, ?, ?, ?, ?, 1)",
			p.Title, p.Slug, p.Content, p.Excerpt, p.Tags)
		if err != nil {
			log.Println("Error seeding blog post:", err)
		}
	}
}
