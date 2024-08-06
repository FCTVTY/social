import React, {Fragment, useEffect, useState} from 'react';
import {
    BriefcaseIcon,
    CheckIcon,
    ChevronRightIcon,
    CurrencyDollarIcon,
    LinkIcon,
    MapPinIcon,
    PencilIcon
} from "@heroicons/react/16/solid";
import {Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {CalendarIcon} from "@heroicons/react/24/outline";
import {Community, CommunityCollection, Post, PPosts} from "../../interfaces/interfaces";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import moment from 'moment';

interface HomeProps {
    host?: string;
    channel?: string;
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
export default function MembersPage({ host, channel }: HomeProps) {
    const [posts, setPosts] = useState<PPosts[]>([]);
    const [community, setCommunity] = useState<Community>();

    useEffect(() => {
        if (host) {
            fetchDetails();
        }
    }, [host, channel]);

    const fetchDetails = async () => {
        try {
            const Cresponse = await axios.get(`${getApiDomain()}/members?name=${host}`);
            setCommunity(Cresponse.data)

        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };
    const handleRefresh = () => {
        if (channel) {
            fetchDetails();
        }
    };

    return (
        <div className="h-[100vh]">


            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="bg-white dark:bg-zinc-950 py-32">
                    <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
                        <div className="mx-auto max-w-2xl">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Meet <strong>{community?.name}</strong> members</h2>
                            <p className="mt-4 text-lg leading-8 text-gray-600">
                                We’re a dynamic group of individuals who are passionate about what we do.
                            </p>
                        </div>
                        <ul
                            role="list"
                            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
                        >
                            {community && community.profiles.map((person) => (
                                <li key={person._id}>
                                    <a href={`/profile/${person._id}`} >
                                    <img className="mx-auto h-56 w-56 rounded-full object-cover " src={person.profilePicture} alt=""/>
                                    <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900 dark:text-white ">{person.first_name} {person.last_name} </h3>
                                    <p className="text-sm leading-6 text-gray-600 truncate">{person.bio}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
        ;
};

