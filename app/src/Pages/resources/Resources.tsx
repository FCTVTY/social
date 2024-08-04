import React, { Fragment, useEffect, useState } from 'react';
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { getApiDomain } from "../../lib/auth/supertokens";
import { CommunityCollection, Courses } from "../../interfaces/interfaces";

interface HomeProps {
    host?: string;
    channel?: string;
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function ResourcesPage({ host, channel }: HomeProps) {
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
            setPosts(postsData || []);
        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const filteredPosts = posts?.flatMap(post =>
        post.files.filter(file => {
            const fileExt = file.fileext || ''; // Default to an empty string if undefined
            return selectedCategory === 'All' || fileExt.includes(selectedCategory);
        }).map(file => ({
            ...file,
            courseName: post.name,
            image: post.media
        }))
    ) || [];

    useEffect(() => {
        // Extract unique file extensions from posts when posts are updated
        const uniqueExtensions = new Set<string>();
        posts?.forEach(post => {
            post.files.forEach(file => {
                if (file.fileext) {
                    uniqueExtensions.add(file.fileext);
                }
            });
        });
        // Update categories with unique extensions
        setCategories(prevCategories => ['All', ...Array.from(uniqueExtensions)]);
    }, [posts]);

    return (
        <div className="h-[100vh]">
            <div className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 text-center mb-3 lg:-ml-72">
                <div className="min-w-0 flex-1">
                    <h2 className="mt-2 text-3xl leading-7 tracking-wider text-sky-950 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
                        {community?.community?.name} Resources
                    </h2>
                </div>
                <div className="absolute right-5 mt-5 flex lg:ml-4 lg:mt-0">
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                {selectedCategory}
                                <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 z-[9999]" aria-hidden="true" />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="z-[9999] origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {categories.map(category => (
                                        <Menu.Item key={category}>
                                            {({ active }) => (
                                                <a
                                                    onClick={() => handleCategoryChange(category)}
                                                    className={classNames(
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'block px-4 py-2 text-sm cursor-pointer'
                                                    )}
                                                >
                                                    {category}
                                                </a>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-xl dark:bg-zinc-950">
                    <section aria-labelledby="features-heading" className="relative">
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                                {filteredPosts.map((file, index) => (
                                    <div key={index} className="group relative bg-white dark:bg-zinc-950 dark:border-gray-800 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                        <div className="aspect-w-1 aspect-h-1 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-56">
                                            {file.image ? (
                                                <img
                                                    src={file.image}
                                                    alt={`Preview of ${file.name}`} // Providing an alt text is good for accessibility
                                                    className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    No Image Available
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-4 py-2">
                                            <p className="mt-1 text-sm text-gray-500">{file.name}</p>
                                            <h3 className="flex text-sm text-gray-700">
                                                <span aria-hidden="true" className="" />
                                                <a
                                                    className="text-center rounded w-full bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Download file
                                                </a>
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                No resources available.
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
