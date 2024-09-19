import React, { Fragment, useEffect, useState } from "react";
import {
  BriefcaseIcon,
  ChartBarSquareIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/16/solid";
import { Dialog, Menu, Tab, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  Bars3Icon,
  CalendarIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import {
  Community,
  CommunityCollection,
  Post,
  PPosts,
  Profile,
  Channel,
  EventDetails,
  PEvent,
  Courses,
} from "../../interfaces/interfaces";

import axios, { post } from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import moment from "moment";
import { date } from "zod";
import {
  ChevronLeftIcon,
  Minimize2,
  SignalIcon,
  StarIcon,
  TicketPlus,
  Trash2,
} from "lucide-react";
import { json, Link, useParams } from "react-router-dom";
import EventItem from "./Eventitem";
import { ChevronUpDownIcon, ServerIcon } from "@heroicons/react/24/solid";
import { LoadingButton } from "../../components/LoadingButton";
import { Buffer } from "buffer";
import mc from "../../lib/utils/mc";
import ReactQuill from "react-quill";

interface HomeProps {
  host?: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
export default function CoursePage({ host, roles, setRoles }: HomeProps) {
  const [posts, setPosts] = useState<Courses>();
  const [community, setCommunity] = useState<CommunityCollection>();
  const [open, setOpen] = useState(false);
  const [openM, setOpenM] = useState(false);
  const { ID } = useParams(); // Extract the ID parameter from the route
  const [channel, setChannel] = useState(ID); // Set channel using the ID from URL

  useEffect(() => {
    if (host) {
      fetchDetails();
    }
  }, [host, channel]);

  const fetchDetails = async () => {
    try {
      const communityResponse = await fetch(
        `${getApiDomain()}/community?name=${host}`,
      );
      if (!communityResponse.ok) {
        throw new Error("Network response was not ok for community fetch");
      }
      const communityData = await communityResponse.json();
      setCommunity(communityData);

      const postsResponse = await fetch(
        `${getApiDomain()}/community/course?host=${communityData.community.id}&name=${channel}`,
      );
      if (!postsResponse.ok) {
        throw new Error("Network response was not ok for posts fetch");
      }
      const postsData = await postsResponse.json();

      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddChapter = () => {
    setPosts({
      ...posts,
      chapters: [
        ...posts.chapters,
        { _id: "", name: "", status: "", videourl: "", image: "", text: "" },
      ],
    });
  };
  const handleChapterChange = (index, e) => {
    const { name, value } = e.target;
    const updatedChapters = posts.chapters.map((chapter, idx) =>
      idx === index ? { ...chapter, [name]: value } : chapter,
    );
    setPosts({ ...posts, chapters: updatedChapters });
  };
  const handleChapterTextChange = (content, delta, source, editor, index) => {
    const htmlContent = content;
    const updatedChapters = posts.chapters.map((chapter, idx) =>
      idx === parseInt(index) ? { ...chapter, text: htmlContent } : chapter,
    );
    setPosts({ ...posts, chapters: updatedChapters });
  };
  const handleChapterImageChange = (
    index,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      const updatedChapters = courseData.chapters.map((chapter, idx) =>
        idx === index ? { ...chapter, image: base64String } : chapter,
      );
      setCourseData({ ...courseData, chapters: updatedChapters });
      // @ts-ignore
      //setSelectedImage(base64String)
    };

    reader.readAsDataURL(file);
  };

  const handleAddFile = () => {
    setPosts({
      ...posts,
      files: [...posts.files, { url: "", name: "", logo: "", fileExt: "" }],
    });
  };

  const RemoveChapter = (index) => {
    setPosts({
      ...posts,
      chapters: posts.chapters.filter((_, i) => i !== index),
    });
  };
  const RemoveFile = (index) => {
    setPosts({
      ...posts,
      files: posts.files.filter((_, i) => i !== index),
    });
  };

  const handleFileCatChange = (index, e) => {
    const { name, value } = e.target;
    const updatedfile = posts.files.map((file, idx) =>
      idx === index ? { ...file, [name]: value } : file,
    );
    setPosts({ ...posts, files: updatedfile });
  };

  const handleFileChange = async (
    index,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = community?.community.id + "/" + file.name;
    const bucketName = "files";

    // Convert the file to a stream
    var endPoint = "s3.app.bhivecommunity.co.uk";
    var port = 443; // Change this if you use a different port
    const reader = new FileReader();
    const fileStream = file.stream();

    const arrayBuffer = await file.arrayBuffer();

    // Convert the array buffer to a buffer
    const buffer = Buffer.from(arrayBuffer);

    // Upload file to MinIO
    mc.putObject(bucketName, fileName, buffer, file.size, (err, etag) => {
      if (err) {
        console.error("Error uploading file", err);
        return;
      }

      // Get the file URL
      const fileUrl = `https://${endPoint}/${bucketName}/${fileName}`;

      // Update the state with the file URL
      const updatedFiles = courseData.files.map((f, idx) =>
        idx === index ? { ...f, url: fileUrl, name: file.name } : f,
      );

      e.target.value = "";
      e.target.className = "hidden";

      setCourseData({ ...courseData, files: updatedFiles });
    });

    // Update the file name in state
  };
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentChapterIndex < posts?.chapters.length - 1) {
      const updatedChapters = posts?.chapters.map((chapter, index) => {
        if (index === currentChapterIndex) {
          return { ...chapter, status: "complete" };
        }
        return chapter;
      });

      setPosts({ ...posts, chapters: updatedChapters });
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPosts({ ...posts, [name]: value });
  };
  const handleImageCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      setPostData((prevState) => ({
        ...prevState,
        media: base64String,
      }));
      // @ts-ignore
      setSelectedImage(base64String);
    };

    reader.readAsDataURL(file);
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    postData.communites = community?.community;
    // @ts-ignore
    postData.channelstring = community?.channels[0].id;
    const date = new Date();

    postData.date = formatDate(date);
    if (postData.eventDetails?.date) {
      const eventDate = new Date(postData.eventDetails.date);
      postData.eventDetails.date = formatDate(eventDate);
    }
    // Handle form submission, e.g., send postData to an API
    console.log(postData);
    await axios.post(`${getApiDomain()}/community/updatecourse`, postData, {});
    setOpen(false);
    //window.location.reload();
  };
  const handleDescChange = (content, delta, source, editor) => {
    const htmlContent = content;
    console.log("HTML Content:", content);

    setPosts({ ...posts, desc: content });
  };
  const chandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore

    // @ts-ignore
    setLoading(true);
    // Handle form submission, e.g., send postData to an API
    await axios.post(`${getApiDomain()}/community/updatecourse`, posts, {});
    setOpen(false);
    //window.location.reload();
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font",
  ];
  return (
    <>
      {posts && (
        <div className="min-h-screen">
          <div className="sticky">
            {/* Sticky search header */}

            <main className="lg:pr-96 mt-[-10px] dark:bg-gray-900">
              <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div>
                  <h1 className="text-xl">{posts?.name}</h1>
                </div>
                {/* Sort dropdown */}
                <div className="flex place-items-center">
                  <p className="text-sm text-gray-700 mr-5 dark:text-white">
                    Chapter{" "}
                    <span className="font-medium">
                      {currentChapterIndex + 1}
                    </span>{" "}
                    /{" "}
                    <span className="font-medium">{posts.chapters.length}</span>
                  </p>
                  <nav
                    aria-label="Pagination"
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  >
                    <button
                      onClick={handlePrevious}
                      disabled={currentChapterIndex === 0}
                      className="relative inline-flex items-center rounded-l-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={
                        currentChapterIndex === posts.chapters.length - 1
                      }
                      className="relative inline-flex items-center rounded-r-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </button>
                  </nav>
                </div>
              </header>

              {/* Deployment list */}
              <div className="">
                <div className="mx-auto px-4 py-4">
                  {/* Product */}
                  <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
                    {/* Product image */}
                    <div className="lg:col-span-7 lg:row-end-1">
                      <div className=" overflow-hidden rounded-lg">
                        {posts &&
                          posts.chapters[currentChapterIndex].videourl && (
                            <div className="aspect-w-16 aspect-h-9">
                              <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={
                                  posts.chapters[currentChapterIndex].videourl
                                }
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                              ></iframe>
                            </div>
                          )}
                        {posts && posts.chapters[currentChapterIndex].image && (
                          <>
                            <Transition.Root show={openM} as={Fragment}>
                              <Dialog
                                as="div"
                                className="relative z-[99999999]"
                                onClose={setOpenM}
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
                                      <Dialog.Panel className="relative !w-[90vw] transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 ">
                                        <div className="sm:flex sm:items-start">
                                          <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                            <img
                                              className="h-[90vh] !w-[90vw] object-contain "
                                              src={
                                                posts.chapters[
                                                  currentChapterIndex
                                                ].image
                                              }
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                      </Dialog.Panel>
                                    </Transition.Child>
                                  </div>
                                </div>
                              </Dialog>
                            </Transition.Root>

                            <img
                              onClick={() => setOpenM(true)}
                              className="h-48 w-full object-cover lg:h-64"
                              src={posts.chapters[currentChapterIndex].image}
                              alt=""
                            />
                          </>
                        )}

                        {posts && posts.chapters[currentChapterIndex].text && (
                          <p
                            className="text-base m-2 "
                            dangerouslySetInnerHTML={{
                              __html: posts.chapters[currentChapterIndex].text,
                            }}
                          ></p>
                        )}
                      </div>
                    </div>

                    {posts.chapters && posts.chapters.length > 1 && (
                      <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-7 lg:mt-0 lg:max-w-none">
                        <Tab.Group as="div">
                          <div className="border-b border-gray-200">
                            <Tab.List className="-mb-px flex space-x-8">
                              <Tab
                                className={({ selected }) =>
                                  classNames(
                                    selected
                                      ? "border-indigo-600 text-indigo-600"
                                      : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800",
                                    "whitespace-nowrap border-b-2 py-6 text-sm font-medium",
                                  )
                                }
                              >
                                Course Details
                              </Tab>
                            </Tab.List>
                          </div>
                          <Tab.Panels as={Fragment}>
                            <Tab.Panel className="-mb-10">
                              <h3 className="sr-only">Course Details</h3>
                              <p
                                className="text-base mt-10 mb-36"
                                dangerouslySetInnerHTML={{
                                  __html: posts?.desc,
                                }}
                              ></p>
                            </Tab.Panel>
                          </Tab.Panels>
                        </Tab.Group>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>

            {/* Activity feed */}
            <aside className=" p-5 bg-white dark:bg-gray-900 lg:fixed lg:bottom-0 lg:right-0 lg:top-[64px]  lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
              <header className="flex items-center justify-between border-b border-white/5 ">
                <h2 className="text-base font-semibold leading-7 ">
                  {" "}
                  {posts.name}
                </h2>
              </header>
              <div>
                <h4 className="sr-only">Status</h4>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentChapterIndex + 1}/{posts.chapters.length} Completed
                </p>
                <div className="mt-6" aria-hidden="true">
                  <div className="overflow-hidden rounded-full bg-gray-200 dark:bg-gray-400">
                    <div
                      className="h-2 rounded-full bg-gray-900 dark:bg-gray-50"
                      style={{
                        width: `${((currentChapterIndex + 1) / posts.chapters.length) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid"></div>
                </div>
              </div>
              <div className="">
                <nav className="flex" aria-label="Progress">
                  <ol role="list" className="space-y-6">
                    {posts.chapters.map((step) => (
                      <li key={step.name}>
                        {step.status === "complete" ? (
                          <div className="group">
                            <span className="flex items-start">
                              <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                                <CheckCircleIcon
                                  className="h-full w-full text-gray-900 group-hover:text-indigo-800"
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-white">
                                {step.name}
                              </span>
                            </span>
                          </div>
                        ) : step.status === "current" ? (
                          <div className="flex items-start" aria-current="step">
                            <span
                              className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                              aria-hidden="true"
                            >
                              <span className="absolute h-4 w-4 rounded-full bg-indigo-200" />
                              <span className="relative block h-2 w-2 rounded-full bg-gray-900" />
                            </span>
                            <span className="ml-3 text-sm font-medium text-gray-900">
                              {step.name}
                            </span>
                          </div>
                        ) : (
                          <div className="group">
                            <div className="flex items-start">
                              <div
                                className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                                aria-hidden="true"
                              >
                                <div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400" />
                              </div>
                              <p className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-white">
                                {step.name}
                              </p>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              <div className="mt-10 sticky bottom-0">
                <h2 className="text-base font-semibold leading-7 ">
                  Course Files
                </h2>
                <ul role="list" className="divide-y divide-gray-300">
                  {posts.files.map((file) => (
                    <li
                      key={file.url}
                      className="flex items-center justify-between gap-x-6 py-5"
                    >
                      <div className="flex gap-x-4">
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
                            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                          />
                        </svg>

                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                            {file.name}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-white">
                            {file.fileext}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.url}
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                      </a>
                    </li>
                  ))}

                  {roles &&
                    (roles.includes("admin") ||
                      roles.includes("moderator")) && (
                      <li className="flex items-center justify-between gap-x-6 py-5">
                        <h2 className="text-base font-semibold leading-7 ">
                          Moderator Actions
                        </h2>
                        <a
                          className="rounded-md bg-red-500 m-3 mt-10 px-1.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          href={`/removeCourse/${posts._id}`}
                        >
                          Delete Course
                        </a>
                      </li>
                    )}
                  {roles &&
                    (roles.includes("admin") ||
                      roles.includes("moderator")) && (
                      <li className="flex items-center justify-between gap-x-6 py-5">
                        <h2 className="text-base font-semibold leading-7 ">
                          Moderator Actions
                        </h2>

                        <button
                          type="button"
                          onClick={() => setOpen(true)}
                          className="hidden md:inline-flex items-center rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <CalendarIcon
                            className="-ml-0.5 mr-1.5 h-5 w-5"
                            aria-hidden="true"
                          />
                          Update
                        </button>
                      </li>
                    )}
                </ul>
                <div className="flex items-center justify-between gap-x-6 py-5 bottom-0 fixed right-5">
                  <h2 className="text-base font-semibold leading-7 "></h2>

                  <Link
                    to={`/s/Home`}
                    className=" md:inline-flex items-center rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <Minimize2
                      className="-ml-0.5 mr-1.5 h-5 w-5 "
                      aria-hidden="true"
                    />
                    Exit Course
                  </Link>
                </div>
              </div>
            </aside>
          </div>
          <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[99999]" onClose={setOpen}>
              <div className="fixed inset-0" />
              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                    <Transition.Child
                      as={Fragment}
                      enter="transform transition ease-in-out duration-500 sm:duration-700"
                      enterFrom="translate-x-full"
                      enterTo="translate-x-0"
                      leave="transform transition ease-in-out duration-500 sm:duration-700"
                      leaveFrom="translate-x-0"
                      leaveTo="translate-x-full"
                    >
                      <Dialog.Panel className="pointer-events-auto w-screen max-w-7xl">
                        <form
                          className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
                          onSubmit={chandleSubmit}
                        >
                          <div className="flex-1">
                            {/* Header */}
                            <div className="bg-gray-50 px-4 py-6 sm:px-6">
                              <div className="flex items-start justify-between space-x-3">
                                <div className="space-y-1">
                                  <h2 className="text-base font-semibold leading-6 text-gray-900">
                                    Update Course
                                  </h2>
                                </div>
                                <div className="flex h-7 items-center">
                                  <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500"
                                    onClick={() => setOpen(false)}
                                  >
                                    <span className="sr-only">Close panel</span>
                                    <XMarkIcon
                                      className="h-6 w-6"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Divider container */}
                            <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                              {/* Course Name */}
                              <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <div>
                                  <label
                                    htmlFor="name"
                                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                  >
                                    Course Name
                                  </label>
                                </div>
                                <div className="sm:col-span-2">
                                  <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={posts.name}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <div>
                                  <label
                                    htmlFor="category"
                                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                  >
                                    Course Category
                                  </label>
                                </div>
                                <div className="sm:col-span-2">
                                  <input
                                    type="text"
                                    name="category"
                                    id="category"
                                    value={posts.category}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              {/* Course Description */}
                              <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <div>
                                  <label
                                    htmlFor="desc"
                                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                  >
                                    Description
                                  </label>
                                </div>
                                <div className="sm:col-span-2">
                                  <ReactQuill
                                    theme="snow"
                                    modules={modules}
                                    formats={formats}
                                    value={posts.desc}
                                    onChange={handleDescChange}
                                  />
                                </div>
                              </div>

                              {/* Course Hours */}
                              <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <div>
                                  <label
                                    htmlFor="hours"
                                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                  >
                                    Hours
                                  </label>
                                </div>
                                <div className="sm:col-span-2">
                                  <input
                                    type="text"
                                    name="hours"
                                    id="hours"
                                    value={posts.hours}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              {/* Course Image */}
                              <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <div>
                                  <h3 className="text-sm font-medium leading-6 text-gray-900">
                                    Cover Image
                                  </h3>
                                </div>
                                <div className="sm:col-span-2">
                                  <div className="flex space-x-2 mb-2">
                                    <label
                                      htmlFor="image-upload"
                                      className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                      <PlusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </label>
                                  </div>
                                  {posts.media && (
                                    <img
                                      src={posts.media}
                                      alt="Course Cover"
                                      className="w-32 h-32 object-cover"
                                    />
                                  )}
                                </div>
                              </div>
                              <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageCChange}
                              />
                              {/* Chapters */}
                              <div className="space-y-2 px-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <h3 className="text-sm font-medium leading-6 text-gray-900">
                                  Chapters
                                </h3>
                                {posts.chapters.map((chapter, index) => (
                                  <div
                                    key={index}
                                    className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 relative pr-20 pb-10"
                                  >
                                    <button
                                      type="button"
                                      className="absolute top-5 right-5"
                                      onClick={() => RemoveChapter(index)}
                                    >
                                      <Trash2 />
                                    </button>
                                    <div>
                                      <label
                                        htmlFor={`chapter-name-${index}`}
                                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                      >
                                        Chapter Name
                                      </label>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <input
                                        type="text"
                                        name="name"
                                        id={`chapter-name-${index}`}
                                        value={chapter.name}
                                        onChange={(e) =>
                                          handleChapterChange(index, e)
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      />
                                    </div>

                                    <div>
                                      <label
                                        htmlFor={`chapter-videourl-${index}`}
                                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                      >
                                        Video URL
                                      </label>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <input
                                        type="text"
                                        name="videourl"
                                        id={`chapter-videourl-${index}`}
                                        value={chapter.videourl}
                                        onChange={(e) =>
                                          handleChapterChange(index, e)
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      />
                                    </div>

                                    <div>
                                      <label
                                        htmlFor={`chapter-image-${index}`}
                                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                      >
                                        Or Image
                                      </label>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <div className="flex space-x-2 mb-2">
                                        <label
                                          htmlFor={`chapter-image-${index}`}
                                          className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                          <PlusIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </label>
                                      </div>
                                      {chapter.image && (
                                        <img
                                          src={chapter.image}
                                          alt="Course Cover"
                                          className="w-32 h-32 object-cover"
                                        />
                                      )}
                                    </div>

                                    <input
                                      type="file"
                                      id={`chapter-image-${index}`}
                                      accept="image/*"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        handleChapterImageChange(index, e)
                                      }
                                    />
                                    <div>
                                      <label
                                        htmlFor={`chapter-text-${index}`}
                                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                      >
                                        Text
                                      </label>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <ReactQuill
                                        theme="snow"
                                        id={`${index}`}
                                        modules={modules}
                                        formats={formats}
                                        value={chapter.text}
                                        onChange={(
                                          content,
                                          delta,
                                          source,
                                          editor,
                                        ) =>
                                          handleChapterTextChange(
                                            content,
                                            delta,
                                            source,
                                            editor,
                                            index,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={handleAddChapter}
                                  className="mt-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                  Add Chapter
                                </button>
                              </div>
                              {/* Files */}
                              <div className="space-y-2 px-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <h3 className="text-sm font-medium leading-6 text-gray-900">
                                  Files
                                </h3>
                                {posts.files.map((file, index) => (
                                  <div
                                    key={index}
                                    className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 relative pr-20 pb-10"
                                  >
                                    <button
                                      type="button"
                                      className="absolute top-5 right-5"
                                      onClick={() => RemoveFile(index)}
                                    >
                                      <Trash2 />
                                    </button>
                                    <div>
                                      <label
                                        htmlFor={`file-name-${index}`}
                                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                      >
                                        File Name
                                      </label>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <input
                                        type="file"
                                        name="name"
                                        id={`file-name-${index}`}
                                        onChange={(e) =>
                                          handleFileChange(index, e)
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      />
                                      <label className="text-sm">
                                        {file.url}
                                      </label>
                                    </div>
                                    <div>
                                      <label
                                        htmlFor={`file-name-${index}`}
                                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                      >
                                        File Category
                                      </label>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <input
                                        type="text"
                                        name="fileext"
                                        id={`file-fileext-${index}`}
                                        onChange={(e) =>
                                          handleFileCatChange(index, e)
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      />
                                      <label className="text-sm">
                                        {file.url}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={handleAddFile}
                                  className="mt-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                  Add File
                                </button>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                              <div className="flex justify-end space-x-3">
                                <button
                                  type="button"
                                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                  onClick={() => setOpen(false)}
                                >
                                  Cancel
                                </button>
                                <LoadingButton
                                  type="submit"
                                  variant="default"
                                  className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  loading={loading}
                                >
                                  {" "}
                                  Update
                                </LoadingButton>
                              </div>
                            </div>
                          </div>
                        </form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      )}
    </>
  );
}
