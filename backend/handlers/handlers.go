package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"image/jpeg"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

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
	w.Write([]byte("Hello from Pixil. This route is a test to check if the API is working, which it is. :)"))
}

// Gets all active media.
func (e Env) AllActiveMedia(w http.ResponseWriter, r *http.Request) {
	mediaStatus := r.URL.Query().Get("status")

	if mediaStatus == "" {
		media, err := models.GetAllMedia(r.Context(), e.Database, -1)
		if err != nil {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error trying to all active media", "error", err.Error())
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(media)
	} else {
		mediaStatus, err := strconv.Atoi(mediaStatus)
		if err != nil {
			http.Error(w, "The mediaStatus parameter must be a number", http.StatusBadRequest)
			return
		}
		media, err := models.GetAllMedia(r.Context(), e.Database, mediaStatus)
		if err != nil {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error trying to all active media", "error", err.Error())
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(media)
	}
}

// Get a thumbnail of a media with the ID specified in the URL parameter.
func (e Env) Thumbnail(w http.ResponseWriter, r *http.Request) {
	id, err := utils.IdFromParam(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		e.Logger.Error("Error trying to parse ID from the request parameter", "error", err.Error())
		return
	}

	var buf bytes.Buffer
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
	mediaFp := filepath.Clean(filepath.Join(utils.MediaDir, media.FileName))

	if filepath.Ext(media.FileName) == ".jpg" || filepath.Ext(media.FileName) == ".png" {
		img, err := utils.LoadImage(mediaFp)

		if err != nil {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error trying to generate thumbnail", "error", err.Error(), "filename", media.FileName)
		}

		err = jpeg.Encode(&buf, img, &jpeg.Options{Quality: 50})
		if err != nil {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error trying to encode the thumbnail", "error", err.Error(), "filename", media.FileName)
			return
		}
	} else if filepath.Ext(media.FileName) == ".mp4" {
		cmd := exec.Command("ffmpeg", "-i", mediaFp, "-vframes", "1", "-qscale:v", "4", "-f", "image2", "-")
		cmd.Stdout = &buf
		err := cmd.Run()
		if err != nil {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error trying to generate thumbnail from video", "error", err.Error(), "filename", media.FileName)
		}
	}

	w.Header().Set("Content-Type", "image/jpeg")
	w.Header().Set("Content-Length", strconv.Itoa(buf.Len()))

	_, err = w.Write(buf.Bytes())
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to write the thumbnail contents to the response", "error", err.Error())
	}
}

func (e Env) Media(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		if r.URL.Query().Get("id") != "" {
			e.GetMediaDetails(w, r)
			return
		}
		if r.URL.Query().Get("tag") != "" {
			e.SearchMedia(w, r)
			return
		}
		e.AllActiveMedia(w, r)
		return
	}
	if r.Method == "POST" {
		e.UploadMedia(w, r)
		return
	}

	http.Error(w, genericErrMsg, http.StatusBadRequest)
}

// Get a media with the ID specified in the URL parameter.
func (e Env) GetMediaContent(w http.ResponseWriter, r *http.Request) {
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
	mediaFp := filepath.Clean(filepath.Join(utils.MediaDir, media.FileName))

	if filepath.Ext(media.FileName) == ".jpg" || filepath.Ext(media.FileName) == ".png" {
		img, err := utils.LoadImage(mediaFp)
		var buf bytes.Buffer

		if err != nil {
			if err == pgx.ErrNoRows {
				http.Error(w, "Media with this ID was not found.", http.StatusNotFound)
				e.Logger.Error("Media with given ID was not found", "id", id)
			} else {
				http.Error(w, genericErrMsg, http.StatusInternalServerError)
				e.Logger.Error("Error trying to load image", "error", err.Error())
			}
			return
		}

		err = jpeg.Encode(&buf, img, &jpeg.Options{Quality: 100})
		if err != nil {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error trying to encode the image", "error", err.Error())
			return
		}
		w.Header().Set("Content-Type", "image/jpeg")
		w.Header().Set("Content-Length", strconv.Itoa(buf.Len()))

		w.WriteHeader(http.StatusOK)
		_, err = w.Write(buf.Bytes())
		if err != nil {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error trying to write the image contents to the response", "error", err.Error())
		}
	} else if filepath.Ext(media.FileName) == ".mp4" {
		vidFile, err := os.Open(mediaFp)
		if err != nil {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Unable to open video file", "file", media.FileName, "error", err)
		}
		http.ServeContent(w, r, media.FileName, time.Time{}, vidFile)
	}
}

func (e Env) UploadMedia(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to create new directory for media", "error", err)
		return
	}
	defer file.Close()

	dir := "/pixil-media/"
	err = os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to create new directory for media", "error", err)
		return
	}

	var sb strings.Builder
	sb.WriteString(strconv.FormatInt(time.Now().Unix(), 10))
	sb.WriteString("_")
	sb.WriteString(filepath.Clean(header.Filename))
	fileName := sb.String()
	path := filepath.Join(dir, filepath.Base(fileName))
	dst, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to open file when uploading media", "error", err)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to copy file when uplaoding media", "error", err)
		return
	}

	media := models.Media{
		FileName:   fileName,
		OwnerEmail: "",
		FileType:   filepath.Ext(path),
		Status:     models.Active,
	}

	id, err := models.AddMedia(r.Context(), e.Database, media)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to add media to the database", "error", err, "media", media)
		return
	}

	go e.ClassifyMedia(id)

	return
}

