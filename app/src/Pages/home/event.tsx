import React, {Fragment, useEffect, useState} from 'react';
import {
    BriefcaseIcon,
    CheckIcon,
    ChevronRightIcon,
    CurrencyDollarIcon,
    LinkIcon,
    MapPinIcon,
    PencilIcon, TagIcon, UserCircleIcon
} from "@heroicons/react/16/solid";
import {Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon, EnvelopeIcon, PhoneIcon} from "@heroicons/react/20/solid";
import {CalendarIcon, CheckCircleIcon} from "@heroicons/react/24/outline";
import {PostLike, PPosts, Profile} from "../../interfaces/interfaces";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import {formatDistanceToNow} from "date-fns";
import Button from "../../components/Button";
import Comment from "./comment";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
interface HomeProps {
    host?: string,
    channel?: string,
    post?: string
}

const activity = [
    {
        id: 1,
        type: 'comment',
        person: { name: 'Eduardo Benz', href: '#' },
        imageUrl:
            'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ',
        date: '6d ago',
    },
    {
        id: 4,
        type: 'comment',
        person: { name: 'Jason Meyers', href: '#' },
        imageUrl:
            'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.',
        date: '2h ago',
    },
]

export default function EventPage({host, channel, post}: HomeProps) {
    const [ppost, setPost] = useState<PPosts>();
    const [profile, setProfile] = useState<Profile>();
    const [postLikes, setPostLikes] = useState<PostLike[]>();
    const [going, setgoing] = useState<boolean>();

    useEffect(() => {
        if (post) {
            fetchDetails();
        }
    }, [host, channel]);

    const userHasLiked = postLikes?.some(like => like.userId === profile?.supertokensId);

    const handleLikeClick = async () => {
        let updatedLikes;
        if (userHasLiked) {
            // Remove the like
            setgoing(false)
            updatedLikes = postLikes?.filter(like => like.userId !== profile?.supertokensId);
        } else {
            // Add the like
            // @ts-ignore
            setgoing(true)
            updatedLikes = [...postLikes, { _id: new Date().getTime().toString(), postId: ppost, userId: profile?.supertokensId }];
        }

        setPostLikes(updatedLikes);

        try {
            // Call the API to save the like status
            await axios.post(`${getApiDomain()}/postLikes`, {
                postId: post,
                userId: profile?.supertokensId,
                liked: !userHasLiked
            });
        } catch (error) {
            console.error('Error saving like status:', error);
            // Revert the like status in case of error
            setPostLikes(postLikes);
        }
    };

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${getApiDomain()}/community/post?oid=${post}`);

            setPost(response.data);

            setPostLikes(response.data.postLikes);

            const Presponse = await axios.get(`${getApiDomain()}/profile`);
            const profileData = Presponse.data;

            // @ts-ignore
            setgoing(response.data.postLikes?.some(like => like.userId === profileData?.supertokensId))

            setProfile(profileData);
        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };
    const handleRefresh = () => {
        if (post) {
            fetchDetails();
        }
    };

    // @ts-ignore
    // @ts-ignore

    console.log(ppost)

    return (
        <>
        {ppost && (
            <div>
        <div className="mt-[-2.5rem]">
            <div>
                <img className=" h-48 w-full object-cover lg:h-64" src={ppost?.media} alt=""/>
            </div>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 ">
                <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                    <div className="flex">
                        <img className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" src={ppost?.profile.profilePicture}
                             alt=""/>
                    </div>
                    <div
                        className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
                            <h1 className="truncate text-2xl font-bold text-gray-900">{ppost?.desc}</h1>
                        </div>
                        <div
                            className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">

                            {!userHasLiked ? (
                                <div
                                    onClick={handleLikeClick}
                                    className="cursor-pointer inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    <EnvelopeIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true"/>
                                    <span>RSVP</span>
                                </div>
                            ) : (<div

                                onClick={handleLikeClick}
                                className="cursor-pointer inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-800"
                            >
                                <CheckCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-white"
                                                 aria-hidden="true"/>
                                <span>Going</span>
                            </div>)}

                            {ppost.eventDetails?.etype === "Zoom" && going && (
                                <a
                                    href={ppost.eventDetails?.location}

                                    className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    <LinkIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                                              aria-hidden="true"/>
                                    <span>Join Online</span>
                                </a>)}
                            {ppost.eventDetails?.etype === "In-Person" && going && (
                                <a
                                    href={`https://maps.google.com/?q=${ppost.eventDetails?.location}`}  // Adjusted for valid URL
                                    className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    <LinkIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true"/>
                                    <span>Event Directions</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-4">

            <ul role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mx-auto divide-y">


            <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow max-w-4xl">
            <div className="flex flex-1 flex-col p-3">
                <dl className="mt-1 flex flex-grow flex-col justify-between">


                    {ppost.article !== "" || ppost.article !== undefined ? (
                        <dd className="text-sm text-gray-500"
                            dangerouslySetInnerHTML={{__html: ppost.article}}></dd>
                    ) : (
                        <dd className="text-sm text-gray-500"
                            dangerouslySetInnerHTML={{__html: ppost.desc}}></dd>
                    )}



                    <div className="divide-x my-4"></div>


                    <div className="flow-root mt-3">
                        <ul role="list" className="-mb-8">
                            {ppost && ppost.postComments.map((activityItem, activityItemIdx) => (
                                <li key={activityItem._id}>
                                    <div className="relative pb-8">
                                        {activityItemIdx !== ppost.postComments.length - 1 ? (
                                            <span
                                                className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                                                aria-hidden="true"/>
                                        ) : null}
                                        <div className="relative flex items-start space-x-3">

                                            <>
                                                <div className="relative">
                                                    <img
                                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
                                                        src={activityItem.profile.profilePicture}
                                                        alt=""
                                                    />


                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div>
                                                        <div className="text-sm">
                                                            <a href={activityItem._id}
                                                               className="font-medium text-gray-900">
                                                                {activityItem.profile.first_name} {activityItem.profile.last_name}
                                                            </a>
                                                        </div>
                                                        <p className="mt-0.5 text-sm text-gray-500">Commented {formatDistanceToNow(new Date(activityItem.date), {addSuffix: true})}</p>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-700">
                                                        <p>{activityItem.comment}</p>
                                                    </div>
                                                </div>
                                            </>

                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </dl>
            </div>
                <div></div>
            </li>

            </ul>
            </div>


                <Comment onSubmit={handleRefresh} post={post} supertokensId={profile?.supertokensId}/>

                <div className="fixed bottom-2 left-2 w-[20vw] lg:hidden">
                    <a href="/"
                       className="w-full flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor"
                             className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>

                    </a>
                </div>
            </div>)}
        </>

    )
        ;
};

