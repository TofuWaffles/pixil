package handlers

import (
	"context"
	"net/http"
	"os"
	"time"
)

type Middleware func(http.HandlerFunc) http.HandlerFunc

// Chains together multiple middleware ending with a handler.
func (e Env) Chain(f http.HandlerFunc, middleware ...Middleware) http.HandlerFunc {
	for _, m := range middleware {
		f = m(f)
	}

	return f
}

// Basic chain providing middleware that should be used by most if not all handlers.
func (e Env) BasicChain(f http.HandlerFunc) http.HandlerFunc {
	timeout := time.Duration(60 * float64(time.Second))
	url := os.Getenv("DOMAIN_URL")
	return e.Chain(f, e.AllowCORS(url), e.Logging(), e.Timeout(timeout))
}

// User authentication on top of the basic chain.
func (e Env) BasicAuthChain(f http.HandlerFunc) http.HandlerFunc {
	return e.Chain(f, e.Authenticate(), e.BasicChain)
}

// Logs access and execution time of a handler.
func (e Env) Logging() Middleware {
	return func(f http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			e.Logger.Info("Serving", "path", r.URL.Path, "method", r.Method, "remote_addr", r.RemoteAddr, "started_at", start)
			defer func() {
				e.Logger.Info("Finished serving", "path", r.URL.Path, "method", r.Method, "remote_addr", r.RemoteAddr, "finished_in", time.Since(start))
			}()

			f(w, r)
		}
	}
}

// Cancels handlers after a specified timeout period has elapsed.
func (e Env) Timeout(timeout time.Duration) Middleware {
	return func(f http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			ctx, cancel := context.WithTimeout(r.Context(), timeout)
			defer func() {
				cancel()
				if ctx.Err() == context.DeadlineExceeded {
					w.WriteHeader(http.StatusGatewayTimeout)
					e.Logger.Error("Handler timed out", "path", r.URL.Path)
				}
			}()
			r = r.WithContext(ctx)

			f(w, r)
		}
	}
}

// AllowCORS is a middleware that enables CORS for requests coming from a specific origin.
func (e Env) AllowCORS(allowedOrigin string) Middleware {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			if origin == allowedOrigin {
				w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			}

			// Handle preflight request
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			next(w, r)
		}
	}
}

func (e Env) GetOnly() Middleware {
	return func(f http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			if r.Method != "" && r.Method != "GET" {
				http.Error(w, "Only GET requests are allowed for this path.", http.StatusBadRequest)
				e.Logger.Error("Non-GET method used on request", "method", r.Method)
				return
			}

			f(w, r)
		}
	}
}

func (e Env) PostOnly() Middleware {
	return func(f http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			if r.Method != "" && r.Method != "POST" {
				http.Error(w, "Only POST requests are allowed for this path.", http.StatusBadRequest)
				e.Logger.Error("Non-POST method used on request", "method", r.Method)
				return
			}

			f(w, r)
		}
	}
}
