package utils

import (
	"context"
	"errors"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"

	"github.com/TofuWaffles/pixil/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

// TODO: Handle target and src dir using env vars or conf files or something
const MediaDir = "/pixil-media/"

func LoadImage(ctx context.Context, db *pgxpool.Pool, id int) (image.Image, error) {
	var img image.Image
	media, err := models.GetMedia(ctx, db, id)

	mediaFp := filepath.Join(MediaDir, media.FileName)
	file, err := os.Open(mediaFp)
	if err != nil {
		return img, err
	}
	defer file.Close()

	switch filepath.Ext(media.FileName) {
	case ".png":
		img, err = png.Decode(file)
	case ".jpg", ".jpeg":
		img, err = jpeg.Decode(file)
	default:
		return img, errors.New("Invalid file format detected for file: " + media.FileName)
	}

	return img, err
}
