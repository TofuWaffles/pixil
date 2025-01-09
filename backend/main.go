package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/TofuWaffles/pixil/handlers"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/cors"
)

func main() {
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer dbpool.Close()

	env := handlers.Env{
		Database: dbpool,
		Logger:   slog.Default(),
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", env.BasicChain(handlers.Home))
	mux.HandleFunc("/all-active-media", env.BasicChain(env.AllActiveMedia))
	mux.HandleFunc("/thumbnail", env.BasicChain(env.Thumbnail))
	mux.HandleFunc("/upload-test", env.BasicChain(env.UploadTest))
	mux.HandleFunc("/download-test", env.BasicChain(env.DownloadTest))

	log.Println("Starting server on :4000")

	err = http.ListenAndServe(":4000", cors.Default().Handler(mux))
	log.Fatal(err)
}
