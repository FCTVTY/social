import React, {Children, Fragment, useEffect, useRef, useState} from 'react';
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
    XMarkIcon,
    AcademicCapIcon,
} from '@heroicons/react/24/outline';
import {ChevronDownIcon, ExclamationTriangleIcon, MagnifyingGlassIcon} from '@heroicons/react/20/solid';
import {getApiDomain} from "../lib/auth/supertokens";
import axios from 'axios';
import {any} from "zod";
import {CommunityCollection, Profile} from "../interfaces/interfaces";
import Join from "../Pages/home/join";
import { JSX } from 'react/jsx-runtime';
import {b} from "vite/dist/node/types.d-aGj9QkWt";
import { themeChange } from 'theme-change';
import {NavigationLoadingBar} from "./loader";
import ThemeSwitch from './themeswitch';
import Cookies from 'js-cookie';
import {LoadingButton} from "../components/LoadingButton";
import {useLocation} from "react-router-dom";
import {
    CalendarDaysIcon,
    GraduationCapIcon,
    PickaxeIcon,
    PlusIcon,
    SquareCodeIcon,
    UsersIcon,
    WrenchIcon,
    LogsIcon, MessageCircleQuestionIcon, ChevronUpIcon
} from "lucide-react";
import Themeswitch from "./themeswitch";

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
    host?: string,
    channel?: string
    isChanelPage?: boolean
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}


