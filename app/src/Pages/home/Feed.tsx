import { EnvelopeIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import { CommunityCollection, Post } from "../../interfaces/interfaces";
import { formatDistanceToNow } from 'date-fns';
import Create from "./create";

interface HomeProps {
    host?: string;
    channel?: string;
}

export default function Feed({ host, channel }: HomeProps) {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (channel) {
            fetchDetails();
        }
    }, [host, channel]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${getApiDomain()}/community/posts?oid=${channel}`);
            const sortedPosts = response.data.sort((a: Post, b: Post) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };

    return (
        <>
            {channel && (
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mx-auto divide-y">
                    <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow max-w-4xl">
                        <Create channel={channel}/>
                    </li>
                    {posts.sort().map((person) => (
                        <li key={person.userId} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow max-w-4xl">
                            <div className="flex flex-1 flex-col p-3">
                                <dl className="mt-1 flex flex-grow flex-col justify-between">
                                    <a href="#" className="group block flex-shrink-0">
                                        <div className="flex items-center">
                                            <div>
                                                <img className="inline-block h-9 w-9 rounded-full" src={person.media} alt="" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{person.userId}</p>
                                                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
                                            </div>
                                        </div>
                                    </a>
                                    <img className="mx-auto mt-2 rounded-md" src={person.media} alt="" />
                                    <div className="flex py-4 justify-between">
                                        <div className="flex space-x-2">
                                            <div className="flex space-x-1 items-center">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </span>
                                                <span>22</span>
                                            </div>
                                            <div className="flex space-x-1 items-center">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500 hover:text-red-400 transition duration-100 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                                <span>20</span>
                                            </div>
                                        </div>
                                    </div>
                                    <dd className="text-sm text-gray-500"> {person.desc}</dd>
                                    <dd className="text-sm text-gray-500">
                                        {person.tags.map(tag => (
                                            <a key={tag} href={`#${tag}`} className="mr-2">#{tag} </a>
                                        ))}
                                    </dd>
                                    <dd className="text-sm text-gray-200">View all comments</dd>
                                    <dd className="text-sm text-gray-200 font-bold">{formatDistanceToNow(new Date(person.date), { addSuffix: true })}</dd>
                                </dl>
                            </div>
                            <div></div>
                            <div className="divide-x"></div>
                        </li>
                    ))}
                </ul>
                </div>
            )}
            {!channel && (
                <div className="relative bg-white">
                    <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
                        <div
                            className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-48 xl:col-span-6">
                            <div className="mx-auto max-w-2xl lg:mx-0">
                                <img
                                    className="h-11"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                    alt="Your Company"
                                />
                                <div className="hidden sm:mt-32 sm:flex lg:mt-16">
                                    <div
                                        className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                                        Anim aute id magna aliqua ad ad non deserunt sunt.{' '}
                                        <a href="#" className="whitespace-nowrap font-semibold text-indigo-600">
                                            <span className="absolute inset-0" aria-hidden="true"/>
                                            Read more <span aria-hidden="true">&rarr;</span>
                                        </a>
                                    </div>
                                </div>
                                <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
                                    Data to enrich your online business
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat
                                    commodo. Elit sunt amet
                                    fugiat veniam occaecat fugiat aliqua.
                                </p>
                                <div className="mt-10 flex items-center gap-x-6">
                                    <a
                                        href="#"
                                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Get started
                                    </a>
                                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                                        Learn more <span aria-hidden="true">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
                            <img
                                className="aspect-[3/2] w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
                                src="https://images.unsplash.com/photo-1498758536662-35b82cd15e29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2102&q=80"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
