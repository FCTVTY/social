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
import {
    Community,
    CommunityCollection,
    Post,
    PPosts,
    Profile,
    Channel,
    EventDetails, PEvent, Courses
} from "../../interfaces/interfaces";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import moment from 'moment';
import {date} from "zod";
import {TicketPlus} from "lucide-react";
import {json} from "react-router-dom";
import EventItem from "./Eventitem";

interface HomeProps {
    host?: string;
    channel?: string;
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
export default function Site({ host, channel ,roles, setRoles}: HomeProps) {

    const [posts, setPosts] = useState<Courses[]>([]);
    const [community, setCommunity] = useState<CommunityCollection>();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState<string[]>(['All']);

    useEffect(() => {
        if (host) {
            fetchDetails();
        }
    }, [host, channel]);

    const fetchDetails = async () => {
        try {
            const communityResponse = await fetch(`${getApiDomain()}/community?name=${host}`);
            if (!communityResponse.ok) {
                throw new Error('Network response was not ok for community fetch');
            }
            const communityData = await communityResponse.json();
            setCommunity(communityData);

            const postsResponse = await fetch(`${getApiDomain()}/community/courses?oid=${communityData.community.id}&page=1`);
            if (!postsResponse.ok) {
                throw new Error('Network response was not ok for Academy fetch');
            }
            const postsData = await postsResponse.json();
            setPosts(postsData);
        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };

    return (
        <>

            <div className="container mx-auto p-6 h-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">General Settings</h2>
                    <div className="mb-4">
                        <label
                            htmlFor="community-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Community Name
                        </label>
                        <input
                            type="text"
                            id="community-name"
                            value={community?.community.name}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="branding-logo"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Branding Logo
                        </label>
                        <input
                            type="file"
                            id="branding-logo"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="desc"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="desc"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={community?.community.desc}

                        />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                    <h2 className="text-2xl font-bold mb-6">Publish Settings</h2>
                    <div className="mb-4">
                        <p>Your website is currently unpublished and can only be viewed by administrators.
                        </p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">
                            Publish Site
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                    <h2 className="text-2xl font-bold mb-6">Domain Settings</h2>
                    <div className="mb-4">
                        <label
                            htmlFor="current-address"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Current Address of Your Site
                        </label>
                        <input
                            type="text"
                            id="current-address"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            readOnly=""
                            defaultValue="currentaddress.bettermode.io"
                        />
                    </div>
                    <div className="mb-4">
                        <p className="block text-sm font-medium text-gray-700">
                            Want to use a different address for your site?
                        </p>
                        <p className="text-gray-600 mb-2">
                            Choose a subdomain under .bettermode.io
                        </p>
                        <input
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            placeholder="yoursubdomain.bettermode.io"
                        />
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            You can freely choose any subdomain under .bettermode.io, as long as
                            it’s not taken by another site. However, to use a custom domain, you
                            need to upgrade your plan.{" "}
                            <a href="#" className="text-blue-500">
                                View available plans
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </>

    )
};