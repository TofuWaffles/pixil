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
		return
	}
	defer dbpool.Close()

	envLogLevel := slog.LevelInfo
	if os.Getenv("LOG_LEVEL") == "DEBUG" {
		envLogLevel = slog.LevelDebug
	}
	logLevel := new(slog.LevelVar)
	logLevel.Set(envLogLevel)
	env := handlers.Env{
		Database: dbpool,
		Logger: slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
			Level: logLevel,
		})),
	}

	err = env.CreateDefaultAdmin()
	if err != nil {
		env.Logger.Error("Unable to create the default admin account", "error", err)
		return
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", env.Chain(env.BasicChain(handlers.Home), env.GetOnly()))
	mux.HandleFunc("/thumbnail", env.BasicAuthChain(env.Thumbnail))
	mux.HandleFunc("/media", env.BasicAuthChain(env.Media))
	mux.HandleFunc("/media_content", env.BasicAuthChain(env.GetMediaContent))
	mux.HandleFunc("/albums", env.BasicAuthChain(env.Album))
	mux.HandleFunc("/album_media", env.BasicAuthChain(env.AlbumMedia))
	mux.HandleFunc("/tags", env.BasicAuthChain(env.Tags))
	mux.HandleFunc("/user", env.BasicAuthChain(env.User))
	mux.HandleFunc("/storage", env.BasicAuthChain(env.Storage))
	mux.HandleFunc("/login", env.BasicChain(env.Login))

	log.Println("Starting server on :4000")

	err = http.ListenAndServe(":4000", mux)
	log.Fatal(err)
}
