package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"log"
	"log/slog"
	"mime"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/TofuWaffles/pixil/database"
	"github.com/TofuWaffles/pixil/utils"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Used to pass data that typically needs to be accessed by all handlers like database connections and loggers.
type Env struct {
	Database *pgxpool.Pool
	Logger   *slog.Logger
}

const genericErrMsg = "Something went wrong when trying serve the request"

func Home(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello from Seallove!"))
}

func (e Env) AllActiveMedia(w http.ResponseWriter, r *http.Request) {
	media, err := models.GetAllMedia(r.Context(), e.Database, models.Active)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to all active media", "error", err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(media)
}

func (e Env) Media(w http.ResponseWriter, r *http.Request) {
	id, err := utils.IdFromParam(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		e.Logger.Error("Error trying to parse ID form parameter", "error", err.Error())
		return
	}

	media, err := models.GetMedia(r.Context(), e.Database, id)
	if err != nil {
		if err == pgx.ErrNoRows {
			http.Error(w, "Media with this ID was not found.", http.StatusNotFound)
		} else {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error trying to get media information from the database", "error", err.Error())
		}
		return
	}

	file, err := os.Open(media.Filepath)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to open media file", "error", err.Error())
		return
	}
	defer file.Close()

	mimeType := mime.TypeByExtension(filepath.Ext(media.Filepath))
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to read the file into bytes", "error", err.Error())
		return
	}

	file.Close()

	w.Header().Set("Content-Type", mimeType)
	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(fileBytes)))

	w.WriteHeader(http.StatusOK)
	_, err = w.Write(fileBytes)
	if err != nil {
		log.Printf("error writing response: %v", err)
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to send file bytes in response", "error", err.Error())
	}
}

func (e Env) Thumbnail(w http.ResponseWriter, r *http.Request) {
	id, err := utils.IdFromParam(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		e.Logger.Error("Error trying to parse ID from the request parameter", "error", err.Error())
		return
	}

	media, err := models.GetMedia(r.Context(), e.Database, id)
	if err != nil {
		if err == pgx.ErrNoRows {
			http.Error(w, "Media with this ID was not found.", http.StatusNotFound)
			e.Logger.Error("Media with given ID was not found", "id", id)
		} else {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error trying to get media information from the database", "error", err.Error())
		}
		return
	}

	file, err := os.Open(media.Filepath)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to open file", "error", err.Error())
		return
	}
	defer file.Close()

	var img image.Image
	switch filepath.Ext(media.Filepath) {
	case ".png":
		img, err = png.Decode(file)
	case ".jpg", ".jpeg":
		img, err = jpeg.Decode(file)
	default:
		http.Error(w, "unsupported image format", http.StatusUnsupportedMediaType)
		return
	}
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to decode the file", "error", err.Error())
		return
	}

	var buf bytes.Buffer
	err = jpeg.Encode(&buf, img, &jpeg.Options{Quality: 50})
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to encode the thumbnail", "error", err.Error())
		return
	}

	w.Header().Set("Content-Type", "image/jpeg")
	w.Header().Set("Content-Length", strconv.Itoa(buf.Len()))

	w.WriteHeader(http.StatusOK)
	_, err = w.Write(buf.Bytes())
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to write the thumbnail contents to the response", "error", err.Error())
	}
}

func (e Env) UploadTest(w http.ResponseWriter, r *http.Request) {
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

	path := filepath.Join(dir, filepath.Base(header.Filename))
	dst, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		panic(err)
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		panic(err)
	}

	media := models.Media{
		Filepath:   path,
		OwnerEmail: "",
		FileType:   filepath.Ext(path),
		Status:     models.Active,
	}

	err = models.AddMedia(r.Context(), e.Database, media)
	if err != nil {
		panic(err)
	}

	return
}

func (e Env) DownloadTest(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

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
}
