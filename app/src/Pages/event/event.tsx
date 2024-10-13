import React, { Fragment, useEffect, useState } from "react";
import {
  LinkIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import {
  EventDetails,
  PostLike,
  PPosts,
  Profile,
} from "../../interfaces/interfaces";
import { getApiDomain } from "../../lib/auth/supertokens";
import Comment from "../home/comment";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { ClockIcon, GlobeIcon, PersonStandingIcon } from "lucide-react";
import { UserIcon, XMarkIcon } from "@heroicons/react/20/solid";
import ical, { ICalEvent } from "ical-generator";
import ICalendarLink from "react-icalendar-link";
import { Link, useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";

interface HomeProps {
  host?: string;
  channel?: string;
  post?: string;
  roles;
  setRoles;
}

export default function EventPage({
  host,
  channel,
  roles,
  setRoles,
}: HomeProps) {
  const [ppost, setPost] = useState<PPosts | null>(null);
  const [ev, setEv] = useState<EventDetails | null>(null);
  const [open, setOpen] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [postLikes, setPostLikes] = useState<PostLike[]>([]);
  const [going, setGoing] = useState<boolean>(false);
  const [event, setEvent] = useState<ICalEvent | null>(null);
  const { ID } = useParams(); // Extract the ID parameter from the route

  const [post, setsPost] = useState(ID); // Set channel using the ID from URL

  const userHasLiked = postLikes.some(
    (like) => like.userId === profile?.supertokensId,
  );
  const userHasLikedCount = postLikes.filter(
    (like) => like.userId === profile?.supertokensId,
  ).length;

  const handleLikeClick = async () => {
    let updatedLikes;
    if (userHasLiked) {
      // Remove the like
      setGoing(false);
      updatedLikes = postLikes.filter(
        (like) => like.userId !== profile?.supertokensId,
      );
    } else {
      // Add the like
      setGoing(true);
      updatedLikes = [
        ...postLikes,
        {
          _id: new Date().getTime().toString(),
          postId: ppost?._id ?? "",
          userId: profile?.supertokensId ?? "",
        },
      ];
    }

    setPostLikes(updatedLikes);

    try {
      await axios.post(`${getApiDomain()}/postLikes`, {
        postId: post,
        userId: profile?.supertokensId,
        liked: !userHasLiked,
      });
    } catch (error) {
      console.error("Error saving like status:", error);
      setPostLikes(postLikes);
    }
  };

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${getApiDomain()}/community/post?oid=${post}`,
      );
      setPost(response.data);

      const eventx = {
        title: response.data.desc,
        description: response.data.article,
        startTime: response.data.eventdetails.date,
        endTime: new Date(response.data.eventdetails.date + 3 * 60 * 60 * 1000),
        location: response.data.eventdetails.location,
      };

      setEvent(eventx);

      setPostLikes(response.data.postLikes);
      setEv(response.data.eventdetails);
      const Presponse = await axios.get(`${getApiDomain()}/profile`);
      const profileData = Presponse.data;

      setGoing(
        response.data.postLikes.some(
          (like) => like.userId === profileData?.supertokensId,
        ),
      );
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [post]);

  const handleDownload = (event) => {
    // Create a new iCal instance
    const cal = ical({ name: "My Calendar" });

    // Add an event
    cal.createEvent({
      start: event.eventDetails?.date,
      end: event.eventDetails?.date, // 1 hour later
      summary: event.desc,
      description: event.article,
      location: event.eventDetails?.location,
      url: event.eventDetails?.location,
    });

    // Generate the iCal file and download it
    // Generate the iCal file
    const blob = new Blob([cal.toString()], { type: "text/calendar" });

    // Create a download action without permanently adding a link to the DOM
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "calendar.ics";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(downloadUrl); // Clean up after download
    document.body.removeChild(a); // Remove the link element from the DOM
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPost({ ...ppost, [name]: value });
  };
  const handleImageCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      setPost((prevState) => ({
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
      setPost((prevState) => ({
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
    setEv({ ...ev, [name]: value });
    setPost({ ...ppost, eventdetails: { ...ev, [name]: value } });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEv({ ...ev, etype: e.target.value });
    setPost({
      ...ppost,
      eventdetails: { ...ev, etype: e.target.value },
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

    //check if date2 is set...

    if (ppost.eventdetails.date2 == undefined) {
      alert("Unable to save");
      alert("Date is missing");
    } else {
      const date = new Date();

      ppost.date = formatDate(date);
      ppost.id = ppost?._id;
      if (ppost?.eventdetails?.date) {
        const eventDate = new Date(ppost.eventdetails.date2);
        ppost.eventdetails.date = formatDate(eventDate);
      }

      // Handle form submission, e.g., send postData to an API
      console.log(ppost);
      await axios
        .post(`${getApiDomain()}/community/updateEvent`, ppost, {})
        .then(function (response) {
          console.log("Success:", response.data);
          toast.success("Event updated successfully");
        })
        .catch(function (error) {
          console.error("Error:", error); // Log the entire error
          if (error.response && error.response.data) {
            toast.error("Error: " + error.response.data);
          } else {
            toast.error("An unexpected error occurred.");
          }
        });

      setOpen(false);
    }
    //window.location.reload();
  };

  return (
    <>
      {ppost && (
        <>
          <div>
            <div className="mt-[-2.5rem] mx-2">
              <div>
                <img
                  className="h-48 w-full object-cover lg:h-64 rounded-t-lg"
                  src={ppost?.media}
                  alt=""
                />
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                  <div className="flex">
                    <img
                      className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                      src={ppost?.logo}
                      alt=""
                    />
                  </div>
                  <div className="mt-10 pt-10 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                    <div className="mt-15 min-w-0 flex-1 sm:hidden md:block">
                      <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-gray-400 dark:text-white">
                        {ppost?.desc} <br />
                        <span className="text-red-600 text-sm mt-[-10px]">
                          {new Date(ev?.date).toLocaleDateString()} At{" "}
                          {new Date(ev?.date).toLocaleTimeString()}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                      {!userHasLiked ? (
                        <div
                          onClick={handleLikeClick}
                          className="cursor-pointer inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <EnvelopeIcon
                            className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>RSVP</span>
                        </div>
                      ) : (
                        <>
                          <div
                            onClick={handleLikeClick}
                            className="cursor-pointer inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-800"
                          >
                            <CheckCircleIcon
                              className="-ml-0.5 mr-1.5 h-5 w-5 text-white"
                              aria-hidden="true"
                            />
                            <span>Going</span>
                          </div>
                          <ICalendarLink
                            className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            event={event}
                          >
                            Add to Calendar
                          </ICalendarLink>
                        </>
                      )}

                      {ev?.etype === "Zoom" && going && (
                        <a
                          href={ev.location}
                          className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <LinkIcon
                            className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>Join Online</span>
                        </a>
                      )}
                      {ev?.etype === "In-Person" && going && (
                        <a
                          href={`https://maps.google.com/?q=${ev?.location}`}
                          target="_blank"
                          className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <LinkIcon
                            className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>Event Directions</span>
                        </a>
                      )}
                      {roles &&
                        (roles.includes("admin") ||
                          roles.includes("moderator")) && (
                          <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="hidden lg:inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            <PencilIcon
                              className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <span>Edit Event</span>
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
              <ul
                role="list"
                className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mx-auto divide-y"
              >
                <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white dark:bg-gray-900 shadow max-w-7xl">
                  <div className="flex flex-1 flex-col p-3">
                    <dl className="mt-1 flex flex-grow flex-col justify-between">
                      <strong>Event Details</strong>
                      {ppost.article ? (
                        <dd
                          className="text-sm text-gray-900 dark:text-gray-400 my-3"
                          dangerouslySetInnerHTML={{ __html: ppost.article }}
                        ></dd>
                      ) : (
                        <dd
                          className="text-sm text-gray-900 dark:text-gray-400 my-3"
                          dangerouslySetInnerHTML={{ __html: ppost.desc }}
                        ></dd>
                      )}

                      <div className="border-t border-gray-200">
                        <dl>
                          <div className="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-400">
                              Location
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">
                              {ev?.etype === "In-Person" ? (
                                <>
                                  {" "}
                                  <MapPinIcon className="h-5 w-5 inline-block mr-2" />
                                  <a
                                    href={`https://maps.google.com/?q=${ev?.location}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    Directions
                                  </a>
                                </>
                              ) : (
                                <>
                                  <GlobeIcon className="h-5 w-5 inline-block mr-2" />
                                  <a
                                    href={ev?.location}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    Join Online
                                  </a>
                                </>
                              )}
                            </dd>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-400">
                              Date
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 dark:text-white sm:mt-0 sm:col-span-2">
                              <CalendarIcon className="h-5 w-5 inline-block mr-2" />
                              {new Date(ev?.date).toLocaleDateString()}
                            </dd>
                          </div>
                          <div className="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-400">
                              Time
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 dark:text-white sm:mt-0 sm:col-span-2">
                              <ClockIcon className="h-5 w-5 inline-block mr-2" />
                              {new Date(ev?.date).toLocaleTimeString()} GMT
                            </dd>
                          </div>

                          <div className="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-400">
                              Going
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 dark:text-white sm:mt-0 sm:col-span-2">
                              <UserIcon className="h-5 w-5 inline-block mr-2" />
                              {userHasLikedCount} Responded
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div className="divide-x my-4"></div>

                      <div className="flow-root mt-3">
                        <ul role="list" className="-mb-8">
                          {ppost &&
                            ppost.postComments.map(
                              (activityItem, activityItemIdx) => (
                                <li key={activityItem._id}>
                                  <div className="relative pb-8">
                                    {activityItemIdx !==
                                    ppost.postComments.length - 1 ? (
                                      <span
                                        className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"
                                      />
                                    ) : null}
                                    <div className="relative flex items-start space-x-3">
                                      <>
                                        <div className="relative">
                                          <img
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white dark:ring-zinc-950"
                                            src={
                                              activityItem.profile
                                                .profilePicture
                                            }
                                            alt=""
                                          />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div>
                                            <div className="text-sm">
                                              <Link
                                                to={activityItem._id}
                                                className="font-medium text-gray-900 dark:text-gray-400 dark:text-white"
                                              >
                                                {
                                                  activityItem.profile
                                                    .first_name
                                                }{" "}
                                                {activityItem.profile.last_name}
                                              </Link>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-900 dark:text-gray-400">
                                              Commented{" "}
                                              {formatDistanceToNow(
                                                new Date(activityItem.date),
                                                { addSuffix: true },
                                              )}
                                            </p>
                                          </div>
                                          <div className="mt-2 text-sm text-gray-700 dark:text-white">
                                            <p>{activityItem.comment}</p>
                                          </div>
                                        </div>
                                      </>
                                    </div>
                                  </div>
                                </li>
                              ),
                            )}
                        </ul>
                      </div>
                    </dl>
                  </div>
                  <div></div>
                </li>
              </ul>
            </div>

            <Comment
              onSubmit={fetchDetails}
              post={post}
              supertokensId={profile?.supertokensId}
            />

            <div className="fixed bottom-2 left-2 w-[20vw] lg:hidden">
              <a
                href="/app/public"
                className="w-full flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </a>
            </div>
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
                            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-6 sm:px-6">
                              <div className="flex items-start justify-between space-x-3">
                                <div className="space-y-1">
                                  <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-400">
                                    Edit Event : {ppost.desc}
                                  </Dialog.Title>
                                  <p className="text-sm text-gray-900 dark:text-gray-400">
                                    Get started by filling in the information
                                    below to create your new Event.
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
                                    value={ppost.desc}
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
                                    value={ppost.article}
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
                                  <img src={ppost.media} />
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
                                  <img src={ppost.logo} />
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
                                          checked={ppost.type === "Zoom"}
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
                                          checked={ev?.etype === "In-Person"}
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
                                  (old date){" "}
                                  {format(ev?.date, "do MMMM, yyyy H:mma")}
                                  <br />
                                  <input
                                    type="datetime-local"
                                    name="date2"
                                    id="date2"
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
                                    value={ev?.location}
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
                                  Update
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
      )}
    </>
  );
}
