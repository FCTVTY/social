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

package client

import (
	"bhiveserver/models"
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"image"
	"image/jpeg"
	"image/png"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/chai2010/webp"
	"github.com/pkg/errors"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword"
	"github.com/supertokens/supertokens-golang/recipe/usermetadata"

	"github.com/joho/godotenv"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/userroles"
	"github.com/supertokens/supertokens-golang/supertokens"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	client               *mongo.Client
	communitesCollection *mongo.Collection
	channelCollection    *mongo.Collection
	postCollection       *mongo.Collection
	ppostCollection      *mongo.Collection
	adsCollection        *mongo.Collection
	profileCollection    *mongo.Collection
	likesCollection      *mongo.Collection
	commentCollection    *mongo.Collection
	membersCollection    *mongo.Collection
	pprofileCollection   *mongo.Collection
	coursesCollection    *mongo.Collection

	minioClient *minio.Client
)

func init() {
	envFile := ".env.dev" // Change this to ".env.prod" for production
	if os.Getenv("ENV") == "prod" {
		envFile = ".env.prod"
	}

	if err := godotenv.Load(envFile); err != nil {
		log.Fatalf("Error loading %s file: %v", envFile, err)
	}

	mongoURI := os.Getenv("MONGO_URI")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, _ = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Error connecting to MongoDB: %v", err)
	}

	database := client.Database("bhive")
	communitesCollection = database.Collection("communites")
	channelCollection = database.Collection("channels")
	postCollection = database.Collection("posts")
	ppostCollection = database.Collection("pposts")
	adsCollection = database.Collection("ads")
	pprofileCollection = database.Collection("pprofile")
	profileCollection = database.Collection("profile")

	likesCollection = database.Collection("postLikes")
	commentCollection = database.Collection("postComments")
	membersCollection = database.Collection("members")
	coursesCollection = database.Collection("courses")
}
func Communities(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	var collection []bson.M
	// Check if the community exists in the database
	cursor, err := communitesCollection.Find(context.Background(), bson.M{"private": false})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(rw, "community not found", http.StatusNotFound)
			return
		}
		http.Error(rw, "failed to fetch community details", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var result bson.M
		err := cursor.Decode(&result)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusInternalServerError)
			return
		}
		collection = append(collection, result)
	}
	// Encode and send community details in the response
	rw.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(rw).Encode(collection); err != nil {
		http.Error(rw, "failed to encode response", http.StatusInternalServerError)
		return
	}
}
func Community(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	// Validate and retrieve community name from URL query parameters
	name := r.URL.Query().Get("name")
	if name == "" {
		http.Error(rw, "community name is required", http.StatusBadRequest)
		return
	}
	var collection models.CommunityCollection
	// Check if the community exists in the database
	filter := bson.M{"url": name}
	var community models.Community
	err := communitesCollection.FindOne(context.Background(), filter).Decode(&community)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(rw, "community not found", http.StatusNotFound)
			return
		}
		http.Error(rw, "failed to fetch community details", http.StatusInternalServerError)
		return
	}
	if community.OwnerId == sessionContainer.GetUserID() {
		community.Create = true
	}
	collection.Community = community

	cursor, err := channelCollection.Find(context.Background(), bson.M{"parent": community.ID})
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var result models.Channel
		err := cursor.Decode(&result)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusInternalServerError)
			return
		}
		collection.Channels = append(collection.Channels, result)
	}
	// Encode and send community details in the response
	rw.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(rw).Encode(collection); err != nil {
		http.Error(rw, "failed to encode response", http.StatusInternalServerError)
		return
	}
}

