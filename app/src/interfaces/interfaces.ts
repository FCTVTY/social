import { ObjectId } from 'mongodb';

export interface Community {
    id: ObjectId;
    name: string;
    logo: string;
    desc: string;
    private: boolean;
}

interface Channel {
    id: ObjectId;
    name: string;
    locked: boolean;
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
    supertokensId: string
    username: string
    me :boolean
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