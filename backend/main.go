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
	mux.HandleFunc("/", env.Chain(env.BasicChain(handlers.Home), env.GetOnly()))
	mux.HandleFunc("/thumbnail", env.Chain(env.BasicChain(env.Thumbnail), env.GetOnly()))
	mux.HandleFunc("/media", env.Chain(env.BasicChain(env.Media)))
	mux.HandleFunc("/download-test", env.Chain(env.BasicChain(env.DownloadTest), env.GetOnly()))

	log.Println("Starting server on :4000")

	err = http.ListenAndServe(":4000", mux)
	log.Fatal(err)
}
