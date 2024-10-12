import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  BriefcaseIcon,
  CheckIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/16/solid";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { CalendarIcon } from "@heroicons/react/24/outline";
import {
  Community,
  CommunityCollection,
  Post,
  PPosts,
  Profile,
  Channel,
  EventDetails,
  PEvent,
} from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import moment from "moment";
import { date } from "zod";
import { TicketPlus } from "lucide-react";
import { json } from "react-router-dom";
import EventItem from "./Eventitem";

interface HomeProps {
  host?: string;
  channel?: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
export default function EventsPage({
  host,
  channel,
  roles,
  setRoles,
}: HomeProps) {
  const [posts, setPosts] = useState<PEvent[]>([]);
  const [community, setCommunity] = useState<CommunityCollection>();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const [destroyloading, setdestroyloading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [skelloading, setskelloading] = useState(true);

  useEffect(() => {
    fetchDetails();
    setLoading(false);
  }, [host, channel]);

  const fetchDetails = async () => {
    try {
      setskelloading(true);
      const communityResponse = await fetch(
        `${getApiDomain()}/community?name=${host}`,
      );
      const communityData: CommunityCollection = await communityResponse.json();
      setCommunity(communityData);

      const [postsResponse, profileResponse] = await Promise.all([
        fetch(
          `${getApiDomain()}/community/posts?host=${host}&page=${page}&event=true`,
        ),
        // fetch(`${getApiDomain()}/ads/get`),
        fetch(`${getApiDomain()}/profile`),
      ]);

      const [postsData, profileData] = await Promise.all([
        postsResponse.json(),
        //adsResponse.json(),
        profileResponse.json(),
      ]);

      const sortedPosts = postsData.sort(
        (a: Post, b: Post) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setPosts(sortedPosts);
      //setProfile(profileData);
      setLoading(false);
      setskelloading(false);
      if (profileData == null) {
        //window.location.href = '/onboarding/';
      }
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  const handleRefresh = () => {
    if (channel) {
      setIsLoading(true);
      window.location.reload();
    }
  };

  const lastPostElementRef = useRef<HTMLLIElement>(null);

  const handleObserver = (node: Element | null) => {
    if (loading) return;
    if (skelloading) return;
    if (destroyloading) return; //hard stop on loading
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoading(false);
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };
  const [eventData, setEventData] = useState<EventDetails>({
    allowSignups: false,
    date: "",
    location: "",
    etype: "online",
    logo: "",
  });
  const [postData, setPostData] = useState<PEvent>({
    postComments: [],
    _id: "",
    channel: "",
    channelstring: "",
    commentsallowed: true,
    date: "",
    desc: "",
    article: "",
    locked: false,
    media: "",
    profile: {} as Profile,
    softdelete: false,
    tags: [],
    userid: "",
    postLikes: [],
    type: "event",
    channels: {} as Channel,
    communites: {} as Community,
    eventDetails: eventData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };
  const handleImageCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      setPostData((prevState) => ({
        ...prevState,
        media: base64String,
      }));
      // @ts-ignore
      setSelectedImage(base64String);
    };

    reader.readAsDataURL(file);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      setPostData((prevState) => ({
        ...prevState,

        logo: base64String,
      }));

      // @ts-ignore
      setSelectedImage(base64String);
    };

    reader.readAsDataURL(file);
  };
  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
    setPostData({ ...postData, eventDetails: { ...eventData, [name]: value } });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({ ...eventData, etype: e.target.value });
    setPostData({
      ...postData,
      eventDetails: { ...eventData, etype: e.target.value },
    });
  };
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
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
    <div className="h-[100vh]">
      <div className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 text-center mb-3 ">
        <div className="min-w-0 flex-1">
          <h2 className="mt-2 text-3xl leading-7 tracking-wider text-sky-950 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
            <span className="hidden lg:inline">
              {" "}
              {community?.community?.name}
            </span>{" "}
            Events
          </h2>
        </div>
        <div className=" absolute right-5 mt-5 flex lg:ml-4 lg:mt-0">
          <span className="sm:ml-3">
            {community && community.community?.create && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="hidden lg:inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <CalendarIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Create
              </button>
            )}
            {roles &&
              (roles.includes("admin") || roles.includes("moderator")) && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="hidden lg:inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <CalendarIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  Create
                </button>
              )}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-2">
        <ul
          role="list"
          className="divide-y divide-gray-100 dark:divide-zinc-900 overflow-hidden bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
        >
          {posts &&
            posts.map((post) => (
              <EventItem
                post={post}
                profile=""
                lite=""
                jsonpost={JSON.stringify(post, null, 2)}
              ></EventItem>
            ))}

          <div ref={handleObserver}>
            {loading && (
              <div className="text-center my-10">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin  fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
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

          {posts.filter((post) => post.type === "event").length == 0 && (
            <div className="p-6 text-center text-gray-900 dark:text-gray-400 dark:text-gray-400">
              No Events available.
            </div>
          )}
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
                    <form
                      className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
                      onSubmit={handleSubmit}
                    >
                      <div className="flex-1">
                        {/* Header */}
                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-400">
                                New Event
                              </Dialog.Title>
                              <p className="text-sm text-gray-900 dark:text-gray-400">
                                Get started by filling in the information below
                                to create your new Event.
                              </p>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="text-gray-400 hover:text-gray-900 dark:text-gray-400"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Divider container */}
                        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                          {/* Event name */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="desc"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
                              >
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
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          {/* Event description */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="article"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
                              >
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
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          {/* Event image */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <h3 className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-400">
                                Cover Image
                              </h3>
                            </div>
                            <div className="sm:col-span-2">
                              <div className="flex space-x-2 mb-2">
                                <label
                                  htmlFor="imagec-upload"
                                  className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </label>
                              </div>
                              <img src={postData.media} />
                            </div>
                          </div>
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <h3 className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-400">
                                Logo
                              </h3>
                            </div>
                            <div className="sm:col-span-2">
                              <div className="flex space-x-2 mb-2">
                                <label
                                  htmlFor="image-upload"
                                  className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </label>
                              </div>
                              <img src={postData.logo} />
                            </div>
                          </div>
                          {/* Event Type */}
                          <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <legend className="sr-only">Event Type</legend>
                            <div
                              className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-400"
                              aria-hidden="true"
                            >
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
                                      checked={eventData.etype === "Zoom"}
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor="online-event"
                                      className="font-medium text-gray-900 dark:text-gray-400"
                                    >
                                      Online Event
                                    </label>
                                    <p
                                      id="online-event-description"
                                      className="text-gray-900 dark:text-gray-400"
                                    >
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
                                      checked={eventData.etype === "In-Person"}
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor="in-person-event"
                                      className="font-medium text-gray-900 dark:text-gray-400"
                                    >
                                      In-Person
                                    </label>
                                    <p
                                      id="in-person-event-description"
                                      className="text-gray-900 dark:text-gray-400"
                                    >
                                      Meet at a conference center or other
                                      location
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </fieldset>

                          {/* Event Date */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="date"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
                              >
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
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <input
                            type="file"
                            id="imagec-upload"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageCChange}
                          />
                          <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                          />
                          {/* Event Location */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="location"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
                              >
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
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
    </div>
  );
}
