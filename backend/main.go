package main

import (
	"bhiveserver/cmd/server/v1/admin"
	"bhiveserver/cmd/server/v1/client"
	_ "bhiveserver/models"
	"encoding/json"
	"fmt"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rollbar/rollbar-go"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/userroles"
	"github.com/supertokens/supertokens-golang/supertokens"
	"go.mongodb.org/mongo-driver/mongo"
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
	// Rollbar initialization

	// Prometheus setup
	prometheus.MustRegister(requestCount)
}

// Middleware to log each request and capture metrics
func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Create a custom response writer to capture the status code
		rw := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		// Serve the request
		defer func() {
			if err := recover(); err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()

		next.ServeHTTP(rw, r)

		duration := time.Since(start)
		method := r.Method
		path := r.URL.Path
		status := fmt.Sprintf("%d", rw.statusCode)

		requestCount.WithLabelValues(method, path, status).Inc()

		log.Printf("%s %s %s %s %d", r.Method, r.RequestURI, r.Proto, duration, rw.statusCode)

	})
}

// responseWriter is a custom wrapper to capture the HTTP status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func main() {
	//defer rollbar.Wait() // Waits for any remaining errors to be sent to Rollbar before exiting

	err := supertokens.Init(SuperTokensConfig)
	if err != nil {
		rollbar.Error(err) // Log initialization errors to Rollbar
		panic(err.Error())
	}
	fmt.Println("supertokens init done..")

	// Setup roles
	roles := []string{"admin", "moderator", "god"}
	permissions := []string{"read:all", "delete:all", "edit:all"}

	for _, role := range roles {
		resp, err := userroles.CreateNewRoleOrAddPermissions(role, permissions, nil)
		if err != nil {
			//rollbar.Error(err) // Log error to Rollbar
			fmt.Println(err)
			return
		}
		if resp.OK.CreatedNewRole == false {
			// The role already exists
		}
	}

	http.Handle("/metrics", promhttp.Handler())

	http.ListenAndServe(":3001", logMiddleware(corsMiddleware(supertokens.Middleware(http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		parsedURL, err := url.Parse(r.URL.Path)
		if err != nil {
			//rollbar.Error(fmt.Errorf("failed to parse URL: %v", err))
			http.Error(rw, "Internal Server Error", http.StatusInternalServerError)
			return
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
				response, err := userroles.RemoveUserRole("public", userId, "admin", nil)
				if err != nil {
					// TODO: Handle error
					return
				}
				if response.UnknownRoleError != nil {
					fmt.Println("role missing")
					return
				}
			}
		}
		if parsedURL.Path == "/internal/god" {
			userId := r.URL.Query().Get("userid")
			response, err := userroles.AddRoleToUser("public", userId, "god", nil)
			if err != nil {
				// TODO: Handle error
				return
			}
			if response.UnknownRoleError != nil {
				fmt.Println("role missing")
				return
			}
			if response.OK.DidUserAlreadyHaveRole {
				fmt.Println("user has role")
			}
		}
		if parsedURL.Path == "/internal/moderator" {
			userId := r.URL.Query().Get("userid")
			response, err := userroles.AddRoleToUser("public", userId, "moderator", nil)
			if err != nil {
				// TODO: Handle error
				return
			}
			if response.UnknownRoleError != nil {
				fmt.Println("role missing")
				return
			}
			if response.OK.DidUserAlreadyHaveRole {
				response, err := userroles.RemoveUserRole("public", userId, "moderator", nil)
				if err != nil {
					// TODO: Handle error
					return
				}
				if response.UnknownRoleError != nil {
					fmt.Println("role missing")
					return
				}
			}
		}

		if parsedURL.Path == "/v1/health" {
			rw.WriteHeader(http.StatusOK)
			rw.Write([]byte("OK")) // or you could return JSON: {"status": "healthy"}
			return
		}

		if parsedURL.Path == "/v1/user/roles" {
			session.VerifySession(nil, client.Roles).ServeHTTP(rw, r)
			return
		}

		if parsedURL.Path == "/v1/sessioninfo" {
			session.VerifySession(nil, client.Sessioninfo).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/communities" && r.Method == "GET" {
			session.VerifySession(nil, client.Communities).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/community" && r.Method == "GET" {
			session.VerifySession(nil, client.Community).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/scommunity" && r.Method == "GET" {
			session.VerifySession(nil, client.SCommunity).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/join" && r.Method == "POST" {
			session.VerifySession(nil, client.CommunityJoin).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/community/posts" && r.Method == "GET" {
			session.VerifySession(nil, client.Posts).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/community/post" && r.Method == "GET" {
			session.VerifySession(nil, client.Post).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/removepost" && r.Method == "GET" {
			session.VerifySession(nil, client.PostDelete).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/removecomment" && r.Method == "GET" {
			session.VerifySession(nil, client.CommentDelete).ServeHTTP(rw, r)
			return
		}

		if parsedURL.Path == "/v1/lockpost" && r.Method == "GET" {
			session.VerifySession(nil, client.PostLock).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/RemoveCourse" && r.Method == "GET" {
			session.VerifySession(nil, client.CourseDelete).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/hidepost" && r.Method == "GET" {
			session.VerifySession(nil, client.PostHide).ServeHTTP(rw, r)
			return
		}

		if parsedURL.Path == "/v1/notifications" && r.Method == "GET" {
			session.VerifySession(nil, client.Notifications).ServeHTTP(rw, r)
			return
		}

		if parsedURL.Path == "/v1/community/createpost" && r.Method == "POST" {
			session.VerifySession(nil, client.CreatePost).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/community/createEvent" && r.Method == "POST" {
			session.VerifySession(nil, client.CreateEvent).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/community/updateEvent" && r.Method == "POST" {
			session.VerifySession(nil, client.UpdateEvent).ServeHTTP(rw, r)
		}

		if parsedURL.Path == "/v1/community/fullcourses" && r.Method == "GET" {
			session.VerifySession(nil, client.FullCourses).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/community/courses" && r.Method == "GET" {
			session.VerifySession(nil, client.Courses).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/community/course" && r.Method == "GET" {
			session.VerifySession(nil, client.Course).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/community/createcourse" && r.Method == "POST" {
			session.VerifySession(nil, client.CreateCourse).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/community/updatecourse" && r.Method == "POST" {
			session.VerifySession(nil, client.UpdateCourse).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/community/updatecourses" && r.Method == "POST" {
			session.VerifySession(nil, client.UpdateCourses).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/data/get" {
			session.VerifySession(nil, client.GetAds).ServeHTTP(rw, r)
		}
		if parsedURL.Path == "/v1/profile" {
			session.VerifySession(nil, client.GetProfile).ServeHTTP(rw, r)
		}
		if parsedURL.Path == "/v1/updateMeta" && r.Method == "POST" {
			session.VerifySession(nil, client.UpdateMeta).ServeHTTP(rw, r)
		}

		if parsedURL.Path == "/v1/deleteaccount" {
			session.VerifySession(nil, client.DeleteAccount).ServeHTTP(rw, r)
		}
		if parsedURL.Path == "/v1/createProfile" && r.Method == "POST" {
			session.VerifySession(nil, client.CreateProfile).ServeHTTP(rw, r)
		}
		if parsedURL.Path == "/v1/postLikes" && r.Method == "POST" {
			session.VerifySession(nil, client.PostLikes).ServeHTTP(rw, r)
		}
		if parsedURL.Path == "/v1/comment" && r.Method == "POST" {
			session.VerifySession(nil, client.Comment).ServeHTTP(rw, r)
		}
		if parsedURL.Path == "/v1/members" && r.Method == "GET" {
			session.VerifySession(nil, client.Members).ServeHTTP(rw, r)
		}
		// admin sections
		if parsedURL.Path == "/v1/admin/community" && r.Method == "GET" {
			session.VerifySession(nil, admin.Community).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/admin/community" && r.Method == "POST" {
			session.VerifySession(nil, admin.CreateCommunity).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/admin/community" && r.Method == "PUT" {
			session.VerifySession(nil, admin.UpdateCommunity).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/admin/channel" && r.Method == "GET" {
			session.VerifySession(nil, admin.Channels).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/admin/channel" && r.Method == "POST" {
			session.VerifySession(nil, admin.CreateChannel).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/admin/addAd" && r.Method == "POST" {
			session.VerifySession(nil, admin.CreatePost).ServeHTTP(rw, r)
			return
		}
		if parsedURL.Path == "/v1/handlePreview" && r.Method == "GET" {
			session.VerifySession(nil, handlePreview).ServeHTTP(rw, r)
			return
		}
		rw.WriteHeader(404)
	})))))

}

