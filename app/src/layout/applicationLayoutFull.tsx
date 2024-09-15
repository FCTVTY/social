import React, {
  Children,
  Component,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import LogoSquare from "../assets/logo-light.svg";
import LogoSquareDark from "../assets/logo-dark.svg";
import fk from "../assets/FK.svg";
import {
  Combobox,
  Dialog,
  Disclosure,
  Menu,
  Transition,
} from "@headlessui/react";
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
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { getApiDomain } from "../lib/auth/supertokens";
import axios from "axios";
import { any } from "zod";
import {
  BNotfications,
  CommunityCollection,
  Profile,
} from "../interfaces/interfaces";
import Join from "../Pages/home/join";
import { JSX } from "react/jsx-runtime";
import { b } from "vite/dist/node/types.d-aGj9QkWt";
import { themeChange } from "theme-change";
import { NavigationLoadingBar } from "./loader";
import ThemeSwitch from "./themeswitch";
import Cookies from "js-cookie";
import { LoadingButton } from "../components/LoadingButton";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarDaysIcon,
  GraduationCapIcon,
  PickaxeIcon,
  PlusIcon,
  SquareCodeIcon,
  UsersIcon,
  WrenchIcon,
  LogsIcon,
  MessageCircleQuestionIcon,
  ChevronUpIcon,
  Bell,
  BellRing,
  SchoolIcon,
} from "lucide-react";
import Themeswitch from "./themeswitch";
import {
  Dismiss,
  DismissInterface,
  DismissOptions,
  InstanceOptions,
} from "flowbite";
import {
  ActionId,
  ActionImpl,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useKBar,
  useMatches,
} from "kbar";
import KeyboardShortcut from "../hooks/keyboard";
import { LifebuoyIcon, PencilSquareIcon } from "@heroicons/react/16/solid";
import { toast, ToastContainer } from "react-toastify";

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
  children: React.ReactNode;
  host?: string;
  channel?: string;
  isChanelPage?: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function Notfications() {
  const [notifications, setNotifications] = useState<BNotfications[]>();

  //get all notifications
  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(`${getApiDomain()}/notifications`);
      setNotifications(response.data);
      const profileresponse = await axios.get(`${getApiDomain()}/profile`);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };
  return (
    <div className="mx-2">
      <div className="dropdown dropdown-bottom dropdown-end">
        <div className="indicator">
          {notifications &&
            notifications.some((notification) => !notification.viewed) && (
              <span className="indicator-item badge badge-primary"></span>
            )}
          <label tabIndex={0} className="btn btn-circle btn-ghost btn-sm">
            {/* Render Bell if there are any notifications */}

            <Bell />
          </label>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-white dark:bg-gray-900 rounded-box card card-compact m-1 w-96 p-3 shadow-xl"
          role="menu"
        >
          <div className="flex items-center justify-between px-2">
            <p className="text-base font-medium">Notifications</p>
            <button className="btn gap-2 btn-sm btn-circle btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                fontSize={16}
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 6L6 18M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-3 ">
            {notifications &&
              notifications.map((notification) => (
                <Link
                  to={`/s/${notification.channel}/${notification.postid}`}
                  key={notification._id}
                  className="my-0.5 flex cursor-pointer items-center gap-3 rounded-box p-1.5 transition-all hover:bg-base-content/5 active:scale-[.98]"
                >
                  <div className="grow">
                    <p className="text-sm">
                      {notification.viewed == false && (
                        <span className="text-red-500">New </span>
                      )}
                      You have been tagged in a{" "}
                      {notification.comment == true && <>comment</>}
                      {notification.comment == false && <>post</>}
                    </p>
                    <span
                      className="text-xs text-base-content/60"
                      // You may want to customize this href
                    >
                      Click to view
                    </span>
                  </div>
                </Link>
              ))}
            {notifications === null && (
              <div className=" px-3 text-center">
                <p className="text-xs  text-base-content/80">
                  No New Notifications
                </p>
              </div>
            )}
          </div>

          <hr className="-mx-2 mt-2 border-base-content/10" />
          <div className="hidden flex items-center justify-between pt-2">
            <button className="btn text-primary hover:bg-primary/10 btn-sm btn-ghost">
              View All
            </button>
            <button className="btn text-base-content/80 hover:bg-base-content/10 btn-sm btn-ghost">
              Mark as read
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
}

