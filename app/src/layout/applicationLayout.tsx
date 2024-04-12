import React, {Fragment, useState} from 'react';
import LogoSquare from "../assets/logo-light.svg";
import LogoSquareDark from "../assets/logo-dark.svg";
import fk from "../assets/FK.svg";
import {Dialog, Disclosure, Menu, Transition} from '@headlessui/react';
import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import {ChevronDownIcon, MagnifyingGlassIcon} from '@heroicons/react/20/solid';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ElementType;
    current: boolean;
}

interface TeamItem {
    id: number;
    name: string;
    href: string;
    initial: string;
    current: boolean;
}

interface UserNavigationItem {
    name: string;
    href: string;
}

interface Props {
    children: React.ReactNode,
    host?: string
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const ApplicationLayout: React.FC<Props> = ({children, host}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation: NavigationItem[] = [
        {name: 'Dashboard', href: '#', icon: HomeIcon, current: true},
        {name: 'Team', href: '#', icon: UsersIcon, current: false},
        {name: 'Projects', href: '#', icon: FolderIcon, current: false},
        {name: 'Calendar', href: '#', icon: CalendarIcon, current: false},
        {name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false},
        {name: 'Reports', href: '#', icon: ChartPieIcon, current: false},
    ];

    const teams: TeamItem[] = [
        {id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false},
        {id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false},
        {id: 3, name: 'Workcation', href: '#', initial: 'W', current: false},
    ];

    const userNavigation: UserNavigationItem[] = [
        {name: 'Your profile', href: '#'},
        {name: 'Sign out', href: '#'},
    ];

    // @ts-ignore
    return (
        <>


            <Disclosure as="nav" className="sticky top-0 z-50 bg-white border-b border-gray-200">
                {({open}) => (
                    <>
                        <div className="mx-auto px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button */}

                                </div>
                                <div
                                    className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex flex-shrink-0 items-center">
                                        <img
                                            className="block h-8 w-auto lg:hidden"
                                            src={LogoSquare}
                                            alt="b:hive"
                                        />
                                        <img
                                            className="hidden h-8 w-auto lg:block"
                                            src={LogoSquare}
                                            alt="b:hive"
                                        />
                                    </div>

                                </div>
                                <div
                                    className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <button
                                        type="button"
                                        className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true"/>
                                    </button>

                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <Menu.Button
                                                className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                    alt=""
                                                />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items
                                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Your Profile
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Settings
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Sign out
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 pb-4 pt-2">
                                {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                                <Disclosure.Button
                                    as="a"
                                    href="#"
                                    className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
                                >
                                    Dashboard
                                </Disclosure.Button>
                                <Disclosure.Button
                                    as="a"
                                    href="#"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                                >
                                    Team
                                </Disclosure.Button>
                                <Disclosure.Button
                                    as="a"
                                    href="#"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                                >
                                    Projects
                                </Disclosure.Button>
                                <Disclosure.Button
                                    as="a"
                                    href="#"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                                >
                                    Calendar
                                </Disclosure.Button>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80"/>
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button type="button" className="-m-2.5 p-2.5"
                                                    onClick={() => setSidebarOpen(false)}>
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    <div
                                        className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 bg-hive px-6">

                                        <nav className="flex flex-1 flex-col mt-2">
                                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map((item) => (
                                                            <li key={item.name}>
                                                                <a
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        item.current
                                                                            ? 'bg-gray-800 text-white'
                                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                    )}
                                                                >
                                                                    <item.icon className="h-6 w-6 shrink-0"
                                                                               aria-hidden="true"/>
                                                                    {item.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                                <li>
                                                    <div className="text-xs font-semibold leading-6 text-gray-400">Your
                                                        teams
                                                    </div>
                                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                                        {teams.map((team) => (
                                                            <li key={team.name}>
                                                                <a
                                                                    href={team.href}
                                                                    className={classNames(
                                                                        team.current
                                                                            ? 'bg-gray-800 text-white'
                                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                    )}
                                                                >
                          <span
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                            {team.initial}
                          </span>
                                                                    <span className="truncate">{team.name}</span>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                                <li className="-mx-6 mt-auto">
                                                    <a
                                                        href="#"
                                                        className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                                                    >
                                                        <img
                                                            className="h-8 w-8 rounded-full bg-gray-800"
                                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                            alt=""
                                                        />
                                                        <span className="sr-only">Your profile</span>
                                                        <span aria-hidden="true">Tom Cook</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:mt-[62px] lg:z-50 lg:flex lg:w-72 lg:flex-col ">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 bg-hive px-6">

                        <nav className="flex flex-1 flex-col mt-2">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-800 text-white'
                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true"/>
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                        {teams.map((team) => (
                                            <li key={team.name}>
                                                <a
                                                    href={team.href}
                                                    className={classNames(
                                                        team.current
                                                            ? 'bg-gray-800 text-white'
                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                          <span
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                            {team.initial}
                          </span>
                                                    <span className="truncate">{team.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="-mx-6 mt-auto">
                                    <a
                                        href="#"
                                        className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                                    >
                                        <img
                                            className="h-8 w-8 rounded-full bg-gray-800"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                        <span className="sr-only">Your profile</span>
                                        <span aria-hidden="true">Tom Cook</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="lg:pl-72">
                    <div className="sticky top-[62px] z-40 lg:mx-auto">
                        <div
                            className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                            </button>

                            {/* Separator */}
                            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true"/>

                            <div className="pl-2 flex flex-1 gap-x-4 self-stretch lg:gap-x-6">

                                <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
                                    <img src={fk} className="mx-auto h-9 py-1"/>

                                    {/* Separator */}
                                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true"/>


                                </div>

                                <form className="relative flex flex-1 hidden md:block" action="#" method="GET">
                                    <label htmlFor="search-field" className="sr-only">
                                        Search
                                    </label>
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="search-field"
                                        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Search..."
                                        type="search"
                                        name="search"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>

                    <main className="py-10 bg">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default ApplicationLayout;
