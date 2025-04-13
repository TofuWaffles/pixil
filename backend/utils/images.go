package utils

import (
	"errors"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"
)

const MediaDir = "/pixil-media/"

func LoadImage(mediaFp string) (image.Image, error) {
	var img image.Image

	file, err := os.Open(mediaFp)
	if err != nil {
		return img, err
	}
	defer file.Close()

	switch filepath.Ext(mediaFp) {
	case ".png":
		img, err = png.Decode(file)
	case ".jpg", ".jpeg":
		img, err = jpeg.Decode(file)
	default:
		return img, errors.New("Invalid file format detected for file: " + filepath.Base(mediaFp))
	}

	return img, err
}
