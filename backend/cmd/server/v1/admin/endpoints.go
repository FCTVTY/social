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

package admin

import (
	"bhiveserver/models"
	"bytes"
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"log"
	"net/http"
	"os"
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
	idstring := r.URL.Query().Get("id")
	if idstring == "" {
		http.Error(rw, "community id is required", http.StatusBadRequest)
		return
	}
	var collection models.Community
	// Check if the community exists in the database
	id, err := primitive.ObjectIDFromHex(idstring) // Assuming idString is your id in string format
	if err != nil {
		// handle the error, e.g., invalid id format
		log.Fatal(err)
	}

	filter := bson.M{"_id": id}
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
	if community.OwnerId == sessionContainer.GetUserID() {
		community.Create = true
	}
	collection = community

	// Encode and send community details in the response
	rw.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(rw).Encode(collection); err != nil {
		http.Error(rw, "failed to encode response", http.StatusInternalServerError)
		return
	}
}
func GenerateUniqueString(length int) (string, error) {
	if length <= 0 {
		return "", fmt.Errorf("length must be greater than 0")
	}

	// Generate random bytes
	randomBytes := make([]byte, (length*6+7)/8) // length*6/8 rounded up
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}

	// Encode the bytes to a URL-safe base64 string and remove padding
	uniqueString := base64.URLEncoding.EncodeToString(randomBytes)
	uniqueString = uniqueString[:length]

	return uniqueString, nil
}
func CreateCommunity(rw http.ResponseWriter, r *http.Request) {
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	// Retrieve session from request context
	var v models.Community

	// We decode our body request params
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}

	v.ID = primitive.NewObjectID()

	if v.Logo != "" {
		img, _, err := decodeDataURI(v.Logo)
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
		v.Logo = webpDataURI
	}

	uniquePart, err := GenerateUniqueString(8)
	if err != nil {
		fmt.Println("Error generating unique string:", err)
		return
	}

	// Add a timestamp to ensure uniqueness
	timestamp := time.Now().UnixNano()
	uniqueString := fmt.Sprintf("%s%d", uniquePart, timestamp)

	// Trim the string to 8 characters if needed
	if len(uniqueString) > 8 {
		uniqueString = uniqueString[:8]
	}

	v.Url = v.Url + "-" + uniqueString

	if len(v.Access) > 0 {

		v.Private = true
	}

	result, err := communitesCollection.InsertOne(context.Background(), v)
	if err != nil {
		http.Error(rw, "failed to insert Community	: "+err.Error(), http.StatusInternalServerError)
		return
	}

	//create default channel
	var c models.Channel
	c.ID = primitive.NewObjectID()

	c.Name = "Home"
	c.Locked = false
	c.Parent = result.InsertedID.(primitive.ObjectID)

	result, err = channelCollection.InsertOne(context.Background(), c)
	if err != nil {
		http.Error(rw, "failed to insert Channel: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(rw).Encode(result.InsertedID)
}
func CreateChannel(rw http.ResponseWriter, r *http.Request) {
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	// Retrieve session from request context
	var v models.Channel

	// We decode our body request params
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}

	v.ID = primitive.NewObjectID()

	result, err := channelCollection.InsertOne(context.Background(), v)
	if err != nil {
		http.Error(rw, "failed to insert Channel	: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(rw).Encode(result.InsertedID)
}
func CreatePost(rw http.ResponseWriter, r *http.Request) {
	// Retrieve session from request context
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}
	var v models.Ads

	// We decode our body request params
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}

	v.ID = primitive.NewObjectID()

	if v.Logo != "" {
		img, _, err := decodeDataURI(v.Logo)
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
		v.Logo = webpDataURI
	}

	result, err := adsCollection.InsertOne(context.Background(), v)
	if err != nil {
		http.Error(rw, "failed to insert Ad: "+err.Error(), http.StatusInternalServerError)
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
func Channels(rw http.ResponseWriter, r *http.Request) {
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
		data = bson.M{"parent": objectId}
	}

	// Fetch posts with pagination
	var posts []bson.M
	cursor, err := channelCollection.Find(context.Background(), data)
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

		data = bson.M{"name": name}
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

	if v.ProfilePicture != "" {
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
	}
	if v.CoverPicture != "" {
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
	}
	filter := bson.M{"name": v.Username}
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

}
