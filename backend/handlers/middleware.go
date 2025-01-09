package handlers

import (
	"context"
	"net/http"
	"time"
)

type Middleware func(http.HandlerFunc) http.HandlerFunc

// Chains together multiple middleware ending with a handler.
func Chain(f http.HandlerFunc, middleware ...Middleware) http.HandlerFunc {
	for _, m := range middleware {
		f = m(f)
	}

	return f
}

// Basic chain providing middleware that should be used by most if not all handlers.
func (e Env) BasicChain(f http.HandlerFunc) http.HandlerFunc {
	timeout := time.Duration(60 * float64(time.Second))
	return Chain(f, e.Logging(), e.Timeout(timeout))
}

// Logs access and execution time of a handler.
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
