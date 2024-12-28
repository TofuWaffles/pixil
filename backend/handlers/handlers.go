package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func Home(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello from Seallove!"))
}

func ReceiveMedia(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Uploading Canny...")
	r.ParseMultipartForm(32 << 20)

	file, header, err := r.FormFile("file")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	dir := "/pixil-media/"
	err = os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		panic(err)
	}
	dst, err := os.OpenFile(filepath.Join(dir, filepath.Base(header.Filename)), os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		panic(err)
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		panic(err)
	}

	fmt.Println("Done uploading Canny!")

	return
}
