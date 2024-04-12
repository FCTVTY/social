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
	"context"
	"encoding/json"
	"footallfitserver/models"
	"github.com/joho/godotenv"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/session/claims"
	sessionerror "github.com/supertokens/supertokens-golang/recipe/session/errors"
	"github.com/supertokens/supertokens-golang/recipe/userroles/userrolesclaims"
	"github.com/supertokens/supertokens-golang/supertokens"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
func contains(s []interface{}, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func AddWVoucher(rw http.ResponseWriter, r *http.Request) {
	sessionContainer := session.GetSessionFromRequestContext(r.Context())
	roles := sessionContainer.GetClaimValue(userrolesclaims.UserRoleClaim)

	if roles == nil || !contains(roles.([]interface{}), "admin") {
		err := supertokens.ErrorHandler(sessionerror.InvalidClaimError{
			Msg: "User is not an admin",
			InvalidClaims: []claims.ClaimValidationError{
				{ID: userrolesclaims.UserRoleClaim.Key},
			},
		}, r, rw)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusUnauthorized)

		}
	}
	var v models.WalkVoucherMapping

	// We decode our body request params
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if the walk contains the place ID in its places array

	var id, _ = primitive.ObjectIDFromHex(v.Wid)

	walkID := bson.M{"_id": id}
	walk := walkCollection.FindOne(context.Background(), walkID)
	if walk.Err() != nil {
		errorMessage := map[string]string{"error": "Walk not found"}
		rw.WriteHeader(http.StatusNotFound)
		json.NewEncoder(rw).Encode(errorMessage)
		return
	}

	var walkData models.Walk
	if err := walk.Decode(&walkData); err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}

	// Check if the place ID already exists in the places array
	placeExists := false
	for _, placeID := range walkData.Vouchers {
		if placeID == v.Voucherid {
			placeExists = true
			break
		}
	}

	// If the place ID doesn't exist, add it to the places array
	if !placeExists {
		walkData.Vouchers = append(walkData.Vouchers, v.Voucherid)
		_, err := walkCollection.ReplaceOne(context.Background(), walkID, walkData)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	rw.WriteHeader(http.StatusOK)
	rw.Write([]byte("Voucher added successfully"))
}
