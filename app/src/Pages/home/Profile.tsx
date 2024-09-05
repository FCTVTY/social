import React, { useEffect, useState } from "react";
import {
  Ads,
  CommunityCollection,
  Post,
  Profile,
} from "../../interfaces/interfaces";
import { getApiDomain } from "../../lib/auth/supertokens";
import PostItem from "./Feeditem";
import PostItemLite from "./FeeditemLite";
import { BadgeCheck } from "lucide-react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

interface HomeProps {
  host?: string;
  profileid?: string;
}

export default function ProfilePage({ host, profileid }: HomeProps) {
  const [profile, setProfile] = useState<Profile>();
  const [community, setCommunity] = useState<CommunityCollection>();

  console.log(profileid);

  useEffect(() => {
    if (profileid) {
      fetchDetails();
    }
  }, [host, profileid]);

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

  return (
    <main className="profile-page">
      {profile && profile.deleted === false && (
        <div className=" min-h-screen">
          <div className="container mx-auto p-4 lg:max-w-7xl">
            {/* Header */}

            <div className="lg:hidden md:hidden rounded-xl border-2 border-gray-100 bg-white dark:bg-zinc-950 dark:border-zinc-800 mb-4 dark:text-white ">
              <div className="rounded-t-lg h-32 overflow-hidden">
                <img
                  className="object-cover object-top w-full"
                  src={profile?.coverPicture}
                  alt=""
                />
              </div>
              <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white dark:border-zinc-800 rounded-full overflow-hidden">
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

            <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-md rounded-lg overflow-hidden hidden lg:block md:block">
              <div className="w-full mx-auto">
                <img
                  src={profile.coverPicture}
                  alt="User Cover"
                  className="w-full object-cover object-top  xl:h-[20rem] lg:h-[22rem] md:h-[16rem] sm:h-[13rem] xs:h-[9.5rem]"
                />

                <div className="w-full mx-auto flex justify-center">
                  <img
                    src={profile.profilePicture}
                    alt="User Profile"
                    className="rounded-full object-cover xl:w-[16rem] xl:h-[16rem] lg:w-[16rem] lg:h-[16rem] md:w-[12rem] md:h-[12rem] sm:w-[10rem] sm:h-[10rem] xs:w-[8rem] xs:h-[8rem] outline outline-4 outline-offset-0 outline-yellow-500 shadow-xl relative xl:bottom-[7rem] lg:bottom-[8rem] md:bottom-[6rem] sm:bottom-[5rem] xs:bottom-[4.3rem]"
                  />
                </div>

                <div className="xl:w-[80%] lg:w-[90%] md:w-[94%] sm:w-[96%] xs:w-[92%] mx-auto flex flex-col gap-4 justify-center items-center relative xl:-top-[6rem] lg:-top-[6rem] md:-top-[4rem] sm:-top-[3rem] xs:-top-[2.2rem]">
                  <h1 className="text-center text-gray-800 dark:text-white text-4xl">
                    <span className="inline-flex">
                      {profile?.first_name} {profile?.last_name}
                      {profile?.verified && (
                        <BadgeCheck className="text-indigo-400 h-5 w-5 ml-2 mt-1"></BadgeCheck>
                      )}
                    </span>
                  </h1>

                  <p className="w-full text-gray-700 dark:text-gray-400 text-md text-pretty sm:text-center xs:text-justify">
                    {profile.status} <br />
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
                        d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z"
                      />
                    </svg>
                    Joined{" "}
                    {formatDistanceToNow(new Date(profile.timeJoined), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              {profile.me && (
                <div className="p-4">
                  <div className="flex justify-end">
                    <a
                      href="/onboarding"
                      className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300"
                    >
                      Edit Profile
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="mt-4 lg:flex gap-4">
              {/* Sidebar */}
              <div className="lg:w-1/2 sm:w-full">
                <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-md rounded-lg p-4 mb-4">
                  <h2 className="text-lg font-bold mb-2">About</h2>
                  <p className="text-gray-700 dark:text-white">{profile.bio}</p>
                </div>
                <div className="hidden bg-white shadow-md rounded-lg p-4 mb-4">
                  <h2 className="text-lg font-bold mb-2">Communities</h2>
                  <div className="flex flex-wrap">
                    {/* Example Friends */}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <img
                        key={i}
                        src={`https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&h=130`}
                        alt={`COMMUNITY ${i + 1}`}
                        className="w-12 h-12 rounded-full border-2 border-white m-1"
                      />
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