func CreatePost(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}
	var v models.Posts

	// We decode our body request params
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}

	v.ID = primitive.NewObjectID()
	v.Date = time.Now()
	v.Channel, _ = primitive.ObjectIDFromHex(v.Channelstring)
	v.Tags = []string{}
	v.Visability = true
	v.UserID = sessionContainer.GetUserID()
	if v.Media != "" {
		img, _, err := decodeDataURI(v.Media)
		if err != nil {
			log.Fatalf("Failed to decode data URI: %v", err)
		}

		// Encode the image to WebP format
		var buf bytes.Buffer
		err = webp.Encode(&buf, img, &webp.Options{Lossless: true})
		if err != nil {
			log.Fatalf("Failed to encode image to WebP: %v", err)
		}

		// Convert the WebP bytes to a data URI
		webpDataURI := "data:image/webp;base64," + base64.StdEncoding.EncodeToString(buf.Bytes())
		v.Media = webpDataURI

		endpoint := "s3.app.bhivecommunity.co.uk"
		accessKeyID := "HWL0Z36tnBEItLIHpK9U"
		secretAccessKey := "k2JLHoWAkEGBaQdQKAWAKS2A0GfdHQMX4C57yKbg"
		useSSL := true

		// Initialize minio client object.
		minioClient, err = minio.New(endpoint, &minio.Options{
			Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
			Secure: useSSL,
		})
		if err != nil {
			log.Fatalln(err)
		}

		//uppload media to s3
		// Make a new bucket called testbucket.
		bucketName := "media"
		location := "uk-west-1"

		err = minioClient.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{Region: location})
		if err != nil {
			// Check to see if we already own this bucket (which happens if you run this twice)
			exists, errBucketExists := minioClient.BucketExists(context.Background(), bucketName)
			if errBucketExists == nil && exists {
				log.Printf("We already own %s\n", bucketName)
			} else {
				log.Fatalln(err)
			}
		} else {
			log.Printf("Successfully created %s\n", bucketName)
		}

		// Upload the test file
		// Change the value of filePath if the file is in another location
		objectName := v.Channelstring + "/" + v.ID.Hex() + ".webp"
		imageData, err := base64.StdEncoding.DecodeString(base64.StdEncoding.EncodeToString(buf.Bytes()))
		if err != nil {
			log.Fatalln("Error decoding base64 string:", err)
		}

		// Upload the test file with FPutObject
		// Create a reader for the image data
		imageReader := bytes.NewReader(imageData)

		// Upload the image
		_, err = minioClient.PutObject(context.Background(), bucketName, objectName, imageReader, imageReader.Size(), minio.PutObjectOptions{
			ContentType: "image/webp", // Replace with the correct content type
		})
		if err != nil {
			log.Fatalln("Error uploading the image:", err)
		}
		v.Media = "https://s3.app.bhivecommunity.co.uk/media/" + v.Channelstring + "/" + v.ID.Hex() + ".webp"
	}

	result, err := postCollection.InsertOne(context.Background(), v)
	if err != nil {
		http.Error(rw, "failed to insert posts: "+err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(rw).Encode(result.InsertedID)

}

func CreateEvent(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}
	var v models.EventPost

	// We decode our body request params
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}

	v.ID = primitive.NewObjectID()
	v.Date = time.Now()
	v.Channel, _ = primitive.ObjectIDFromHex(v.Channelstring)
	//v.Tags = []string{}
	v.Type = "event"

	if v.Media != "" {
		img, _, err := decodeDataURI(v.Media)
		if err != nil {
			log.Fatalf("Failed to decode data URI: %v", err)
		}

		// Encode the image to WebP format
		var buf bytes.Buffer
		err = webp.Encode(&buf, img, &webp.Options{Lossless: true})
		if err != nil {
			log.Fatalf("Failed to encode image to WebP: %v", err)
		}

		// Convert the WebP bytes to a data URI
		webpDataURI := "data:image/webp;base64," + base64.StdEncoding.EncodeToString(buf.Bytes())
		v.Media = webpDataURI
	}

	v.Userid = sessionContainer.GetUserID()

	result, err := postCollection.InsertOne(context.Background(), v)
	if err != nil {
		http.Error(rw, "failed to insert posts: "+err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(rw).Encode(result.InsertedID)

}

func decodeDataURI(dataURI string) (image.Image, string, error) {
	if !strings.HasPrefix(dataURI, "data:image/") {
		return nil, "", errors.New("invalid data URI")
	}

	// Split the metadata and the data
	parts := strings.SplitN(dataURI, ",", 2)
	if len(parts) != 2 {
		return nil, "", errors.New("invalid data URI format")
	}

	// Get the MIME type
	mimeParts := strings.Split(parts[0], ";")
	if len(mimeParts) < 2 {
		return nil, "", errors.New("invalid MIME type")
	}
	mime := mimeParts[0][len("data:image/"):]

	// Decode the base64 data
	data, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, "", fmt.Errorf("failed to decode base64 data: %w", err)
	}

	// Decode the image
	var img image.Image
	switch mime {
	case "jpeg":
		img, err = jpeg.Decode(bytes.NewReader(data))
	case "png":
		img, err = png.Decode(bytes.NewReader(data))
	case "webp":
		img, err = webp.Decode(bytes.NewReader(data))

	default:
		return nil, "", fmt.Errorf("unsupported image type: %s", mime)
	}

	if err != nil {
		return nil, "", fmt.Errorf("failed to decode image: %w", err)
	}

	return img, mime, nil
}
func Posts(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	// Validate and retrieve community name from URL query parameters
	data := bson.M{}

	name := r.URL.Query().Get("oid")
	if name != "" {
		objectId, err := primitive.ObjectIDFromHex(name)
		if err != nil {
			http.Error(rw, "invalid object ID", http.StatusBadRequest)
			return
		}
		data = bson.M{"channel": objectId, "visability": true}
	}

	host := r.URL.Query().Get("host")
	if host != "" {
		data = bson.M{"communites.url": host, "visability": true}
	}
	event := r.URL.Query().Get("event")
	if event != "" {
		data = bson.M{"communites.url": host}
	}

	// Pagination parameters
	limitStr := r.URL.Query().Get("limit")
	pageStr := r.URL.Query().Get("page")

	limit := 3 // default limit
	page := 1  // default page

	if limitStr != "" {
		l, err := strconv.Atoi(limitStr)
		if err == nil && l > 0 {
			limit = l
		}
	}

	if pageStr != "" {
		p, err := strconv.Atoi(pageStr)
		if err == nil && p > 0 {
			page = p
		}
	}

	// Calculate skip
	skip := (page - 1) * limit

	// Find options with limit and skip for pagination
	findOptions := options.Find()
	findOptions.SetLimit(int64(limit))
	findOptions.SetSkip(int64(skip))

	// Fetch posts with pagination
	var posts []bson.M
	cursor, err := ppostCollection.Find(context.Background(), data, findOptions)
	if err != nil {
		http.Error(rw, "failed to fetch posts", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var post bson.M
		if err := cursor.Decode(&post); err != nil {
			http.Error(rw, "failed to decode post", http.StatusInternalServerError)
			return
		}
		if post["userid"] == sessionContainer.GetUserID() {
			post["deletable"] = true // Adding delete flag to the post
		}
		posts = append(posts, post)
	}
	if err := cursor.Err(); err != nil {
		http.Error(rw, "cursor error", http.StatusInternalServerError)
		return
	}

	// Response with posts in JSON format
	rw.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(rw).Encode(posts); err != nil {
		http.Error(rw, "failed to encode response", http.StatusInternalServerError)
		return
	}
}
func Post(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	// Validate and retrieve post ID from URL query parameters
	postID := r.URL.Query().Get("oid")
	if postID == "" {
		http.Error(rw, "post ID is required", http.StatusBadRequest)
		return
	}
	objectID, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		http.Error(rw, "invalid post ID", http.StatusBadRequest)
		return
	}

	// Fetch post from the database
	var post bson.M
	err = ppostCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&post)
	if err != nil {
		http.Error(rw, "failed to fetch post", http.StatusInternalServerError)
		return
	}

	// Encode post as JSON and write response
	rw.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(rw).Encode(post)
	if err != nil {
		http.Error(rw, "failed to encode response", http.StatusInternalServerError)
		return
	}
}

