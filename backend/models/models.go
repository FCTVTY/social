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
	ID        primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name      string             `json:"name"`
	Logo      string             `json:"logo"`
	Desc      string             `json:"desc"`
	Private   bool               `json:"private"`
	OwnerId   string             `json:"ownerId"`
	Create    bool               `json:"create"`
	Url       string             `json:"url"`
	Access    string             `json:"access"`
	Published bool               `json:"published"`
}
type Channel struct {
	ID     primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name   string             `json:"name"`
	Locked bool               `json:"locked"`
	Parent primitive.ObjectID `bson:"parent" json:"parent,omitempty"`
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
	Visability      bool               `json:"visability"`
}
type PPosts struct {
	ID              string    `json:"_id"`
	Channel         string    `json:"channel"`
	Channelstring   string    `json:"channelstring"`
	Commentsallowed bool      `json:"commentsallowed"`
	Date            time.Time `json:"date"`
	Desc            string    `json:"desc"`
	Locked          bool      `json:"locked"`
	Media           string    `json:"media"`
	Profile         []Profile `json:"profile"`
	Softdelete      bool      `json:"softdelete"`
	Tags            []any     `json:"tags"`
	Userid          string    `json:"userid"`
	Visability      bool      `json:"visability"`
}

type Profile struct {
	ID             primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Email          string             `json:"email"`
	FirstName      string             `json:"first_name"`
	LastName       string             `json:"last_name"`
	ProfilePicture string             `json:"profilePicture"`
	CoverPicture   string             `json:"coverPicture"`
	SupertokensID  string             `json:"supertokensId"`
	Username       string             `json:"username"`
	Me             bool               `json:"me"`
	Communities    []any              `json:"communities"`
	Bio            string             `json:"bio"`
}

type Ads struct {
	ID     primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name   string             `json:"name"`
	Logo   string             `json:"logo"`
	Ad     string             `json:"ad"`
	URL    string             `json:"url"`
	Clicks int                `json:"clicks"`
}
type PostLike struct {
	PostID string `json:"postId"`
	UserID string `json:"userId"`
	Liked  bool   `json:"liked"`
}
type Comment struct {
	PostID  string `json:"postId"`
	UserID  string `json:"userId"`
	Comment string `json:"comment"`
}
type EventPost struct {
	ID            primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Channel       primitive.ObjectID `bson:"channel" json:"channel,omitempty"`
	Date          time.Time          `json:"date"`
	Desc          string             `json:"desc"`
	Locked        bool               `json:"locked"`
	Media         string             `json:"media"`
	Logo          string             `json:"logo"`
	Channelstring string             `json:"channelString"`
	Type          string             `json:"type,omitempty"`
	Softdelete    bool               `json:"softdelete"`
	Userid        string             `json:"userid"`
	Article       string             `json:"article,omitempty"`
	EventDetails  struct {
		AllowSignups bool      `json:"allowSignups"`
		Date         time.Time `json:"date"`
		Etype        string    `json:"etype"`
		Location     string    `json:"location"`
	} `json:"eventDetails,omitempty"`
}

type Courses struct {
	ID        primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name      string             `json:"name"`
	Community string             `json:"community"`
	Desc      string             `json:"desc"`
	Featured  bool               `json:"featured"`
	Media     string             `json:"media"`
	Hours     string             `json:"hours"`
	Chapters  []struct {
		ID       string `json:"_id"`
		Name     string `json:"name"`
		Videourl string `json:"videourl"`
		Image    string `json:"image"`
		Text     string `json:"text"`
	} `json:"chapters"`

	Files []struct {
		URL     string `json:"url"`
		Name    string `json:"name"`
		Logo    string `json:"logo"`
		FileExt string `json:"fileExt"`
	} `json:"files"`
}