type Metadata struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

func handlePreview(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for the frontend (if needed)
	// w.Header().Set("Access-Control-Allow-Origin", "*")

	// Get the "url" query parameter
	url := r.URL.Query().Get("url")
	if url == "" {
		http.Error(w, "Missing 'url' parameter", http.StatusBadRequest)
		return
	}

	// Fetch the content from the provided URL
	metadata, err := fetchMetadata(url)
	if err != nil {
		http.Error(w, "Failed to fetch metadata", http.StatusInternalServerError)
		return
	}

	// Return metadata as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metadata)
}

// fetchMetadata fetches and parses metadata from a URL
func fetchMetadata(url string) (Metadata, error) {
	// Fetch the content from the provided URL
	// Create a custom HTTP client
	client := &http.Client{}

	// Create a new request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		//return "", err
	}

	// Set custom headers, including the User-Agent as a bot
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux i686; rv:131.0) Gecko/20100101 Firefox/131.0")
	// Optionally, you can add other headers if needed
	// req.Header.Set("Authorization", "Bearer <token>")

	// Send the request
	resp, err := client.Do(req)
	if err != nil {
		//	return "", err
	}
	defer resp.Body.Close()

	// Read the HTML content
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return Metadata{}, err
	}

	//

	html := string(body)
	// Extract Open Graph metadata using regex
	title := extractMetaTagContent(html, `meta property="og:title" content="(.*?)"`)
	description := extractMetaTagContent(html, `meta property="og:description" content="(.*?)"`)
	image := extractMetaTagContent(html, `meta property="og:image" content="(.*?)"`)

	// Fallback to standard metadata if Open Graph is missing
	if title == "" {
		title = extractTagContent(html, "<title>(.*?)</title>")
	}
	if description == "" {
		description = extractMetaTagContent(html, `meta name="description" content="(.*?)"`)
	}
	if image == "" {
		image = extractMetaTagContent(html, `meta property="image" content="(.*?)"`)
	}

	// Check if metadata was extracted

	// Return the metadata
	return Metadata{
		Title:       title,
		Description: description,
		Image:       image,
	}, nil
}

