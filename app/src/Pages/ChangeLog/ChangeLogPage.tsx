import React, { Fragment, useEffect, useState } from 'react';
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { getApiDomain } from "../../lib/auth/supertokens";
import { CommunityCollection, Courses } from "../../interfaces/interfaces";
import {CheckCircleIcon, InformationCircleIcon} from "@heroicons/react/16/solid";

interface HomeProps {
    host?: string;
    channel?: string;
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function ChangeLogPage({ host, channel }: HomeProps) {

    
    return (
      <>

        <div
          className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 text-center mb-3 lg:-ml-72">
          <div className="min-w-0 flex-1">

            <h2
              className="mt-2 text-3xl leading-7 tracking-wider text-sky-950 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
              Changelog
            </h2>

          </div>
        </div>
          <div className=" px-6 lg:px-8 pb-10 dark:text-white">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-white">
              <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-white">B:Hive v1 <div
                className="badge badge-accent">New Features</div> <div
                className="badge badge-secondary">Sunday 4th Aug</div>
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Production Release 🤘</h1>
              <p className="mt-6 ">
                Welcome to Version 1 of B:hive! </p>
              <br/><br/>
                <p>
                  We are thrilled to introduce the first official release of B:Hive, an innovative platform designed to
                  enhance your experience and productivity. This release brings a host of exciting new features and
                  improvements that we believe will greatly benefit our users. Here’s a quick overview of what’s new in
                  Version 1:
                </p>
                <h2 className="text-2xl mt-2 text-primary">Channels</h2>
                <p>
                  We’ve added Channels to help you organize your discussions and collaborations more effectively.
                  Whether you’re working on a project, participating in a community, or just looking to streamline
                  communication, Channels will provide you with the tools you need to stay connected and focused.
                </p>
              <h2 className="text-2xl mt-2 text-secondary">Academy</h2>
              <p>
                  Our new Academy section offers a wealth of educational resources and training materials. From
                  tutorials and webinars to in-depth courses, the Academy is designed to support your learning journey
                  and help you acquire new skills and knowledge.
                </p>
              <h2 className="text-2xl mt-2 text-red-600" >Resources</h2>
              <p>
                  The Resources feature has been expanded to include a comprehensive library of documents, templates,
                  and guides. Whether you need reference materials or tools to support your work, our Resources section
                  has you covered.
                </p>
              <h2 className="text-2xl mt-2 text-indigo-400">Events</h2>
              <p>
                  Stay informed and engaged with our new Events feature. This section will keep you up-to-date on
                  upcoming webinars, workshops, conferences, and community gatherings. Participate in events to network,
                  learn, and grow with others in your field.
                </p>
                <p className="mt-5">
                  We are excited for you to explore these new features and enhancements. Your feedback is invaluable to
                  us, so please do not hesitate to share your thoughts and suggestions as you navigate through B:Hive.
                  Together, we can continue to improve and make B:Hive the ultimate platform for collaboration and
                  growth.
                </p>
                <p>
                  Thank you for being a part of our community and for your continued support. Happy exploring!
                </p>
            </div>
          </div>
      </>
);
}
