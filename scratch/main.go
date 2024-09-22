package main

import (
	"context"
	"crypto/rand"
	"fmt"
	"log"
	"math/big"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const idLength = 12

// Function to generate a random channel ID
func generateChannelID(length int) (string, error) {
	result := make([]byte, length)
	for i := range result {
		randomNum, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		result[i] = charset[randomNum.Int64()]
	}
	return string(result), nil
}

func main() {
	// MongoDB connection URI
	uri := "mongodb://guyrt:bFANwo1eaXQT6xJL5FH5@app.footfallfit.co.uk:27017" // Replace with your actual MongoDB URI

	// Create a new client and connect to the server
	client, err := mongo.NewClient(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	// Select the database and collection
	collection := client.Database("bhive").Collection("channels")

	// Define filter for documents you want to update (empty for all documents)
	filter := bson.M{} // Adjust this filter to target specific documents

	// Loop over the documents and update the channelId field
	updateEachDocumentWithUniqueID(ctx, collection, filter)
}

func updateEachDocumentWithUniqueID(ctx context.Context, collection *mongo.Collection, filter bson.M) {
	// Find all documents that match the filter
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		log.Fatal("Error finding documents:", err)
	}
	defer cursor.Close(ctx)

	// Iterate through the documents and update each one with a unique channel ID
	for cursor.Next(ctx) {
		// Generate a unique random channel ID
		channelID, err := generateChannelID(idLength)
		if err != nil {
			log.Fatal("Error generating channel ID:", err)
		}

		// Prepare the update for this document
		update := bson.M{
			"$set": bson.M{
				"publicId": channelID,
			},
		}

		// Perform the update for this document
		_, err = collection.UpdateOne(ctx, bson.M{"_id": cursor.Current.Lookup("_id")}, update)
		if err != nil {
			log.Fatal("Error updating document:", err)
		}

		fmt.Printf("Updated document with _id: %v, new channelId: %s\n", cursor.Current.Lookup("_id"), channelID)
	}

	if err := cursor.Err(); err != nil {
		log.Fatal("Cursor error:", err)
	}

	fmt.Println("All matching documents updated with unique channel IDs.")
}
