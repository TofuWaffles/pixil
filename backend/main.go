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

	env := handlers.Env{
		Database: dbpool,
		Logger:   slog.Default(),
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
	mux.HandleFunc("/user", env.BasicAuthChain(env.User))
	mux.HandleFunc("/login", env.BasicChain(env.Login))

	log.Println("Starting server on :4000")

	err = http.ListenAndServe(":4000", mux)
	log.Fatal(err)
}
