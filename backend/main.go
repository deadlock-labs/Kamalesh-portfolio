package main

import (
	"log"
	"net/http"
	"os"

	"github.com/deadlock-labs/portfolio-backend/database"
	"github.com/deadlock-labs/portfolio-backend/handlers"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./portfolio.db"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	database.InitDB(dbPath)

	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()

	api.HandleFunc("/health", handlers.HealthCheck).Methods("GET")
	api.HandleFunc("/profile", handlers.GetProfile).Methods("GET")
	api.HandleFunc("/skills", handlers.GetSkills).Methods("GET")
	api.HandleFunc("/experiences", handlers.GetExperiences).Methods("GET")
	api.HandleFunc("/projects", handlers.GetProjects).Methods("GET")

	// Blog routes
	api.HandleFunc("/blog", handlers.GetBlogPosts).Methods("GET")
	api.HandleFunc("/blog/{slug}", handlers.GetBlogPost).Methods("GET")
	api.HandleFunc("/blog", handlers.CreateBlogPost).Methods("POST")
	api.HandleFunc("/blog/{slug}", handlers.UpdateBlogPost).Methods("PUT")
	api.HandleFunc("/blog/{slug}", handlers.DeleteBlogPost).Methods("DELETE")

	// Medium RSS
	api.HandleFunc("/medium", handlers.GetMediumPosts).Methods("GET")

	// Contact
	api.HandleFunc("/contact", handlers.CreateContact).Methods("POST")

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
