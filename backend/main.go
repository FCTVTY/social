/*
 * Copyright (c) 2024.  Footfallfit & FICTIVITY. All rights reserved.
 * This code is confidential and proprietary to Footfallfit & FICTIVITY.
 * Unauthorized copying, modification, or distribution of this code is strictly prohibited.
 *
 * Authors:
 *
 * [@sam1f100](https://www.github.com/sam1f100)
 *
 */

package main

import (
	"context"
	"fmt"
	"footallfitserver/cmd/server/v1/admin"
	"footallfitserver/cmd/server/v1/client"
	_ "footallfitserver/models"
	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/userroles"
	"github.com/supertokens/supertokens-golang/supertokens"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

var mgclient *mongo.Client
var brandingCollection *mongo.Collection
var walkCollection *mongo.Collection
var voucherCollection *mongo.Collection
var userVoucherCollection *mongo.Collection
var placeCollection *mongo.Collection

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

// Middleware to log each request
func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Serve the request
		next.ServeHTTP(response, r)

		duration := time.Since(start)
		log.Printf("%s %s %s %s", r.Method, r.RequestURI, r.Proto, duration)
	})
}

func main() {
	envFile := ".env.dev" // Change this to ".env.prod" for production
	if os.Getenv("ENV") == "prod" {
		envFile = ".env.prod"
	}

	if err := godotenv.Load(envFile); err != nil {
		log.Fatalf("Error loading %s file: %v", envFile, err)
	}

	mongoURI := os.Getenv("MONGO_URI")

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	mgclient, _ = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	database := mgclient.Database("tenants")
	brandingCollection = database.Collection("tenants")
	walkCollection = database.Collection("walks")
	voucherCollection = database.Collection("voucher")
	userVoucherCollection = database.Collection("uservouchers")
	placeCollection = database.Collection("place")

	err := supertokens.Init(SuperTokensConfig)
	if err != nil {
		fmt.Println(err)
		panic(err.Error())
	}
	fmt.Println("supertokens init done..")

	resp, err := userroles.CreateNewRoleOrAddPermissions("admin", []string{"read:all", "delete:all", "edit:all"}, nil)

	if err != nil {
		// TODO: Handle error
		fmt.Println(err)
		return
	}
	if resp.OK.CreatedNewRole == false {
		// The role already exists
	}

	http.Handle("/metrics", promhttp.Handler()) // Expose Prometheus metrics

	http.ListenAndServe(":3001", logMiddleware(corsMiddleware(supertokens.Middleware(http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {

		parsedURL, err := url.Parse(r.URL.Path)
		if err != nil {
			// handle error
		}

		// Prefix all requests with "v1/"

		if parsedURL.Path == "/internal/admin" {

			userId := r.URL.Query().Get("userid")

			response, err := userroles.AddRoleToUser("public", userId, "admin", nil)
			if err != nil {
				// TODO: Handle error
				return
			}

			if response.UnknownRoleError != nil {
				fmt.Println("role missing")
				return
			}

			if response.OK.DidUserAlreadyHaveRole {
				// The user already had the role
				fmt.Println("user has role")
			}

		}

		if parsedURL.Path == "/v1/sessioninfo" {
			session.VerifySession(nil, client.Sessioninfo).ServeHTTP(rw, r)
			return
		}

		if parsedURL.Path == "/v1/tenants" && r.Method == "GET" {
			session.VerifySession(nil, client.Tenants).ServeHTTP(rw, r)

			return
		}

		if parsedURL.Path == "/v1/admin/attachvoucher" && r.Method == "POST" {
			session.VerifySession(nil, admin.AddWVoucher).ServeHTTP(rw, r)
			return
		}

		if parsedURL.Path == "/v1/user/voucher" && r.Method == "POST" {
			session.VerifySession(nil, client.AddUVoucher).ServeHTTP(rw, r)
			return
		}

		rw.WriteHeader(404)
	})))))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Check if the request Origin header is allowed
		if isAllowedOrigin(origin) {
			response.Header().Set("Access-Control-Allow-Origin", origin)
			response.Header().Set("Access-Control-Allow-Credentials", "true")
		}

		if r.Method == "OPTIONS" {
			response.Header().Set("Access-Control-Allow-Headers", strings.Join(append([]string{"Content-Type"}, supertokens.GetAllCORSHeaders()...), ","))
			response.Header().Set("Access-Control-Allow-Methods", "*")
			response.Write([]byte(""))
		} else {
			requestCount.WithLabelValues(r.Method, r.URL.Path, "200").Inc()
			next.ServeHTTP(response, r)
		}
	})
}

func isAllowedOrigin(origin string) bool {
	allowedDomains := os.Getenv("URL") // Comma-separated list of allowed domains

	domains := strings.Split(allowedDomains, ",")
	for _, domain := range domains {
		if origin == domain {
			return true
		}
	}
	return false
}
