package models

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	Member = iota
	Admin  = iota
)

// A user within the system.
type User struct {
	Email        string `json:"email"`
	Username     string `json:"username"`
	PasswordHash string `json:"passwordHash"`
	UserType     int    `json:"userType"`
}

// Represents media status.
const (
	Active   = iota
	Archived = iota
	Deleted  = iota
)

// Media includes images and video files on the system.
type Media struct {
	Id         int       `json:"id"`
	FileName   string    `json:"fileName"`
	OwnerEmail string    `json:"ownerEmail"`
	FileType   string    `json:"fileType"`
	Status     int       `json:"status"`
	CreatedAt  time.Time `json:"createdAt"`
}

// A tag associated with a media, describing the objects that exists in that media.
type Tag struct {
	MediaId int    `json:"mediaId"`
	Label   string `json:"label"`
}

// Retrieves a user from the database associated with a given email.
func GetUser(ctx context.Context, db *pgxpool.Pool, email string) (User, error) {
	rows, _ := db.Query(ctx,
		`SELECT email, username, password_hash, user_type
		FROM "user"
		WHERE email = $1`,
		email,
	)

	return pgx.CollectOneRow(rows, pgx.RowToStructByName[User])
}

func GetAllUsers(ctx context.Context, db *pgxpool.Pool) ([]User, error) {
	var rows pgx.Rows
	rows, _ = db.Query(ctx,
		`SELECT email, username, password_hash, user_type
		FROM "user"`,
	)

	return pgx.CollectRows(rows, pgx.RowToStructByName[User])
}

// Inserts a user to the database.
func AddUser(ctx context.Context, db *pgxpool.Pool, user User) error {
	_, err := db.Exec(ctx,
		`INSERT INTO "user" (email, username, password_hash, user_type)
		VALUES ($1, $2, $3, $4)`,
		user.Email,
		user.Username,
		user.PasswordHash,
		user.UserType,
	)
	return err
}

func CheckUserExists(ctx context.Context, db *pgxpool.Pool, email string) (bool, error) {
	var res bool
	err := db.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM "user" WHERE email = $1)`, email).Scan(&res)
	return res, err
}

// Retrieves media of a given ID from the database. This does not include the file contents.
func GetMedia(ctx context.Context, db *pgxpool.Pool, id int) (Media, error) {
	rows, err := db.Query(ctx,
		`SELECT id, file_name, owner_email, file_type, status, created_at
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

// Retrieves all media of a given status. If a status number of less than 0 is passed in, retrieves all media regardless of status.
func GetAllMedia(ctx context.Context, db *pgxpool.Pool, status int) ([]Media, error) {
	var rows pgx.Rows
	if status >= 0 {
		rows, _ = db.Query(ctx,
			`SELECT id, file_name, owner_email, file_type, status, created_at
			FROM media
			WHERE status = $1`,
			status,
		)
	} else {
		rows, _ = db.Query(ctx,
			`SELECT id, file_name, owner_email, file_type, status, created_at
			FROM media`,
		)
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Media])
}

// Inserts a new media into the database.
func AddMedia(ctx context.Context, db *pgxpool.Pool, media Media) (int, error) {
	var id int
	err := db.QueryRow(ctx,
		`INSERT INTO media (file_name, owner_email, file_type, status, created_at)
		VALUES ($1, $2, $3, $4, NOW())
    RETURNING id`,
		media.FileName,
		media.OwnerEmail,
		media.FileType,
		media.Status,
	).Scan(&id)

	return id, err
}

func AddTag(ctx context.Context, db *pgxpool.Pool, mediaId int, tag string) error {
	_, err := db.Exec(ctx,
		`INSERT INTO tag (media_id, name)
		VALUES ($1, $2)
		`,
		mediaId,
		tag,
	)

	return err
}

func GetTaggedMedia(ctx context.Context, db *pgxpool.Pool, tag string) ([]int, error) {
	var ids []int
	rows, err := db.Query(ctx,
		`SELECT media_id FROM tag
		WHERE name = $1
		`,
		tag,
	)
	if err != nil {
		return ids, err
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		err := rows.Scan(&id)
		if err != nil {
			return []int{}, err
		}
		ids = append(ids, id)
	}

	if err := rows.Err(); err != nil {
		return []int{}, err
	}

	return ids, nil
}
