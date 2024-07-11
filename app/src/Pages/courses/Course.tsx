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
    EventDetails, PEvent
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
    const [posts, setPosts] = useState<PEvent[]>([]);
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

            const postsResponse = await fetch(`${getApiDomain()}/community/posts?host=${host}&page=1`);
            if (!postsResponse.ok) {
                throw new Error('Network response was not ok for posts fetch');
            }
            const postsData = await postsResponse.json();
            const sortedPosts = postsData.sort((a: Post, b: Post) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            setPosts(sortedPosts);
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
    const people = [
        {
            name: 'How to save.pdf',
            email: '1.4 MB',
            imageUrl:
              'data:image/png;base64,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EAEAAECACAAAAAJEAAAAECACAACAABEAAAAEiAAAACBABAAAAAEiAAAACBABAABAgAgAAAACRAAAABAgAgAAgAARAAAABIgAAAAgQAQAAAABIgAAAAgQAQAAQIAIAAAAAkQAAAAQIAIAAIAAEQAAAASIAAAAIEAEAAAAASIAAAAIEAEAAECACAAAAAJEAAAAECACAACAABEAAAAEiAAAACBABAAAAAEiAAAACBABAABAgAgAAAACRAAAABAgAgAAgAARAAAABIgAAAAgQAQAAAABIgAAAAgQAQAAQIAIAAAAAkQAAAAQIAIAAIAAEQAAAASIAAAAIEAEAAAAASIAAAAIEAEAAECACAAAAAJEAAAAECACAACAABEAAAAEiAAAACBABAAAAAEiAAAACBABAABAgAgAAAACRAAAABAgAgAAgAARAAAABIgAAAAgQAQAAAABIgAAAAgQAQAAQIAIAAAAAkQAAAAQIAIAAIAAEQAAAASIAAAAIEAEAAAAASIAAAAIEAEAAECACAAAAAJEAAAAECACAACAABEAAAAEiAAAACBABAAAAAEiAAAACBABAABAgAgAAAACRAAAABAgAgAAgAARAAAABIgAAAAgQAQAAAABIgAAAAgQAQAAQIAIAAAAAkQAAAAQIAIAAIAAEQAAAASIAAAAIEAEAAAAASIAAAAIEAEAAECACAAAAAJEAAAAECACAACAABEAAAAEiAAAACBABAAAAAGq8T0AlaF28iT1OehA3zM2yrJZWTYjy+ZkmYzipibFK1aquHyFimvWSHHse6KkMvl9tFhxa6tUKCpub5cKBcVtbYrXrFVx+QrFq1fL8nm/G3tZapuPqO9hh/qeURY67rtfhfkLfM9AGSAA0CW148ep37FH+56xRSyTUX7eW8o3zlZ+VqOyz7+g4vIVXrbUjh1T/r+PZiquWaPi4iXKz5mr/Ow5ys+eo8Jb8ys2DFLDhpX/73uJ5F57nQCAJAIAAXD19UrvtqvSu+36v7+WnztPmT8+rc5771Ph3fc8ritDzik1dKhSQ4cqvece//vLls8r98qryj77nDLP/kmFt+Z7HAmgpwgABKl2/DjVjh+n/j/4nrIv/Fntt/xemaf+KJn5nla2XG2t6vb+hOr2/oQGnHSiistXKPPkU+q45w/KN872PQ9AN/EmQITNOdXtu48GXz5NQ+++XXX7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',
            href: '#',
        },
        {
            name: 'Course Homework.pdf',
            email: '1.4 MB',
            imageUrl:
              'data:image/png;base64,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EAEAAECACAAAAAJEAAAAECACAACAABEAAAAEiAAAACBABAAAAAEiAAAACBABAABAgAgAAAACRAAAABAgAgAAgAARAAAABIgAAAAgQAQAAAABIgAAAAgQAQAAQIAIAAAAAkQAAAAQIAIAAIAAEQAAAASIAAAAIEAEAAAAASIAAAAIEAEAAECACAAAAAJEAAAAECACAACAABEAAAAEiAAAACBABAAAAAEiAAAACBABAABAgAgAAAACRAAAABAgAgAAgAARAAAABIgAAAAgQAQAAAABIgAAAAgQAQAAQIAIAAAAAkQAAAAQIAIAAIAAEQAAAASIAAAAIEAEAAAAASIAAAAIEAEAAECACAAAAAJEAAAAECACAACAABEAAAAEiAAAACBABAAAAAEiAAAACBABAABAgAgAAAACRAAAABAgAgAAgAARAAAABIgAAAAgQAQAAAABIgAAAAgQAQAAQIAIAAAAAkQAAAAQIAIAAIAAEQAAAASIAAAAIEAEAAAAASIAAAAIEAEAAECACAAAAAJEAAAAECACAACAABEAAAAEiAAAACBABAAAAAEiAAAACBABAABAgAgAAAACRAAAABAgAgAAgAARAAAABIgAAAAgQAQAAAABIgAAAAgQAQAAQIAIAAAAAkQAAAAQIAIAAIAAEQAAAASIAAAAIEAEAAAAASIAAAAIEAEAAECACAAAAAJEAAAAECACAACAABEAAAAEiAAAACBABAAAAAGq8T0AlaF28iT1OehA3zM2yrJZWTYjy+ZkmYzipibFK1aquHyFimvWSHHse6KkMvl9tFhxa6tUKCpub5cKBcVtbYrXrFVx+QrFq1fL8nm/G3tZapuPqO9hh/qeURY67rtfhfkLfM9AGSAA0CW148ep37FH+56xRSyTUX7eW8o3zlZ+VqOyz7+g4vIVXrbUjh1T/r+PZiquWaPi4iXKz5mr/Ow5ys+eo8Jb8ys2DFLDhpX/73uJ5F57nQCAJAIAAXD19UrvtqvSu+36v7+WnztPmT8+rc5771Ph3fc8ritDzik1dKhSQ4cqvece//vLls8r98qryj77nDLP/kmFt+Z7HAmgpwgABKl2/DjVjh+n/j/4nrIv/Fntt/xemaf+KJn5nla2XG2t6vb+hOr2/oQGnHSiistXKPPkU+q45w/KN872PQ9AN/EmQITNOdXtu48GXz5NQ+++XXX7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',
            href: '#',
        },

    ]
    return (
      <>

          <div>



              <div className="sticky">
                  {/* Sticky search header */}


                  <main className="lg:pr-96 mt-[-10px]">
                      <header
                        className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                          <div><h1 className="text-xl">All in the Details</h1>
                              <p className="text-base">Coruse details</p>
                          </div>
                          {/* Sort dropdown */}
                          <div className="flex place-items-center"><p className="text-sm text-gray-700 mr-5">
                              Chapter <span className="font-medium">3</span> / <span
                            className="font-medium">10</span>
                          </p>
                              <nav aria-label="Pagination"
                                   className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                  <a
                                    href="#"
                                    className="relative inline-flex items-center rounded-l-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                  >
                                      <span className="sr-only">Previous</span>
                                      <ChevronLeftIcon aria-hidden="true" className="h-5 w-5"/>
                                  </a>
                                  <a
                                    href="#"
                                    className="relative inline-flex items-center rounded-r-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                  >
                                      <span className="sr-only">Next</span>
                                      <ChevronRightIcon aria-hidden="true" className="h-5 w-5"/>
                                  </a></nav>
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
                                                  src="https://www.youtube.com/embed/FUUG5bDmOjQ?si=3966QryqTeN5CKQd"
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
                                                      Customer Reviews
                                                  </Tab>
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
                                                      FAQ
                                                  </Tab>
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
                                                      License
                                                  </Tab>
                                              </Tab.List>
                                          </div>
                                          <Tab.Panels as={Fragment}>
                                              <Tab.Panel className="-mb-10">
                                                  <h3 className="sr-only">Customer Reviews</h3>

                                                  {reviews.featured.map((review, reviewIdx) => (
                                                    <div key={review.id}
                                                         className="flex space-x-4 text-sm text-gray-500">
                                                        <div className="flex-none py-10">
                                                            <img src={review.avatarSrc} alt=""
                                                                 className="h-10 w-10 rounded-full bg-gray-100"/>
                                                        </div>
                                                        <div
                                                          className={classNames(reviewIdx === 0 ? '' : 'border-t border-gray-200', 'py-10')}>
                                                            <h3
                                                              className="font-medium text-gray-900">{review.author}</h3>
                                                            <p>
                                                                <time dateTime={review.datetime}>{review.date}</time>
                                                            </p>

                                                            <div className="mt-4 flex items-center">
                                                                {[0, 1, 2, 3, 4].map((rating) => (
                                                                  <StarIcon
                                                                    key={rating}
                                                                    className={classNames(
                                                                      review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                                                                      'h-5 w-5 flex-shrink-0'
                                                                    )}
                                                                    aria-hidden="true"
                                                                  />
                                                                ))}
                                                            </div>
                                                            <p className="sr-only">{review.rating} out of 5 stars</p>

                                                            <div
                                                              className="prose prose-sm mt-4 max-w-none text-gray-500"
                                                              dangerouslySetInnerHTML={{__html: review.content}}
                                                            />
                                                        </div>
                                                    </div>
                                                  ))}
                                              </Tab.Panel>

                                              <Tab.Panel className="text-sm text-gray-500">
                                                  <h3 className="sr-only">Frequently Asked Questions</h3>

                                                  <dl>
                                                      {faqs.map((faq) => (
                                                        <Fragment key={faq.question}>
                                                            <dt
                                                              className="mt-10 font-medium text-gray-900">{faq.question}</dt>
                                                            <dd
                                                              className="prose prose-sm mt-2 max-w-none text-gray-500">
                                                                <p>{faq.answer}</p>
                                                            </dd>
                                                        </Fragment>
                                                      ))}
                                                  </dl>
                                              </Tab.Panel>

                                              <Tab.Panel className="pt-10">
                                                  <h3 className="sr-only">License</h3>

                                                  <div
                                                    className="prose prose-sm max-w-none text-gray-500"
                                                    dangerouslySetInnerHTML={{__html: license.content}}
                                                  />
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
                          <p className="text-sm font-medium text-gray-900">2/3 Completed</p>
                          <div className="mt-6" aria-hidden="true">
                              <div className="overflow-hidden rounded-full bg-gray-200">
                                  <div className="h-2 rounded-full bg-gray-900" style={{width: '37.5%'}}/>
                              </div>
                              <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">

                              </div>
                          </div>
                      </div>
                      <div className="">
                          <nav className="flex" aria-label="Progress">
                              <ol role="list" className="space-y-6">
                                  {steps.map((step) => (
                                    <li key={step.name}>
                                        {step.status === 'complete' ? (
                                          <a href={step.href} className="group">
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
                                          </a>
                                        ) : step.status === 'current' ? (
                                          <a href={step.href} className="flex items-start" aria-current="step">
                  <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center" aria-hidden="true">
                    <span className="absolute h-4 w-4 rounded-full bg-indigo-200"/>
                    <span className="relative block h-2 w-2 rounded-full bg-gray-900"/>
                  </span>
                                              <span
                                                className="ml-3 text-sm font-medium text-gray-900">{step.name}</span>
                                          </a>
                                        ) : (
                                          <a href={step.href} className="group">
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
                                          </a>
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
                              {people.map((person) => (
                                <li key={person.email} className="flex items-center justify-between gap-x-6 py-5">
                                    <div className="flex gap-x-4">
                                        <img className="h-12 w-12 flex-none rounded-md bg-gray-50"
                                             src={person.imageUrl} alt=""/>
                                        <div className="min-w-0 flex-auto">
                                            <p
                                              className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                                            <p
                                              className="mt-1 truncate text-xs leading-5 text-gray-500">{person.email}</p>
                                        </div>
                                    </div>
                                    <a
                                      href={person.href}
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

      </>
    )

};

