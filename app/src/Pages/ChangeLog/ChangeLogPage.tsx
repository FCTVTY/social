import React, { Fragment, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { getApiDomain } from "../../lib/auth/supertokens";
import { CommunityCollection, Courses } from "../../interfaces/interfaces";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/16/solid";

interface HomeProps {
  host?: string;
  channel?: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ChangeLogPage({ host, channel }: HomeProps) {
  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 text-center mb-3 ">
        <div className="min-w-0 flex-1">
          <h2 className="mt-2 text-3xl leading-7 tracking-wider text-sky-950 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
            Changelog
          </h2>
        </div>
      </div>

      <div className=" px-6 lg:px-8 pb-10 dark:text-white">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-white">
          <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-white">
            B:Hive v1.0.3
            <div className="ml-2 badge badge-secondary">Friday 6th Sep</div>
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-400 sm:text-4xl dark:text-white">
            General Improvements{" "}
          </h1>
          <br />
          <p>
            <p className="text-2xl mt-2 text-primary">New ✨</p>
            <ul>
              <li>
                Count on Profiles &amp; Levels - Profiles now show what level
                your at based on comments/post creations
              </li>
              <li>
                Cake day - Shows your birthday on the community (when you
                joined)
              </li>
              <li>
                Joined date - Shows how long users has been a part of the
                communtiy
              </li>
              <li>ability to crop your cover photo on the onboarding page</li>
              <li>
                ctrl/cmd + k - this will open a dialog to allow you to search
                for spaces
              </li>
              <li>
                posts can have a custom background (black,blue,pink - more to
                come) to allow some posts to stand out&nbsp;
              </li>
            </ul>
            <h2 className="text-2xl mt-2 text-primary">Improvements 🙌</h2>
            <ul>
              <li>
                Member page has had an improvement to show whos a moderator
                &amp; also a list of all members
              </li>
              <li>General speed improvements</li>
              <li>communites now have logos/backdrops on the login page</li>
            </ul>
            <p>&nbsp;</p>
            <p className="text-2xl mt-2 text-primary">Bug Fixes 🐛</p>
            <ul>
              <li>
                Fixed bug issue on events page not showing up correctly on a few
                communities
              </li>
            </ul>
          </p>
        </div>
      </div>

      <div className=" px-6 lg:px-8 pb-10 dark:text-white">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-white">
          <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-white">
            B:Hive v1.0.2 <div className="badge badge-accent">Improvements</div>
            <div className="badge badge-secondary">Wednesday 14th Aug</div>
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-400 sm:text-4xl dark:text-white">
            Improved URLS{" "}
          </h1>
          <br />
          <p>
            We've updated how space's links work. Instead of displaying a random
            ID for each channel, we now use the space name, providing a cleaner
            and more intuitive approach.
          </p>
        </div>
      </div>
      <div className=" px-6 lg:px-8 pb-10 dark:text-white">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-white">
          <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-white">
            B:Hive v1.0.1{" "}
            <div className="badge badge-accent">New Features/Improvements</div>
            <div className="badge badge-secondary">Thursday 8th Aug</div>
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-400 sm:text-4xl dark:text-white">
            Tweaks
          </h1>
          <p className="mt-6 ">Tweaks & More </p>
          <br />
          <br />
          <p>
            We are excited to announce a new feature: you can now tag users in
            posts and comments! Stay tuned for more enhancements in the coming
            weeks. <br />
            <br />
            Additionally, we've renamed Channels to Spaces. This change allows
            us to expand this area into a versatile platform for feeds, chats,
            and more.{" "}
          </p>
        </div>
      </div>
      <div className=" px-6 lg:px-8 pb-10 dark:text-white">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-white">
          <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-white">
            B:Hive v1.0.0 <div className="badge badge-accent">New Features</div>
            <div className="badge badge-secondary">Sunday 4th Aug</div>
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-400 sm:text-4xl dark:text-white">
            Production Release 🤘
          </h1>
          <p className="mt-6 ">Welcome to Version 1 of B:hive! </p>
          <br />
          <br />
          <p>
            We are thrilled to introduce the first official release of B:Hive,
            an innovative platform designed to enhance your experience and
            productivity. This release brings a host of exciting new features
            and improvements that we believe will greatly benefit our users.
            Here’s a quick overview of what’s new in Version 1:
          </p>
          <h2 className="text-2xl mt-2 text-primary">Channels</h2>
          <p>
            We’ve added Channels to help you organize your discussions and
            collaborations more effectively. Whether you’re working on a
            project, participating in a community, or just looking to streamline
            communication, Channels will provide you with the tools you need to
            stay connected and focused.
          </p>
          <h2 className="text-2xl mt-2 text-secondary">Academy</h2>
          <p>
            Our new Academy section offers a wealth of educational resources and
            training materials. From tutorials and webinars to in-depth courses,
            the Academy is designed to support your learning journey and help
            you acquire new skills and knowledge.
          </p>
          <h2 className="text-2xl mt-2 text-red-600">Resources</h2>
          <p>
            The Resources feature has been expanded to include a comprehensive
            library of documents, templates, and guides. Whether you need
            reference materials or tools to support your work, our Resources
            section has you covered.
          </p>
          <h2 className="text-2xl mt-2 text-indigo-400">Events</h2>
          <p>
            Stay informed and engaged with our new Events feature. This section
            will keep you up-to-date on upcoming webinars, workshops,
            conferences, and community gatherings. Participate in events to
            network, learn, and grow with others in your field.
          </p>
          <p className="mt-5">
            We are excited for you to explore these new features and
            enhancements. Your feedback is invaluable to us, so please do not
            hesitate to share your thoughts and suggestions as you navigate
            through B:Hive. Together, we can continue to improve and make B:Hive
            the ultimate platform for collaboration and growth.
          </p>
          <p>
            Thank you for being a part of our community and for your continued
            support. Happy exploring!
          </p>
        </div>
      </div>
    </>
  );
}
