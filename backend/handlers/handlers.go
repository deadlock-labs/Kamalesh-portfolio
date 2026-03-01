package handlers

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/deadlock-labs/portfolio-backend/models"
)

func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Println("Error encoding JSON:", err)
	}
}

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}

// Static data

var staticProfile = models.Profile{
	ID:       1,
	Name:     "Kamalesh D",
	Title:    "DevSecOps Engineer & Technical Blogger",
	Bio:      "Passionate DevSecOps Engineer with expertise in cloud infrastructure, CI/CD pipelines, container orchestration, and infrastructure as code. I write about DevOps practices, cloud-native technologies, and automation on Medium. Dedicated to building reliable, scalable systems and sharing knowledge with the developer community.",
	Email:    "kkamalesh117@gmail.com",
	LinkedIn: "https://www.linkedin.com/in/kamalesh-d-4b0444219/",
	GitHub:   "https://github.com/kkamalesh117",
	Medium:   "https://medium.com/@kkamalesh117",
	Avatar:   "/avatar.png",
}

var staticSkills = []models.Skill{
	{ID: 1, Name: "Docker", Category: "Containers & Orchestration", Level: 90, Icon: "docker"},
	{ID: 2, Name: "Kubernetes", Category: "Containers & Orchestration", Level: 85, Icon: "kubernetes"},
	{ID: 3, Name: "Helm", Category: "Containers & Orchestration", Level: 82, Icon: "helm"},
	{ID: 4, Name: "Terraform", Category: "Infrastructure as Code", Level: 88, Icon: "terraform"},
	{ID: 5, Name: "Ansible", Category: "Infrastructure as Code", Level: 82, Icon: "ansible"},
	{ID: 6, Name: "AWS", Category: "Cloud Platforms", Level: 90, Icon: "aws"},
	{ID: 7, Name: "Azure", Category: "Cloud Platforms", Level: 78, Icon: "azure"},
	{ID: 8, Name: "GCP", Category: "Cloud Platforms", Level: 75, Icon: "gcp"},
	{ID: 9, Name: "Jenkins", Category: "CI/CD", Level: 88, Icon: "jenkins"},
	{ID: 10, Name: "GitHub Actions", Category: "CI/CD", Level: 92, Icon: "github"},
	{ID: 11, Name: "GitLab CI", Category: "CI/CD", Level: 85, Icon: "gitlab"},
	{ID: 12, Name: "ArgoCD", Category: "CI/CD", Level: 78, Icon: "argocd"},
	{ID: 13, Name: "Linux", Category: "Operating Systems", Level: 92, Icon: "linux"},
	{ID: 14, Name: "Python", Category: "Programming", Level: 85, Icon: "python"},
	{ID: 15, Name: "Go", Category: "Programming", Level: 80, Icon: "go"},
	{ID: 16, Name: "Bash", Category: "Programming", Level: 90, Icon: "bash"},
	{ID: 17, Name: "Prometheus", Category: "Monitoring & Logging", Level: 85, Icon: "prometheus"},
	{ID: 18, Name: "Grafana", Category: "Monitoring & Logging", Level: 88, Icon: "grafana"},
	{ID: 19, Name: "ELK Stack", Category: "Monitoring & Logging", Level: 80, Icon: "elastic"},
	{ID: 20, Name: "Nginx", Category: "Web Servers", Level: 85, Icon: "nginx"},
}

var staticExperiences = []models.Experience{
	{ID: 1, Company: "Ford Motor Company", Role: "DevSecOps Engineer", Duration: "Jul 2024 - Present", Description: "Collaborating with NVC, IMG, and NA teams for Monorepo Architecture using Nx tool to manage microfrontends. Contributed to Tekton CI/CD pipeline development. Supported OpenShift CaaS infrastructure. Integrated Dynatrace with OneAgent for observability. Created a self-hosted cache server reducing Nx + OpenAPI build times by ~60%. Supported canary deployment strategies. Built a reverse proxy server in Golang for secure GitHub webhook communication with private networks.", SortOrder: 1},
	{ID: 2, Company: "Medium", Role: "Technical Writer", Duration: "Jul 2023 - Present", Description: "Self-employed technical writer covering DevOps, Docker, Cybersecurity, Ethical Hacking, Python, and Software Development topics.", SortOrder: 2},
	{ID: 3, Company: "Seervitax", Role: "Full Stack Engineer", Duration: "May 2023 - Present", Description: "Freelance full stack development using HTML, CSS, Bootstrap, and API integrations for Seervi Tax Consultancy.", SortOrder: 3},
	{ID: 4, Company: "BLeap Digital", Role: "Infrastructure Engineer", Duration: "May 2024 - Jun 2024", Description: "Freelance infrastructure engineering with PHP, Laravel, Docker, Apache, and DigitalOcean.", SortOrder: 4},
	{ID: 5, Company: "Alexandria", Role: "WordPress Developer", Duration: "May 2024 - Jun 2024", Description: "Freelance WordPress development including deployment and hosting management using Hostinger and GoDaddy.", SortOrder: 5},
	{ID: 6, Company: "Aaimaa Solutions", Role: "DevOps Engineer", Duration: "Jan 2024 - Feb 2024", Description: "Internship focused on Docker, Frappe framework, AWS, and Amazon EKS.", SortOrder: 6},
	{ID: 7, Company: "RadicalX (Reality AI Lab)", Role: "Software Developer", Duration: "Dec 2023 - Jan 2024", Description: "Internship working on software development projects at Reality AI Lab.", SortOrder: 7},
	{ID: 8, Company: "Technocrats Robotics", Role: "ROBOCON Special Team", Duration: "Jul 2021 - Oct 2023", Description: "Full-time member of the ROBOCON Special Team, working on robotics competition projects.", SortOrder: 8},
	{ID: 9, Company: "Ford Motor Company", Role: "Software Developer Intern", Duration: "May 2023 - Jun 2023", Description: "Internship focused on Cybersecurity, Google Cloud Platform (GCP), React.js, and related technologies.", SortOrder: 9},
}

