package main

import (
	"github.com/TofuWaffles/pixil/handlers"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
    mux.HandleFunc("/", handlers.Home)

	log.Println("Starting server on :4000")

	err := http.ListenAndServe(":4000", mux)
	log.Fatal(err)
}
