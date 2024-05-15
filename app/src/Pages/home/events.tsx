import React, {Fragment} from 'react';
import {
    BriefcaseIcon,
    CheckIcon,
    ChevronRightIcon,
    CurrencyDollarIcon,
    LinkIcon,
    MapPinIcon,
    PencilIcon
} from "@heroicons/react/16/solid";
import {Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {CalendarIcon} from "@heroicons/react/24/outline";
interface HomeProps {
    host?: string;
    channel?: string;
}
function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
export default function EventsPage({ host, channel }: HomeProps) {
    const people = [
        {
            name: 'How to make money',
            email: 'leslie talks about making money',
            role: 'In-Person',
            imageUrl:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            href: '#',
            lastSeen: '21-April-2025',
            lastSeenDateTime: '2023-01-23T13:23Z',
        },
        {
            name: 'How to make money',
            email: 'leslie talks about making money part 2',
            role: 'Zoom',
            imageUrl:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            href: '#',
            lastSeen: '25-April-2025',
            lastSeenDateTime: '2023-01-23T13:23Z',
        },
    ]
    return (
        <>
            <div className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 bg-white border-b bg-gray-200 mb-3">
                <div className="min-w-0 flex-1">

                    <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                       Events
                    </h2>

                </div>
                <div className="mt-5 flex lg:ml-4 lg:mt-0">


                    <span className="sm:ml-3">
          <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <CheckIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true"/>
            Create
          </button>
        </span>


                </div>
            </div>


    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        <ul
            role="list"
            className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
        >
            {people.map((person) => (
                <li key={person.email}
                    className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                    <div className="flex gap-x-4">
                        <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt=""/>
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                                <a href={person.href}>
                                    <span className="absolute inset-x-0 -top-px bottom-0"/>
                                    {person.name}
                                </a>
                            </p>
                            <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                <a href={`mailto:${person.email}`} className="relative truncate hover:underline">
                                    {person.email}
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">{person.role}</p>

                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                         className="w-5 h-5 inline-flex ">
                                        <path
                                            d="M5.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V12ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM7.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V12ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V10ZM10 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H10ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H12ZM11.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V10ZM14 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H14Z"/>
                                        <path fillRule="evenodd"
                                              d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span>{person.lastSeen}</span>
                                </p>

                        </div>
                        <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true"/>
                    </div>
                </li>
            ))}
        </ul>
    </div>
        </>
    )
        ;
};

