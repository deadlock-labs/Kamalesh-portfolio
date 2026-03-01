package handlers

import (
	"database/sql"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/deadlock-labs/portfolio-backend/database"
	"github.com/deadlock-labs/portfolio-backend/models"
	"github.com/gorilla/mux"
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

// Profile handlers

func GetProfile(w http.ResponseWriter, r *http.Request) {
	var p models.Profile
	err := database.DB.QueryRow("SELECT id, name, title, bio, email, linkedin, github, medium, avatar FROM profiles LIMIT 1").
		Scan(&p.ID, &p.Name, &p.Title, &p.Bio, &p.Email, &p.LinkedIn, &p.GitHub, &p.Medium, &p.Avatar)
	if err != nil {
		respondError(w, http.StatusNotFound, "Profile not found")
		return
	}
	respondJSON(w, http.StatusOK, p)
}

// Skills handlers

func GetSkills(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, name, category, level, icon FROM skills ORDER BY category, level DESC")
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to fetch skills")
		return
	}
	defer rows.Close()

	var skills []models.Skill
	for rows.Next() {
		var s models.Skill
		if err := rows.Scan(&s.ID, &s.Name, &s.Category, &s.Level, &s.Icon); err != nil {
			continue
		}
		skills = append(skills, s)
	}
	respondJSON(w, http.StatusOK, skills)
}

// Experience handlers

func GetExperiences(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, company, role, duration, description, sort_order FROM experiences ORDER BY sort_order")
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to fetch experiences")
		return
	}
	defer rows.Close()

	var exps []models.Experience
	for rows.Next() {
		var e models.Experience
		if err := rows.Scan(&e.ID, &e.Company, &e.Role, &e.Duration, &e.Description, &e.SortOrder); err != nil {
			continue
		}
		exps = append(exps, e)
	}
	respondJSON(w, http.StatusOK, exps)
}

// Project handlers

func GetProjects(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, title, description, tech_stack, link, image FROM projects")
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to fetch projects")
		return
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var p models.Project
		if err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.TechStack, &p.Link, &p.Image); err != nil {
			continue
		}
		projects = append(projects, p)
	}
	respondJSON(w, http.StatusOK, projects)
}

// Blog handlers

func GetBlogPosts(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, title, slug, content, excerpt, tags, published, created_at, updated_at FROM blog_posts WHERE published = 1 ORDER BY created_at DESC")
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to fetch blog posts")
		return
	}
	defer rows.Close()

	var posts []models.BlogPost
	for rows.Next() {
		var p models.BlogPost
		if err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Content, &p.Excerpt, &p.Tags, &p.Published, &p.CreatedAt, &p.UpdatedAt); err != nil {
			continue
		}
		posts = append(posts, p)
	}
	respondJSON(w, http.StatusOK, posts)
}

func GetBlogPost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	var p models.BlogPost
	err := database.DB.QueryRow("SELECT id, title, slug, content, excerpt, tags, published, created_at, updated_at FROM blog_posts WHERE slug = ? AND published = 1", slug).
		Scan(&p.ID, &p.Title, &p.Slug, &p.Content, &p.Excerpt, &p.Tags, &p.Published, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			respondError(w, http.StatusNotFound, "Blog post not found")
		} else {
			respondError(w, http.StatusInternalServerError, "Failed to fetch blog post")
		}
		return
	}
	respondJSON(w, http.StatusOK, p)
}

func CreateBlogPost(w http.ResponseWriter, r *http.Request) {
	var p models.BlogPost
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if p.Title == "" || p.Slug == "" {
		respondError(w, http.StatusBadRequest, "Title and slug are required")
		return
	}

	// Sanitize slug
	p.Slug = strings.ToLower(strings.ReplaceAll(p.Slug, " ", "-"))

	result, err := database.DB.Exec("INSERT INTO blog_posts (title, slug, content, excerpt, tags, published) VALUES (?, ?, ?, ?, ?, ?)",
		p.Title, p.Slug, p.Content, p.Excerpt, p.Tags, p.Published)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to create blog post")
		return
	}

	id, _ := result.LastInsertId()
	p.ID = int(id)
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	respondJSON(w, http.StatusCreated, p)
}

func UpdateBlogPost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	var p models.BlogPost
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	_, err := database.DB.Exec("UPDATE blog_posts SET title=?, content=?, excerpt=?, tags=?, published=?, updated_at=CURRENT_TIMESTAMP WHERE slug=?",
		p.Title, p.Content, p.Excerpt, p.Tags, p.Published, slug)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to update blog post")
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"message": "Blog post updated"})
}

func DeleteBlogPost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	_, err := database.DB.Exec("DELETE FROM blog_posts WHERE slug=?", slug)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to delete blog post")
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"message": "Blog post deleted"})
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

	_, err := database.DB.Exec("INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)",
		c.Name, c.Email, c.Subject, c.Message)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to save contact message")
		return
	}

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
