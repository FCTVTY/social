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

package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type Community struct {
	ID      primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name    string             `json:"name"`
	Logo    string             `json:"logo"`
	Desc    string             `json:"desc"`
	Private bool               `json:"private"`
}
type Channel struct {
	ID     primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name   string             `json:"name"`
	Locked bool               `json:"locked"`
}

type CommunityCollection struct {
	Community Community `json:"community"`
	Channels  []Channel `json:"channels"`
}
type Posts struct {
	ID primitive.ObjectID `bson:"_id" json:"id,omitempty"`

	UserID          string             `json:"userId"`
	Media           string             `json:"media"`
	Tags            []string           `json:"tags"`
	Date            time.Time          `json:"date"`
	Locked          bool               `json:"locked"`
	Commentsallowed bool               `json:"commentsallowed"`
	SoftDelete      bool               `json:"softDelete"`
	Channel         primitive.ObjectID `bson:"channel" json:"channel,omitempty"`
	Desc            string             `json:"desc"`
	Channelstring   string             `json:"channelstring"`
}
