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
    <div className="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-zinc-950 py-32">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Meet <strong>{community?.name}</strong> Moderators
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
                  .filter((x) => x.verified)
                  .map((person) => (
                    <li key={person._id}>
                      <a href={`/profile/${person._id}`}>
                        <img
                          className="mx-auto h-56 w-56 rounded-full object-cover "
                          src={person.profilePicture}
                          alt=""
                        />
                        <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900 dark:text-white inline-flex">
                          {person.first_name} {person.last_name}{" "}
                          {person?.verified && (
                            <BadgeCheck className="text-indigo-400 h-5 w-5 ml-2 mt-1"></BadgeCheck>
                          )}
                        </h3>
                        <p className="text-sm leading-6 text-gray-600 truncate">
                          {person.bio}
                        </p>
                      </a>
                    </li>
                  ))}
            </ul>
          </div>
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h3 className="font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mt-10">
              All Members
            </h3>
          </div>
          <ul
            role="list"
            className="divide-y divide-gray-100 dark:divide-amber-500 overflow-hidden bg-white dark:bg-zinc-950 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl m-2 mt-5"
          >
            {community &&
              community.profiles.map((person) => (
                <li
                  key={person._id}
                  className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 dark:hover:bg-zinc-900 sm:px-6"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <img
                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                      src={person.profilePicture}
                      alt=""
                    />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                        <a
                          href={`/profile/${person._id}`}
                          className={`inline-flex`}
                        >
                          <span className="absolute inset-x-0 -top-px bottom-0" />
                          {person.first_name} {person.last_name}{" "}
                          {person?.verified && (
                            <BadgeCheck className="text-indigo-400 h-3 w-3 ml-1 mt-1"></BadgeCheck>
                          )}
                        </a>
                      </p>
                      <p className="mt-1 flex text-xs leading-5 text-gray-500 dark:text-white">
                        {person.bio.substring(0, 20)}{" "}
                        {person.bio.length >= 20 && "..."}
                      </p>
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
