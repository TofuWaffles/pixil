package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	models "github.com/TofuWaffles/pixil/database"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

func (e Env) User(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		e.GetUser(w, r)
		return
	} else if r.Method == "POST" {
		e.PostUser(w, r)
		return
	}

	w.WriteHeader(http.StatusBadRequest)
}

func (e Env) GetUser(w http.ResponseWriter, r *http.Request) {
	type SanitizedUser struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		UserType int    `json:"userType"`
	}

	email := r.URL.Query().Get("email")

	if email == "" {
		users, err := models.GetAllUsers(r.Context(), e.Database)
		if err != nil {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error while trying to get all users from the database", "error", err)
			return
		}
		sanitizedUsers := []SanitizedUser{}
		for _, user := range users {
			sanitizedUsers = append(sanitizedUsers, SanitizedUser{
				Email:    user.Email,
				Username: user.Username,
				UserType: user.UserType,
			})
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		err = json.NewEncoder(w).Encode(sanitizedUsers)
		if err != nil {
			http.Error(w, genericErrMsg, http.StatusInternalServerError)
			e.Logger.Error("Error trying to get all users", "error", err)
			return
		}

		return
	}

	user, err := models.GetUser(r.Context(), e.Database, email)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error while trying to get a user from the database", "error", err, "email", email)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(SanitizedUser{
			Email:    user.Email,
			Username: user.Username,
			UserType: user.UserType,
		})
	}
}

func (e Env) PostUser(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var registerUser struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		Password string `json:"password"`
		UserType int    `json:"userType"`
	}
	err := decoder.Decode(&registerUser)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to decode response from json body", "error", err, "body", r.Body)
		return
	}
	registerUser.Email = strings.ToLower(registerUser.Email)
	e.Logger.Debug("User", "user", registerUser)

	exists, err := models.CheckUserExists(r.Context(), e.Database, registerUser.Email)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to check if the user exists in the database", "error", err, "email", registerUser.Email)
		return
	}
	if exists {
		http.Error(w, "User already exists", http.StatusConflict)
		e.Logger.Error("User already exists lol", "email", registerUser.Email)
		return
	}

	fmt.Println("Hashing password: ", registerUser.Password)
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(registerUser.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to hash the provided password", "error", err)
		return
	}

	if err = models.AddUser(r.Context(), e.Database, models.User{
		Email:        registerUser.Email,
		Username:     registerUser.Username,
		PasswordHash: string(passwordHash),
		UserType:     registerUser.UserType,
	}); err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to add user to the database", "error", err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (e Env) Login(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var loginUser struct {
		Email    string
		Password string
	}
	err := decoder.Decode(&loginUser)
	loginUser.Email = strings.ToLower(loginUser.Email)

	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Unable to decode response from json body", "error", err, "body", r.Body)
		return
	}

	user, err := models.GetUser(r.Context(), e.Database, loginUser.Email)
	if err != nil {
		if err == pgx.ErrNoRows {
			http.Error(w, "No user with the provided email was found.", http.StatusNotFound)
			return
		}
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error trying to retrieve user from database", "error", err)
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginUser.Password)); err != nil {
		http.Error(w, "Wrong password provided.", http.StatusUnauthorized)
		hash, _ := bcrypt.GenerateFromPassword([]byte(loginUser.Password), bcrypt.DefaultCost)
		e.Logger.Error("Wrong password", "password", loginUser.Password, "error", err, "hash", hash)
		return
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"email":    user.Email,
			"username": user.Username,
			"userType": user.UserType,
			"sub":      "auth",
			"iss":      "pixil",
			"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(),
			"iat":      time.Now().Unix(),
		}).SignedString([]byte(os.Getenv("JWT_KEY")))
	if err != nil {
		http.Error(w, genericErrMsg, http.StatusInternalServerError)
		e.Logger.Error("Error generating JWT.", "error", err, "user_email", user.Email)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(struct{ Token string }{Token: token})
}