func Courses(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	// Validate and retrieve community name from URL query parameters
	data := bson.M{}

	name := r.URL.Query().Get("oid")
	if name != "" {
		//objectId, err := primitive.ObjectIDFromHex(name)
		//if err != nil {
		//http.Error(rw, "invalid object ID", http.StatusBadRequest)
		//return
		//}
		data = bson.M{"community": name}
	}

	// Pagination parameters
	limitStr := r.URL.Query().Get("limit")
	pageStr := r.URL.Query().Get("page")

	limit := 3 // default limit
	page := 1  // default page

	if limitStr != "" {
		l, err := strconv.Atoi(limitStr)
		if err == nil && l > 0 {
			limit = l
		}
	}

	if pageStr != "" {
		p, err := strconv.Atoi(pageStr)
		if err == nil && p > 0 {
			page = p
		}
	}

	// Calculate skip
	skip := (page - 1) * limit

	// Find options with limit and skip for pagination
	findOptions := options.Find()
	findOptions.SetLimit(int64(limit))
	findOptions.SetSkip(int64(skip))

	// Fetch posts with pagination
	var posts []bson.M
	cursor, err := coursesCollection.Find(context.Background(), data, findOptions)
	if err != nil {
		http.Error(rw, "failed to fetch courses", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var post bson.M
		if err := cursor.Decode(&post); err != nil {
			http.Error(rw, "failed to decode courses", http.StatusInternalServerError)
			return
		}

		posts = append(posts, post)
	}
	if err := cursor.Err(); err != nil {
		http.Error(rw, "cursor error", http.StatusInternalServerError)
		return
	}

	// Response with posts in JSON format
	rw.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(rw).Encode(posts); err != nil {
		http.Error(rw, "failed to encode response", http.StatusInternalServerError)
		return
	}
}

func Course(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	// Validate and retrieve post ID from URL query parameters
	host := r.URL.Query().Get("host")
	if host == "" {
		http.Error(rw, "host is required", http.StatusBadRequest)
		return
	}
	name := r.URL.Query().Get("name")
	if name == "" {
		http.Error(rw, "name is required", http.StatusBadRequest)
		return
	}

	name = strings.ReplaceAll(name, "_", " ")

	// Fetch post from the database
	var post bson.M
	err := coursesCollection.FindOne(context.Background(), bson.M{"community": host, "name": name}).Decode(&post)
	if err != nil {
		http.Error(rw, "failed to fetch event", http.StatusInternalServerError)
		return
	}

	// Encode post as JSON and write response
	rw.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(rw).Encode(post)
	if err != nil {
		http.Error(rw, "failed to encode response", http.StatusInternalServerError)
		return
	}
}

func Sessioninfo(w http.ResponseWriter, r *http.Request) {
	sessionContainer := session.GetSessionFromRequestContext(r.Context())

	if sessionContainer == nil {
		w.WriteHeader(500)
		w.Write([]byte("no session found"))
		return
	}
	sessionData, err := sessionContainer.GetSessionDataInDatabase()
	if err != nil {
		err = supertokens.ErrorHandler(err, r, w)
		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(err.Error()))
		}
		return
	}

	response, err := userroles.AddRoleToUser("public", sessionContainer.GetUserID(), "user", nil)
	if err != nil {
		// TODO: Handle error
		return
	}

	if response.UnknownRoleError != nil {
		// No such role exists
		return
	}

	if response.OK.DidUserAlreadyHaveRole {
		// The user already had the role
	}
	response, err = userroles.AddRoleToUser("public", sessionContainer.GetUserID(), "admin", nil)
	if err != nil {
		// TODO: Handle error
		return
	}

	if response.UnknownRoleError != nil {
		// No such role exists
		return
	}

	if response.OK.DidUserAlreadyHaveRole {
		// The user already had the role
	}
	response, err = userroles.AddRoleToUser("public", sessionContainer.GetUserID(), "superadmin", nil)
	if err != nil {
		// TODO: Handle error
		return
	}

	if response.UnknownRoleError != nil {
		// No such role exists
		return
	}

	if response.OK.DidUserAlreadyHaveRole {
		// The user already had the role
	}

	w.WriteHeader(200)
	w.Header().Add("content-type", "application/json")
	bytes, err := json.Marshal(map[string]interface{}{
		"sessionHandle":      sessionContainer.GetHandle(),
		"userId":             sessionContainer.GetUserID(),
		"accessTokenPayload": sessionContainer.GetAccessTokenPayload(),
		"sessionData":        sessionData,
	})
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("error in converting to json"))
	} else {
		w.Write(bytes)
	}
}

