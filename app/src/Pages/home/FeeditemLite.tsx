import React, { useState } from "react";
import axios from "axios";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { getApiDomain } from "../../lib/auth/supertokens";
import { Link } from "react-router-dom";
import LinkPreview from "../../components/LinkPreview";

interface PostItemProps {
  lite?: boolean;
}

const PostItemLite = ({ post, profile, lite }) => {
  // @ts-ignore

  const urlPattern = /(https?:\/\/[^\s]+)/g;

  // Check if the description contains a URL
  const hasUrl = urlPattern.test(post.desc);
  const wrapUrlsWithAnchorTags = (text: string) => {
    // Regular expression to find URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Replace URLs with <a> tags
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" class="text-indigo-600" rel="noopener noreferrer">${url}</a>`;
    });
  };

  const processedDesc = wrapUrlsWithAnchorTags(post.desc);
  return (
    <li
      key={post._id}
      className={`col-span-1 flex flex-col  rounded-2xl bg-white dark:bg-gray-900 dark:shadow-gray-800 dark:border shadow max-w-4xl dark:border-gray-800 dark:border dark:rounded-none`}
    >
      <div className="flex flex-1 flex-col p-3">
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <div data-testid="account" className="group block shrink-0">
            <div className="flex rtl:space-x-reverse items-center justify-between">
              <div className="flex rtl:space-x-reverse items-center space-x-3 overflow-hidden">
                <div className="inline-block cursor-pointer">
                  <Link to={`/profile/${profile.handle || profile._id}`}>
                    <div
                      data-testid="still-image-container"
                      className="rounded-full group relative isolate overflow-hidden h-[42px] w-[42px]"
                    >
                      <img
                        src={
                          profile.profilePicture ||
                          `https://eu.ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&size=250`
                        }
                        alt="Avatar"
                        className="block size-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 z-[1] flex items-center space-x-2"></div>
                    </div>
                  </Link>
                </div>
                <div className="grow overflow-hidden">
                  <div className="inline-block cursor-pointer">
                    <Link
                      title=""
                      to={`/profile/${profile.handle || profile._id}`}
                    >
                      <div className="flex rtl:space-x-reverse items-center space-x-1 grow">
                        <p className="truncate text-sm text-gray-900 dark:text-gray-400 dark:text-gray-100 font-semibold tracking-normal font-sans normal-case">
                          {profile.first_name} {profile.last_name}
                        </p>
                        {profile.verified && (
                          <span
                            className="verified-icon text-rose-600"
                            data-testid="verified-badge"
                          >
                            <div
                              className="relative flex shrink-0 flex-col"
                              data-testid="icon"
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 text-secondary-500"
                                data-testid="svg-icon"
                              >
                                <title>Verified Account</title>
                                <path
                                  d="M8.82.521a1.596 1.596 0 012.36 0l.362.398c.42.46 1.07.635 1.664.445l.512-.163a1.596 1.596 0 012.043 1.18l.115.525a1.596 1.596 0 001.218 1.218l.525.115a1.596 1.596 0 011.18 2.043l-.163.513a1.596 1.596 0 00.446 1.663l.397.362a1.596 1.596 0 010 2.36l-.397.362c-.461.42-.635 1.07-.446 1.664l.163.512a1.596 1.596 0 01-1.18 2.043l-.525.115a1.596 1.596 0 00-1.218 1.218l-.115.525a1.596 1.596 0 01-2.043 1.18l-.512-.163a1.596 1.596 0 00-1.664.445l-.362.398a1.596 1.596 0 01-2.36 0l-.362-.398a1.596 1.596 0 00-1.663-.445l-.513.163a1.596 1.596 0 01-2.043-1.18l-.115-.525a1.596 1.596 0 00-1.218-1.218l-.525-.115a1.596 1.596 0 01-1.18-2.043l.164-.512a1.596 1.596 0 00-.446-1.664L.52 11.18a1.596 1.596 0 010-2.36l.398-.362c.46-.42.635-1.07.446-1.663L1.2 6.282a1.596 1.596 0 011.18-2.043l.525-.115a1.596 1.596 0 001.218-1.218l.115-.525A1.596 1.596 0 016.282 1.2l.513.163c.594.19 1.244.015 1.663-.445L8.821.52z"
                                  fill="currentColor"
                                ></path>
                                <path
                                  d="M6.66 7.464L5.012 9.111l3.85 3.85 5.483-5.481-1.966-1.966L8.544 9.35 6.66 7.464z"
                                  fill="#fff"
                                ></path>
                                <path
                                  opacity=".5"
                                  d="M11.25 15.55l-1.646-1.848 1.646-1.646 1.887 1.887-1.887 1.606z"
                                  fill="#fff"
                                ></path>
                              </svg>
                            </div>
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className="flex flex-col space-y-0">
                    <div className="flex rtl:space-x-reverse items-center space-x-1">
                      <p className="truncate text-sm text-gray-700 dark:text-gray-600 font-normal tracking-normal font-sans normal-case">
                        {profile.handle != null && <>@{profile.handle}</>}
                      </p>
                      <span className="text-sm text-gray-700 dark:text-gray-600 font-normal tracking-normal font-sans normal-case">
                        ·
                      </span>

                      <time className="text-sm text-gray-700 dark:text-gray-600 font-normal tracking-normal font-sans normal-case whitespace-nowrap">
                        {formatDistanceToNow(new Date(post.date), {
                          addSuffix: true,
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </dl>

        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <Link
            to={`/profile/${profile._id}`}
            className="group block flex-shrink-0"
          >
            <div className="flex items-center hidden">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={profile.profilePicture}
                  alt=""
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-white group-hover:text-gray-900 dark:text-gray-400 inline-flex">
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-xs font-medium text-gray-900 dark:text-gray-400 group-hover:text-gray-700">
                  View profile
                </p>
              </div>
            </div>
          </Link>
          <Link className="my-3" to={`/s/${post.channel}/${post._id}`}>
            <img className="mx-auto mt-2 rounded-md" src={post.media} alt="" />
            <p
              className="dark:!text-white            posts text-base leading-5 text-gray-900 dark:text-gray-400 dark:text-gray-100 font-normal tracking-normal font-sans normal-case text-gray-900 dark:text-gray-400 dark:text-gray-100 break-words text-ellipsis overflow-hidden relative focus:outline-none cursor-pointer max-h-40"
              dangerouslySetInnerHTML={{ __html: processedDesc }}
            ></p>
          </Link>
          {hasUrl && (
            <LinkPreview url={post.desc.match(urlPattern)[0]}></LinkPreview>
          )}
          <div className="flex py-4 justify-between">
            <div className="flex space-x-2">
              <div className="flex space-x-1 items-center"></div>
            </div>
          </div>
          <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-400">
            {post.tags.map((tag) => (
              <a key={tag} href={`#${tag}`} className="mr-2">
                #{tag}{" "}
              </a>
            ))}
          </dd>
          <Link
            className="mt-0.5 text-sm text-gray-900 dark:text-gray-400"
            to={`/s/${post.channel.name}/${post._id}`}
          >
            View all comments
          </Link>
          <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-400 ">
            {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
          </dd>
        </dl>
      </div>
      <div></div>
      <div className="divide-x"></div>
    </li>
  );
};

export default PostItemLite;
