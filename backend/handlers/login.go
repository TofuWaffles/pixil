package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	models "github.com/TofuWaffles/pixil/database"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

type LoginUser struct {
	email    string
	password string
}

func (e Env) Register(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var loginUser LoginUser
	err := decoder.Decode(&loginUser)

	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to decode response from json body", "error", err, "body", r.Body)
		return
	}

	user, err := models.GetUser(r.Context(), e.Database, loginUser.email)
	if err != nil {
		if err == pgx.ErrNoRows {
			http.Error(w, "No user with the provided email was found.", http.StatusNotFound)
			return
		}
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to retrieve user from database", "error", err)
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginUser.password)); err != nil {
		http.Error(w, "Wrong password provided.", http.StatusUnauthorized)
		return
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodES256,
		jwt.MapClaims{
			"email":     user.Email,
			"expiresIn": "7d",
		}).SignedString(os.Getenv("JWT_KEY"))
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error generating JWT.", "error", err, "user_email", user.Email)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(struct{ token string }{token: token})
}
