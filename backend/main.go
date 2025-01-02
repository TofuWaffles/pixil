package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/TofuWaffles/pixil/handlers"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer dbpool.Close()

	mux := http.NewServeMux()
	mux.HandleFunc("/", handlers.Home)
	mux.HandleFunc("/upload-test", handlers.UploadTest)
	mux.HandleFunc("/download-test", handlers.DownloadTest)

	log.Println("Starting server on :4000")

	err = http.ListenAndServe(":4000", mux)
	log.Fatal(err)
}
