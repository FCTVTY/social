import {EnvelopeIcon, PhoneIcon} from '@heroicons/react/20/solid'
import React, {useEffect, useState} from "react";
import {XMarkIcon} from '@heroicons/react/20/solid'
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import {CommunityCollection, Post} from "../../interfaces/interfaces";
import { formatDistanceToNow } from 'date-fns';
import Create from "./create";

interface HomeProps {
    host?: string,
    channel?: string
}

export default function Feed({host, channel}: HomeProps) {
    const [posts, setPosts] = useState<Post[]>([]);

    if(channel != null)
    {
        useEffect(() => {
            fetchDetails();
        }, [host]);

        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${getApiDomain()}/community/posts?oid=${channel}`);
                setPosts(response.data);



            } catch (error) {
                console.error('Error fetching community details:', error);
            }
        };
    }

    return (

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">




            <ul role="list"
                className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mx-auto divide-y">

<li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow max-w-4xl">
    <Create/>
</li>
                {posts.map((person) => (
                    <li
                        key={person.userId}
                        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow max-w-4xl"
                    >
                        <div className="flex flex-1 flex-col p-3">

                            <dl className="mt-1 flex flex-grow flex-col justify-between">
                                <a href="#" className="group block flex-shrink-0">
                                    <div className="flex items-center">
                                        <div>
                                            <img
                                                className="inline-block h-9 w-9 rounded-full"
                                                src={person.media}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{person.userId}</p>
                                            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">View
                                                profile</p>
                                        </div>
                                    </div>
                                </a>

                                <img className="mx-auto mt-2 rounded-md" src={person.media} alt=""/>

                                <div className="flex py-4 justify-between">

                                    <div className="flex space-x-2">
                                        <div className="flex space-x-1 items-center">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600 cursor-pointer" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </span>
                                            <span>22</span>
                                        </div>
                                        <div className="flex space-x-1 items-center">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="h-7 w-7 text-red-500 hover:text-red-400 transition duration-100 cursor-pointer"
                 viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd"/>
            </svg>
          </span>
                                            <span>20</span>
                                        </div>
                                    </div>
                                </div>
                                <dd className="text-sm text-gray-500"> views</dd>
                                <dd className="text-sm text-gray-500">
                                    {person.tags.map(tag => (
                                        <a key={tag} href={`#${tag}`} className="mr-2">#{tag} </a>
                                    ))}
                                </dd>
                                <dd className="text-sm text-gray-200">View all comments</dd>
                                <dd className="text-sm text-gray-200 font-bold">{formatDistanceToNow(new Date(person.date), {addSuffix: true})}</dd>
                            </dl>
                        </div>
                        <div>

                        </div>
                        <div className="divide-x"></div>
                    </li>

                ))}
            </ul>
        </div>
    )
}
