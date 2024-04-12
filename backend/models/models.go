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

import "go.mongodb.org/mongo-driver/bson/primitive"

type Tenant struct {
	Name string `bson:"name,omitempty"`
	Logo string `bson:"logo,omitempty"`
}

type Walk struct {
	ID      primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name    string             `json:"name"`
	Tenant  string             `json:"tenant"`
	Details string             `json:"details"`
	Tags    []string           `json:"tags"`
	Geo     []struct {
		Coordinate []float64 `json:"coordinate"`
	} `json:"geo"`
	Places   []string `json:"places"`
	Likes    int      `json:"likes"`
	Vouchers []string `json:"vouchers"`
	Image    string   `json:"image"`
	Calories int      `json:"calories,string"` // Calories received as string
	Distance float64  `json:"distance,string"` // Distance received as string
	Duration int      `json:"duration,string"` // Duration received as string
	Steps    int      `json:"steps,string"`    // Steps received as string
}

type Place struct {
	Name       string             `json:"name"`
	Tenant     string             `json:"tenant"`
	Logo       string             `json:"logo"`
	Details    string             `json:"details"`
	Rating     string             `json:"rating"`
	Toilet     bool               `json:"toilet"`
	Disabled   bool               `json:"disabled"`
	Coordinate []float64          `json:"coordinate"`
	ID         primitive.ObjectID `bson:"_id" json:"id,omitempty"`
}

type Vouchers struct {
	Name       string             `json:"name"`
	Tenant     string             `json:"tenant"`
	Logo       string             `json:"logo"`
	Details    string             `json:"details"`
	Code       string             `json:"code"`
	Expired    bool               `json:"expired"`
	Coordinate []float64          `json:"coordinate"`
	Pid        string             `json:"pid"`
	Rewarded   bool               `json:"rewarded"`
	ID         primitive.ObjectID `bson:"_id" json:"id,omitempty"`
}
type VouchersUsersMapping struct {
	Vid  string `json:"vid"`
	Usid string `json:"usid"`
	Used bool   `json:"used"`
}

type WalkPlaceMapping struct {
	Wid     string `json:"wid"`
	Placeid string `json:"placeid"`
}
type WalkVoucherMapping struct {
	Wid       string `json:"wid"`
	Voucherid string `json:"voucherid"`
}

type UserHistory struct {
	Duration       string `json:"duration"`
	Distance       string `json:"distance"`
	CaloriesBurned string `json:"calories_burned"`
	Steps          string `json:"steps"`
	UserID         string `json:"userid"`
}
