import React, {Fragment, useEffect, useState} from 'react';
import {
    BriefcaseIcon,
    CheckIcon,
    ChevronRightIcon,
    CurrencyDollarIcon,
    LinkIcon,
    MapPinIcon,
    PencilIcon, TagIcon, UserCircleIcon
} from "@heroicons/react/16/solid";
import {Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon, EnvelopeIcon, PhoneIcon} from "@heroicons/react/20/solid";
import {CalendarIcon} from "@heroicons/react/24/outline";
import {PPosts} from "../../interfaces/interfaces";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import {formatDistanceToNow} from "date-fns";
import Button from "../../components/Button";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
interface HomeProps {
    host?: string,
    channel?: string,
    post?: string
}

const activity = [
    {
        id: 1,
        type: 'comment',
        person: { name: 'Eduardo Benz', href: '#' },
        imageUrl:
            'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ',
        date: '6d ago',
    },
    {
        id: 4,
        type: 'comment',
        person: { name: 'Jason Meyers', href: '#' },
        imageUrl:
            'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.',
        date: '2h ago',
    },
]

export default function EventPage({host, channel, post}: HomeProps) {
    const [ppost, setPost] = useState<PPosts>();

    useEffect(() => {
        if (post) {
            fetchDetails();
        }
    }, [host, channel]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${getApiDomain()}/community/post?oid=${post}`);

            setPost(response.data);
        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };


    // @ts-ignore
    // @ts-ignore
    return (
        <>
        {ppost && (
            <div>
        <div className="mt-[-2.5rem]">
            <div>
                <img className=" h-48 w-full object-cover lg:h-64" src={ppost?.media} alt=""/>
            </div>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 ">
                <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                    <div className="flex">
                        <img className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" src={ppost?.profile.profilePicture}
                             alt=""/>
                    </div>
                    <div
                        className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
                            <h1 className="truncate text-2xl font-bold text-gray-900">{ppost?.desc}</h1>
                        </div>
                                     <div
                            className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                <EnvelopeIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true"/>
                                <span>RSVP</span>
                            </button>
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                <LinkIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true"/>
                                <span>Join Online</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-4">

            <ul role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mx-auto divide-y">


            <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow max-w-4xl">
            <div className="flex flex-1 flex-col p-3">
            <dl className="mt-1 flex flex-grow flex-col justify-between">



{ppost.article !== "" || ppost.article !== undefined ? (
        <dd className="text-sm text-gray-500"
            dangerouslySetInnerHTML={{__html: ppost.article}}></dd>
    ) : (
        <dd className="text-sm text-gray-500"
            dangerouslySetInnerHTML={{__html: ppost.desc}}></dd>
    )}
    <dd className="text-sm text-gray-500">
        {ppost.tags.map(tag => (
            <a key={tag} href={`#${tag}`} className="mr-2">#{tag} </a>
        ))}
    </dd>



    <div className="divide-x my-4"></div>


    <div className="flow-root mt-3">
        <ul role="list" className="-mb-8">
            {activity.map((activityItem, activityItemIdx) => (
                <li key={activityItem.id}>
                    <div className="relative pb-8">
                        {activityItemIdx !== activity.length - 1 ? (
                            <span
                                className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"/>
                        ) : null}
                        <div className="relative flex items-start space-x-3">
                            {activityItem.type === 'comment' ? (
                                <>
                                    <div className="relative">
                                        <img
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
                                            src={activityItem.imageUrl}
                                            alt=""
                                        />


                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div>
                                            <div className="text-sm">
                                                <a href={activityItem.person.href}
                                                   className="font-medium text-gray-900">
                                                    {activityItem.person.name}
                                                </a>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500">Commented {activityItem.date}</p>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-700">
                                            <p>{activityItem.comment}</p>
                                        </div>
                                    </div>
                                </>
                            ) : activityItem.type === 'assignment' ? (
                                <>
                                    <div>
                                        <div className="relative px-1">
                                            <div
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                                                <UserCircleIcon
                                                    className="h-5 w-5 text-gray-500"
                                                    aria-hidden="true"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1 py-1.5">
                                        <div className="text-sm text-gray-500">
                                            <a href={activityItem.person.href}
                                               className="font-medium text-gray-900">
                                                {activityItem.person.name}
                                            </a>{' '}
                                            assigned{' '}
                                            <a href={activityItem.assigned.href}
                                               className="font-medium text-gray-900">
                                                {activityItem.assigned.name}
                                            </a>{' '}
                                            <span
                                                className="whitespace-nowrap">{activityItem.date}</span>
                                        </div>
                                    </div>
                                </>
                            ) : activityItem.type === 'tags' ? (
                                <>
                                    <div>
                                        <div className="relative px-1">
                                            <div
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                                                <TagIcon
                                                    className="h-5 w-5 text-gray-500"
                                                    aria-hidden="true"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1 py-0">
                                        <div
                                            className="text-sm leading-8 text-gray-500">
                        <span className="mr-0.5">
                          <a href={activityItem.person.href} className="font-medium text-gray-900">
                            {activityItem.person.name}
                          </a>{' '}
                            added tags
                        </span>{' '}
                                            <span className="mr-0.5">
                          {activityItem.tags.map((tag) => (
                              <Fragment key={tag.name}>
                                  <a
                                      href={tag.href}
                                      className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200"
                                  >
                                      <svg
                                          className={classNames(tag.color, 'h-1.5 w-1.5')}
                                          viewBox="0 0 6 6"
                                          aria-hidden="true"
                                      >
                                          <circle cx={3} cy={3} r={3}/>
                                      </svg>
                                      {tag.name}
                                  </a>{' '}
                              </Fragment>
                          ))}
                        </span>
                                            <span
                                                className="whitespace-nowrap">{activityItem.date}</span>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
</dl>
</div>
    <div></div>
</li>

</ul>
</div>


    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-3">
        <form className=" bg-white shadow rounded-lg p-3">

                <textarea
                    id="desc"
                    name="desc"
                    placeholder="Type something..."

                    className="w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-tg placeholder-gray-400"
                />
            <footer className="flex justify-between mt-2">
                <div className="flex gap-2">

                </div>
                <label htmlFor="image-upload" className="cursor-pointer">
                    <Button className="flex items-center mr-2" color="white" type="submit">Leave
                        Comment</Button>


                </label>
            </footer>
        </form>
    </div>
    <div className="fixed bottom-2 left-2 w-[20vw] lg:hidden">
        <a href="/"  className="w-full flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                 className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>

        </a>
    </div>
</div>   )}
</>

)
    ;
};

