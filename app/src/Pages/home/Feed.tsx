import React, {useEffect, useState} from "react";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import {Ads, Post, PPosts, Profile} from "../../interfaces/interfaces";
import {formatDistanceToNow} from 'date-fns';
import Create from "./create";
import PostItem from "./Feeditem";

interface HomeProps {
    host?: string;
    channel?: string;
}

export default function Feed({host, channel}: HomeProps) {
    const [posts, setPosts] = useState<PPosts[]>([]);
    const [ad, setAds] = useState<Ads[]>([]);
    const [profile, setProfile] = useState<Profile>();

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

            const adresponse = await axios.get(`${getApiDomain()}/ads/get`);
            setAds(adresponse.data)

            const profileresponse = await axios.get(`${getApiDomain()}/profile`);

            setProfile(profileresponse.data);

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
        <>
            {channel && (
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                    <div className="lg:grid lg:grid-cols-5 lg:grid-rows-1 lg:gap-4">
                        <div className="lg:col-span-3">

                            <ul role="list"
                                className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mx-auto divide-y">
                                <li className="col-span-1 flex flex-col divide-y divide-gray-200 max-w-4xl">
                                    <Create channel={channel} onSubmit={handleRefresh}/>
                                </li>
                                {
                                    ad && ad.length > 0 && (() => {
                                        const randomIndex = Math.floor(Math.random() * ad.length);
                                        const randomPost = ad[randomIndex];
                                        if (!randomPost) {
                                            return null; // Return null if randomPost is undefined
                                        }
                                        return [randomPost].map(post => (
                                        <li key={post._id} className="col-span-1 flex flex-col divide-y divide-gray-200  max-w-4xl">
                                    <article className="rounded-xl border-2 border-gray-100 bg-white my-3">
                                        <div className="flex items-start gap-4 p-4 sm:p-6 lg:p-8">
                                            <a href="https://www.fkcreative.co.uk/" className="block shrink-0">
                                                <img
                                                    alt=""
                                                    src={post.logo}
                                                    className="size-14 rounded-lg object-contain"
                                                />
                                            </a>

                                            <div>
                                                <h3 className="font-medium sm:text-lg">
                                                    <a href="https://www.fkcreative.co.uk/"
                                                       className="hover:underline"> {post.name} </a>
                                                </h3>

                                                <p className="line-clamp-2 text-sm text-gray-700">
                                                    {post.ad}
                                                </p>

                                                <div className="mt-2 sm:flex sm:items-center sm:gap-2">


                                                    <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                                                    <p className="sm:block sm:text-xs sm:text-gray-500">

                                                        <a href={post.url}
                                                           className="font-medium underline hover:text-gray-700"> Read
                                                            More </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <strong
                                                className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-slate-900 px-3 py-1.5 text-white"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                                    />
                                                </svg>

                                                <span className="text-[10px] font-medium sm:text-xs">Advert</span>
                                            </strong>
                                        </div>
                                    </article>
                                    <div className="divide-x"></div>
                                </li>
                                        ));
                                    })()
                                }
                                {posts.filter(post => post.type !== "event").map(post => (
                                    <PostItem key={post._id} post={post} profile={profile} />
                                ))}
                            </ul>
                        </div>

                    <div className="lg:col-span-2 lg:col-start-4">
                        <div className="rounded-xl border-2 border-gray-100 bg-white p-3">
                            <h2 className="text-xl">About</h2>
                            <p className={`py-2`}>[communites.desc]</p>
                            <dl>
                                <dt className="inline-flex py-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="inline-block w-5 h-5 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                                    </svg>
                                    Public
                                </dt>
                                <dd className="text-sm text-gray-700">Anyone can see who's in the community and what
                                    they post.
                                </dd>

                                <dt className="inline-flex py-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="inline-block w-5 h-5 mr-1">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    </svg>
                                    Visible
                                </dt>
                                <dd className="text-sm text-gray-700">Anyone can find this community.
                                </dd>


                            </dl>

                        </div>

                        <div className="rounded-xl border-2 border-gray-100 bg-white p-3 mt-4">
                            <h2 className="text-xl">Members</h2>


                            <dl>
                                <dt className="inline-flex py-2">

                                    Newest Members
                                </dt>
                                <dd className="text-sm text-gray-700">

                                    <div className="isolate flex -space-x-2 overflow-hidden">
                                        <img
                                            className="relative z-30 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                        <img
                                            className="relative z-20 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                        <img
                                            className="relative z-10 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                                            alt=""
                                        />
                                        <img
                                            className="relative z-0 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                    </div>
                                </dd>
                            </dl>
                            <dl>
                                <dt className="inline-flex py-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="inline-block w-5 h-5 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
                                    </svg>

                                    Admins & Moderators
                                </dt>
                                <dd className="text-sm text-gray-700">

                                    <div className="isolate flex -space-x-2 overflow-hidden">
                                        <img
                                            className="relative z-30 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                        <img
                                            className="relative z-20 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                        <img
                                            className="relative z-10 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                                            alt=""
                                        />
                                        <img
                                            className="relative z-0 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                    </div>
                                </dd>
                            </dl>
                        </div>

                    </div>
                    </div>
                </div>

            )}

        </>
    );
}