const ApplicationLayoutFull: React.FC<Props> = ({
  children,
  host,
  channel,
  isChanelPage = false,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [community, setCommunity] = useState<Partial<CommunityCollection>>();
  const [profile, setProfile] = useState<Partial<Profile>>();
  const [locked, setLocked] = useState(false);
  const [isadmin, setAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(useLocation().pathname);
  const cancelButtonRef = useRef(null);
  const location = useLocation();
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);

  useEffect(() => {
    setUrl(location.pathname);
  }, [location]);
  // This gives you the path of the current URL
  const teams: TeamItem[] = [
    {
      id: 1,
      name: "Academy",
      href: "/Academy",
      initial: <GraduationCapIcon />,
      current: "/Academy" == url,
    },
    {
      id: 2,
      name: "Resources",
      href: "/Resources",
      initial: <SquareCodeIcon />,
      current: "/Resources" == url,
    },
    {
      id: 3,
      name: "Events",
      href: "/events/upcoming",
      initial: <CalendarDaysIcon />,
      current: "/events/upcoming" == url,
    },
    {
      id: 4,
      name: "Members",
      href: "/members/list",
      initial: <UsersIcon />,
      current: "/members/list" == url,
    },
    {
      id: 5,
      name: "Changelog",
      href: "/changelog",
      initial: <LogsIcon />,
      current: "/changelog" == url,
    },
    {
      id: 6,
      name: "FAQ",
      href: "/FAQ",
      initial: <MessageCircleQuestionIcon />,
      current: "/FAQ" == url,
    },
  ];
  const admin: TeamItem[] = [
    {
      id: 1,
      name: "Site Settings",
      href: "/admin/site",
      initial: <WrenchIcon />,
      current: "/admin/site" == url,
    },
    {
      id: 1,
      name: "Academy Management",
      href: "/AcademyManagement",
      initial: <SchoolIcon />,
      current: "/AcademyManagement" == url,
    },
  ];
  const debug: TeamItem[] = [
    {
      id: 1,
      name: "DEBUG",
      href: "/admin/site",
      initial: <WrenchIcon />,
      current: "/Academy" == url,
    },
  ];
  const userNavigation: UserNavigationItem[] = [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#" },
  ];
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchDetails();
  }, [host]);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${getApiDomain()}/community?name=${host}`,
      );
      setCommunity(response.data);
      const profileresponse = await axios.get(`${getApiDomain()}/profile`);

      setProfile(profileresponse.data);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  useEffect(() => {
    if (community && community.channels) {
      console.log("loading" + channel);
      if (channel === undefined && isChanelPage) {
        axios
          .post(`${getApiDomain()}/join?id=` + community.community?.id)
          .then(
            window.location.assign(
              "/s/" + community.channels[0].id + "?loggedin=true",
            ),
          );
      }

      const channelNavigation = community.channels.map((channel) => ({
        name: channel.name,
        href: `/s/${channel.name}`, // Update with appropriate channel ID or URL
        icon: ChartPieIcon, // Update with appropriate icon
        current: `/s/${channel.name}` === url, // Set current to true if the URL matches
      }));

      setNavigation((prevNavigation) => [...channelNavigation]);
    }
  }, [community, url]);

  useEffect(() => {
    rolesData();
  }, []);

  const rolesData = async () => {
    let response = await axios.get(`${getApiDomain()}/user/roles`);
    setRoles(response.data);
  };
  var home = false;
  if (url == "/s/" + community?.channels[0].id) {
    home = true;
  }

  useEffect(() => {
    themeChange(false);

    setLocked(community?.community?.private);

    //check cookie...

    let cookie = Cookies.get(community?.community?.id);

    if (cookie == community?.community?.access) {
      setLocked(false);
    }
  }, [community?.community?.name]);

  const locationu = useLocation();

  // Extract the query string parameters
  const queryParams = new URLSearchParams(locationu.search);

  // Get specific values from the query string
  const code = queryParams.get("code");
  const loggedin = queryParams.get("loggedin");
  useEffect(() => {
    themeChange(false);
    if (loggedin) {
      toast("Logged in ...");
    }
    setLocked(community?.community?.private);

    //check cookie...

    let cookie = Cookies.get(community?.community?.id);

    if (cookie == community?.community?.access) {
      setLocked(false);
      Cookies.set(community?.community?.id, community?.community?.access, {
        expires: 365,
      });
    }
  }, [community?.community?.name]);

  useEffect(() => {
    themeChange(false);

    if (code != null) {
      setLocked(community?.community?.private);

      //check cookie...

      let cookie = Cookies.get(community?.community?.id);

      if (code == community?.community?.access) {
        setLocked(false);
        Cookies.set(community?.community?.id, code, { expires: 365 });
      }
    }
  }, [community?.community?.name, code]);

  useEffect(() => {
    setAdmin(roles.includes("admin") || roles.includes("moderator"));
  }, [roles]);
  const shouldRender =
    (community &&
      locked === false &&
      community.community?.published === true) ||
    (community && community.community?.published === false && isadmin);

  // List of available DaisyUI themes
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
  ];

  // State to hold the currently selected theme
  const [theme, setTheme] = useState("light");

  // Function to handle theme change
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
    const htmlSelector = document.querySelector("html");

    htmlSelector.setAttribute("data-theme", event.target.value);
  };
  const visibleTeams = teams.slice(0, 4);
  const hiddenTeams = teams.slice(4);
  const [isOpen, setIsOpen] = useState(false);
  // target element that will be dismissed
  const $targetEl: HTMLElement = document.getElementById("toast-loggedin");

  // optional trigger element
  const $triggerEl: HTMLElement = document.getElementById("toast-loggedin");

  // options object
  const options: DismissOptions = {
    transition: "transition-opacity",
    duration: 1000,
    timing: "ease-out",

    // callback functions
    onHide: (context, targetEl) => {
      console.log("element has been dismissed");
      console.log(targetEl);
    },
  };

  // instance options object
  const instanceOptions: InstanceOptions = {
    id: "targetElement",
    override: true,
  };

  /*
   * $targetEl (required)
   * $triggerEl (optional)
   * options (optional)
   * instanceOptions (optional)
   */
  const dismiss: DismissInterface = new Dismiss(
    $targetEl,
    $triggerEl,
    options,
    instanceOptions,
  );
  //dismiss.hide();
  function delayedGreeting() {
    dismiss.hide();
  }

  // Set a timer to execute the delayedGreeting function after 2000 milliseconds
  setTimeout(delayedGreeting, 2000);

  const [query, setQuery] = useState("");
  const [kopen, setKOpen] = useState(false);

  const actions = [
    {
      id: 1,
      name: "Text",
      description: "Add freeform text with basic formatting options.",
      url: "#",
      color: "bg-indigo-500",
      icon: PencilSquareIcon,
    },
  ];

  const filteredItems =
    query === ""
      ? []
      : navigation.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });
  const handleShortcutTrigger = () => {
    setKOpen(true);
  };
  // @ts-ignore
  return (
    <>
      <KeyboardShortcut onTrigger={handleShortcutTrigger} />
      <Transition.Root
        show={kopen}
        as={Fragment}
        afterLeave={() => setQuery("")}
        appear
      >
        <Dialog as="div" className="relative z-[999999999]" onClose={setKOpen}>
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

          <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <Combobox onChange={(item) => (window.location = item.url)}>
                  <div className="relative">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Combobox.Input
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Search..."
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>

                  {filteredItems.length > 0 && (
                    <Combobox.Options
                      static
                      className="max-h-96 scroll-py-3 overflow-y-auto p-3"
                    >
                      {filteredItems.map((item) => (
                        <Combobox.Option
                          key={item.id}
                          value={item}
                          className={({ active }) =>
                            classNames(
                              "flex cursor-default select-none rounded-xl p-3",
                              active && "bg-gray-100",
                            )
                          }
                        >
                          {({ active }) => (
                            <>
                              <div
                                className={classNames(
                                  "flex h-10 w-10 flex-none items-center justify-center rounded-lg",
                                  item.color,
                                )}
                              >
                                <item.icon
                                  className="h-6 w-6 text-white"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="ml-4 flex-auto">
                                <p
                                  className={classNames(
                                    "text-sm font-medium",
                                    active ? "text-gray-900" : "text-gray-700",
                                  )}
                                >
                                  {item.name}
                                </p>
                              </div>
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}
                  {query === "?" && (
                    <div className="px-6 py-14 text-center text-sm sm:px-14">
                      <LifebuoyIcon
                        className="mx-auto h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                      <p className="mt-4 font-semibold text-gray-900">
                        Help with searching
                      </p>
                      <p className="mt-2 text-gray-500">
                        Use this tool to quickly search for users and projects
                        across our entire platform. You can also use the search
                        modifiers found in the footer below to limit the results
                        to just users or projects.
                      </p>
                    </div>
                  )}

                  {query !== "" && filteredItems.length === 0 && (
                    <div className="px-6 py-14 text-center text-sm sm:px-14">
                      <ExclamationTriangleIcon
                        className="mx-auto h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                      <p className="mt-4 font-semibold text-gray-900">
                        No results found
                      </p>
                      <p className="mt-2 text-gray-500">
                        We couldn’t find anything with that term. Please try
                        again.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center bg-gray-50 px-4 py-2.5 text-xs text-gray-700">
                    Type{" "}
                    <kbd
                      className={classNames(
                        "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2",
                        query.startsWith("#")
                          ? "border-indigo-600 text-indigo-600"
                          : "border-gray-400 text-gray-900",
                      )}
                    >
                      #
                    </kbd>{" "}
                    <span className="sm:hidden">for spaces,</span>
                    <span className="hidden sm:inline">to access spaces,</span>
                    <kbd
                      className={classNames(
                        "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2",
                        query.startsWith(">")
                          ? "border-indigo-600 text-indigo-600"
                          : "border-gray-400 text-gray-900",
                      )}
                    >
                      &gt;
                    </kbd>{" "}
                    for users, and{" "}
                    <kbd
                      className={classNames(
                        "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2",
                        query === "?"
                          ? "border-indigo-600 text-indigo-600"
                          : "border-gray-400 text-gray-900",
                      )}
                    >
                      ?
                    </kbd>{" "}
                    for help.
                  </div>
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {shouldRender && (
        <div className="w-full mx-auto">
          <ToastContainer />

          <Disclosure
            as="nav"
            className={`overscroll-none sticky top-0 z-50  ${community && community.community?.published ? "bg-gray-50 dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-900"} `}
          >
            {({ open }) => (
              <>
                <div className="mx-auto px-2 sm:px-6 lg:px-8">
                  <div className="relative flex h-16 justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                      {/* Mobile menu button */}
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start w-32">
                      <div className="flex flex-shrink-0 items-center ">
                        <button
                          type="button"
                          className="m-2.5 -ml-2.5 p-2.5 text-gray-700 lg:hidden"
                          onClick={() => setSidebarOpen(true)}
                        >
                          <span className="sr-only">Open sidebar</span>
                          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        <img
                          src={community && community.community?.logo}
                          className="sm:mx-auto hidden md:block h-9 rounded-xs dark:hidden"
                        />
                        <img
                          src={
                            (community && community.community?.dLogo) ||
                            (community && community.community?.logo)
                          }
                          className="sm:mx-auto hidden  h-9 rounded-xs dark:block sm:hidden"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start w-32">
                      <div className="flex flex-shrink-0 items-center "></div>
                    </div>
                    <div className="absolute inset-y-0 right-0 justify-content-end flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                      <Themeswitch></Themeswitch>
                      <Notfications />

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/profile/${profile?._id}`}
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 dark:bg-gray-800 dark:text-white"
                                      : "",
                                    "block px-4 py-2 text-sm text-gray-700",
                                  )}
                                >
                                  Your Profile
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/settings`}
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 dark:bg-gray-800 dark:text-white"
                                      : "",
                                    "block px-4 py-2 text-sm text-gray-700",
                                  )}
                                >
                                  Settings
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/auth"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 dark:bg-gray-800 dark:text-white"
                                      : "",
                                    "block px-4 py-2 text-sm text-gray-700",
                                  )}
                                >
                                  Sign out
                                </Link>
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
              <Dialog
                as="div"
                className="relative z-50 lg:hidden"
                onClose={setSidebarOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-white/80" />
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
                          <button
                            type="button"
                            className="-m-2.5 p-2.5"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon
                              className="h-6 w-6 text-black"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </Transition.Child>
                      {/* Sidebar component, swap this element with another sidebar if you like */}
                      <div className="flex grow flex-col gap-y-5 overflow-y-auto  bg-white dark:bg-gray-900 pl-6 lg:mt-[62px]">
                        <nav className="flex flex-1 flex-col mt-2">
                          <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                          >
                            <li>
                              <ul role="list" className="-mx-3 space-y-3">
                                {navigation.map((item) => (
                                  <li key={item.name}>
                                    <Link
                                      to={item.href}
                                      className={classNames(
                                        item.current
                                          ? "text-indigo-600 bg-gray-200 dark:bg-gray-800"
                                          : "text-gray-400 hover:text-white hover:bg-indigo-600",
                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]",
                                      )}
                                    >
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center  text-[0.625rem] font-medium ">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="size-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                          />
                                        </svg>
                                      </span>
                                      <span className="mt-[2px]">
                                        {item.name}
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                            <li>
                              <div className="text-xs  leading-6 text-gray-400 my-3">
                                General
                              </div>
                              <ul role="list" className="-mx-3 space-y-3">
                                {visibleTeams.map((team) => (
                                  <li key={team.name}>
                                    <Link
                                      to={team.href}
                                      className={classNames(
                                        team.current
                                          ? `text-cyan-500 bg-gray-200 dark:bg-gray-800`
                                          : `text-gray-400 hover:text-white hover:bg-cyan-500`,
                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]",
                                      )}
                                    >
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium group-hover:text-white">
                                        {team.initial}
                                      </span>
                                      <span className="mt-[2px]">
                                        {team.name}
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                                {isOpen &&
                                  hiddenTeams.map((team) => (
                                    <li key={team.name}>
                                      <Link
                                        to={team.href}
                                        className={classNames(
                                          team.current
                                            ? `text-cyan-500 bg-gray-200 dark:bg-gray-800`
                                            : `text-gray-400 hover:text-white hover:bg-cyan-500`,
                                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]",
                                        )}
                                      >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium group-hover:text-white">
                                          {team.initial}
                                        </span>
                                        <span className="mt-[2px]">
                                          {team.name}
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                              </ul>
                              {hiddenTeams.length > 0 && (
                                <button
                                  onClick={() => setIsOpen(!isOpen)}
                                  className="mt-4 text-gray-400  text-[0.625rem] font-medium"
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
                              <Link
                                to={`/profile/${profile?._id}`}
                                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6  "
                              >
                                <img
                                  className="h-8 w-8 rounded-full bg-gray-800"
                                  src={profile?.profilePicture}
                                  alt=""
                                />
                                <span className="sr-only">Your profile</span>
                                <span aria-hidden="true">
                                  {profile?.first_name} {profile?.last_name}
                                </span>
                              </Link>
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
            <div className="">
              <div className="sticky top-[62px] z-40 lg:mx-auto hidden">
                <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white dark:bg-gray-50 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-700 dark:text-white lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Separator */}
                  <div
                    className="h-6 w-px bg-gray-200 lg:hidden"
                    aria-hidden="true"
                  />

                  <div className="px-4 flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
                      <img
                        src={community && community.community?.logo}
                        className="sm:mx-auto h-9 py-1"
                      />
                      {/* Separator */}
                    </div>
                  </div>
                </div>
              </div>

              <main className=" py-10 bg dark:bg-gray-900">
                <div className="w-full ">
                  <div className="flex justify-center -mt-8 mb-10">
                    <img
                      src={community && community.community?.logo}
                      className="sm:mx-auto md:hidden sm:block h-9 rounded-xs"
                    />
                  </div>
                </div>
                {community?.community?.private && community?.user?.notjoined ? (
                  <Join
                    text={community.community.desc}
                    logo={community.community.logo}
                  />
                ) : (
                  Children.map(children, (child) => {
                    // @ts-ignore
                    return React.cloneElement(child, { roles, setRoles });
                  })
                )}
              </main>
            </div>
          </div>
          <>
            {community &&
              community.community?.published !== true &&
              roles &&
              (roles.includes("admin") || roles.includes("moderator")) && (
                <div className="fixed inset-x-0 bottom-0 z-[100]">
                  <div className="flex items-center gap-x-6 bg-indigo-700 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                    <p className="text-sm leading-6 text-white">
                      <a href="#">
                        Your website is currently unpublished and can only be
                        viewed by administrators.
                      </a>
                    </p>
                    <div className="flex flex-1 justify-end">
                      <button
                        type="button"
                        className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
                      >
                        <span className="sr-only">Dismiss</span>
                        <XMarkIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </>
        </div>
      )}
      {community &&
        community.community?.published == false &&
        isadmin == false && (
          <>
            <form
              name="myForm"
              id="myForm"
              className="flex min-h-screen items-center justify-center"
            >
              <div className="min-h-1/2 bg-gray-900  border border-gray-900 rounded-2xl shadow shadow-lg p-3">
                <div className="mx-4 sm:mx-24 md:mx-34 lg:mx-56 mx-auto  flex items-center space-y-4 py-16  text-white flex-col">
                  <PickaxeIcon />

                  <h1 className="text-white text-2xl">
                    This Community is currently Unpublished
                  </h1>

                  <p>Check back soon</p>
                </div>
              </div>
            </form>
          </>
        )}
      {locked && (
        <>
          <form
            name="myForm"
            id="myForm"
            className="flex min-h-screen items-center justify-center"
          >
            <div className="min-h-1/2 bg-gray-900  border border-gray-900 rounded-2xl shadow shadow-lg p-3">
              <div className="mx-4 sm:mx-24 md:mx-34 lg:mx-56 mx-auto  flex items-center space-y-4 py-16  text-red-500 flex-col">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-11"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                  />
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
                >
                  Unlock
                </button>
                <p></p>
              </div>
            </div>
          </form>
        </>
      )}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999999999]"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
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
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Debug panel
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          <div className="debug-panel mt-10">
                            <div className="debug-info">
                              <div className="p-4">
                                <label
                                  htmlFor="theme-select"
                                  className="block mb-2 text-lg font-semibold"
                                >
                                  Choose Theme:
                                </label>
                                <select
                                  id="theme-select"
                                  value={theme}
                                  onChange={handleThemeChange}
                                  className="p-2 border rounded"
                                >
                                  {themes.map((themeOption) => (
                                    <option
                                      key={themeOption}
                                      value={themeOption}
                                    >
                                      {themeOption.charAt(0).toUpperCase() +
                                        themeOption.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <ul>
                                <li>
                                  <strong>Community:</strong>{" "}
                                  {JSON.stringify(community, null, 2)}
                                </li>
                                <li>
                                  <strong>Locked:</strong>{" "}
                                  {locked ? "true" : "false"}
                                </li>
                                <li>
                                  <strong>Is Admin:</strong>{" "}
                                  {isadmin ? "true" : "false"}
                                </li>
                                <li>
                                  <strong>Published:</strong>{" "}
                                  {community?.community?.published
                                    ? "true"
                                    : "false"}
                                </li>
                                <li>
                                  <strong>Should Render:</strong>{" "}
                                  {shouldRender ? "true" : "false"}
                                </li>
                              </ul>
                            </div>

                            {/* Conditional rendering based on the debug information */}
                            {shouldRender && (
                              <div className="render-content">
                                {/* Your content here */}
                                <p>
                                  The component is rendered based on the
                                  provided conditions.
                                </p>
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
function CommandBar() {
  return (
    <KBarPortal>
      <KBarPositioner className="p-2 bg-gray-900/80 flex items-center">
        <KBarAnimator className=" w-full w-max-[600px] overflow-hidden p-2 bg-white rounded-xl z-[999999999999]">
          <KBarSearch className="flex px-4 w-full h-16 outline-none" />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

function CommandButton() {
  const { query } = useKBar();
  return (
    <button
      onClick={query.toggle}
      className="flex items-center justify-center w-12 h-12 mr-4 bg-white border border-gray-200 rounded-lg dark:border dark:border-gray-700 dark:bg-gray-800 general-ring-state"
    >
      <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M14.333 1a2.667 2.667 0 0 0-2.666 2.667v10.666a2.667 2.667 0 1 0 2.666-2.666H3.667a2.667 2.667 0 1 0 2.666 2.666V3.667a2.667 2.667 0 1 0-2.666 2.666h10.666a2.667 2.667 0 0 0 0-5.333Z"
        />
      </svg>
    </button>
  );
}

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 pt-4 pb-2 font-medium text-gray-400 uppercase ">
            {item}
          </div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
        )
      }
    />
  );
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId,
      );
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        className={`${
          active
            ? "bg-blue-400  rounded-lg text-gray-100 "
            : "transparent text-gray-500"
        } 'rounded-lg px-4 py-2 flex items-center cursor-pointer justify-between `}
      >
        <div className="flex items-center gap-2 text-base">
          {action.icon && action.icon}
          <div className="flex flex-col">
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span className="mr-4 opacity-50">{ancestor.name}</span>
                    <span className="mr-4">&rsaquo;</span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span className="text-sm">{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div aria-hidden className="grid grid-flow-col gap-2">
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                className={`${
                  active
                    ? "bg-white text-blue-400 "
                    : "bg-gray-200 text-gray-500"
                } ' px-3 py-2 flex rounded-md items-center cursor-pointer justify-between `}
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);

export default ApplicationLayoutFull;
