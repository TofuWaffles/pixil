package database

type User struct {
	email         string
	username      string
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
