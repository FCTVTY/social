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
	"github.com/joho/godotenv"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/userroles"
	"github.com/supertokens/supertokens-golang/supertokens"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
	"os"
	"time"
)

var (
	client                *mongo.Client
	brandingCollection    *mongo.Collection
	walkCollection        *mongo.Collection
	voucherCollection     *mongo.Collection
	userVoucherCollection *mongo.Collection
	placeCollection       *mongo.Collection
	userHistoryCollection *mongo.Collection
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

	database := client.Database("tenants")
	brandingCollection = database.Collection("tenants")
	walkCollection = database.Collection("walks")
	voucherCollection = database.Collection("voucher")
	userVoucherCollection = database.Collection("uservouchers")
	placeCollection = database.Collection("place")
}

func AddUVoucher(rw http.ResponseWriter, r *http.Request) {
	var v models.VouchersUsersMapping
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	if sessionContainer == nil {
		http.Error(rw, "no session found", http.StatusInternalServerError)
		return
	}

	// We decode our body request params
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}

	v.Usid = sessionContainer.GetUserID()

	// Check if the mapping already exists
	filter := bson.M{"vid": v.Vid, "usid": v.Usid}
	existingMapping := userVoucherCollection.FindOne(context.Background(), filter)
	if existingMapping.Err() == nil {
		errorMessage := map[string]string{"error": "Mapping already exists"}
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(errorMessage)
		return
	}

	// Insert the new mapping
	result, err := userVoucherCollection.InsertOne(context.Background(), v)
	if err != nil {
		errorMessage := map[string]string{"error": "Oh no, Something went wrong"}
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(errorMessage)
		return
	}

	json.NewEncoder(rw).Encode(result)
}

func Tenants(w http.ResponseWriter, r *http.Request) {

	var results []bson.M

	cursor, err := brandingCollection.Find(context.Background(), bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var result bson.M
		err := cursor.Decode(&result)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		results = append(results, result)
	}

	json.NewEncoder(w).Encode(results)
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
