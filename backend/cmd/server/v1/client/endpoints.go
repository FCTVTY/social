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
	"context"
	"encoding/json"
	"footallfitserver/models"
	"log"
	"net/http"
	"os"
	"time"

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
	profileCollection = database.Collection("profile")
	likesCollection = database.Collection("postLikes")
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
	filter := bson.M{"name": name}
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
	v.UserID = sessionContainer.GetUserID()
	result, err := postCollection.InsertOne(context.Background(), v)
	if err != nil {
		http.Error(rw, "failed to insert posts: "+err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(rw).Encode(result.InsertedID)

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
		data = bson.M{"channel": objectId}
		// Check if the community exists in the database

		if err != nil {
			http.Error(rw, "failed to fetch posts", http.StatusInternalServerError)
			return
		}
	}

	name = r.URL.Query().Get("host")
	if name != "" {

		data = bson.M{"communites.name": name}
		// Check if the community exists in the database
	}

	var posts []bson.M

	cursor, err := ppostCollection.Find(context.Background(), data)
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
		err = profileCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&profile)
		if err != nil {
			http.Error(rw, "failed to fetch post", http.StatusInternalServerError)
			return
		}
	}
	if self {
		err := profileCollection.FindOne(context.Background(), bson.M{"supertokensId": oid}).Decode(&profile)
		if err != nil {
			http.Error(rw, "failed to fetch post", http.StatusInternalServerError)
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