func GetAds(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	var collection []bson.M
	// Check if the community exists in the database
	cursor, err := adsCollection.Find(context.Background(), bson.D{})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(rw, "community not found", http.StatusNotFound)
			return
		}
		http.Error(rw, "failed to fetch community details:"+err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var result bson.M
		err := cursor.Decode(&result)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusInternalServerError)
			return
		}
		collection = append(collection, result)
	}
	// Encode and send community details in the response
	rw.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(rw).Encode(collection); err != nil {
		http.Error(rw, "failed to encode response", http.StatusInternalServerError)
		return
	}
}

func GetProfile(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}
	self := false
	// Validate and retrieve post ID from URL query parameters
	oid := r.URL.Query().Get("oid")
	if oid == "" {
		oid = sessionContainer.GetUserID()
		self = true
	}

	var profile bson.M

	if !self {
		objectID, err := primitive.ObjectIDFromHex(oid)
		if err != nil {
			http.Error(rw, "invalid post ID", http.StatusBadRequest)
			return
		}
		err = pprofileCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&profile)
		if err != nil {
			http.Error(rw, "failed to fetch profile "+err.Error(), http.StatusInternalServerError)
			return
		}
	}
	if self {
		err := pprofileCollection.FindOne(context.Background(), bson.M{"supertokensId": oid}).Decode(&profile)
		if err != nil {
			http.Error(rw, "failed to fetch profile "+err.Error(), http.StatusInternalServerError)
			return
		}
	}
	// Fetch post from the database

	// Get user ID from session container
	userID := sessionContainer.GetUserID()

	// Check if user ID matches profile's SupertokensID
	if profile["supertokensId"] == userID {
		// Mark as self profile
		profile["me"] = true
	}

	// Encode post as JSON and write response
	rw.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(rw).Encode(profile)
	if err != nil {
		http.Error(rw, "failed to encode response", http.StatusInternalServerError)
		return
	}
}

