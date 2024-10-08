import React, { useState } from "react";
import axios from "axios";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { getApiDomain } from "../../lib/auth/supertokens";
import { Link } from "react-router-dom";

interface PostItemProps {
  lite?: boolean;
}

const PostItemLite = ({ post, profile, lite }) => {
  // @ts-ignore
  return (
    <li
      key={post._id}
      className={`col-span-1 flex flex-col  rounded-2xl bg-white dark:bg-gray-900 dark:shadow-gray-800 dark:border shadow max-w-4xl dark:border-gray-800 dark:border dark:rounded-none`}
    >
      <div className="flex flex-1 flex-col p-3">
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <Link
            to={`/profile/${profile._id}`}
            className="group block flex-shrink-0"
          >
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={profile.profilePicture}
                  alt=""
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-white group-hover:text-gray-900 inline-flex">
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-xs font-medium text-gray-900 group-hover:text-gray-700">
                  View profile
                </p>
              </div>
            </div>
          </Link>
          <Link className="my-3" to={`/s/${post.channel}/${post._id}`}>
            <img className="mx-auto mt-2 rounded-md" src={post.media} alt="" />
            <h2
              className="dark:!text-white"
              dangerouslySetInnerHTML={{ __html: post.desc }}
            ></h2>
          </Link>

          <div className="flex py-4 justify-between">
            <div className="flex space-x-2">
              <div className="flex space-x-1 items-center"></div>
            </div>
          </div>
          <dd className="mt-0.5 text-sm text-gray-900">
            {post.tags.map((tag) => (
              <a key={tag} href={`#${tag}`} className="mr-2">
                #{tag}{" "}
              </a>
            ))}
          </dd>
          <Link
            className="mt-0.5 text-sm text-gray-900"
            to={`/s/${post.channel.name}/${post._id}`}
          >
            View all comments
          </Link>
          <dd className="mt-0.5 text-sm text-gray-900 ">
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
