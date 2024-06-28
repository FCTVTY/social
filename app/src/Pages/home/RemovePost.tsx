import React, {useEffect, useState} from 'react';
import {Ads, Post, Profile} from "../../interfaces/interfaces";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import PostItem from "./Feeditem";
import PostItemLite from "./FeeditemLite";
import {LinkIcon, PlusIcon, ExclamationTriangleIcon} from "@heroicons/react/16/solid";


interface HomeProps {
    host?: string;
    profileid?: string;
}

export default function RemovePost({ host, profileid }: HomeProps) {
    const [profile, setProfile] = useState<Profile>();

    console.log(profileid)

    useEffect(() => {
        if (profileid) {
            fetchDetails();
        }
    }, [host, profileid]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${getApiDomain()}/removepost?oid=${profileid}`);
            const timer = setTimeout(() => {
                // Redirect to the desired location after 3 seconds
                window.location.href = '/feed/';
            }, 3000);

        } catch (error) {
            console.error('Error fetching profile details:', error);
        }
    };
    return (
        <main className="profile-page">
            <div className="rounded-md bg-yellow-50 p-4 m-10">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true"/>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Please wait.. Removing Post</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>
                               Removing Post <br/>
                                Removing Media <br/>
                                Removing Likes <br/>
                                Removing Comments <br/>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}