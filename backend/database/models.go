package models

import (
	"context"

	"github.com/jackc/pgx/v5"
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
	Id         int
	Filepath   string
	OwnerEmail string
	FileType   string
	Status     int
}

type Tag struct {
	MediaId int
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
		`SELECT id, filepath, owner_email, file_type, status
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

func GetAllActiveMedia(ctx context.Context, db *pgxpool.Pool) ([]Media, error) {
	rows, _ := db.Query(ctx,
		`SELECT id, filepath, owner_email, file_type, status
		FROM media
		WHERE status = $1`,
		Active,
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
		`INSERT INTO media (filepath, owner_email, file_type, status)
		VALUES ($1, $2, $3, $4)`,
		media.Filepath,
		media.OwnerEmail,
		media.FileType,
		media.Status,
	)
	return err
}
