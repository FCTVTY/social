import React, { useEffect, useState } from "react";
import {
  Ads,
  CommunityCollection,
  Post,
  Profile,
} from "../../interfaces/interfaces";
import { getApiDomain } from "../../lib/auth/supertokens";
import PostItem from "../home/Feeditem";
import PostItemLite from "../home/FeeditemLite";
import {
  BadgeCheck,
  CakeIcon,
  LockIcon,
  MessageCircle,
  PenTool,
  ScrollText,
  Star,
} from "lucide-react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Link, useLocation } from "react-router-dom";
import LogoSquare from "../../assets/logo-light.svg";

interface HomeProps {
  host?: string;
  profileid?: string;
}

export default function ProfilePage({ host, profileid }: HomeProps) {
  const [profile, setProfile] = useState<Profile>();
  const [community, setCommunity] = useState<CommunityCollection>();
  const location = useLocation();

  console.log(profileid);
  useEffect(() => {
    profileid = location.pathname.split("/")[2];

    fetchDetails();
  }, [host, profileid, location]);

  const fetchDetails = async () => {
    try {
      const communityResponse = await fetch(
        `${getApiDomain()}/community?name=${host}`,
      );
      if (!communityResponse.ok) {
        throw new Error("Network response was not ok for community fetch");
      }
      const communityData = await communityResponse.json();
      setCommunity(communityData);

      const response = await fetch(
        `${getApiDomain()}/profile?oid=${profileid}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  const calculateLevel = (posts, comments, ver) => {
    const total = posts + comments;
    if (ver) {
      return 5;
    }
    if (total < 100) {
      return 1; // Level 1: Less than 100 combined
    } else if (total >= 100 && total < 200) {
      return 2; // Level 2: Between 100 and 200 combined
    } else if (total >= 300 && total < 500) {
      return 3; // Level 3: Between 300 and 500 combined
    } else if (total >= 500) {
      return 4; // Level 4: Greater than 500 combined
    } else {
      return 1; // Fallback to level 1
    }
  };

  const checkCakeDay = (timeJoined: string): boolean => {
    const joinDate = new Date(timeJoined);
    const today = new Date();

    // Create a date object for today with the same month and day as joinDate
    const cakeDayDate = new Date(
      today.getFullYear(),
      joinDate.getMonth(),
      joinDate.getDate(),
    );

    // Check if the cake day date is today
    return today.toDateString() === cakeDayDate.toDateString();
  };
  const isCakeDay = checkCakeDay(profile?.timeJoined);
  return (
    <main className="min-h-screen profile-page">
      {profile && profile.deleted === false && (
        <div className=" min-h-screen">
          <div className="container mx-auto p-4 lg:max-w-7xl">
            {/* Header */}

            <div className="lg:hidden md:hidden rounded-xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 mb-4 dark:text-white ">
              <div className="rounded-t-lg h-32 overflow-hidden">
                <img
                  className="object-cover object-top w-full"
                  src={profile?.coverPicture}
                  alt=""
                />
              </div>
              <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden">
                <img
                  className="object-cover object-center h-32"
                  src={profile?.profilePicture}
                  alt=""
                />
              </div>
              <div className="text-center mt-2 mx-auto">
                <h2 className="font-semibold">
                  <span className="inline-flex">
                    {profile?.first_name} {profile?.last_name}
                    {profile?.verified && (
                      <BadgeCheck className="text-indigo-400 h-5 w-5 ml-2"></BadgeCheck>
                    )}
                  </span>
                </h2>
              </div>
              <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around hidden">
                <li className="flex flex-col items-center justify-around">
                  <svg
                    className="w-4 fill-current text-blue-900"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <div>2k</div>
                </li>
                <li className="flex flex-col items-center justify-between">
                  <svg
                    className="w-4 fill-current text-blue-900"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
                  </svg>
                  <div>10k</div>
                </li>
                <li className="flex flex-col items-center justify-around">
                  <svg
                    className="w-4 fill-current text-blue-900"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
                  </svg>
                  <div>15</div>
                </li>
              </ul>
              <div className="p-4 border-t mx-8 mt-2 hidden">
                <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
                  Follow
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 bordershadow-md rounded-lg overflow-hidden hidden lg:block md:block">
              <div className="w-full mx-auto">
                <img
                  src={profile.coverPicture || "https://picsum.photos/1600/600"}
                  alt="User Cover"
                  className=" object-cover object-top   aspect-video"
                />

                <div className="w-full mx-auto flex justify-center">
                  <img
                    src={
                      profile.profilePicture ||
                      `https://eu.ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&size=250`
                    }
                    alt="User Profile"
                    className="rounded-full object-cover xl:w-[16rem] xl:h-[16rem] lg:w-[16rem] lg:h-[16rem] md:w-[12rem] md:h-[12rem] sm:w-[10rem] sm:h-[10rem] xs:w-[8rem] xs:h-[8rem] outline outline-4 outline-offset-0 outline-yellow-500 shadow-xl relative xl:bottom-[7rem] lg:bottom-[8rem] md:bottom-[6rem] sm:bottom-[5rem] xs:bottom-[4.3rem]"
                  />
                </div>

                <div className="xl:w-[80%] lg:w-[90%] md:w-[94%] sm:w-[96%] xs:w-[92%] mx-auto flex flex-col gap-4 justify-center items-center relative xl:-top-[6rem] lg:-top-[6rem] md:-top-[4rem] sm:-top-[3rem] xs:-top-[2.2rem]">
                  <h1 className="text-center text-gray-800 dark:text-white text-4xl">
                    <span className="inline-flex">
                      {profile?.first_name} {profile?.last_name}
                      {profile?.verified && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 h-7 w-7 ml-2 text-rose-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                  </h1>

                  <p className="w-full text-gray-700 dark:text-gray-400 text-md text-pretty sm:text-center xs:text-justify">
                    {profile.status} {isCakeDay && <p>🎂 Happy Cake Day! 🎂</p>}{" "}
                    <div className="bg-white dark:bg-gray-900 mt-6 -mb-20">
                      <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
                          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dd className="text-base dark:text-white leading-7 text-gray-600 inline-flex ">
                              <CakeIcon className="mr-2" />
                              Joined{" "}
                              {formatDistanceToNow(
                                new Date(profile.timeJoined),
                                {
                                  addSuffix: true,
                                },
                              )}
                            </dd>
                          </div>
                          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dd className="text-base dark:text-white leading-7 text-gray-600 inline-flex ">
                              <ScrollText className="mr-2" />
                              {profile.posts.length} posts published
                            </dd>
                          </div>
                          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dd className="text-base dark:text-white leading-7 text-gray-600 inline-flex ">
                              <MessageCircle className="mr-2" />
                              {profile.commentCount} comments written
                            </dd>
                          </div>
                          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dd className="text-base dark:text-white leading-7 text-gray-600 inline-flex">
                              <Star className="mr-2 text-yellow-300" />
                              Level{" "}
                              {calculateLevel(
                                profile.posts.length,
                                profile.commentCount,
                                profile?.verified,
                              )}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </p>
                </div>
              </div>

              {profile.me && (
                <div className="p-4">
                  <div className="flex justify-end">
                    <Link
                      to="/onboarding"
                      className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="mt-4 lg:flex gap-4">
              {/* Sidebar */}
              <div className="lg:w-1/2 sm:w-full">
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 bordershadow-md rounded-lg p-4 mb-4">
                  <h2 className="text-lg font-bold mb-2">About</h2>
                  <p
                    className="text-gray-700 dark:text-white"
                    dangerouslySetInnerHTML={{ __html: profile.bio }}
                  ></p>
                </div>
                <div className=" bg-white dark:bg-gray-900 dark:border-gray-800 bordershadow-md rounded-lg p-4 mb-4">
                  <h2 className="text-lg font-bold mb-2">Communities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Example Friends */}
                    {profile.communitesFull &&
                      profile.communitesFull.map((c) => (
                        <div>
                          <img
                            key={c.id}
                            src={c.logo || LogoSquare}
                            alt={`COMMUNITY`}
                            className=" h-16 max-w-full rounded-xl border border-white dark:border-gray-800 m-2 p-2 object-contain"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Posts */}
              <div className="lg:w-1/2 sm:w-full ">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mx-auto divide-y">
                  {profile.posts &&
                    profile.posts
                      .filter(
                        (post) =>
                          post.type !== "event" &&
                          post.softdelete !== true &&
                          post.visability == true &&
                          community?.channels.some(
                            (channel) => channel.id === post.channelstring,
                          ),
                      )
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((post) => (
                        <PostItemLite
                          key={post._id}
                          post={post}
                          profile={profile}
                          lite={true}
                        />
                      ))}
                  {profile.posts &&
                    profile.posts.filter((post) => post.type === "event")
                      .length == 0 && (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No New Activity.
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
