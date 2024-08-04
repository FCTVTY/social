package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
	requestCount = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"method", "handler", "status"},
	)
)

func init() {
	prometheus.MustRegister(requestCount)
}

func main() {
	// Register /metrics endpoint
	http.Handle("/metrics", promhttp.Handler())

	// Basic log middleware
	http.Handle("/", logMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, world!"))
	})))

	fmt.Println("Listening on :3002")
	log.Fatal(http.ListenAndServe(":3002", nil))
}

// Middleware to log each request and capture metrics
func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Increment the request count metric
		requestCount.WithLabelValues(r.Method, r.URL.Path, "200").Inc()

		// Call the next handler in the chain
		next.ServeHTTP(w, r)
	})
}
