import React, {Fragment, useEffect, useState} from 'react';
import {
    BriefcaseIcon,
    CheckIcon,
    ChevronRightIcon,
    CurrencyDollarIcon,
    LinkIcon,
    MapPinIcon,
    PencilIcon, PlusIcon, QuestionMarkCircleIcon
} from "@heroicons/react/16/solid";
import {Dialog, Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {CalendarIcon} from "@heroicons/react/24/outline";
import {CommunityCollection, Post, PPosts} from "../../interfaces/interfaces";
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
export default function EventsPage({ host, channel }: HomeProps) {
    const [posts, setPosts] = useState<PPosts[]>([]);
    const [community, setCommunity] = useState<CommunityCollection>();
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (host) {
            fetchDetails();
        }
    }, [host, channel]);

    const fetchDetails = async () => {
        try {
            const Cresponse = await axios.get(`${getApiDomain()}/community?name=${host}`);
            setCommunity(Cresponse.data)
            const response = await axios.get(`${getApiDomain()}/community/posts?host=${host}`);
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
            <div className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 bg-white border-b bg-gray-200 mb-3">
                <div className="min-w-0 flex-1">

                    <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {community?.community?.name}   Events
                    </h2>

                </div>
                <div className="mt-5 flex lg:ml-4 lg:mt-0">


          <span className="sm:ml-3">
    {community && community.community?.create && (
        <button
            type="button"
            onClick={() => setOpen(true)}

            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            <CheckIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true"/>
            Create
        </button>
    )}
</span>


                </div>
            </div>


            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                <ul
                    role="list"
                    className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
                >
                    {

                        posts.filter(post => post.type === "event").map(post => (
                            <li key={post._id}
                                className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                                <div className="flex gap-x-4">
                        <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={post.media} alt=""/>
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                                <a href={`/event/${post._id}`}>
                                    <span className="absolute inset-x-0 -top-px bottom-0"/>
                                    {post.desc}
                                </a>
                            </p>
                            <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                <a href="{}" className="relative truncate hover:underline">
                                    {post.desc}
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">{post.eventDetails?.etype}</p>

                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                         className="w-5 h-5 inline-flex ">
                                        <path
                                            d="M5.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V12ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM7.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V12ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V10ZM10 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H10ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H12ZM11.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V10ZM14 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H14Z"/>
                                        <path fillRule="evenodd"
                                              d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span>{post.eventDetails && post.eventDetails.date && (
                                        moment(post.eventDetails.date).format('DD/MM/YYYY @ hh:mm').toString()
                                    )}</span>
                                </p>

                        </div>
                        <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true"/>
                    </div>
                </li>
            ))}
        </ul>
    </div>

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={setOpen}>
                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                                        <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                            <div className="flex-1">
                                                {/* Header */}
                                                <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                                    <div className="flex items-start justify-between space-x-3">
                                                        <div className="space-y-1">
                                                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                                                New Event
                                                            </Dialog.Title>
                                                            <p className="text-sm text-gray-500">
                                                                Get started by filling in the information below to create your new Event.
                                                            </p>
                                                        </div>
                                                        <div className="flex h-7 items-center">
                                                            <button
                                                                type="button"
                                                                className="text-gray-400 hover:text-gray-500"
                                                                onClick={() => setOpen(false)}
                                                            >
                                                                <span className="sr-only">Close panel</span>
                                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Divider container */}
                                                <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                                                    {/* Project name */}
                                                    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                        <div>
                                                            <label
                                                                htmlFor="desc"
                                                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                                            >
                                                                Event name
                                                            </label>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <input
                                                                type="text"
                                                                name="desc"
                                                                id="desc"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Project description */}
                                                    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                        <div>
                                                            <label
                                                                htmlFor="article"
                                                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                                            >
                                                                Description
                                                            </label>
                                                        </div>
                                                        <div className="sm:col-span-2">
                            <textarea
                                id="article"
                                name="article"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={''}
                            />
                                                        </div>
                                                    </div>

                                                    {/* Team members */}
                                                    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                        <div>
                                                            <h3 className="text-sm font-medium leading-6 text-gray-900">Image</h3>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <div className="flex space-x-2">


                                                                <button
                                                                    type="button"
                                                                    className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                >
                                                                    <span className="sr-only">Add Image</span>
                                                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Privacy */}
                                                    <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                        <legend className="sr-only">Event Type</legend>
                                                        <div className="text-sm font-medium leading-6 text-gray-900" aria-hidden="true">
                                                            Event Type
                                                        </div>
                                                        <div className="space-y-5 sm:col-span-2">
                                                            <div className="space-y-5 sm:mt-0">
                                                                <div className="relative flex items-start">
                                                                    <div className="absolute flex h-6 items-center">
                                                                        <input
                                                                            id="public-access"
                                                                            name="privacy"
                                                                            aria-describedby="public-access-description"
                                                                            type="radio"
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                            defaultChecked
                                                                        />
                                                                    </div>
                                                                    <div className="pl-7 text-sm leading-6">
                                                                        <label htmlFor="public-access" className="font-medium text-gray-900">
                                                                           Online Event
                                                                        </label>
                                                                        <p id="public-access-description" className="text-gray-500">
                                                                            People join via Zoom or google Meet
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="relative flex items-start">
                                                                    <div className="absolute flex h-6 items-center">
                                                                        <input
                                                                            id="restricted-access"
                                                                            name="privacy"
                                                                            aria-describedby="restricted-access-description"
                                                                            type="radio"
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                        />
                                                                    </div>
                                                                    <div className="pl-7 text-sm leading-6">
                                                                        <label htmlFor="restricted-access" className="font-medium text-gray-900">
                                                                            In-Person
                                                                        </label>
                                                                        <p id="restricted-access-description" className="text-gray-500">
                                                                            Meet at an conference centre or other location
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    >
                                                        Create
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

        </>
    )
        ;
};

