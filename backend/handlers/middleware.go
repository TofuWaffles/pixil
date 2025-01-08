package handlers

import (
	"context"
	"net/http"
	"time"
)

type Middleware func(http.HandlerFunc) http.HandlerFunc

func Chain(f http.HandlerFunc, middleware ...Middleware) http.HandlerFunc {
	for _, m := range middleware {
		f = m(f)
	}

	return f
}

// Allows addtional chaining of pre-chained middleware
func (e Env) WrapMiddleware(http.HandlerFunc) Middleware {
	return func(f http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			f(w, r)
		}
	}
}

// Logs access and execution time of a handler
func (e Env) Logging() Middleware {
	return func(f http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			e.Logger.Info("Serving", "path", r.URL.Path, "remote_addr", r.RemoteAddr, "started_at", start)
			defer func() {
				e.Logger.Info("Finished serving", "path", r.URL.Path, "remote_addr", r.RemoteAddr, "finished_in", time.Since(start))
			}()

			f(w, r)
		}
	}
}

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
