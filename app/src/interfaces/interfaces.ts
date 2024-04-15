import { ObjectId } from 'mongodb';

interface Community {
    _id: ObjectId;
    name: string;
    logo: string;
    desc: string;
    private: boolean;
}

interface Channel {
    _id: ObjectId;
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

