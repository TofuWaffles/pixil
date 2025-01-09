package models

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	Email        string `json:"email"`
	Username     string `json:"username"`
	PasswordSalt string `json:"passwordSalt"`
	PasswordHash string `json:"passwordHash"`
}

const (
	Active   = iota
	Archived = iota
	Deleted  = iota
)

type Media struct {
	Id         int       `json:"id"`
	Filepath   string    `json:"filepath"`
	OwnerEmail string    `json:"ownerEmail"`
	FileType   string    `json:"fileType"`
	Status     int       `json:"status"`
	CreatedAt  time.Time `json:"createdAt"`
}

type Tag struct {
	MediaId int    `json:"mediaId"`
	Label   string `json:"label"`
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
		VALUES ($1, $2, $3, $4)`,
		user.Email,
		user.Username,
		user.PasswordSalt,
		user.PasswordHash,
	)
	return err
}

func GetMedia(ctx context.Context, db *pgxpool.Pool, id int) (Media, error) {
	rows, err := db.Query(ctx,
		`SELECT id, filepath, owner_email, file_type, status, created_at
		FROM media
		WHERE id = $1
		LIMIT 1
		`,
		id,
	)
	if err != nil {
		return Media{}, err
	}

	return pgx.CollectOneRow(rows, pgx.RowToStructByName[Media])
}

func GetAllMedia(ctx context.Context, db *pgxpool.Pool, status int) ([]Media, error) {
	rows, _ := db.Query(ctx,
		`SELECT id, filepath, owner_email, file_type, status, created_at
		FROM media
		WHERE status = $1`,
		status,
	)
	defer rows.Close()

	media, err := pgx.CollectRows(rows, pgx.RowToStructByName[Media])
	if err != nil {
		return []Media{}, err
	}

	return media, nil
}

func AddMedia(ctx context.Context, db *pgxpool.Pool, media Media) error {
	_, err := db.Exec(ctx,
		`INSERT INTO media (filepath, owner_email, file_type, status, created_at)
		VALUES ($1, $2, $3, $4, NOW())`,
		media.Filepath,
		media.OwnerEmail,
		media.FileType,
		media.Status,
	)
	return err
}
