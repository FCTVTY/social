import { ObjectId } from "mongodb";

export interface Community {
  id: ObjectId;
  name: string;
  logo: string;
  desc: string;
  private: boolean;
  create: boolean;
  profiles: Profile[];
  access: string;
  published: boolean;
  menu: string;
  menutext: string;
  landingBg: string;
}

export interface Channel {
  id: ObjectId;
  name: string;
  locked: boolean;
  // Getter for the URLFriendly property
  get URLFriendly(): string;
  // Replace spaces with hyphens or any other preferred URL-friendly character
}
// Channel class implementing the interface with an additional getter for URLFriendly
export class ChannelClass implements Channel {
  id: ObjectId;
  name: string;
  locked: boolean;

  // Getter for the URLFriendly property

  url: string;

  constructor(id: ObjectId, name: string, locked: boolean) {
    this.id = id;
    this.name = name;
    this.locked = locked;
  }
}

interface User {
  notjoined: boolean;
}

export interface CommunityCollection {
  community: Community;
  channels: ChannelClass[];
  user: User;
  profiles: Profile[];
}

export interface Post {
  id: ObjectId;
  userId: string;
  media: string;
  tags: string[];
  date: string;
  locked: boolean;
  commentsallowed: boolean;
  softDelete: boolean;
  channel: ObjectId;
  channelstring: string;
  visability: boolean;
  desc: string;
  taggedUsers: Profile[];
}
export interface PostComment {
  _id: string;
  comment: string;
  postId: string;
  userId: string;
  Profile: Profile;
}
export interface PPosts {
  postComments: PostComment[];
  _id: string;
  channel: string;
  channelstring: string;
  commentsallowed: boolean;
  date: string;
  desc: string;
  article: string;
  locked: boolean;
  media: string;
  profile: Profile;
  softdelete: boolean;
  tags: any[];
  userid: string;
  postLikes: PostLike[];
  type: string;
  channels: Channel;
  communites: Community;
  visability: boolean;
  deletable: boolean;
}
export interface EventDetails {
  allowSignups: boolean;
  date: string;
  location: string;
  etype: string;
  logo: string;
}

export interface PEvent extends PPosts {
  logo: string;
  eventDetails: EventDetails;
}

export interface Profile {
  commentCount: any;
  timeJoined: string;
  status: string;
  deleted: boolean;
  bio: string;
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  profilePicture: string;
  coverPicture: string;
  verified: boolean;
  supertokensId: string;
  username: string;
  me: boolean;
  posts: PPosts[];
}
export interface PostLike {
  _id: string;
  postId: string;
  userId: string;
}

export interface BNotfications {
  _id: string;
  postid: string;
  userid: string;
  viewed: boolean;
  channel: string;
  comment: boolean;
}

export interface Ads {
  _id: string;
  ad: string;
  clicks: number;
  logo: string;
  name: string;
  url: string;
}

export interface Courses {
  _id: string;
  name: string;
  community: string;
  desc: string;
  featured: boolean;
  media: string;
  hours: string;
  chapters: Chapter[];
  files: File[];
  category: string;
}

export interface Chapter {
  _id: string;
  name: string;
  status: string;
  videourl: string;
  image: string;
  text: string;
}

export interface File {
  url: string;
  name: string;
  logo: string;
  fileext: string;
}

export default class Message {
  type: number;
  message: string;
  username: string;

  constructor(type: number, message: string, username: string) {
    this.type = type;
    this.message = message;
    this.username = username;
  }
}
