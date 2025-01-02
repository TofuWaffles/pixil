package database

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	email         string
	username      string
	password_salt string
	password_hash string
}

const (
	active   = iota
	archived = iota
	deleted  = iota
)

type Media struct {
	id          int32
	path        string
	owner_email string
	file_type   string
	status      int
}

type Tag struct {
	media_id int32
	name     string
}

func GetUser(ctx context.Context, db *pgxpool.Pool, email string) (User, error) {
	row := db.QueryRow(ctx,
		`SELECT email, username, password_salt, password_hash
		FROM user
		WHERE email = $1`,
		email,
	)

	user := User{}
	err := row.Scan(user.email, user.username, user.password_salt, user.password_hash)

	return user, err
}

func AddUser(ctx context.Context, db *pgxpool.Pool, user User) error {
	_, err := db.Exec(ctx,
		`INSERT INTO user (email, username, password_salt, password_hash)
		VALUES $1, $2, $3, $4`,
		user.email,
		user.username,
		user.password_salt,
		user.password_hash,
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
	err := row.Scan(media.id, media.path, media.owner_email, media.file_type, media.status)

	return media, err
}

func GetAllActiveMedia(ctx context.Context, db *pgxpool.Pool) ([]Media, error) {
	media := []Media{}
	rows, err := db.Query(ctx,
		`SELECT (id, path, owner_email, file_type, status)
		FROM media
		WHERE status = $1`,
		active,
	)
	if err != nil {
		return media, err
	}
	defer rows.Close()

	cur := Media{}
	for rows.Next() {
		if err := rows.Scan(cur.id, cur.path, cur.owner_email, cur.file_type, cur.status); err != nil {
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
		media.path,
		media.owner_email,
		media.file_type,
		media.status,
	)
	return err
}
