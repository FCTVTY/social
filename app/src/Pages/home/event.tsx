import React, { useEffect, useState } from "react";
import {
  LinkIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  MapPinIcon,
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
import Comment from "./comment";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { ClockIcon, GlobeIcon, PersonStandingIcon } from "lucide-react";
import { UserIcon } from "@heroicons/react/20/solid";
import ical, { ICalEvent } from "ical-generator";
import ICalendarLink from "react-icalendar-link";

interface HomeProps {
  host?: string;
  channel?: string;
  post?: string;
}

export default function EventPage({ host, channel, post }: HomeProps) {
  const [ppost, setPost] = useState<PPosts | null>(null);
  const [ev, setEv] = useState<EventDetails | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [postLikes, setPostLikes] = useState<PostLike[]>([]);
  const [going, setGoing] = useState<boolean>(false);
  const [event, setEvent] = useState<ICalEvent | null>(null);

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
    if (post) {
      fetchDetails();
    }
  }, [host, channel, post]);

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

  return (
    <>
      {ppost && (
        <div>
          <div className="mt-[-2.5rem]">
            <div>
              <img
                className="h-48 w-full object-cover lg:h-64"
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
                    <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-white">
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
                        className="cursor-pointer inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                          className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          event={event}
                        >
                          Add to Calendar
                        </ICalendarLink>
                      </>
                    )}

                    {ev?.etype === "Zoom" && going && (
                      <a
                        href={ev.location}
                        className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                        className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <LinkIcon
                          className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Event Directions</span>
                      </a>
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
              <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white dark:bg-zinc-900 shadow max-w-7xl">
                <div className="flex flex-1 flex-col p-3">
                  <dl className="mt-1 flex flex-grow flex-col justify-between">
                    <strong>Event Details</strong>
                    {ppost.article ? (
                      <dd
                        className="text-sm text-gray-500 my-3"
                        dangerouslySetInnerHTML={{ __html: ppost.article }}
                      ></dd>
                    ) : (
                      <dd
                        className="text-sm text-gray-500 my-3"
                        dangerouslySetInnerHTML={{ __html: ppost.desc }}
                      ></dd>
                    )}

                    <div className="border-t border-gray-200">
                      <dl>
                        <div className="bg-white dark:bg-zinc-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Location
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
                        <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Date
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                            <CalendarIcon className="h-5 w-5 inline-block mr-2" />
                            {new Date(ev?.date).toLocaleDateString()}
                          </dd>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Time
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                            <ClockIcon className="h-5 w-5 inline-block mr-2" />
                            {new Date(ev?.date).toLocaleTimeString()} GMT
                          </dd>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Going
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
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
                                            activityItem.profile.profilePicture
                                          }
                                          alt=""
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div>
                                          <div className="text-sm">
                                            <a
                                              href={activityItem._id}
                                              className="font-medium text-gray-900 dark:text-white"
                                            >
                                              {activityItem.profile.first_name}{" "}
                                              {activityItem.profile.last_name}
                                            </a>
                                          </div>
                                          <p className="mt-0.5 text-sm text-gray-500">
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
              href="/"
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
      )}
    </>
  );
}
