package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mosaic/api/internal/api"
	"github.com/mosaic/api/internal/database"
	"github.com/mosaic/api/internal/models"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "mosaic.db"
	}
	processorURL := os.Getenv("PROCESSOR_URL")
	if processorURL == "" {
		processorURL = "http://localhost:8000"
	}

	db, err := database.Open(dbURL)
	if err != nil {
		log.Fatal(err)
	}

	if err := db.AutoMigrate(
		&models.Message{},
		&models.Expense{},
		&models.Earning{},
		&models.Medicine{},
		&models.Appointment{},
		&models.Idea{},
		&models.Medication{},
		&models.Reminder{},
	); err != nil {
		log.Fatal(err)
	}

	hub := api.NewHub()
	go hub.Run()

	h := api.NewHandler(db, processorURL, hub)

	r := gin.Default()
	r.Use(cors.Default())
	h.RegisterRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("API listening on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
