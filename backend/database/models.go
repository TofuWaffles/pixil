package models

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	Email        string
	Username     string
	PasswordSalt string
	PasswordHash string
}

const (
	Active   = iota
	Archived = iota
	Deleted  = iota
)

type Media struct {
	Id         int32
	Path       string
	OwnerEmail string
	FileType   string
	Status     int
}

type Tag struct {
	MediaId int32
	Label   string
}

func GetUser(ctx context.Context, db *pgxpool.Pool, email string) (User, error) {
	row := db.QueryRow(ctx,
		`SELECT email, username, password_salt, password_hash
		FROM user
		WHERE email = $1`,
		email,
	)

	user := User{}
	err := row.Scan(user.Email, user.Username, user.PasswordSalt, user.PasswordHash)

	return user, err
}

func AddUser(ctx context.Context, db *pgxpool.Pool, user User) error {
	_, err := db.Exec(ctx,
		`INSERT INTO user (email, username, password_salt, password_hash)
		VALUES $1, $2, $3, $4`,
		user.Email,
		user.Username,
		user.PasswordSalt,
		user.PasswordHash,
	)
	return err
}

func GetMedia(ctx context.Context, db *pgxpool.Pool, id int32) (Media, error) {
	row := db.QueryRow(ctx,
		`SELECT (id, path, owner_email, file_type, status)
		FROM media
		WHERE id = $1`,
		id,
	)

	media := Media{}
	err := row.Scan(media.Id, media.Path, media.OwnerEmail, media.FileType, media.Status)

	return media, err
}

func GetAllActiveMedia(ctx context.Context, db *pgxpool.Pool) ([]Media, error) {
	media := []Media{}
	rows, err := db.Query(ctx,
		`SELECT (id, path, owner_email, file_type, status)
		FROM media
		WHERE status = $1`,
		Active,
	)
	if err != nil {
		return media, err
	}
	defer rows.Close()

	cur := Media{}
	for rows.Next() {
		if err := rows.Scan(cur.Id, cur.Path, cur.OwnerEmail, cur.FileType, cur.Status); err != nil {
			return []Media{}, err
		}
		media = append(media, cur)
		cur = Media{}
	}
	if err = rows.Err(); err != nil {
		return []Media{}, err
	}

	return media, nil
}

func AddMedia(ctx context.Context, db *pgxpool.Pool, media Media) error {
	_, err := db.Exec(ctx,
		`INSERT INTO media (path, owner_email, file_type, status)
		VALUES $1, $2, $3, $4`,
		media.Path,
		media.OwnerEmail,
		media.FileType,
		media.Status,
	)
	return err
}
