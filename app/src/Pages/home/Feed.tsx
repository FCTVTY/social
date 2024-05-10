import { EnvelopeIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import {CommunityCollection, Post, PPosts} from "../../interfaces/interfaces";
import { formatDistanceToNow } from 'date-fns';
import Create from "./create";
import Button from "../../components/Button";

interface HomeProps {
    host?: string;
    channel?: string;
}

export default function Feed({ host, channel }: HomeProps) {
    const [posts, setPosts] = useState<PPosts[]>([]);

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
    const handleRefresh = () => {
        if (channel) {
            fetchDetails();
        }
    };

    return (
        <>
            {channel && (
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                    <ul role="list"
                        className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mx-auto divide-y">
                        <li className="col-span-1 flex flex-col divide-y divide-gray-200 max-w-4xl">
                            <Create channel={channel} onSubmit={handleRefresh}/>
                        </li>
                        <li className="col-span-1 flex flex-col divide-y divide-gray-200  max-w-4xl">
                            <article className="rounded-xl border-2 border-gray-100 bg-white my-3">
                                <div className="flex items-start gap-4 p-4 sm:p-6 lg:p-8">
                                    <a href="#" className="block shrink-0">
                                        <img
                                            alt=""
                                            src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
                                            className="size-14 rounded-lg object-contain"
                                        />
                                    </a>

                                    <div>
                                        <h3 className="font-medium sm:text-lg">
                                            <a href="#" className="hover:underline"> ADVERT </a>
                                        </h3>

                                        <p className="line-clamp-2 text-sm text-gray-700">
                                            AD AD AD AD
                                        </p>

                                        <div className="mt-2 sm:flex sm:items-center sm:gap-2">


                                            <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                                            <p className="hidden sm:block sm:text-xs sm:text-gray-500">

                                                <a href="#"
                                                   className="font-medium underline hover:text-gray-700">  Read More </a>
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

                        {

                            posts.sort().map((post) => (
                            <li key={post._id}
                                className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow max-w-4xl">
                                <div className="flex flex-1 flex-col p-3">
                                    <dl className="mt-1 flex flex-grow flex-col justify-between">
                                        <a href="#" className="group block flex-shrink-0">
                                            <div className="flex items-center">
                                                <div>
                                                    <img className="inline-block h-9 w-9 rounded-full"
                                                         src={post.profile[0].profilePicture} alt=""/>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{post.profile[0].first_name} {post.profile[0].last_name}</p>
                                                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">View
                                                        profile</p>
                                                </div>
                                            </div>
                                        </a>
                                        <img className="mx-auto mt-2 rounded-md" src={post.media} alt=""/>
                                        <div className="flex py-4 justify-between">
                                            <div className="flex space-x-2">
                                                <div className="flex space-x-1 items-center">
                                                <span>
                                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                        className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round"
        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
</svg>

                                                </span>
                                                    <span>22</span>
                                                </div>
                                                <div className="flex space-x-1 items-center">
                                                <span>
                                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                        className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
</svg>

                                                </span>
                                                    <span>{post.postLikes.length}</span>
                                                </div>
                                                <div className="flex space-x-1 items-center">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                         fill="currentColor" className="w-6 h-6 text-red-500">
  <path
      d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"/>
</svg>

                                                </span>
                                                    <span>{post.postLikes.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <dd className="text-sm"
                                            dangerouslySetInnerHTML={{__html: post.desc}}></dd>
                                        {post.article !== "" &&
                                            <Button className="flex items-center mr-2" color="slate" variant="outline" type="button">Read Article</Button>

                                        }
                                        <dd className="text-sm text-gray-500">
                                            {post.tags.map(tag => (
                                                <a key={tag} href={`#${tag}`} className="mr-2">#{tag} </a>
                                            ))}
                                        </dd>
                                        <a className="text-sm text-gray-400" href={`/feed/${channel}/${post._id}`}>View all comments</a>
                                        <dd className="text-sm text-gray-400 font-bold">{formatDistanceToNow(new Date(post.date), {addSuffix: true})}</dd>
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