// extractMetaTagContent extracts the content of a meta tag using regex
func extractMetaTagContent(html, pattern string) string {
	re := regexp.MustCompile(pattern)
	match := re.FindStringSubmatch(html)
	if len(match) > 1 {
		return match[1]
	}
	return ""
}

// extractTagContent extracts content from standard HTML tags (like <title>) using regex
func extractTagContent(html, pattern string) string {
	re := regexp.MustCompile(pattern)
	match := re.FindStringSubmatch(html)
	if len(match) > 1 {
		return strings.TrimSpace(match[1])
	}
	return ""
}
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Check if the request Origin header is allowed
		if strings.Contains(origin, "bhivecommunity.co.uk") || strings.Contains(origin, "bhivecom.co.uk") || strings.Contains(origin, "localhost") {
			// If the origin is allowed, set it in the response header
			response.Header().Set("Access-Control-Allow-Origin", origin)
		}

		// Always allow credentials
		response.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			// For preflight requests, set additional headers
			response.Header().Set("Access-Control-Allow-Headers", strings.Join(append([]string{"Content-Type"}, supertokens.GetAllCORSHeaders()...), ","))
			response.Header().Set("Access-Control-Allow-Methods", strings.Join(append([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}), ","))
			response.Write([]byte(""))
		} else {
			// Call the next handler in the chain
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
