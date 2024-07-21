import React, {Fragment, useEffect, useState} from 'react';
import {
    BriefcaseIcon, ChartBarSquareIcon, CheckCircleIcon,
    CheckIcon,
    ChevronRightIcon,
    CurrencyDollarIcon, GlobeAltIcon,
    LinkIcon,
    MapPinIcon,
    PencilIcon, PlusIcon, QuestionMarkCircleIcon
} from "@heroicons/react/16/solid";
import {Dialog, Menu, Tab, Transition} from "@headlessui/react";
import {ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {Bars3Icon, CalendarIcon, Cog6ToothIcon, FolderIcon, HomeIcon} from "@heroicons/react/24/outline";
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
import {ChevronLeftIcon, SignalIcon, StarIcon, TicketPlus} from "lucide-react";
import {json} from "react-router-dom";
import EventItem from "./Eventitem";
import {ChevronUpDownIcon, ServerIcon} from "@heroicons/react/24/solid";

interface HomeProps {
    host?: string;
    channel?: string;
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
export default function CoursePage({ host, channel ,roles, setRoles}: HomeProps) {
    const [posts, setPosts] = useState<Courses>();
    const [community, setCommunity] = useState<CommunityCollection>();
    const [open, setOpen] = useState(false)

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

            const postsResponse = await fetch(`${getApiDomain()}/community/course?host=${communityData.community.id}&name=${channel}`);
            if (!postsResponse.ok) {
                throw new Error('Network response was not ok for posts fetch');
            }
            const postsData = await postsResponse.json();

            setPosts(postsData);
        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleRefresh = () => {
        if (channel) {
            fetchDetails();
        }
    };
    const [eventData, setEventData] = useState<EventDetails>({
        allowSignups: false,
        date: '',
        location: '',
        etype: 'online',
        logo: ''
    });
    const [postData, setPostData] = useState<PEvent>({
        postComments: [],
        _id: '',
        channel: '',
        channelstring: '',
        commentsallowed: true,
        date: '',
        desc: '',
        article: '',
        locked: false,
        media: '',
        profile: {} as Profile,
        softdelete: false,
        tags: [],
        userid: '',
        postLikes: [],
        type: 'event',
        channels: {} as Channel,
        communites: {} as Community,
        eventDetails: eventData
    });


    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const handlePrevious = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(currentChapterIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentChapterIndex < posts?.chapters.length - 1) {
            const updatedChapters = posts?.chapters.map((chapter, index) => {
                if (index === currentChapterIndex) {
                    return { ...chapter, status: 'complete' };
                }
                return chapter;
            });

            setPosts({ ...posts, chapters: updatedChapters });
            setCurrentChapterIndex(currentChapterIndex + 1);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPostData({ ...postData, [name]: value });
    };
    const handleImageCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            const base64String = event.target?.result as string;
            setPostData(prevState => ({
                ...prevState,
                media: base64String,
            }));
            // @ts-ignore
            setSelectedImage(base64String)
        };

        reader.readAsDataURL(file);
    };
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            const base64String = event.target?.result as string;
            setPostData(prevState => ({
                ...prevState,

                    logo: base64String,

            }));

            // @ts-ignore
            setSelectedImage(base64String)
        };

        reader.readAsDataURL(file);
    };
    const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
        setPostData({ ...postData, eventDetails: { ...eventData, [name]: value } });
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventData({ ...eventData, etype: e.target.value });
        setPostData({ ...postData, eventDetails: { ...eventData, etype: e.target.value } });
    };
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        postData.communites = community?.community;
        // @ts-ignore
        postData.channelstring = community?.channels[0].id;
        const date = new Date();

        postData.date = formatDate(date);
        if (postData.eventDetails?.date) {
            const eventDate = new Date(postData.eventDetails.date);
            postData.eventDetails.date = formatDate(eventDate);
        }
        // Handle form submission, e.g., send postData to an API
        console.log(postData);
        await axios.post(`${getApiDomain()}/community/createEvent`, postData, {});
        setOpen(false);
        //window.location.reload();
    };
    const products = [
        {
            id: 1,
            name: 'Fusion',
            category: 'UI Kit',
            href: '#',
            price: '$49',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-05-related-product-01.jpg',
            imageAlt:
              'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
        },{
            id: 1,
            name: 'Fusion',
            category: 'UI Kit',
            href: '#',
            price: '$49',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-05-related-product-01.jpg',
            imageAlt:
              'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
        },{
            id: 1,
            name: 'Fusion',
            category: 'UI Kit',
            href: '#',
            price: '$49',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-05-related-product-01.jpg',
            imageAlt:
              'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
        },
        // More products...
    ]


    const pages = [
        { name: 'Courses', href: '/Courses', current: false },
        { name: 'All in the Details', href: '#', current: true },
    ]


    const navigation = [
        { name: 'Projects', href: '#', icon: FolderIcon, current: false },
        { name: 'Deployments', href: '#', icon: ServerIcon, current: true },
        { name: 'Activity', href: '#', icon: SignalIcon, current: false },
        { name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
        { name: 'Usages', href: '#', icon: ChartBarSquareIcon, current: false },
        { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false },
    ]
    const teams = [
        { id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
        { id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
        { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
    ]
    const statuses = {
        offline: 'text-gray-500 bg-gray-100/10',
        online: 'text-green-400 bg-green-400/10',
        error: 'text-rose-400 bg-rose-400/10',
    }
    const environments = {
        Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
        Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
    }
    const deployments = [
        {
            id: 1,
            href: '#',
            projectName: 'ios-app',
            teamName: 'Planetaria',
            status: 'offline',
            statusText: 'Initiated 1m 32s ago',
            description: 'Deploys from GitHub',
            environment: 'Preview',
        },
        // More deployments...
    ]



    const product = {
        name: 'Application UI Icon Pack',
        version: { name: '1.0', date: 'June 5, 2021', datetime: '2021-06-05' },
        price: '$220',
        description:
          'The Application UI Icon Pack comes with over 200 icons in 3 styles: outline, filled, and branded. This playful icon pack is tailored for complex application user interfaces with a friendly and legible look.',
        highlights: [
            '200+ SVG icons in 3 unique styles',
            'Compatible with Figma, Sketch, and Adobe XD',
            'Drawn on 24 x 24 pixel grid',
        ],
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-05-product-01.jpg',
        imageAlt: 'Sample of 30 icons with friendly and fun details in outline, filled, and brand color styles.',
    }
    const reviews = {
        average: 4,
        featured: [
            {
                id: 1,
                rating: 5,
                content: `
        <p>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</p>
      `,
                date: 'July 16, 2021',
                datetime: '2021-07-16',
                author: 'Emily Selman',
                avatarSrc:
                  'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
            },
            {
                id: 2,
                rating: 5,
                content: `
        <p>Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.</p>
      `,
                date: 'July 12, 2021',
                datetime: '2021-07-12',
                author: 'Hector Gibbons',
                avatarSrc:
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
            },
            // More reviews...
        ],
    }
    const faqs = [
        {
            question: 'What format are these icons?',
            answer:
              'The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.',
        },
        {
            question: 'Can I use the icons at different sizes?',
            answer:
              "Yes. The icons are drawn on a 24 x 24 pixel grid, but the icons can be scaled to different sizes as needed. We don't recommend going smaller than 20 x 20 or larger than 64 x 64 to retain legibility and visual balance.",
        },
        // More FAQs...
    ]
    const license = {
        href: '#',
        summary:
          'For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.',
        content: `
    <h4>Overview</h4>
    
    <p>For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.</p>
    
    <ul role="list">
    <li>You\'re allowed to use the icons in unlimited projects.</li>
    <li>Attribution is not required to use the icons.</li>
    </ul>
    
    <h4>What you can do with it</h4>
    
    <ul role="list">
    <li>Use them freely in your personal and professional work.</li>
    <li>Make them your own. Change the colors to suit your project or brand.</li>
    </ul>
    
    <h4>What you can\'t do with it</h4>
    
    <ul role="list">
    <li>Don\'t be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
    <li>Don\'t be evil. These icons cannot be used on websites or applications that promote illegal or immoral beliefs or activities.</li>
    </ul>
  `,
    }
    const steps = [
        { name: 'Create account', href: '#', status: 'complete' },
        { name: 'Profile information', href: '#', status: 'current' },
        { name: 'Theme', href: '#', status: 'upcoming' },
        { name: 'Preview', href: '#', status: 'upcoming' },
    ]

    const activityItems = [
        {
            user: {
                name: 'Michael Foster',
                imageUrl:
                  'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            projectName: 'ios-app',
            commit: '2d89f0c8',
            branch: 'main',
            date: '1h',
            dateTime: '2023-01-23T11:00',
        },
        // More items...
    ]



    return (
      <>
      {posts && (


          <div>



              <div className="sticky">
                  {/* Sticky search header */}


                  <main className="lg:pr-96 mt-[-10px]">
                      <header
                        className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                          <div><h1 className="text-xl">{posts?.name}</h1>

                          </div>
                          {/* Sort dropdown */}
                          <div className="flex place-items-center"><p className="text-sm text-gray-700 mr-5">
                              Chapter <span className="font-medium">{currentChapterIndex + 1}</span> / <span
                            className="font-medium">{posts.chapters.length}</span>
                          </p>
                              <nav aria-label="Pagination"
                                   className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                  <button
                                    onClick={handlePrevious}
                                    disabled={currentChapterIndex === 0}
                                    className="relative inline-flex items-center rounded-l-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                  >
                                      <span className="sr-only">Previous</span>
                                      <ChevronLeftIcon aria-hidden="true" className="h-5 w-5"/>
                                  </button>
                                  <button
                                    onClick={handleNext}
                                    disabled={currentChapterIndex === posts.chapters.length - 1}
                                    className="relative inline-flex items-center rounded-r-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                  >
                                      <span className="sr-only">Next</span>
                                      <ChevronRightIcon aria-hidden="true" className="h-5 w-5"/>
                                  </button></nav>
                          </div>
                      </header>

                      {/* Deployment list */}
                      <div className="">
                          <div className="mx-auto px-4 py-4">
                              {/* Product */}
                              <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
                                  {/* Product image */}
                                  <div className="lg:col-span-7 lg:row-end-1">

                                      <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
                                          <iframe width="560" height="315"
                                                  src={posts.chapters[currentChapterIndex].videourl}
                                                  title="YouTube video player" frameBorder="0"
                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                  referrerPolicy="strict-origin-when-cross-origin"
                                                  allowFullScreen></iframe>
                                      </div>
                                  </div>


                                  <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-7 lg:mt-0 lg:max-w-none">
                                      <Tab.Group as="div">
                                          <div className="border-b border-gray-200">
                                          <Tab.List className="-mb-px flex space-x-8">
                                                  <Tab
                                                    className={({selected}) =>
                                                      classNames(
                                                        selected
                                                          ? 'border-indigo-600 text-indigo-600'
                                                          : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
                                                        'whitespace-nowrap border-b-2 py-6 text-sm font-medium'
                                                      )
                                                    }
                                                  >
                                                      Course Details
                                                  </Tab>


                                              </Tab.List>
                                          </div>
                                          <Tab.Panels as={Fragment}>
                                              <Tab.Panel className="-mb-10">
                                                  <h3 className="sr-only">Course Details</h3>
                                                  <p className="text-base mt-10 mb-36">{posts?.desc}</p>
                                              </Tab.Panel>


                                          </Tab.Panels>
                                      </Tab.Group>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </main>

                  {/* Activity feed */}
                  <aside
                    className=" p-5 bg-white lg:fixed lg:bottom-0 lg:right-0 lg:top-[64px]  lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
                      <header
                        className="flex items-center justify-between border-b border-white/5 ">
                          <h2 className="text-base font-semibold leading-7 ">All in the Details
                          </h2>

                      </header>
                      <div>
                          <h4 className="sr-only">Status</h4>
                          <p className="text-sm font-medium text-gray-900">{currentChapterIndex + 1}/{posts.chapters.length} Completed</p>
                          <div className="mt-6" aria-hidden="true">
                              <div className="overflow-hidden rounded-full bg-gray-200">
                                  <div className="h-2 rounded-full bg-gray-900" style={{width: `${((currentChapterIndex + 1) / posts.chapters.length) * 100}%`}}/>
                              </div>
                              <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">

                              </div>
                          </div>
                      </div>
                      <div className="">
                          <nav className="flex" aria-label="Progress">
                              <ol role="list" className="space-y-6">
                                  {posts.chapters.map((step) => (
                                    <li key={step.name}>
                                        {step.status === 'complete' ? (
                                          <div className="group">
                  <span className="flex items-start">
                    <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <CheckCircleIcon
                        className="h-full w-full text-gray-900 group-hover:text-indigo-800"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                      {step.name}
                    </span>
                  </span>
                                          </div>
                                        ) : step.status === 'current' ? (
                                          <div className="flex items-start" aria-current="step">
                  <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center" aria-hidden="true">
                    <span className="absolute h-4 w-4 rounded-full bg-indigo-200"/>
                    <span className="relative block h-2 w-2 rounded-full bg-gray-900"/>
                  </span>
                                              <span
                                                className="ml-3 text-sm font-medium text-gray-900">{step.name}</span>
                                          </div>
                                        ) : (
                                          <div className="group">
                                              <div className="flex items-start">
                                                  <div
                                                    className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                                                    aria-hidden="true">
                                                      <div
                                                        className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400"/>
                                                  </div>
                                                  <p
                                                    className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</p>
                                              </div>
                                          </div>
                                        )}
                                    </li>
                                  ))}
                              </ol>
                          </nav>
                      </div>

                      <div className="mt-10 sticky bottom-0">
                          <h2 className="text-base font-semibold leading-7 ">Course Files
                          </h2>
                          <ul role="list" className="divide-y divide-gray-300">
                              {posts.files.map((file) => (
                                <li key={file.url} className="flex items-center justify-between gap-x-6 py-5">
                                    <div className="flex gap-x-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
                                        </svg>

                                        <div className="min-w-0 flex-auto">
                                            <p
                                              className="text-sm font-semibold leading-6 text-gray-900">{file.name}</p>
                                            <p
                                              className="mt-1 truncate text-xs leading-5 text-gray-500">{file.fileExt}</p>
                                        </div>
                                    </div>
                                    <a
                                      href={file.url}
                                      className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                                        </svg>

                                    </a>
                                </li>
                              ))}
                          </ul>

                      </div>
                  </aside>
              </div>
          </div>


)}
      </>
    )

};

