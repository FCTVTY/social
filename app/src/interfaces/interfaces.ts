import { ObjectId } from 'mongodb';

interface Community {
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
