import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import {
  Ads,
  CommunityCollection,
  Post,
  PPosts,
  Profile,
} from "../../interfaces/interfaces";
import { formatDistanceToNow } from "date-fns";
import Create from "./create";
import PostItem from "./Feeditem";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Menu,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import {
  LinkIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/16/solid";
import { BadgeCheck, CakeIcon, MessageCircle, ScrollText } from "lucide-react";
import { cn } from "../../lib/utils/cn";
import { useLocation } from "react-router-dom";
import { usePageTitle } from "../../lib/hooks/usePageTitle";

interface HomeProps {
  host?: string;
  channel?: string;
}

export default function Feed({ host, channel, roles, setRoles }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ads, setAds] = useState<Ads[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const [community, setCommunity] = useState<Partial<CommunityCollection>>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [destroyloading, setdestroyloading] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [cchannel, setcChanel] = useState(location.pathname.split("/")[2]);
  const [hasNewPosts, setHasNewPosts] = useState(false); // New state variable for flagging new posts

  channel = location.pathname.split("/")[2];
  usePageTitle(channel);

  console.log(location);

  // Handle channel change and reset page and posts
  useEffect(() => {
    setcChanel(location.pathname.split("/")[2]);
    setPage(1);
    setPosts([]);
    setdestroyloading(false);
    setLoading(true);
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cchannel]);

  useEffect(() => {
    if (channel === "Landing" && host === "auth") {
      window.location.href = "/Landing";
      return;
    }

    fetchDetails(location.pathname.split("/")[2]);
  }, [host, channel]);

  useEffect(() => {
    if (channel === "Landing" && host === "auth") {
      window.location.href = "/Landing";
      return;
    }
    channel = location.pathname.split("/")[2];

    fetchDetails(location.pathname.split("/")[2]);
  }, [host, channel, location]);

  useEffect(() => {
    if (!loading) return;

    const loadMorePosts = async () => {
      try {
        const response = await fetch(
          `${getApiDomain()}/community/posts?oid=${host}&name=${cchannel}&page=${page}`,
        );
        const responseData = await response.json();

        // Check if responseData is null or empty
        if (!responseData || responseData.length === 0) {
          setLoading(false);
          setdestroyloading(true);
          return;
        }

        const newPosts = responseData.sort(
          (a: Post, b: Post) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching more posts:", error);
        setLoading(false);
      }
    };

    loadMorePosts();
  }, [loading, channel, page]);

  // Polling for new posts
  useEffect(() => {
    const pollForNewPosts = async () => {
      try {
        const response = await fetch(
          `${getApiDomain()}/community/posts?oid=${host}&name=${cchannel}&page=1`,
        );
        const responseData = await response.json();

        if (responseData && responseData.length > 0) {
          // Compare the first post in the fetched data with the current posts
          if (posts.length > 0 && responseData[0]._id !== posts[0]._id) {
            setHasNewPosts(true); // New posts found
          } else {
            setHasNewPosts(false);
          }
        }
      } catch (error) {
        console.error("Error polling for new posts:", error);
      }
    };

    // Set up polling interval
    const intervalId = setInterval(pollForNewPosts, 30000); // Poll every 30 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [cchannel, host, posts]);

  const fetchDetails = async (chanel: string) => {
    try {
      setskelloading(true);
      const communityResponse = await fetch(
        `${getApiDomain()}/community?name=${host}`,
      );
      const communityData: CommunityCollection = await communityResponse.json();
      setCommunity(communityData);

      if (!channel) {
        window.location.href =
          "/s/" + communityData.channels[0].name + "?loggedin=true";
        return;
      }

      const [postsResponse, adsResponse, profileResponse] = await Promise.all([
        fetch(
          `${getApiDomain()}/community/posts?oid=${host}&name=${chanel}&page=1`,
        ),
        fetch(`${getApiDomain()}/data/get`),
        fetch(`${getApiDomain()}/profile`),
      ]);

      const [postsData, adsData, profileData] = await Promise.all([
        postsResponse.json(),
        adsResponse.json(),
        profileResponse.json(),
      ]);

      // Check if responseData is null or empty
      if (!postsResponse || postsResponse.length === 0) {
        setLoading(false);
        setdestroyloading(true);
        return;
      }

      try {
        const sortedPosts = postsData.sort(
          (a: Post, b: Post) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setPosts(sortedPosts);
        setAds(adsData);
        setProfile(profileData);
        setskelloading(false);
        if (profileData == null) {
          //window.location.href = '/onboarding/';
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setAds(adsData);
        setProfile(profileData);
        setskelloading(false);
      }
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [skelloading, setskelloading] = useState(true);

  const handleRefresh = () => {
    if (cchannel) {
      fetchDetails(cchannel);
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
        setLoading(true);
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };
  const items = [
    { name: "Save and schedule", href: "#" },
    { name: "Save and publish", href: "#" },
    { name: "Export PDF", href: "#" },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  const currentUrl = window.location.pathname; // This gives you the path of the current URL

  var home = false;
  if (currentUrl == "/s/" + community?.channels?.[0].name) {
    home = true;
  }
  return (
    <div className="mx-auto max-w-7xl py-0 px-6 -mt-10 min-h-screen bg-gray-50 dark:bg-gray-900">
      {isLoading && (
        <div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
          <div className="flex justify-center items-center mt-[50vh]">
            <div
              role="status"
              className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-800"
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
        </div>
      )}
      {roles && (roles.includes("admin") || roles.includes("moderator")) && (
        <div className="text-right my-5 mx-5 mt-[-10px] text-sm text-muted text-gray-400 text-light">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hidden relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
              Admin Tools
            </button>
          </div>
        </div>
      )}
      {channel && (
        <div className="mx-auto max-w-7xl py-0 px-6 -mt-10 min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="lg:grid lg:grid-cols-5 lg:grid-rows-1 lg:gap-4">
            <div className="lg:col-span-3">
              <div className={cn(home ? "" : "hidden", "mb-5")}>
                <div className="mx-auto max-w-7xl py-0 sm:px-2">
                  <div
                    role="alert"
                    className="alert md:hidden bg-gray-900 text-white"
                  >
                    <span>
                      {" "}
                      Welcome to the {community?.community?.name} B:Hive
                      Community
                    </span>
                  </div>

                  <div
                    tabIndex={0}
                    className="hidden md:collapse collapse-arrow relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-10 text-center shadow-xl dark:border-gray-800 dark:borderrounded-2xl sm:px-16 __welcome"
                  >
                    <div className="collapse-title text-xl font-medium text-white">
                      <h3 className="mx-auto max-w-2xl text-3xl font-bold  text-white sm:text-4xl">
                        Welcome to the {community?.community?.name} B:Hive
                        Community
                      </h3>
                    </div>
                    <div className="collapse-content">
                      <p
                        className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300"
                        dangerouslySetInnerHTML={{
                          __html: community?.community?.desc,
                        }}
                      ></p>
                      <svg
                        viewBox="0 0 1024 1024"
                        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
                        aria-hidden="true"
                      >
                        <circle
                          cx={512}
                          cy={512}
                          r={512}
                          fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
                          fillOpacity="0.7"
                        />
                        <defs>
                          <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                            <stop stopColor="#7775D6" />
                            <stop offset={1} stopColor="#E935C1" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <ul
                role="list"
                className="grid grid-cols-1 dark:gap-0 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mx-auto  "
              >
                <li className="col-span-1 flex flex-col divide-y divide-gray-200 max-w-4xl ">
                  <Create
                    channel={
                      community?.channels?.find(
                        (ch) => ch.name === decodeURI(channel),
                      ).id
                    }
                    profiles={community?.profiles}
                    onSubmit={handleRefresh}
                  />
                </li>
                {hasNewPosts && (
                  <li
                    className={`col-span-1 flex flex-col p-5 text-center  rounded-2xl bg-white dark:bg-gray-900 dark:shadow-gray-800 dark:border shadow max-w-4xl dark:border-gray-800 dark:border dark:rounded-none`}
                  >
                    New posts are available. Refresh to see them!
                  </li>
                )}
                {!skelloading &&
                  posts
                    .filter((post) => post.type !== "event")
                    .map((post) => (
                      <PostItem
                        key={post._id}
                        post={post}
                        profile={profile}
                        lite={undefined}
                        roles={roles}
                        supertokensId={profile?.supertokensId}
                        profiles={community?.profiles}
                      />
                    ))}

                {skelloading && (
                  <div className="flex flex-1 flex-col p-3 relative animate-pulse">
                    <dl className="mt-1 flex flex-grow flex-col justify-between">
                      <div className="group block flex-shrink-0">
                        <div className="flex items-center">
                          <div className="rounded-full h-9 w-9 bg-gray-200 dark:bg-gray-800" />
                          <div className="ml-3 h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-full" />
                        </div>
                        <div className="mx-auto mt-2 rounded-md h-48 w-full bg-gray-200 dark:bg-gray-800" />
                        <div className="my-3 h-48 w-full bg-gray-200 dark:bg-gray-800" />
                        <div className="flex py-4 justify-between">
                          <div className="flex space-x-2">
                            <div className="flex space-x-1 items-center h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                            <div className="flex space-x-1 items-center h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                          </div>
                        </div>
                        <div className="mt-0.5 text-sm text-gray-500 h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-full" />
                        <div className="mt-0.5 text-sm text-gray-500 h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-full" />
                        <div className="mt-0.5 text-sm text-gray-500 h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-full" />
                      </div>
                    </dl>
                  </div>
                )}

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
                    <div className="text-center mt-10 text-sm text-muted text-gray-400 text-light">
                      End of feed.
                    </div>
                  )}
                </div>
              </ul>
            </div>

            <div className="lg:col-span-2 lg:col-start-4 ">
              <div className="rounded-xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 mb-4 dark:text-white ">
                <div className="rounded-t-lg overflow-hidden">
                  <img
                    className="object-cover object-top w-full aspect-video"
                    src={profile?.coverPicture}
                    alt=""
                  />
                </div>
                <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden">
                  <img
                    className="object-cover object-center "
                    src={profile?.profilePicture}
                    alt=""
                  />
                </div>
                <div className="text-center mt-2 mx-auto">
                  <h2 className="font-semibold">
                    <span className="inline-flex">
                      {profile?.first_name} {profile?.last_name}
                      {profile?.verified && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 h-5 w-5 ml-2 text-rose-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </>
                      )}
                    </span>
                  </h2>
                  <p className="text-gray-500 pb-5">{profile?.bio}</p>
                  {roles && roles.length > 0 && (
                    <div className="pb-5">
                      {roles.map((role) => {
                        let roleClasses = "";
                        let roleLabel = "";

                        switch (role) {
                          case "god":
                            roleClasses = "bg-rose-100 text-rose-700";
                            roleLabel = "GOD";
                            break;
                          case "admin":
                            roleClasses = "bg-purple-100 text-purple-700";
                            roleLabel = "Admin";
                            break;
                          case "moderator":
                            roleClasses = "bg-green-100 text-green-700";
                            roleLabel = "Moderator";
                            break;
                          // Add more roles as needed
                          default:
                            roleClasses = "bg-gray-100 text-gray-700";
                            roleLabel =
                              role.charAt(0).toUpperCase() + role.slice(1); // Capitalize first letter
                            break;
                        }

                        return (
                          <p className="text-gray-500" key={role}>
                            <span
                              className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${roleClasses}`}
                            >
                              {roleLabel}
                            </span>
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
                {profile && (
                  <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
                    <li className="flex flex-col items-center justify-around">
                      <ScrollText />
                      <div>{profile?.posts.length}</div>
                    </li>
                    <li className="flex flex-col items-center justify-between">
                      <MessageCircle />
                      <div>{profile?.commentCount}</div>
                    </li>
                  </ul>
                )}
                <div className="p-4 border-t mx-8 mt-2 hidden">
                  <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
                    Follow
                  </button>
                </div>
              </div>

              <span className="truncate text-base font-medium leading-7 text-slate-400 dark:text-white py-3 ml-2">
                About
              </span>

              <div className="rounded-xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 p-3 mb-4 dark:text-white ">
                <img
                  src={community && community.community?.logo}
                  className="mx-auto h-20 w-40 py-1 object-contain dark:hidden"
                />
                <img
                  src={
                    (community && community.community?.dLogo) ||
                    (community && community.community?.logo)
                  }
                  className="mx-auto h-20 w-40 py-1 object-contain hidden dark:block"
                />

                <p
                  className={`py-6`}
                  dangerouslySetInnerHTML={{
                    __html: community?.community?.desc,
                  }}
                ></p>
                <dl>
                  {!community?.community?.private && (
                    <>
                      <dt className="inline-flex py-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="inline-block w-5 h-5 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                          />
                        </svg>
                        Public
                      </dt>
                      <dd className="text-sm ">
                        Anyone can see who's in the community and what they
                        post.
                      </dd>
                    </>
                  )}
                  {community?.community?.private && (
                    <>
                      <dt className="inline-flex py-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                          />
                        </svg>
                        Private
                      </dt>
                      <dd className="text-sm ">
                        Only community members can see who's in the community
                        and what they post.
                      </dd>
                    </>
                  )}
                </dl>
              </div>

              <span className="truncate text-base font-medium leading-7 text-slate-400 dark:text-white py-3 mt-4 ml-2">
                Sponsors
              </span>
              {ads &&
                ads.length > 0 &&
                (() => {
                  const randomIndex = Math.floor(Math.random() * ads.length);
                  const randomPost = ads[randomIndex];
                  if (!randomPost) {
                    return null; // Return null if randomPost is undefined
                  }
                  return [randomPost].map((post) => (
                    <div
                      key={post._id}
                      className="col-span-1 flex flex-col divide-y divide-gray-200  max-w-4xl"
                    >
                      <article className="rounded-xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                        <div className="flex items-start gap-4 p-4 sm:p-6 lg:p-8">
                          <a href={post.url} className="block shrink-0">
                            <img
                              alt=""
                              src={post.logo}
                              className="size-14 rounded-lg object-contain"
                            />
                          </a>

                          <div>
                            <h3 className="font-medium sm:text-lg">
                              <a href={post.url} className="hover:underline">
                                {" "}
                                {post.name}{" "}
                              </a>
                            </h3>

                            <p className="line-clamp-2 text-sm text-gray-700">
                              {post.ad}
                            </p>

                            <div className="mt-2 sm:flex sm:items-center sm:gap-2">
                              <span
                                className="hidden sm:block"
                                aria-hidden="true"
                              >
                                &middot;
                              </span>

                              <p className="sm:block sm:text-xs sm:text-gray-500">
                                <a
                                  href={post.url}
                                  className="font-medium underline hover:text-gray-700"
                                >
                                  {" "}
                                  Read More{" "}
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <strong className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-slate-900 dark:bg-zinc-600 px-3 py-1.5 text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              />
                            </svg>

                            <span className="text-[10px] font-medium sm:text-xs">
                              Sponsor
                            </span>
                          </strong>
                        </div>
                      </article>
                    </div>
                  ));
                })()}
              <div className="rounded-xl border border-gray-100 bg-white p-3 mt-4 hidden">
                <h2 className="text-xl">Members</h2>

                <dl className="">
                  <dt className="inline-flex py-2">Newest Members</dt>
                  <dd className="text-sm text-gray-700">
                    <div className="isolate flex -space-x-2 overflow-hidden">
                      <img
                        className="relative z-30 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <img
                        className="relative z-20 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <img
                        className="relative z-10 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                        alt=""
                      />
                      <img
                        className="relative z-0 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                  </dd>
                </dl>
                <dl className="hidden">
                  <dt className="inline-flex py-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="inline-block w-5 h-5 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
                    Admins & Moderators
                  </dt>
                  <dd className="text-sm text-gray-700">
                    <div className="isolate flex -space-x-2 overflow-hidden">
                      <img
                        className="relative z-30 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <img
                        className="relative z-20 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <img
                        className="relative z-10 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                        alt=""
                      />
                      <img
                        className="relative z-0 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
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
                                Manage Channel
                              </Dialog.Title>
                              <p className="text-sm text-gray-500">
                                Moderator Tools{" "}
                              </p>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="text-gray-400 hover:text-gray-500"
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
                          {/* Project name */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Channel Name
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                name="project-name"
                                id="project-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          {/* Project description */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="project-description"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Description
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <textarea
                                id="project-description"
                                name="project-description"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={""}
                              />
                            </div>
                          </div>

                          {/* Team members */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <h3 className="text-sm font-medium leading-6 text-gray-900">
                                Team Members
                              </h3>
                            </div>
                            <div className="sm:col-span-2">
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                  <span className="sr-only">
                                    Add team member
                                  </span>
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Privacy */}
                          <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <legend className="sr-only">Privacy</legend>
                            <div
                              className="text-sm font-medium leading-6 text-gray-900"
                              aria-hidden="true"
                            >
                              Privacy
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
                                    <label
                                      htmlFor="public-access"
                                      className="font-medium text-gray-900"
                                    >
                                      Public access
                                    </label>
                                    <p
                                      id="public-access-description"
                                      className="text-gray-500"
                                    >
                                      Everyone with the link will see this
                                      project
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
                                    <label
                                      htmlFor="restricted-access"
                                      className="font-medium text-gray-900"
                                    >
                                      Private to Project Members
                                    </label>
                                    <p
                                      id="restricted-access-description"
                                      className="text-gray-500"
                                    >
                                      Only members of this project would be able
                                      to access
                                    </p>
                                  </div>
                                </div>
                                <div className="relative flex items-start">
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id="private-access"
                                      name="privacy"
                                      aria-describedby="private-access-description"
                                      type="radio"
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor="private-access"
                                      className="font-medium text-gray-900"
                                    >
                                      Private to you
                                    </label>
                                    <p
                                      id="private-access-description"
                                      className="text-gray-500"
                                    >
                                      You are the only one able to access this
                                      project
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <hr className="border-gray-200" />
                              <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                <div>
                                  <a
                                    href="#"
                                    className="group flex items-center space-x-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                  >
                                    <LinkIcon
                                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-900"
                                      aria-hidden="true"
                                    />
                                    <span>Copy link</span>
                                  </a>
                                </div>
                                <div>
                                  <a
                                    href="#"
                                    className="group flex items-center space-x-2.5 text-sm text-gray-500 hover:text-gray-900"
                                  >
                                    <QuestionMarkCircleIcon
                                      className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    <span>Learn more about sharing</span>
                                  </a>
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
    </div>
  );
}
