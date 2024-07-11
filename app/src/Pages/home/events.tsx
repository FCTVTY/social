import React, {Fragment, useEffect, useRef, useState} from 'react';
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
    EventDetails, PEvent
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
export default function EventsPage({ host, channel ,roles, setRoles}: HomeProps) {
    const [posts, setPosts] = useState<PEvent[]>([]);
    const [community, setCommunity] = useState<CommunityCollection>();
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const [destroyloading, setdestroyloading] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [skelloading, setskelloading] = useState(true);


    useEffect(() => {
        fetchDetails();
    }, [host, channel]);

    useEffect(() => {
        if (!loading) return;

        const loadMorePosts = async () => {
            try {
                const response = await fetch(`${getApiDomain()}/community/posts?host=${host}&page=${page}&event=true`);
                const responseData = await response.json();

                // Check if responseData is null or empty
                if (!responseData || responseData.length === 0) {
                    setLoading(false);
                    setdestroyloading(true);
                    return;
                }

                const newPosts = responseData.sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching more posts:', error);
                setLoading(false);
            }
        };

        loadMorePosts();
    }, [loading, channel, page]);

    const fetchDetails = async () => {
        try {
            setskelloading(true);
            const communityResponse = await fetch(`${getApiDomain()}/community?name=${host}`);
            const communityData: CommunityCollection = await communityResponse.json();
            setCommunity(communityData);



            const [postsResponse, adsResponse, profileResponse] = await Promise.all([
                fetch(`${getApiDomain()}/community/posts?host=${host}&page=${page}&event=true`),
                fetch(`${getApiDomain()}/ads/get`),
                fetch(`${getApiDomain()}/profile`)
            ]);

            const [postsData, adsData, profileData] = await Promise.all([
                postsResponse.json(),
                adsResponse.json(),
                profileResponse.json()
            ]);

            const sortedPosts = postsData.sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setPosts(sortedPosts);
            //setProfile(profileData);
            setskelloading(false);
            if (profileData == null) {
                //window.location.href = '/onboarding/';
            }

        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };

    const handleRefresh = () => {
        if (channel) {
            setIsLoading(true)
            window.location.reload()
        }
    };

    const lastPostElementRef = useRef<HTMLLIElement>(null);

    const handleObserver = (node: Element | null) => {
        if (loading) return;
        if(skelloading) return;
        if(destroyloading) return; //hard stop on loading
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setLoading(true);
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
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

    return (
      <>
          <div
            className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 text-center mb-3 -ml-72">
              <div className="min-w-0 flex-1">

                  <h2
                    className="mt-2 text-3xl leading-7 tracking-wider text-sky-950 sm:truncate sm:text-3xl sm:tracking-tight">
                      {community?.community?.name} Events
                  </h2>

              </div>
              <div className=" absolute right-5 mt-5 flex lg:ml-4 lg:mt-0">


          <span className="sm:ml-3">
    {community && community.community?.create && (
      <button
        type="button"
        onClick={() => setOpen(true)}

        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
          <CalendarIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true"/>
          Create
      </button>
    )}
              {roles && (roles.includes("admin") || roles.includes("moderator")) && (<button
                  type="button"
                  onClick={() => setOpen(true)}

                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <CalendarIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true"/>
                    Create
                </button>
              )}
                  </span>


              </div>
          </div>


          <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-2">

              <ul
                role="list"
                className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
              >
                  {

                      posts.filter(post => post.type === "event").map(post => (
                        <EventItem post={post} profile="" lite=""
                                   jsonpost={JSON.stringify(post, null, 2)}></EventItem>
                      ))}

                  <div ref={handleObserver}>
                      {loading && (
                        <div className="text-center my-10">
                            <div role="status">
                                <svg aria-hidden="true"
                                     className="inline w-8 h-8 text-gray-200 animate-spin  fill-blue-600"
                                     viewBox="0 0 100 101" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="currentColor"/>
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                      )}
                      {destroyloading && (
                        <div className="text-center my-10 text-sm text-muted text-gray-400 text-light">
                            End of Events.
                        </div>
                      )}
                  </div>


                  {
                    posts.filter(post => post.type === "event").length == 0 && (
                      <div className="text-center my-10 text-sm text-muted text-gray-400">
                          <h2 className="text-4xl m-3"> No Events added.</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            data-name="Layer 1"
                            className="text-center h-[320] w-[320px] p-3 mx-auto"
                            viewBox="0 0 579.232 563.506"
                          >
                              <path
                                fill="#f2f2f2"
                                d="M223.642 513.249l-15.084 13.886 11.988-20.114c-9.445-17.127-24.89-31.929-24.89-31.929s-32.047 30.703-32.047 54.837 14.348 32.56 32.046 32.56 32.046-8.426 32.046-32.56c0-5.372-1.59-11.069-4.059-16.68z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M204.68 527.887v1.19c-.072 13.828-2.404 24.616-6.98 32.213-.064.112-.135.218-.2.33l-.512-.312-.489-.306c5.077-8.204 6.873-19.8 6.938-31.86.005-.39.011-.784.005-1.178-.017-5.106-.33-10.27-.83-15.289a88.313 88.313 0 00-.118-1.177c-.695-6.62-1.696-12.945-2.72-18.44a67.34 67.34 0 00-.224-1.16c-1.773-9.293-3.58-16.024-3.993-17.514-.047-.182-.077-.282-.083-.306l.56-.159.006-.006.565-.159c.006.024.106.36.271.984.63 2.332 2.267 8.663 3.875 17.013.07.377.147.766.218 1.155.836 4.458 1.655 9.44 2.303 14.67q.247 1.97.441 3.886c.047.395.089.79.124 1.178q.813 8.136.842 15.247z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M200.751 491.751c-.394.053-.795.106-1.201.148a32.49 32.49 0 01-3.322.17 31.603 31.603 0 01-13.663-3.086c-.247.313-.494.625-.748.943a32.774 32.774 0 0014.411 3.321 33.616 33.616 0 003.545-.188c.4-.042.801-.095 1.196-.153a32.497 32.497 0 009.393-2.845q-.38-.486-.742-.954a31.495 31.495 0 01-8.869 2.644zM203.713 511.462q-.61.036-1.219.036c-.123.006-.253.006-.377.006a31.771 31.771 0 01-26.077-13.622c-.235.347-.471.695-.7 1.048a32.95 32.95 0 0026.777 13.751c.165 0 .33 0 .495-.006.412-.005.819-.017 1.225-.035a32.776 32.776 0 0017.461-6.125c-.188-.347-.377-.695-.57-1.042a31.553 31.553 0 01-17.015 5.99z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M204.68 527.887a33.187 33.187 0 01-2.562.106 31.857 31.857 0 01-30.542-22.92c-.265.477-.53.948-.783 1.425a33.024 33.024 0 0031.324 22.673c.442 0 .884-.006 1.32-.03.418-.011.83-.035 1.242-.064a32.927 32.927 0 0021.731-10.607c-.124-.435-.265-.865-.406-1.301a31.754 31.754 0 01-21.325 10.718z"
                              ></path>
                              <path
                                fill="#cacaca"
                                d="M578.394 30.177H.838a.838.838 0 010-1.676h577.556a.838.838 0 010 1.676z"
                              ></path>
                              <circle cx="19.706" cy="9.221" r="9.221" fill="#3f3d56"></circle>
                              <circle cx="51.559" cy="9.221" r="9.221" fill="#3f3d56"></circle>
                              <circle cx="83.413" cy="9.221" r="9.221" fill="#3f3d56"></circle>
                              <path
                                fill="#3f3d56"
                                d="M559.309 5.64h-22.633a1.677 1.677 0 010-3.353h22.633a1.677 1.677 0 110 3.353zM559.309 11.927h-22.633a1.677 1.677 0 010-3.353h22.633a1.677 1.677 0 110 3.353zM559.309 18.214h-22.633a1.677 1.677 0 010-3.353h22.633a1.677 1.677 0 110 3.353z"
                              ></path>
                              <path
                                fill="#f0f0f0"
                                d="M17.399 68.086H546.679V348.50600000000003H17.399z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M546.68 120.576v-2.75H443.65v-49.74h-2.75v49.74H337.87v-49.74h-2.75v49.74H232.09v-49.74h-2.75v49.74H126.308v-49.74h-2.75v49.74H17.399v2.75h106.16v54.95H17.399v2.75h106.16v54.95H17.399v2.75h106.16v54.94H17.399v2.75h106.16v54.84h2.75v-54.84h103.03v54.84h2.75v-54.84h103.03v54.84h2.75v-54.84H440.9v54.84h2.75v-54.84h103.03v-2.75H443.65v-54.94h103.03v-2.75H443.65v-54.95h103.03v-2.75H443.65v-54.95zm-317.34 170.34H126.308v-54.94h103.03zm0-57.69H126.308v-54.95h103.03zm0-57.7H126.308v-54.95h103.03zm105.78 115.39H232.09v-54.94h103.03zm0-57.69H232.09v-54.95h103.03zm0-57.7H232.09v-54.95h103.03zm105.78 115.39H337.87v-54.94H440.9zm0-57.69H337.87v-54.95H440.9zm0-57.7H337.87v-54.95H440.9z"
                              ></path>
                              <path fill="#cacaca" d="M146.805 133.939H182.214V168.219H146.805z"></path>
                              <path fill="#cacaca" d="M472.805 244.939H508.214V279.219H472.805z"></path>
                              <path
                                fill="#cacaca"
                                d="M157.805 301.939H193.214V336.21900000000005H157.805z"
                              ></path>
                              <path
                                fill="#6c63ff"
                                d="M168.27 127.579H203.679V161.85899999999998H168.27z"
                              ></path>
                              <path
                                fill="#ffb6b6"
                                d="M370.13 270.076L412.149 232.639 424.545 238.781 374.149 291.639 370.13 270.076z"
                              ></path>
                              <circle cx="417.679" cy="235.506" r="10" fill="#ffb6b6"></circle>
                              <path
                                fill="#ffb6b6"
                                d="M330.799 551.856L320.856 551.856 316.126 513.506 330.8 513.507 330.799 551.856z"
                              ></path>
                              <path
                                fill="#2f2e41"
                                d="M333.334 561.494l-32.058-.001v-.406a12.479 12.479 0 0112.478-12.478h19.58z"
                              ></path>
                              <path
                                fill="#ffb6b6"
                                d="M294.799 551.856L284.856 551.856 280.126 513.506 294.8 513.507 294.799 551.856z"
                              ></path>
                              <path
                                fill="#2f2e41"
                                d="M297.334 561.494l-32.058-.001v-.406a12.479 12.479 0 0112.478-12.478h19.58zM339.15 332.64s25-2 17 42S331.577 539 331.577 539l-15.023 2.065-8.876-160.56-6.715 160.56L281.857 539 263.15 366.64s-6.007-13.86-.003-23.43 76.003-10.57 76.003-10.57z"
                              ></path>
                              <path
                                fill="#3f3d56"
                                d="M323.15 223.64l6.94-3.72s17.101-1.458 24.08 18.63l18.51 27.956 30-26 13 9-37.81 45.124-15.72 2.01-34-44z"
                              ></path>
                              <path
                                fill="#2f2e41"
                                d="M297.963 142.506c-28.518 0-36.5 31.327-36.5 49s16.341 15 36.5 15c8.652 0 16.596.488 22.852-.347l3.009-7.347 2.42 6.088c5.136-1.887 8.219-5.722 8.219-13.394 0-17.673-7-49-36.5-49z"
                              ></path>
                              <circle cx="297.841" cy="181.915" r="24.561" fill="#ffb6b6"></circle>
                              <path
                                fill="#2f2e41"
                                d="M269.463 179.506h9.714l4.286-12 .857 12h4.643l2.5-7 .5 7h34.5a26 26 0 00-26-26h-5a26 26 0 00-26 26z"
                              ></path>
                              <path fill="#6c63ff" d="M398.27 197.579H433.679V231.859H398.27z"></path>
                              <path
                                fill="#3f3d56"
                                d="M346.92 323.59c-3.77.049-15.13-67.35-15.13-67.35l-1.7-36.32-12.41-.417v-.816a6.181 6.181 0 00-6.182-6.181H287.86a6.176 6.176 0 00-6.16 5.788l-9.734-.327-16.856 53.553s15.532 49.76 8.036 71.69c0 0 73.038 6.272 87.02-7.65 0 0 .525-12.018-3.246-11.97z"
                              ></path>
                              <path
                                fill="#3f3d56"
                                d="M276.15 224.64l-4.184-6.673s-13.61-3.365-19.213 5.653-22.074 57.886-22.074 57.886l17 6 19.291-27.046z"
                              ></path>
                              <path
                                fill="#6c63ff"
                                d="M283.27 259.579H318.679V293.85900000000004H283.27z"
                              ></path>
                              <path
                                fill="#ffb6b6"
                                d="M256.103 271.97l-12.32-1.304a12.085 12.085 0 008.578 16.98l48.744 9.729-5.085-15.66z"
                              ></path>
                              <circle cx="301.251" cy="287.555" r="10" fill="#ffb6b6"></circle>
                              <path
                                fill="#3f3d56"
                                d="M288.768 297.86l-37.135-8.486a16.043 16.043 0 01-11.632-10.64l-1.5-4.629 9.637-7.584 44.152 12.341z"
                              ></path>
                              <path
                                fill="#cacaca"
                                d="M497.439 563.506h-381a1 1 0 110-2h381a1 1 0 010 2z"
                              ></path>
                          </svg>


                      </div>
                    )
                  }
              </ul>
          </div>

          <Transition.Root show={open} as={Fragment}>
              <Dialog as="div" className="relative z-[99999]" onClose={setOpen}>
                  <div className="fixed inset-0"/>
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
                                      <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
                                            onSubmit={handleSubmit}>
                                          <div className="flex-1">
                                              {/* Header */}
                                              <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                                  <div className="flex items-start justify-between space-x-3">
                                                      <div className="space-y-1">
                                                          <Dialog.Title
                                                            className="text-base font-semibold leading-6 text-gray-900">
                                                              New Event
                                                          </Dialog.Title>
                                                          <p className="text-sm text-gray-500">
                                                              Get started by filling in the information below to
                                                              create your new Event.
                                                          </p>
                                                      </div>
                                                      <div className="flex h-7 items-center">
                                                          <button
                                                            type="button"
                                                            className="text-gray-400 hover:text-gray-500"
                                                            onClick={() => setOpen(false)}
                                                          >
                                                              <span className="sr-only">Close panel</span>
                                                              <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                                          </button>
                                                      </div>
                                                  </div>
                                              </div>

                                              {/* Divider container */}
                                              <div
                                                className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                                                  {/* Event name */}
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <label htmlFor="desc"
                                                                 className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                                              Event name
                                                          </label>
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                          <input
                                                            type="text"
                                                            name="desc"
                                                            id="desc"
                                                            value={postData.desc}
                                                            onChange={handleChange}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                          />
                                                      </div>
                                                  </div>

                                                  {/* Event description */}
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <label htmlFor="article"
                                                                 className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                                              Description
                                                          </label>
                                                      </div>
                                                      <div className="sm:col-span-2">
                            <textarea
                              id="article"
                              name="article"
                              rows={3}
                              value={postData.article}
                              onChange={handleChange}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                                                      </div>
                                                  </div>

                                                  {/* Event image */}
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <h3
                                                            className="text-sm font-medium leading-6 text-gray-900">Cover
                                                              Image</h3>
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                          <div className="flex space-x-2 mb-2">
                                                              <label htmlFor="imagec-upload"
                                                                     className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                              >
                                                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                                              </label>


                                                          </div>
                                                          <img src={postData.media}/>
                                                      </div>
                                                  </div>
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <h3
                                                            className="text-sm font-medium leading-6 text-gray-900">Logo</h3>
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                          <div className="flex space-x-2 mb-2">
                                                              <label htmlFor="image-upload"
                                                                     className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                              >
                                                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                                              </label>


                                                          </div>
                                                          <img src={postData.logo}/>
                                                      </div>
                                                  </div>
                                                  {/* Event Type */}
                                                  <fieldset
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <legend className="sr-only">Event Type</legend>
                                                      <div className="text-sm font-medium leading-6 text-gray-900"
                                                           aria-hidden="true">
                                                          Event Type
                                                      </div>
                                                      <div className="space-y-5 sm:col-span-2">
                                                          <div className="space-y-5 sm:mt-0">
                                                              <div className="relative flex items-start">
                                                                  <div className="absolute flex h-6 items-center">
                                                                      <input
                                                                        id="online-event"
                                                                        name="etype"
                                                                        value="Zoom"
                                                                        onChange={handleRadioChange}
                                                                        type="radio"
                                                                        checked={eventData.etype === 'Zoom'}
                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                      />
                                                                  </div>
                                                                  <div className="pl-7 text-sm leading-6">
                                                                      <label htmlFor="online-event"
                                                                             className="font-medium text-gray-900">
                                                                          Online Event
                                                                      </label>
                                                                      <p id="online-event-description"
                                                                         className="text-gray-500">
                                                                          People join via Zoom or Google Meet
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                              <div className="relative flex items-start">
                                                                  <div className="absolute flex h-6 items-center">
                                                                      <input
                                                                        id="in-person-event"
                                                                        name="etype"
                                                                        value="In-Person"
                                                                        onChange={handleRadioChange}
                                                                        type="radio"
                                                                        checked={eventData.etype === 'In-Person'}
                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                      />
                                                                  </div>
                                                                  <div className="pl-7 text-sm leading-6">
                                                                      <label htmlFor="in-person-event"
                                                                             className="font-medium text-gray-900">
                                                                          In-Person
                                                                      </label>
                                                                      <p id="in-person-event-description"
                                                                         className="text-gray-500">
                                                                          Meet at a conference center or other
                                                                          location
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </fieldset>

                                                  {/* Event Date */}
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <label htmlFor="date"
                                                                 className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                                              Date
                                                          </label>
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                          <input
                                                            type="datetime-local"
                                                            name="date"
                                                            id="date"
                                                            value={eventData.date}
                                                            onChange={handleEventChange}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                          />
                                                      </div>
                                                  </div>
                                                  <input type="file" id="imagec-upload" accept="image/*"
                                                         style={{display: 'none'}}
                                                         onChange={handleImageCChange}/>
                                                  <input type="file" id="image-upload" accept="image/*"
                                                         style={{display: 'none'}}
                                                         onChange={handleImageChange}/>
                                                  {/* Event Location */}
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <label htmlFor="location"
                                                                 className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                                              Location
                                                          </label>
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                          <input
                                                            type="text"
                                                            name="location"
                                                            id="location"
                                                            value={eventData.location}
                                                            onChange={handleEventChange}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                          />
                                                      </div>
                                                  </div>
                                              </div>

                                              {/* Action buttons */}
                                              <div
                                                className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
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