var staticProjects = []models.Project{
	{ID: 1, Title: "Kubernetes Auto-Scaler", Description: "Custom Kubernetes horizontal pod autoscaler with predictive scaling based on traffic patterns and resource utilization metrics.", TechStack: "Kubernetes,Go,Prometheus,Grafana", Link: "https://github.com/kkamalesh117", Image: ""},
	{ID: 2, Title: "CI/CD Pipeline Framework", Description: "Reusable CI/CD pipeline templates for multi-cloud deployments supporting Docker, Kubernetes, and serverless architectures.", TechStack: "Jenkins,GitHub Actions,Docker,Terraform", Link: "https://github.com/kkamalesh117", Image: ""},
	{ID: 3, Title: "Infrastructure Monitoring Dashboard", Description: "Comprehensive monitoring solution with custom Grafana dashboards, Prometheus alerting, and automated incident response.", TechStack: "Prometheus,Grafana,Python,AlertManager", Link: "https://github.com/kkamalesh117", Image: ""},
	{ID: 4, Title: "GitOps Deployment Platform", Description: "Fully automated GitOps deployment platform using ArgoCD, Helm, and Kubernetes for zero-downtime deployments.", TechStack: "ArgoCD,Helm,Kubernetes,Terraform", Link: "https://github.com/kkamalesh117", Image: ""},
}

// Profile handler

func GetProfile(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, http.StatusOK, staticProfile)
}

// Skills handler

func GetSkills(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, http.StatusOK, staticSkills)
}

// Experience handler

func GetExperiences(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, http.StatusOK, staticExperiences)
}

// Project handler

func GetProjects(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, http.StatusOK, staticProjects)
}

// Medium RSS Feed handler

type RSS struct {
	Channel struct {
		Items []RSSItem `xml:"item"`
	} `xml:"channel"`
}

type RSSItem struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
	PubDate     string `xml:"pubDate"`
}

func GetMediumPosts(w http.ResponseWriter, r *http.Request) {
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get("https://medium.com/feed/@kkamalesh117")
	if err != nil {
		respondError(w, http.StatusServiceUnavailable, "Failed to fetch Medium feed")
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 5*1024*1024)) // 5MB limit
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to read Medium feed")
		return
	}

	var rss RSS
	if err := xml.Unmarshal(body, &rss); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to parse Medium feed")
		return
	}

	var posts []models.MediumPost
	for _, item := range rss.Channel.Items {
		// Extract a clean excerpt from description
		desc := item.Description
		if len(desc) > 300 {
			desc = desc[:300] + "..."
		}

		// Try to extract thumbnail from description
		thumbnail := ""
		if imgStart := strings.Index(item.Description, "<img"); imgStart != -1 {
			if srcStart := strings.Index(item.Description[imgStart:], "src=\""); srcStart != -1 {
				start := imgStart + srcStart + 5
				if end := strings.Index(item.Description[start:], "\""); end != -1 {
					thumbnail = item.Description[start : start+end]
				}
			}
		}

		// Strip HTML tags from description for excerpt
		cleanDesc := stripHTMLTags(desc)

		posts = append(posts, models.MediumPost{
			Title:       item.Title,
			Link:        item.Link,
			Description: cleanDesc,
			PubDate:     item.PubDate,
			Thumbnail:   thumbnail,
		})
	}

	respondJSON(w, http.StatusOK, posts)
}

func stripHTMLTags(s string) string {
	var result strings.Builder
	inTag := false
	for _, r := range s {
		if r == '<' {
			inTag = true
			continue
		}
		if r == '>' {
			inTag = false
			continue
		}
		if !inTag {
			result.WriteRune(r)
		}
	}
	return result.String()
}

// Contact handler

func CreateContact(w http.ResponseWriter, r *http.Request) {
	var c models.Contact
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if c.Name == "" || c.Email == "" || c.Message == "" {
		respondError(w, http.StatusBadRequest, "Name, email, and message are required")
		return
	}

	if !strings.Contains(c.Email, "@") || !strings.Contains(c.Email, ".") {
		respondError(w, http.StatusBadRequest, "Invalid email address")
		return
	}

	log.Printf("Contact message from %s (%s): %s", c.Name, c.Email, c.Subject)
	respondJSON(w, http.StatusCreated, map[string]string{"message": "Message sent successfully"})
}

// Health check

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "healthy",
		"version": "1.0.0",
		"time":    fmt.Sprintf("%v", time.Now().Format(time.RFC3339)),
	})
}