func PostLikes(rw http.ResponseWriter, r *http.Request) {
	var like models.PostLike
	err := json.NewDecoder(r.Body).Decode(&like)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	oid, _ := primitive.ObjectIDFromHex(like.PostID)
	filter := bson.M{"postId": oid, "userId": like.UserID}
	if like.Liked {
		_, err = likesCollection.InsertOne(context.Background(), bson.M{
			"postId": oid,
			"userId": like.UserID,
		})
		if err != nil {
			http.Error(rw, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		_, err = likesCollection.DeleteOne(context.Background(), filter)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	rw.WriteHeader(http.StatusOK)
	rw.Write([]byte("Success"))
}

func Comment(rw http.ResponseWriter, r *http.Request) {

	var comment models.Comment
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	oid, _ := primitive.ObjectIDFromHex(comment.PostID)

	_, err = commentCollection.InsertOne(context.Background(), bson.M{
		"postId":  oid,
		"userId":  comment.UserID,
		"comment": comment.Comment,
		"date":    time.Now(),
	})

	rw.WriteHeader(http.StatusOK)
	rw.Write([]byte("Success"))
}

func Members(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	// Validate and retrieve community name from URL query parameters

	data := bson.M{}

	name := r.URL.Query().Get("name")
	if name != "" {

		data = bson.M{"url": name}
		// Check if the community exists in the database
	}

	c := bson.M{}

	err := membersCollection.FindOne(context.Background(), data).Decode(c)
	if err != nil {
		http.Error(rw, "failed to fetch Members"+err.Error(), http.StatusInternalServerError)
		return
	}

	rw.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(rw).Encode(c); err != nil {
		http.Error(rw, "failed to encode response", http.StatusInternalServerError)
		return
	}
}

func CreateProfile(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}
	var v models.Profile

	// We decode our body request params
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}

	v.SupertokensID = sessionContainer.GetUserID()

	if v.ProfilePicture != "" && !strings.HasPrefix(v.ProfilePicture, "https") {
		img, _, err := decodeDataURI(v.ProfilePicture)
		if err != nil {
			log.Fatalf("Failed to decode data URI: %v", err)
		}

		// Encode the image to WebP format
		var buf bytes.Buffer
		err = webp.Encode(&buf, img, &webp.Options{Lossless: true})
		if err != nil {
			log.Fatalf("Failed to encode image to WebP: %v", err)
		}

		// Convert the WebP bytes to a data URI
		webpDataURI := "data:image/webp;base64," + base64.StdEncoding.EncodeToString(buf.Bytes())
		v.ProfilePicture = webpDataURI

		endpoint := "s3.app.bhivecommunity.co.uk"
		accessKeyID := "HWL0Z36tnBEItLIHpK9U"
		secretAccessKey := "k2JLHoWAkEGBaQdQKAWAKS2A0GfdHQMX4C57yKbg"
		useSSL := true

		// Initialize minio client object.
		minioClient, err = minio.New(endpoint, &minio.Options{
			Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
			Secure: useSSL,
		})
		if err != nil {
			log.Fatalln(err)
		}
		bucketName := "profile"
		location := "uk-west-1"

		err = minioClient.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{Region: location})
		if err != nil {
			// Check to see if we already own this bucket (which happens if you run this twice)
			exists, errBucketExists := minioClient.BucketExists(context.Background(), bucketName)
			if errBucketExists == nil && exists {
				log.Printf("We already own %s\n", bucketName)
			} else {
				log.Fatalln(err)
			}
		} else {
			log.Printf("Successfully created %s\n", bucketName)
		}

		// Upload the test file
		// Change the value of filePath if the file is in another location
		objectName := v.SupertokensID + "/profilepic/" + v.SupertokensID + ".webp"
		imageData, err := base64.StdEncoding.DecodeString(base64.StdEncoding.EncodeToString(buf.Bytes()))
		if err != nil {
			log.Fatalln("Error decoding base64 string:", err)
		}

		// Upload the test file with FPutObject
		// Create a reader for the image data
		imageReader := bytes.NewReader(imageData)

		// Upload the image
		_, err = minioClient.PutObject(context.Background(), bucketName, objectName, imageReader, imageReader.Size(), minio.PutObjectOptions{
			ContentType: "image/webp", // Replace with the correct content type
		})
		if err != nil {
			log.Fatalln("Error uploading the image:", err)
		}
		v.ProfilePicture = "https://s3.app.bhivecommunity.co.uk/profile/" + v.SupertokensID + "/profilepic/" + v.SupertokensID + ".webp"

	}
	if v.CoverPicture != "" && !strings.HasPrefix(v.CoverPicture, "https") {
		img, _, err := decodeDataURI(v.CoverPicture)
		if err != nil {
			log.Fatalf("Failed to decode data URI: %v", err)
		}

		// Encode the image to WebP format
		var buf bytes.Buffer
		err = webp.Encode(&buf, img, &webp.Options{Lossless: true})
		if err != nil {
			log.Fatalf("Failed to encode image to WebP: %v", err)
		}

		// Convert the WebP bytes to a data URI
		webpDataURI := "data:image/webp;base64," + base64.StdEncoding.EncodeToString(buf.Bytes())
		v.CoverPicture = webpDataURI

		endpoint := "s3.app.bhivecommunity.co.uk"
		accessKeyID := "HWL0Z36tnBEItLIHpK9U"
		secretAccessKey := "k2JLHoWAkEGBaQdQKAWAKS2A0GfdHQMX4C57yKbg"
		useSSL := true

		// Initialize minio client object.
		minioClient, err = minio.New(endpoint, &minio.Options{
			Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
			Secure: useSSL,
		})
		if err != nil {
			log.Fatalln(err)
		}
		bucketName := "profile"
		location := "uk-west-1"

		err = minioClient.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{Region: location})
		if err != nil {
			// Check to see if we already own this bucket (which happens if you run this twice)
			exists, errBucketExists := minioClient.BucketExists(context.Background(), bucketName)
			if errBucketExists == nil && exists {
				log.Printf("We already own %s\n", bucketName)
			} else {
				log.Fatalln(err)
			}
		} else {
			log.Printf("Successfully created %s\n", bucketName)
		}

		// Upload the test file
		// Change the value of filePath if the file is in another location
		objectName := v.SupertokensID + "/cover/" + v.SupertokensID + ".webp"
		imageData, err := base64.StdEncoding.DecodeString(base64.StdEncoding.EncodeToString(buf.Bytes()))
		if err != nil {
			log.Fatalln("Error decoding base64 string:", err)
		}

		// Upload the test file with FPutObject
		// Create a reader for the image data
		imageReader := bytes.NewReader(imageData)

		// Upload the image
		_, err = minioClient.PutObject(context.Background(), bucketName, objectName, imageReader, imageReader.Size(), minio.PutObjectOptions{
			ContentType: "image/webp", // Replace with the correct content type
		})
		if err != nil {
			log.Fatalln("Error uploading the image:", err)
		}
		v.CoverPicture = "https://s3.app.bhivecommunity.co.uk/profile/" + v.SupertokensID + "/cover/" + v.SupertokensID + ".webp"

	}
	filter := bson.M{"url": v.Username}
	var community models.Community
	err = communitesCollection.FindOne(context.Background(), filter).Decode(&community)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(rw, "community not found", http.StatusNotFound)
			return
		}
		http.Error(rw, "failed to fetch community details", http.StatusInternalServerError)
		return
	}

	var id = community.ID.Hex()

	v.Communities = append(v.Communities, id)

	// Check if a profile already exists for this user
	filter = bson.M{"supertokensId": v.SupertokensID}
	var existingProfile models.Profile
	err = profileCollection.FindOne(context.Background(), filter).Decode(&existingProfile)
	if err != nil {
		if err != mongo.ErrNoDocuments {
			http.Error(rw, "failed to fetch existing profile: "+err.Error(), http.StatusInternalServerError)
			return
		}
		// No existing profile found, create a new one
		userID := sessionContainer.GetUserID()
		// You can learn more about the `User` object over here https://github.com/supertokens/core-driver-interface/wiki
		id, _ := emailpassword.GetUserByID(sessionContainer.GetUserID())

		metadata, err := usermetadata.GetUserMetadata(userID)
		if err != nil {
			// TODO: handle error...
		}

		updateData := bson.M{
			"username":       v.Username,
			"profilePicture": v.ProfilePicture,
			"coverPicture":   v.CoverPicture,
			"bio":            v.Bio,
			"supertokensId":  sessionContainer.GetUserID(),
			"first_name":     metadata["first_name"],
			"last_name":      metadata["last_name"],
			"communities":    v.Communities,
			"email":          id.Email,
			"deleted":        false,
		}

		result, err := profileCollection.InsertOne(context.Background(), updateData)
		if err != nil {
			http.Error(rw, "failed to insert profile: "+err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(rw).Encode(result.InsertedID)
		return
	}

	// Profile already exists, update it
	updateData := bson.M{
		"username":       v.Username,
		"profilePicture": v.ProfilePicture,
		"coverPicture":   v.CoverPicture,
		"bio":            v.Bio,
	}

	update := bson.M{"$set": updateData}

	_, err = profileCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		http.Error(rw, "failed to update profile: "+err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(rw).Encode("ok")
}

func Roles(rw http.ResponseWriter, r *http.Request) {
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}
	var roles, _ = userroles.GetRolesForUser("public", sessionContainer.GetUserID(), nil)

	json.NewEncoder(rw).Encode(roles.OK.Roles)
}

func PostDelete(rw http.ResponseWriter, r *http.Request) {
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusUnauthorized) // 401 Unauthorized for no session
		return
	}

	userID := sessionContainer.GetUserID()
	roles, err := userroles.GetRolesForUser("public", userID, nil)
	if err != nil {
		http.Error(rw, "failed to get user roles", http.StatusInternalServerError)
		return
	}

	hasRole := false
	for _, role := range roles.OK.Roles {
		if role == "admin" || role == "moderator" {
			hasRole = true
			break
		}
	}

	if !hasRole {
		http.Error(rw, "user does not have the required role", http.StatusForbidden) // 403 Forbidden for insufficient role
		return
	}

	name := r.URL.Query().Get("oid")
	if name == "" {
		http.Error(rw, "missing object ID", http.StatusBadRequest) // 400 Bad Request for missing ID
		return
	}

	objectId, err := primitive.ObjectIDFromHex(name)
	if err != nil {
		http.Error(rw, "invalid object ID", http.StatusBadRequest)
		return
	}

	data := bson.M{"_id": objectId}

	ctx := context.Background()
	result, err := postCollection.DeleteOne(ctx, data)
	if err != nil {
		http.Error(rw, "failed to delete", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(rw, "post not found", http.StatusNotFound) // 404 Not Found if no document is deleted
		return
	}

	rw.WriteHeader(http.StatusOK) // 200 OK for successful deletion
	rw.Write([]byte("post deleted successfully"))
}
func PostHide(rw http.ResponseWriter, r *http.Request) {
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusUnauthorized) // 401 Unauthorized for no session
		return
	}

	userID := sessionContainer.GetUserID()

	name := r.URL.Query().Get("oid")
	if name == "" {
		http.Error(rw, "missing object ID", http.StatusBadRequest) // 400 Bad Request for missing ID
		return
	}

	objectId, err := primitive.ObjectIDFromHex(name)
	if err != nil {
		http.Error(rw, "invalid object ID", http.StatusBadRequest)
		return
	}

	data := bson.M{"_id": objectId, "userid": userID}
	update := bson.M{"$set": bson.M{"visability": false}}
	ctx := context.Background()

	result2, err := postCollection.UpdateOne(ctx, data, update)
	if err != nil {
		http.Error(rw, "failed to soft delete", http.StatusInternalServerError)
		return
	}

	if result2.MatchedCount == 0 {
		http.Error(rw, "post not found", http.StatusNotFound) // 404 Not Found if no document is deleted
		return
	}

	rw.WriteHeader(http.StatusOK) // 200 OK for successful deletion
	rw.Write([]byte("post deleted successfully"))
}

func DeleteAccount(rw http.ResponseWriter, r *http.Request) {

	// Profile already exists, update it
	updateData := bson.M{
		"username":       "",
		"first_name":     "[deleted]",
		"last_name":      "",
		"email":          "",
		"deleted":        true,
		"profilePicture": "https://s3.app.bhivecommunity.co.uk/profile/blank-profile-picture-png-6.jpg",
		"coverPicture":   "",
		"bio":            "",
	}

	update := bson.M{"$set": updateData}
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}
	filter := bson.M{"supertokensId": sessionContainer.GetUserID()}

	_, err := profileCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		http.Error(rw, "failed to update profile: "+err.Error(), http.StatusInternalServerError)
		return
	}

	supertokens.DeleteUser(sessionContainer.GetUserID())
}
