package handlers

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"os"
	"path/filepath"
	"strings"
)

func Home(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello from Seallove!"))
}

func UploadTest(w http.ResponseWriter, r *http.Request) {
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

func enableCORS(w http.ResponseWriter) {
	// TODO: Make this a chainable middleware
	w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins (adjust this in production)
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
}

func ListMedia(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
}

func DownloadTest(w http.ResponseWriter, r *http.Request) {
	enableCORS(w) // Add CORS headers
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	fmt.Println("Downloading Canny...")
	mw := multipart.NewWriter(w)
	w.Header().Set("Content-Type", mw.FormDataContentType())

	path := "/pixil-media/"
	entries, err := os.ReadDir(path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, entry := range entries {
		var filePath strings.Builder
		filePath.WriteString(path)
		filename := entry.Name()
		filePath.WriteString(filename)
		fileBytes, err := os.ReadFile(filePath.String())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		contentType := http.DetectContentType(fileBytes)

		partHeader := textproto.MIMEHeader{}
		partHeader.Set("Content-Disposition", fmt.Sprintf(`form-data; name="file"; filename="%s"`, entry.Name()))
		partHeader.Set("Content-Type", contentType)
		fw, err := mw.CreatePart(partHeader)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if _, err := fw.Write(fileBytes); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
	if err := mw.Close(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println("Downloaded Canny")
}