func (e Env) SearchMedia(w http.ResponseWriter, r *http.Request) {
	tag := r.URL.Query().Get("tag")
	media, err := models.GetTaggedMedia(r.Context(), e.Database, tag)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to retrieve tagged media IDs from database", "error", err, "tag", tag)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(media)
}

func (e Env) Album(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		e.GetAllAlbums(w, r)
		return
	} else if r.Method == "POST" {
		e.AddAlbum(w, r)
		return
	}

	http.Error(w, "Bad request method.", http.StatusBadRequest)
}

func (e Env) GetAllAlbums(w http.ResponseWriter, r *http.Request) {
	albums, err := models.GetAllAlbums(r.Context(), e.Database)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to retrieve albums from the database", "error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(albums)
}

func (e Env) AddAlbum(w http.ResponseWriter, r *http.Request) {
	albumName := r.URL.Query().Get("name")
	if albumName == "" {
		http.Error(w, "Album name cannot be empty.", http.StatusBadRequest)
		return
	}
	err := models.AddAlbum(r.Context(), e.Database, albumName)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to add album to the database", "error", err, "album_name", albumName)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (e Env) AlbumMedia(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		e.GetAlbumMedia(w, r)
	} else if r.Method == "POST" {
		e.AddAlbumMedia(w, r)
	}

	http.Error(w, "Bad request method.", http.StatusBadRequest)
}

func (e Env) GetAlbumMedia(w http.ResponseWriter, r *http.Request) {
	albumId, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to convert id string to int", "error", err, "album_id", albumId)
		return
	}
	media, err := models.GetAlbumMedia(r.Context(), e.Database, albumId)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to retrieve media from database based on media IDs", "error", err, "album_id", albumId)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(media)
}

func (e Env) AddAlbumMedia(w http.ResponseWriter, r *http.Request) {
	albumId, err := strconv.Atoi(r.URL.Query().Get("album_id"))
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to convert id string to int", "error", err, "album_id", albumId)
		return
	}
	mediaId, err := strconv.Atoi(r.URL.Query().Get("media_id"))
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to convert id string to int", "error", err, "media_id", mediaId)
		return
	}
	err = models.AddAlbumMedia(r.Context(), e.Database, albumId, mediaId)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to add album media to database", "error", err)
	}

	w.WriteHeader(http.StatusOK)
}

func (e Env) GetMediaDetails(w http.ResponseWriter, r *http.Request) {
	mediaId, err := strconv.Atoi(r.URL.Query().Get("id"))
	details, err := models.GetMedia(r.Context(), e.Database, mediaId)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to get details of a specific media", "error", err, "media_id", mediaId)
		return
	}
	tags, err := models.GetMediaTags(r.Context(), e.Database, mediaId)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to get tags of a specific media", "error", err, "media_id", mediaId)
		return
	}

	media := struct {
		Id         int       `json:"id"`
		FileName   string    `json:"fileName"`
		OwnerEmail string    `json:"ownerEmail"`
		FileType   string    `json:"fileType"`
		Status     int       `json:"status"`
		CreatedAt  time.Time `json:"createdAt"`
		Tags       []string  `json:"tags"`
	}{
		Id:         details.Id,
		FileName:   details.FileName,
		OwnerEmail: details.OwnerEmail,
		FileType:   details.FileType,
		Status:     details.Status,
		CreatedAt:  details.CreatedAt,
		Tags:       tags,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(media)
}

func (e Env) ClassifyMedia(mediaID int) {
	media, err := models.GetMedia(context.Background(), e.Database, mediaID)
	if err != nil {
		e.Logger.Error("Unable to get media from ID", "error", err)
	}
	filename := media.FileName

	req, err := http.NewRequest("GET", "http://classifier:5000", nil)
	if err != nil {
		e.Logger.Error("Unable to create the http request for media classification", "error", err)
		return
	}
	q := req.URL.Query()
	q.Add("filename", filename)
	req.URL.RawQuery = q.Encode()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := http.Client{
		Timeout: 60 * time.Second,
	}

	res, err := client.Do(req)
	if err != nil {
		e.Logger.Error("Unable to classify media", "error", err, "filename", filename)
		return
	}
	defer res.Body.Close()
	var labels struct {
		Labels []string
	}
	json.NewDecoder(res.Body).Decode(&labels)

	for _, tag := range labels.Labels {
		err := models.AddTag(context.Background(), e.Database, mediaID, tag)
		if err != nil {
			e.Logger.Error("Unable to write tag to the database", "error", err, "media_id", mediaID, "tag", tag)
		}
	}
}
