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
import { ObjectId } from 'mongodb';

export interface Walk {
  calories: number;
  distance: number;
  duration: number;
  steps: number;
  id: string;
  name: string;
  tenant: string;
  details: string;
  tags: string[];
  geo: {
    coordinate: number[];
  }[];
  places: string[];
  likes: number;
  vouchers: string[];
  image: string;
  status: boolean
}

export interface Tenant {
  name: string;
}

export interface Place {
  name: string;
  tenant: string;
  logo: string;
  details: string;
  rating: string;
  toilet: boolean;
  disabled: boolean;
  coordinate: number[];
  id: string;
}

export interface Voucher {
  name: string;
  tenant: string;
  logo: string;
  details: string;
  code: string;
  expired: boolean;
  coordinate: number[];
  pid: string;
  rewarded: boolean;
  id: string;
}
export interface Branding {
  _id: string
  logo: string
  name: string
  personalWalks :boolean
  mapboxToken: string
}
export interface VoucherUserMapping {
  vid: string;
  usid: string;
  used: boolean;
}

export interface WalkPlaceMapping {
  wid: string;
  placeid: string;
}

export interface WalkVoucherMapping {
  wid: string;
  voucherid: string;
}

export interface Community {

  _id: ObjectId;
  name: string;
  logo: string;
  desc: string;
  private: boolean;
  create: boolean
  profiles: Profile[]

}

export interface Channel {
  id: ObjectId;
  name: string;
  locked: boolean;
  parent: ObjectId;
}
interface User {
  notjoined:boolean
}

export interface CommunityCollection {
  community: Community;
  channels: Channel[];
  user:User;
}

export interface Post {
  id: ObjectId
  userId: string
  media: string
  tags: string[]
  date: string
  locked: boolean
  commentsallowed: boolean
  softDelete: boolean
  channel: ObjectId
  channelstring: string

  desc: string
}
export interface PostComment {
  _id: string
  comment: string
  postId: string
  userId: string
  Profile: Profile
}
export interface PPosts {
  postComments: PostComment[];
  _id: string
  channel: string
  channelstring: string
  commentsallowed: boolean
  date: string
  desc: string
  article: string
  locked: boolean
  media: string
  profile: Profile
  softdelete: boolean
  tags: any[]
  userid: string
  postLikes: PostLike[]
  type:string
  channels: Channel
  communites: Community
  eventDetails?: EventDetails
}

export interface Profile {
  bio: string;
  _id: string
  email: string
  first_name: string
  last_name: string
  profilePicture: string
  coverPicture: string

  supertokensId: string
  username: string
  me :boolean
  posts : PPosts[]
}
export interface PostLike {
  _id: string
  postId: string
  userId: string
}
export interface EventDetails {
  allowSignups: boolean
  date: string
  location: string
  etype: string
}
export interface Ads {
  _id: string
  ad: string
  clicks: number
  logo: string
  name: string
  url: string
}