const ApplicationLayout: React.FC<Props> = ({children, host, channel, isChanelPage =false}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [community, setCommunity] = useState<Partial<CommunityCollection>>();
    const [profile, setProfile] = useState<Partial<Profile>>();
    const [locked, setLocked] = useState(false);
    const [isadmin, setAdmin] = useState(false);
    const [open, setOpen] = useState(false)

    const cancelButtonRef = useRef(null)

    const [navigation, setNavigation] = useState<NavigationItem[]>([]);
    const fnavigation = {
        main: [

        ],
        social: [
            {
                name: 'Facebook',
                href: '#',
                icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
                    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                        <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
            },
            {
                name: 'Instagram',
                href: '#',
                icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
                    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                        <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
            },
            {
                name: 'Twitter',
                href: '#',
                icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
                    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                        <path
                            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                ),
            },
            {
                name: 'GitHub',
                href: '#',
                icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
                    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                        <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
            },
            {
                name: 'YouTube',
                href: '#',
                icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
                    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                        <path
                            fillRule="evenodd"
                            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
            },
        ],
    }
    const currentUrl = window.location.pathname; // This gives you the path of the current URL



    const teams: TeamItem[] = [
        {id: 1, name: 'Academy', href: '/Academy', initial: <GraduationCapIcon/>, current: '/Academy' == currentUrl},
        {id: 2, name: 'Resources', href: '/Resources', initial: <SquareCodeIcon/>, current: '/Resources' == currentUrl},
        {id: 3, name: 'Events', href: '/events/upcoming', initial: <CalendarDaysIcon/>, current: '/events/upcoming' == currentUrl},
        {id: 4, name: 'Members', href: '/members/list', initial: <UsersIcon/>, current: '/members/list' == currentUrl},
        {id: 5, name: 'Changelog', href: '/changelog',initial: <LogsIcon/> , current: '/changelog' == currentUrl },
        {id: 6, name: 'FAQ', href: '/FAQ',initial: <MessageCircleQuestionIcon/> , current: '/FAQ' == currentUrl },

    ];
    const admin: TeamItem[] = [
        {id: 1, name: 'Site Settings', href: '/admin/site', initial: <WrenchIcon/>, current: '/admin/site' == currentUrl},
    ];
    const debug: TeamItem[] = [
        {id: 1, name: 'DEBUG', href: '/admin/site', initial: <WrenchIcon/>, current: '/Academy' == currentUrl},
    ];
    const userNavigation: UserNavigationItem[] = [
        {name: 'Your profile', href: '#'},
        {name: 'Sign out', href: '#'},
    ];
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchDetails();
    }, [host]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${getApiDomain()}/community?name=${host}`);
            setCommunity(response.data);
            const profileresponse = await axios.get(`${getApiDomain()}/profile`);

            setProfile(profileresponse.data);

        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };

    useEffect(() => {
        if (community && community.channels) {
            console.log("loading"+  channel)
            if(channel === undefined && isChanelPage)
            {

                window.location.assign('/feed/'+ community.channels[0].id);
            }

            const currentUrl = window.location.pathname; // This gives you the path of the current URL

            const channelNavigation = community.channels.map((channel) => ({
                name: channel.name,
                href: `/feed/${channel.id}`, // Update with appropriate channel ID or URL
                icon: ChartPieIcon, // Update with appropriate icon
                current: `/feed/${channel.id}` === currentUrl, // Set current to true if the URL matches
            }));

            setNavigation(prevNavigation => [ ...channelNavigation]);
        }
    }, [community]);

    useEffect(() => {
        rolesData()
    }, []);

    const rolesData = async ()=> {

        let response = await axios.get(`${getApiDomain()}/user/roles`);
        setRoles(response.data)
    };
    var home = false;
    if(currentUrl == '/feed/'+community?.channels[0].id)
    {
        home = true;
    }



    useEffect(() => {
        themeChange(false);


        setLocked(community?.community?.private)

        //check cookie...

        let cookie = Cookies.get(community?.community?.id);


        if (cookie == community?.community?.access){
            setLocked(false)
        }

    }, [community?.community?.name]);


    const location = useLocation();

    // Extract the query string parameters
    const queryParams = new URLSearchParams(location.search);

    // Get specific values from the query string
    const code = queryParams.get('code');

    useEffect(() => {
        themeChange(false);


        setLocked(community?.community?.private)

        //check cookie...

        let cookie = Cookies.get(community?.community?.id);


        if (cookie == community?.community?.access){
            setLocked(false)
            Cookies.set(community?.community?.id, community?.community?.access, { expires: 365 });
        }

    }, [community?.community?.name]);


    useEffect(() => {
        themeChange(false);

        if(code != null) {
            setLocked(community?.community?.private)

            //check cookie...

            let cookie = Cookies.get(community?.community?.id);

            if (code == community?.community?.access) {
                setLocked(false)
                Cookies.set(community?.community?.id, code, {expires: 365});
            }
        }
    }, [community?.community?.name, code]);


    const [menu, Setmenu] = useState('bg-indigo-600');
    const [menu2, Setmenu2] = useState('bg-cyan-500');
    const [menuText, SetmenuText] = useState('text-indigo-600');
    const [menuText2, SetmenuText2] = useState('text-cyan-500');


    useEffect(() => {





            setAdmin(roles.includes("admin") || roles.includes("moderator"))
        }, [roles]);
    const shouldRender = (community && (locked === false && community.community?.published === true)) ||
        (community && (community.community?.published === false && isadmin));

// List of available DaisyUI themes
    const themes = [
        'light',
        'dark',
        'cupcake',
        'bumblebee',
        'emerald',
        'corporate',
        'synthwave',
        'retro',
        'cyberpunk',
        'valentine',
        'halloween',
        'garden',
        'forest',
        'aqua',
        'lofi',
        'pastel',
        'fantasy',
        'wireframe',
        'black',
        'luxury',
        'dracula'
    ];

        // State to hold the currently selected theme
        const [theme, setTheme] = useState('light');

        // Function to handle theme change
        const handleThemeChange = (event) => {
            setTheme(event.target.value);
            const htmlSelector = document.querySelector('html');

            htmlSelector.setAttribute('data-theme', event.target.value);
        };
    const visibleTeams = teams.slice(0, 4);
    const hiddenTeams = teams.slice(4);
    const [isOpen, setIsOpen] = useState(false);



    // @ts-ignore
    return (
        <>
            {shouldRender && (

                <>
                    <div
                        className="hidden fixed bottom-0 z-[999] isolate w-full flex items-center gap-x-6 overflow-hidden bg-red-500 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                        <div
                            className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                            aria-hidden="true"
                        >

                        </div>

                        <div className="hidden  flex flex-wrap items-center gap-x-4 gap-y-2">
                            <p className="text-sm leading-6 text-white">
                                <strong className="font-semibold">Planned Maintenance Window</strong>
                                <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current"
                                     aria-hidden="true">
                                    <circle cx={1} cy={1} r={1}/>
                                </svg>
                                23:00 GTM 06/07/2024
                            </p>

                        </div>
                        <div className="flex flex-1 justify-end">
                            <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
                                <span className="sr-only">Dismiss</span>
                                <XMarkIcon className="h-5 w-5 text-gray-900" aria-hidden="true"/>
                            </button>
                        </div>
                    </div>

                    <Disclosure as="nav"
                                className="overscroll-none sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-900">
                        {({open}) => (
                            <>
                                <div className="mx-auto px-2 sm:px-6 lg:px-8">
                                    <div className="relative flex h-16 justify-between">
                                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                            {/* Mobile menu button */}

                                        </div>
                                        <div
                                            className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start w-32">
                                            <div className="flex flex-shrink-0 items-center ">

                                                <button
                                                    type="button"
                                                    className="m-2.5 -ml-2.5 p-2.5 text-gray-700 lg:hidden"
                                                    onClick={() => setSidebarOpen(true)}
                                                >
                                                    <span className="sr-only">Open sidebar</span>
                                                    <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                                                </button>




                                                <img
                                                    className=" h-7 w-auto dark:hidden"
                                                    src={LogoSquare}
                                                    alt="b:hive"
                                                />

                                                <img
                                                    className="hidden h-7 w-auto dark:block"
                                                    src={LogoSquareDark}
                                                    alt="b:hive"
                                                />

                                            </div>

                                        </div>
                                        <div
                                            className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start w-32">
                                            <div className="flex flex-shrink-0 items-center ">


                                                <img src={community && community.community?.logo}
                                                     className="sm:mx-auto hidden md:block h-9 rounded-xs dark:invert"/>

                                            </div>

                                        </div>
                                        <div
                                          className="absolute inset-y-0 right-0 justify-content-end flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                            <Themeswitch></Themeswitch>
                                            <button
                                              type="button"
                                              className="mx-2 rounded-full bg-white dark:bg-zinc-950 p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                                                          src={profile?.profilePicture}
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
                                                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-zinc-950 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">


                                                        <Menu.Item>
                                                            {({active}) => (
                                                              <a
                                                                href={`/profile/${profile?._id}`}
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                              >
                                                                  Your Profile
                                                              </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({active}) => (
                                                              <a
                                                                href={`/settings`}
                                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                              >
                                                                  Settings
                                                              </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({active}) => (
                                                              <a
                                                                href="/auth"
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
                                    <div className="fixed inset-0 bg-white/80"/>
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
                                                        <XMarkIcon className="h-6 w-6 text-black" aria-hidden="true"/>
                                                    </button>
                                                </div>
                                            </Transition.Child>
                                            {/* Sidebar component, swap this element with another sidebar if you like */}
                                            <div
                                                className="flex grow flex-col gap-y-5 overflow-y-auto  bg-white dark:bg-zinc-950 pl-6 lg:mt-[62px]">

                                                <nav className="flex flex-1 flex-col mt-2">
                                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                        <li>
                                                            <ul role="list" className="-mx-3 space-y-3">
                                                                {navigation.map((item) => (



                                                                    <li key={item.name}>
                                                                        <a
                                                                            href={item.href}
                                                                            className={classNames(
                                                                                item.current
                                                                                    ? 'text-indigo-600 bg-gray-200 dark:bg-zinc-800'
                                                                                    : 'text-gray-400 hover:text-white hover:bg-indigo-600',
                                                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]'
                                                                            )}
                                                                        >
                                                     <span
                                                         className="flex h-6 w-6 shrink-0 items-center justify-center  text-[0.625rem] font-medium ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round"
        d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
</svg>

                          </span>
                                                                            <span
                                                                                className="mt-[2px]">
                            {item.name}
                          </span>
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </li>
                                                        <li>
                                                            <div
                                                              className="text-xs  leading-6 text-gray-400 my-3">General
                                                            </div>
                                                            <ul role="list" className="-mx-3 space-y-3">
                                                                {visibleTeams.map((team) => (
                                                                  <li key={team.name}>
                                                                      <a
                                                                        href={team.href}
                                                                        className={classNames(
                                                                          team.current
                                                                            ? `${menuText2} bg-gray-200 dark:bg-zinc-800`
                                                                            : `text-gray-400 hover:text-white hover:${menu2}`,
                                                                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]'
                                                                        )}
                                                                      >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium group-hover:text-white">
                {team.initial}
              </span>
                                                                          <span className="mt-[2px]">{team.name}</span>
                                                                      </a>
                                                                  </li>
                                                                ))}
                                                                {isOpen && hiddenTeams.map((team) => (
                                                                  <li key={team.name}>
                                                                      <a
                                                                        href={team.href}
                                                                        className={classNames(
                                                                          team.current
                                                                            ? `${menuText2} bg-gray-200 dark:bg-zinc-800`
                                                                            : `text-gray-400 hover:text-white hover:${menu2}`,
                                                                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]'
                                                                        )}
                                                                      >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium group-hover:text-white">
                {team.initial}
              </span>
                                                                          <span className="mt-[2px]">{team.name}</span>
                                                                      </a>
                                                                  </li>
                                                                ))}
                                                            </ul>
                                                            {hiddenTeams.length > 0 && (
                                                              <button
                                                                onClick={() => setIsOpen(!isOpen)}
                                                                className="mt-4 text-gray-400  "
                                                              >
                                                                  {!isOpen ? (
                                                                    <span>Show More</span>
                                                                  ) : (
                                                                    <span>Show Less</span>
                                                                  )}
                                                              </button>
                                                            )}
                                                        </li>
                                                        <li className="-mx-6 mt-auto">
                                                            <a
                                                              href={`/profile/${profile?._id}`}
                                                              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6  "
                                                            >
                                                                <img
                                                                  className="h-8 w-8 rounded-full bg-gray-800"
                                                                  src={profile?.profilePicture}
                                                                  alt=""
                                                                />
                                                                <span className="sr-only">Your profile</span>
                                                                <span
                                                                  aria-hidden="true">{profile?.first_name} {profile?.last_name}</span>
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
                        <div
                          className="hidden lg:fixed lg:inset-y-0 lg:mt-[64px] lg:z-50 lg:flex lg:w-72 lg:flex-col border-r-2 border-slate-100 dark:bg-zinc-950 dark:border-zinc-900">
                            {/* Sidebar component, swap this element with another sidebar if you like */}
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-6 ml-4 mt-4">

                                <nav className="flex flex-1 flex-col mt-2">
                                    <div className="text-xs  leading-6 text-gray-400 my-3">Channels</div>

                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-3 space-y-3">
                                                {navigation.map((item) => (
                                                  <li key={item.name}>
                                                      <a
                                                        href={item.href}
                                                        className={classNames(
                                                          item.current
                                                            ? `${menuText} bg-gray-200 dark:bg-zinc-800`
                                                            : `text-gray-400 hover:text-white hover:${menu}`,
                                                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 '
                                                        )}
                                                      >
                                                     <span
                                                       className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round"
        d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
</svg>

                          </span>
                                                            <span
                                                                className="mt-[2px]">
                            {item.name}
                          </span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li>
                                            <div className="text-xs  leading-6 text-gray-400 my-3">General</div>
                                            <ul role="list" className="-mx-3 space-y-3">
                                                {visibleTeams.map((team) => (
                                                  <li key={team.name}>
                                                      <a
                                                        href={team.href}
                                                        className={classNames(
                                                          team.current
                                                            ? `${menuText2} bg-gray-200 dark:bg-zinc-800`
                                                            : `text-gray-400 hover:text-white hover:${menu2}`,
                                                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]'
                                                        )}
                                                      >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium group-hover:text-white">
                {team.initial}
              </span>
                                                          <span className="mt-[2px]">{team.name}</span>
                                                      </a>
                                                  </li>
                                                ))}
                                                {isOpen && hiddenTeams.map((team) => (
                                                  <li key={team.name}>
                                                      <a
                                                        href={team.href}
                                                        className={classNames(
                                                          team.current
                                                            ? `${menuText2} bg-gray-200 dark:bg-zinc-800`
                                                            : `text-gray-400 hover:text-white hover:${menu2}`,
                                                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]'
                                                        )}
                                                      >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium group-hover:text-white">
                {team.initial}
              </span>
                                                          <span className="mt-[2px]">{team.name}</span>
                                                      </a>
                                                  </li>
                                                ))}
                                            </ul>
                                            {hiddenTeams.length > 0 && (
                                              <button
                                                onClick={() => setIsOpen(!isOpen)}
                                                className="mt-4 text-gray-400  "
                                              >
                                                  {!isOpen ? (
                                                    <span>Show More</span>
                                                  ) : (
                                                    <span>Show Less</span>
                                                  )}
                                              </button>
                                            )}
                                        </li>
                                        {roles && (roles.includes("admin") || roles.includes("moderator")) && (

                                            <li>
                                                <div className="text-xs  leading-6 text-gray-400 my-3">Admin/Moderator
                                                    Settings
                                                </div>
                                                <ul role="list" className="-mx-3 space-y-3">
                                                    {admin.map((team) => (
                                                        <li key={team.name}>
                                                            <a
                                                                href={team.href}
                                                                className={classNames(
                                                                    team.current
                                                                        ? 'text-gray-900 bg-gray-200 dark:bg-zinc-800'
                                                                        : 'text-gray-400 hover:text-white hover:bg-gray-900',
                                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]'
                                                                )}
                                                            >
                          <span
                              className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium  group-hover:text-white">
                            {team.initial}
                          </span>
                                                                <span
                                                                    className="mt-[2px]">{team.name}</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        )}
                                        {roles && (roles.includes("god")) && (

                                            <li>
                                                <div className="text-xs  leading-6 text-rose-400 my-3"> DEBUG                                                   Settings
                                                </div>
                                                <ul role="list" className="-mx-3 space-y-3">
                                                    {debug.map((team) => (
                                                        <li key={team.name}>
                                                            <a
                                                                onClick={() => setOpen(true)}

                                                                className={classNames(
                                                                    team.current
                                                                        ? 'text-rose-900 bg-rose-200'
                                                                        : 'text-rose-400 hover:text-white hover:bg-rose-900',
                                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]'
                                                                )}
                                                            >
                          <span
                              className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium  group-hover:text-white">
                            {team.initial}
                          </span>
                                                                <span
                                                                    className="mt-[2px]">{team.name}</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        )}
                                        <li className="-mx-6 mt-auto">
                                            <div className="mt-auto p-6 text-sm text-gray-500 dark:text-dark-txt">

                                                <a href="/terms.html">Terms</a>

                                               <br/>
                                                <span>Bhive © 2024</span>
                                            </div>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <div className="">
                            <div className="sticky top-[62px] z-40 lg:mx-auto hidden">
                                <div
                                  className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white dark:bg-gray-50 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                                    <button
                                      type="button"
                                        className="-m-2.5 p-2.5 text-gray-700 dark:text-white lg:hidden"
                                        onClick={() => setSidebarOpen(true)}
                                    >
                                        <span className="sr-only">Open sidebar</span>
                                        <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                                    </button>

                                    {/* Separator */}
                                    <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true"/>

                                    <div className="px-4 flex flex-1 gap-x-4 self-stretch lg:gap-x-6">

                                        <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
                                            <img src={community && community.community?.logo}
                                                 className="sm:mx-auto h-9 py-1"/>
                                            {/* Separator */}


                                        </div>


                                    </div>
                                </div>
                            </div>

                            <main className="lg:ml-72 py-10 bg dark:bg-zinc-950">
                                <div className="w-full ">
                                    <div className="flex justify-center -mt-8 mb-10">
                                        <img src={community && community.community?.logo}
                                             className="sm:mx-auto md:hidden sm:block h-9 rounded-xs dark:invert"/>
                                    </div></div>
                                        {
                                            community?.community?.private && community?.user?.notjoined ? (
                                              <Join text={community.community.desc} logo={community.community.logo}/>
                                            ) : (
                                              Children.map(children, child => {
                                                  // @ts-ignore
                                                  return React.cloneElement(child, {roles, setRoles});
                                              })
                                            )
                                        }
                            </main>


                        </div>
                    </div>
                    <>
                        {community && community.community?.published !== true && roles && (roles.includes("admin") || roles.includes("moderator")) && (
                            <div className="fixed inset-x-0 bottom-0 z-[100]">
                                <div
                                    className="flex items-center gap-x-6 bg-indigo-700 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                                    <p className="text-sm leading-6 text-white">
                                        <a href="#">

                                            Your website is currently unpublished and can only be viewed by
                                            administrators.

                                        </a>
                                    </p>
                                    <div className="flex flex-1 justify-end">
                                        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
                                            <span className="sr-only">Dismiss</span>
                                            <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                </>
            )}
            {community && community.community?.published == false && isadmin == false && (

                <>

                    <form name="myForm" id="myForm" className="flex min-h-screen items-center justify-center">
                        <div className="min-h-1/2 bg-gray-900  border border-gray-900 rounded-2xl shadow shadow-lg p-3">
                            <div
                                className="mx-4 sm:mx-24 md:mx-34 lg:mx-56 mx-auto  flex items-center space-y-4 py-16  text-white flex-col">
                                <PickaxeIcon/>

                                <h1 className="text-white text-2xl">This Community is currently Unpublished</h1>


                                <p>
                                    Check back soon
                                </p>
                            </div>
                        </div>
                    </form>


                </>)}
            {locked && (
                <>

                    <form name="myForm" id="myForm" className="flex min-h-screen items-center justify-center">
                        <div className="min-h-1/2 bg-gray-900  border border-gray-900 rounded-2xl shadow shadow-lg p-3">
                            <div
                                className="mx-4 sm:mx-24 md:mx-34 lg:mx-56 mx-auto  flex items-center space-y-4 py-16  text-red-500 flex-col">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="size-11">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"/>
                                </svg>

                                <h1 className="text-white text-2xl">Community is protected</h1>

                                <input
                                    className="w-full p-2 bg-gray-900 rounded-md border border-gray-700 text-center"
                                    placeholder="Access Code"
                                    type="password"
                                    name="code"
                                    id=""
                                />
                                <button
                                    className="w-full p-2 bg-gray-50 rounded-full text-gray-900 border border-gray-700 "
                                    type="submit"

                                >Unlock
                                </button>
                                <p>

                                </p>
                            </div>
                        </div>
                    </form>


                </>)}



            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-[999999999]" initialFocus={cancelButtonRef} onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Debug panel
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    <div className="debug-panel mt-10">
                                                        <div className="debug-info">
                                                            <div className="p-4">
                                                                <label htmlFor="theme-select"
                                                                       className="block mb-2 text-lg font-semibold">
                                                                    Choose Theme:
                                                                </label>
                                                                <select
                                                                    id="theme-select"
                                                                    value={theme}
                                                                    onChange={handleThemeChange}
                                                                    className="p-2 border rounded"
                                                                >
                                                                    {themes.map((themeOption) => (
                                                                        <option key={themeOption} value={themeOption}>
                                                                            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <ul>
                                                                <li>
                                                                    <strong>Community:</strong> {JSON.stringify(community, null, 2)}
                                                                </li>
                                                                <li><strong>Locked:</strong> {locked ? 'true' : 'false'}
                                                                </li>
                                                                <li><strong>Is
                                                                    Admin:</strong> {isadmin ? 'true' : 'false'}</li>
                                                                <li>
                                                                    <strong>Published:</strong> {community?.community?.published ? 'true' : 'false'}
                                                                </li>
                                                                <li><strong>Should
                                                                    Render:</strong> {shouldRender ? 'true' : 'false'}
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        {/* Conditional rendering based on the debug information */}
                                                        {shouldRender && (
                                                            <div className="render-content">
                                                                {/* Your content here */}
                                                                <p>The component is rendered based on the provided
                                                                    conditions.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>


        </>


    );
};

export default ApplicationLayout;
