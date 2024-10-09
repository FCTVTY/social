import {
  ChatBubbleLeftEllipsisIcon,
  EnvelopeIcon,
  PhoneIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import React, { Fragment, useEffect, useState } from "react";
import { getApiDomain } from "../../lib/auth/supertokens";
import {
  Ads,
  CommunityCollection,
  Post,
  PostLike,
  PPosts,
  Profile,
} from "../../interfaces/interfaces";
import { formatDistanceToNow } from "date-fns";
import Create from "./create";
import Button from "../../components/Button";
import { TagIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import Comment from "./comment";
import YouTubeEmbed from "./youtube";
import { BadgeCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LinkPreview from "../../components/LinkPreview";

interface HomeProps {
  host?: string;
  channel?: string;
  post?: string;
}
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PostView({ host, channel, post }: HomeProps) {
  const [ppost, setPost] = useState<PPosts>();
  const [postLikes, setPostLikes] = useState<PostLike[]>();
  const [profile, setProfile] = useState<Profile>();
  const [community, setCommunity] = useState<Partial<CommunityCollection>>();
  const [ads, setAds] = useState<Ads[]>([]);
  const location = useLocation();
  post = location.pathname.split("/")[3];
  useEffect(() => {
    if (post) {
      fetchDetails();
    }
  }, [post]);

  const userHasLiked = postLikes?.some(
    (like) => like.userId === profile?.supertokensId,
  );

  const handleLikeClick = async () => {
    let updatedLikes;
    if (userHasLiked) {
      // Remove the like
      updatedLikes = postLikes?.filter(
        (like) => like.userId !== profile?.supertokensId,
      );
    } else {
      // Add the like
      updatedLikes = [
        ...(postLikes || []),
        {
          _id: new Date().getTime().toString(),
          postId: post,
          userId: profile?.supertokensId,
        },
      ];
    }

    setPostLikes(updatedLikes);

    try {
      // Call the API to save the like status
      const response = await fetch(`${getApiDomain()}/postLikes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post,
          userId: profile?.supertokensId,
          liked: !userHasLiked,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error saving like status:", error);
      // Revert the like status in case of error
      setPostLikes(postLikes);
    }
  };

  const fetchDetails = async () => {
    try {
      const Presponse = await fetch(`${getApiDomain()}/profile`);
      const profileData = await Presponse.json();
      setProfile(profileData);

      const communityResponse = await fetch(
        `${getApiDomain()}/community?name=${host}`,
      );
      const communityData: CommunityCollection = await communityResponse.json();
      setCommunity(communityData);

      const response = await fetch(
        `${getApiDomain()}/community/post?oid=${post}`,
      );
      const postData = await response.json();
      setPost(postData);
      setPostLikes(postData.postLikes);

      const ads = await fetch(`${getApiDomain()}/data/get`);

      const adsData = await ads.json();

      setAds(adsData);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  const handleRefresh = () => {
    if (post) {
      fetchDetails();
    }
  };
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  // Check if the description contains a URL
  const hasUrl = urlPattern.test(ppost?.article);
  const hasUrld = urlPattern.test(ppost?.desc);

  // @ts-ignore
  // @ts-ignore
  return (
    <div className="h-[100vh]">
      <div className="lg:grid lg:grid-cols-5 lg:grid-rows-1 lg:gap-4">
        <div className="lg:col-span-3">
          {ppost && (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ul
                  role="list"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mx-auto divide-y"
                >
                  <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white dark:bg-gray-900 shadow max-w-7xl">
                    <div className="flex flex-1 flex-col p-3">
                      <dl className="mt-1 flex flex-grow flex-col justify-between">
                        <Link
                          to={`/profile/${ppost.profile.handle || ppost.profile._id}`}
                          className="group block flex-shrink-0"
                        >
                          <div className="flex items-center">
                            <div>
                              <img
                                className="inline-block h-9 w-9 rounded-full"
                                src={ppost.profile.profilePicture}
                                alt=""
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-700 dark:text-white group-hover:text-gray-900 dark:text-gray-400">
                                {ppost.profile.first_name}{" "}
                                {ppost.profile.last_name} - Published{" "}
                                {formatDistanceToNow(new Date(ppost.date), {
                                  addSuffix: true,
                                })}{" "}
                              </p>
                              <p className="text-xs font-medium text-gray-900 dark:text-gray-400 group-hover:text-gray-700">
                                View profile
                              </p>
                            </div>
                          </div>
                        </Link>
                        <img
                          className="mx-auto mt-2 rounded-md"
                          src={ppost.media}
                          alt=""
                        />

                        {ppost.article && ppost.article !== "" ? (
                          <>
                            <dd
                              className=" mb-5 posts text-base leading-5 text-gray-900 dark:text-gray-400 dark:text-gray-100 font-normal tracking-normal font-sans normal-case text-gray-900 dark:text-gray-400 dark:text-gray-100 break-words text-ellipsis overflow-hidden relative focus:outline-none cursor-pointer max-h-40"
                              dangerouslySetInnerHTML={{
                                __html: ppost.article,
                              }}
                            ></dd>
                            {hasUrl && (
                              <LinkPreview
                                url={
                                  ppost.article.match(/(https?:\/\/[^\s]+)/g)[0]
                                }
                              ></LinkPreview>
                            )}
                          </>
                        ) : (
                          <>
                            {" "}
                            <p
                              className="mb-5 posts text-base leading-5 text-gray-900 dark:text-gray-400 dark:text-gray-100 font-normal tracking-normal font-sans normal-case text-gray-900 dark:text-gray-400 dark:text-gray-100 break-words text-ellipsis overflow-hidden relative focus:outline-none cursor-pointer max-h-40"
                              dangerouslySetInnerHTML={{ __html: ppost.desc }}
                            ></p>
                            {hasUrld && (
                              <LinkPreview
                                url={
                                  ppost.desc.match(/(https?:\/\/[^\s]+)/g)[0]
                                }
                              ></LinkPreview>
                            )}
                          </>
                        )}

                        <dd className="mt-2">
                          {ppost.tags.map((tag) => (
                            <a
                              key={tag}
                              href={`#${tag}`}
                              className="badge badge-outline mr-2"
                            >
                              #{tag}{" "}
                            </a>
                          ))}
                        </dd>

                        <div className="flex py-4 justify-between">
                          <div className="flex space-x-2">
                            <div className="flex space-x-1 items-center">
                              <span>
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
                                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                                  />
                                </svg>
                              </span>
                              <span>{ppost.postComments.length}</span>
                            </div>

                            <div
                              className="flex space-x-1 items-center"
                              onClick={handleLikeClick}
                              style={{ cursor: "pointer" }}
                            >
                              <span>
                                {userHasLiked ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 text-red-500"
                                  >
                                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                  </svg>
                                ) : (
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
                                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                    />
                                  </svg>
                                )}
                              </span>
                              <span>{postLikes?.length}</span>
                            </div>
                          </div>
                        </div>

                        <div className="divide-x"></div>

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
                                                  {
                                                    activityItem.profile
                                                      .last_name
                                                  }
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
                                            <div className="mt-2 text-sm text-gray-700 dark:text-white ">
                                              <p
                                                dangerouslySetInnerHTML={{
                                                  __html: activityItem.comment,
                                                }}
                                              ></p>
                                              <LinkPreview
                                                url={
                                                  activityItem.comment.match(
                                                    /(https?:\/\/[^\s]+)/g,
                                                  )[0]
                                                }
                                              ></LinkPreview>
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
            </>
          )}
          {ppost && ppost.commentsallowed ? (
            <Comment
              onSubmit={handleRefresh}
              post={post}
              supertokensId={profile?.supertokensId}
              profiles={community?.profiles}
              channel={ppost?.channel}
            />
          ) : (
            <p className="text-center py-3">comments have been disabled</p>
          )}
        </div>
        <div className="lg:col-span-2 lg:col-start-4 px-4 sm:px-6 lg:px-8 ">
          <div className="rounded-xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 mb-4 dark:text-white ">
            <div className="rounded-t-lg  overflow-hidden">
              <img
                className="object-cover object-top w-full aspect-video"
                src={
                  ppost?.profile?.coverPicture ||
                  "https://picsum.photos/1600/600"
                }
                alt=""
              />
            </div>
            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden">
              <img
                className="object-cover object-center h-32"
                src={ppost?.profile?.profilePicture}
                alt=""
              />
            </div>
            <div className="text-center mt-2 mx-auto">
              <h3 className="font-semibold">
                <span className="inline-flex">
                  {ppost?.profile?.first_name} {ppost?.profile?.last_name}
                  {ppost?.profile?.verified && (
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
                  )}
                </span>
              </h3>
              <p
                className="text-gray-900 dark:text-gray-400 pb-5"
                dangerouslySetInnerHTML={{ __html: profile?.bio || "" }}
              ></p>{" "}
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
                          <span className="hidden sm:block" aria-hidden="true">
                            &middot;
                          </span>

                          <p className="sm:block sm:text-xs sm:text-gray-900 dark:text-gray-400">
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
        </div>
      </div>
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
  );
}
