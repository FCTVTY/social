import React, { Fragment, useEffect, useState } from "react";
import {
  BriefcaseIcon,
  CheckIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from "@heroicons/react/16/solid";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { CalendarIcon } from "@heroicons/react/24/outline";
import {
  Community,
  CommunityCollection,
  Post,
  PPosts,
} from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import moment from "moment";
import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface HomeProps {
  host?: string;
  channel?: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
export default function MembersPage({ host, channel }: HomeProps) {
  const [posts, setPosts] = useState<PPosts[]>([]);
  const [community, setCommunity] = useState<Community>();

  useEffect(() => {
    if (host) {
      fetchDetails();
    }
  }, [host, channel]);

  const fetchDetails = async () => {
    try {
      const Cresponse = await axios.get(
        `${getApiDomain()}/members?name=${host}`,
      );
      setCommunity(Cresponse.data);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };
  const handleRefresh = () => {
    if (channel) {
      fetchDetails();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 py-32">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-400 dark:text-white sm:text-4xl">
                Meet{" "}
                <strong className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
                  {community?.name}
                </strong>{" "}
                Moderators
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                We’re a dynamic group of individuals who are passionate about
                what we do. Here to keep everything safe & clean
              </p>
            </div>

            <ul
              role="list"
              className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            >
              {community &&
                community.profiles
                  .filter((x) => x.verified && !x.hidden)
                  .map((person) => (
                    <li key={person._id}>
                      <Link to={`/profile/${person._id}`}>
                        <img
                          className="mx-auto h-56 w-56 rounded-full object-cover "
                          src={person.profilePicture}
                          alt=""
                        />
                        <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900 dark:text-gray-400 dark:text-white inline-flex">
                          {person.first_name} {person.last_name}{" "}
                          {person?.verified && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6 h-6 w-6 ml-2 text-rose-600"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </h3>
                        <p
                          className="text-sm leading-6 text-gray-600 truncate"
                          dangerouslySetInnerHTML={{
                            __html:
                              person.bio.length >= 30
                                ? person.bio.substring(0, 30) + "..."
                                : person.bio,
                          }}
                        ></p>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h3 className="font-bold tracking-tight text-gray-900 dark:text-gray-400 dark:text-white sm:text-4xl mt-10">
              All Members
            </h3>
          </div>
          <ul
            role="list"
            className="divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl m-2 mt-5"
          >
            {community &&
              community.profiles
                .filter((x) => !x.hidden)
                .map((person) => (
                  <li
                    key={person._id}
                    className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 dark:hover:bg-gray-800 sm:px-6"
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <img
                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        src={person.profilePicture}
                        alt=""
                      />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-400 dark:text-white">
                          <Link
                            to={`/profile/${person._id}`}
                            className={`inline-flex`}
                          >
                            <span className="absolute inset-x-0 -top-px bottom-0" />
                            {person.first_name} {person.last_name}{" "}
                            {person?.verified && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6 h-4 w-4 ml-2 text-rose-600"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </Link>
                        </p>
                        <p
                          className="mt-1 flex text-xs leading-5 text-gray-900 dark:text-gray-400 dark:text-white"
                          dangerouslySetInnerHTML={{
                            __html:
                              person.bio.length >= 20
                                ? person.bio.substring(0, 20) + "..."
                                : person.bio,
                          }}
                        ></p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-4">
                      <div className="hidden sm:flex sm:flex-col sm:items-end"></div>
                      <ChevronRightIcon
                        className="h-5 w-5 flex-none text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
