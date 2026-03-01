package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/deadlock-labs/portfolio-backend/handlers"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()

	api.HandleFunc("/health", handlers.HealthCheck).Methods("GET")
	api.HandleFunc("/profile", handlers.GetProfile).Methods("GET")
	api.HandleFunc("/skills", handlers.GetSkills).Methods("GET")
	api.HandleFunc("/experiences", handlers.GetExperiences).Methods("GET")
	api.HandleFunc("/projects", handlers.GetProjects).Methods("GET")

	// Medium RSS
	api.HandleFunc("/medium", handlers.GetMediumPosts).Methods("GET")

	// Contact
	api.HandleFunc("/contact", handlers.CreateContact).Methods("POST")

	// CORS
	allowedOrigins := os.Getenv("CORS_ORIGINS")
	var origins []string
	if allowedOrigins != "" {
		origins = strings.Split(allowedOrigins, ",")
	} else {
		origins = []string{"http://localhost:3000", "http://localhost:3001"}
	}
	c := cors.New(cors.Options{
		AllowedOrigins:   origins,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
