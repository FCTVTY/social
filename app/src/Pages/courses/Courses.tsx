import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BriefcaseIcon,
  CheckIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/16/solid";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Editor, RawDraftContentState } from "draft-js";

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
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import moment from "moment";
import { date } from "zod";
import {
  ChevronUpIcon,
  PencilLineIcon,
  TicketPlus,
  Trash2,
} from "lucide-react";
import { json, Link } from "react-router-dom";
import EventItem from "./Eventitem";
import Button from "../../components/Button";
import * as minio from "minio";
import mc from "../../lib/utils/mc";
import { Types } from "mongoose";
import { Buffer } from "buffer/";
import { LoadingButton } from "../../components/LoadingButton";
import RTEditor from "../../components/Editor/RTEditor";
import { getContentHTML } from "../../components/Editor/Renderer/rendererFunctions";
import ReactQuill, { Quill } from "react-quill";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import { toast } from "react-toastify";
window.Buffer = Buffer;

interface HomeProps {
  host?: string;
  channel?: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CoursesPage({
  host,
  channel,
  roles,
  setRoles,
}: HomeProps) {
  const [posts, setPosts] = useState<Courses[]>([]);
  const [community, setCommunity] = useState<CommunityCollection>();
  const [open, setOpen] = useState(false);
  const [groupedCourses, setGroupedCourses] = useState<{
    [key: string]: Courses[];
  }>({});

  const [courseData, setCourseData] = useState<Courses>({
    _id: "",
    name: "",
    community: "",
    desc: "",
    featured: false,
    media: "",
    hours: "",
    chapters: [],
    files: [],
  });
  useEffect(() => {
    if (host) {
      fetchDetails();
    }
  }, [host, channel]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDetails = async () => {
    try {
      // Fetch community details
      const communityResponse = await fetch(
        `${getApiDomain()}/community?name=${host}`,
      );
      if (!communityResponse.ok) {
        throw new Error("Network response was not ok for community fetch");
      }
      const communityData = await communityResponse.json();
      setCommunity(communityData);

      let page = 1;
      let allCourses = [];
      let postsData;
      let limit = 10;

      // Fetch courses and continue polling until no more courses
      do {
        const postsResponse = await fetch(
          `${getApiDomain()}/community/courses?oid=${communityData.community.id}&page=${page}&limit=${limit}`,
        );
        if (!postsResponse.ok) {
          throw new Error("Network response was not ok for courses fetch");
        }
        postsData = await postsResponse.json();

        if (postsData !== null) {
          allCourses = [...allCourses, ...postsData];
          setPosts(allCourses);
          groupCoursesByCategory(allCourses);
          page++;
        }
      } while (postsData !== null); // Continue fetching while data is not null

      // Set posts and group by category once all pages are fetched
      setPosts(allCourses);
      groupCoursesByCategory(allCourses);
      setLoading(false);
      toast.success("Courses loaded");
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  const groupCoursesByCategory = (courses: Courses[]) => {
    const grouped = courses.reduce(
      (acc, course) => {
        const category = course.category || "Uncategorised";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(course);
        return acc;
      },
      {} as { [key: string]: Courses[] },
    );

    setGroupedCourses(grouped);
  };

  const handleRefresh = () => {
    if (channel) {
      fetchDetails();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };
  const handleImageCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      setCourseData((prevState) => ({
        ...prevState,
        media: base64String,
      }));
      // @ts-ignore
      //setSelectedImage(base64String)
    };

    reader.readAsDataURL(file);
  };

  const handleAddChapter = () => {
    setCourseData({
      ...courseData,
      chapters: [
        ...courseData.chapters,
        { _id: "", name: "", status: "", videourl: "", image: "", text: "" },
      ],
    });
  };
  const RemoveChapter = (index) => {
    setCourseData({
      ...courseData,
      chapters: courseData.chapters.filter((_, i) => i !== index),
    });
  };
  const RemoveFile = (index) => {
    setCourseData({
      ...courseData,
      files: courseData.files.filter((_, i) => i !== index),
    });
  };

  const handleChapterChange = (index, e) => {
    const { name, value } = e.target;
    const updatedChapters = courseData.chapters.map((chapter, idx) =>
      idx === index ? { ...chapter, [name]: value } : chapter,
    );
    setCourseData({ ...courseData, chapters: updatedChapters });
  };
  const handleChapterTextChange = (content, delta, source, editor, index) => {
    console.log("HTML Content:", index);
    const htmlContent = content;
    const updatedChapters = courseData.chapters.map((chapter, idx) =>
      idx === parseInt(index) ? { ...chapter, text: htmlContent } : chapter,
    );
    console.log(updatedChapters);
    setCourseData({ ...courseData, chapters: updatedChapters });
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
    setCourseData({
      ...courseData,
      files: [
        ...courseData.files,
        { url: "", name: "", logo: "", fileExt: "" },
      ],
    });
  };

  const handleFileCatChange = (index, e) => {
    const { name, value } = e.target;
    const updatedfile = courseData.files.map((file, idx) =>
      idx === index ? { ...file, [name]: value } : file,
    );
    setCourseData({ ...courseData, files: updatedfile });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(courseData);
    // Submit form data to your backend
  };
  const handleDescChange = (content, delta, source, editor) => {
    console.log("HTML Content:", content);

    setCourseData({ ...courseData, desc: content });
  };

  const chandleSubmit = async () => {
    // @ts-ignore
    courseData.community = community?.community.id.toString();

    console.log(courseData.desc);
    // @ts-ignore
    setLoading(true);
    // Handle form submission, e.g., send postData to an API
    console.log(courseData);
    await axios.post(
      `${getApiDomain()}/community/createcourse`,
      courseData,
      {},
    );
    setOpen(false);
    window.location.reload();
  };

  const [openIndex, setOpenIndex] = useState(groupedCourses[0]);
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 text-center mb-3 ">
          <div className="min-w-0 flex-1">
            <h2 className="mt-2 text-3xl leading-7 tracking-wider text-sky-950 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
              <span className="hidden lg:inline">
                {" "}
                {community?.community?.name}
              </span>{" "}
              Courses
            </h2>
          </div>
          <div className=" absolute right-5 mt-5 flex lg:ml-4 lg:mt-0">
            <span className="sm:ml-3">
              {community && community.community?.create && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="hidden md:inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <CalendarIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  Create
                </button>
              )}
              {roles &&
                (roles.includes("admin") || roles.includes("moderator")) && (
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="hidden md:inline-flex items-center rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <CalendarIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Create
                  </button>
                )}
            </span>
          </div>
        </div>

        {posts &&
          posts
            .filter((post) => post.featured)
            .map((product) => (
              <div className="bg-white dark:bg-gray-900 shadow rounded-xl">
                <section
                  aria-labelledby="features-heading"
                  className="relative"
                >
                  <div className="overflow-hidden aspect-square	 rounded-l-lg sm:rounded-lg  lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-16">
                    <div className="badge badge-neutral absolute top-[10px] left-[10px]">
                      FEATURED
                    </div>

                    <img
                      src={product.media}
                      alt="Black leather journal with silver steel disc binding resting on wooden shelf with machined steel pen."
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>

                  <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 sm:pb-10 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:pt-15">
                    <div className="lg:col-start-2">
                      <h2
                        id="features-heading"
                        className="font-medium text-cyan-900 dark:text-white"
                      >
                        Course of the month
                      </h2>
                      <p className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-400 dark:text-white">
                        {product.name}
                      </p>
                      <p
                        className="mt-4 text-gray-900 dark:text-gray-400"
                        dangerouslySetInnerHTML={{ __html: product.desc }}
                      ></p>

                      <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="font-medium text-gray-900 dark:text-gray-400 dark:text-white">
                            Course length: {product.hours}
                          </dt>
                          <dd className="mt-4 text-gray-900 dark:text-gray-400">
                            <Link
                              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              to={`/course/${product.name.replace(/ /g, "_")}`}
                            >
                              View
                            </Link>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </section>
              </div>
            ))}
        {loading && (
          <div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
            <div className="flex justify-center items-center mt-[50vh]">
              <div
                role="status"
                className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
              >
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-800"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        )}
        <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl bg-white dark:bg-gray-900 shadow rounded-xl mt-10">
          {Object.keys(groupedCourses).map((category) => (
            <div key={category} className="mb-10">
              <Disclosure
                as="div"
                key={category}
                defaultOpen={category === openIndex}
                className="p-6"
              >
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900 dark:text-gray-400 dark:text-white">
                        <span className="text-base font-semibold leading-7">
                          {category || "All"}{" "}
                        </span>
                        <span className="flex h-7 items-center">
                          <span className=" indicator-item badge badge-primary text-white">
                            {groupedCourses[category].length}
                          </span>
                          {open ? (
                            <ChevronUpIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <ChevronDownIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 ">
                      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
                        {groupedCourses[category]
                          .sort((a, b) => a.order - b.order)
                          .map((product) => (
                            <div
                              key={product._id}
                              className="group relative divide-gray-200 rounded-lg bg-white dark:bg-gray-900 shadow"
                            >
                              <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-t-lg">
                                <img
                                  src={product.media}
                                  alt={product.name}
                                  className="object-cover object-center"
                                />
                                <div
                                  className="flex items-end p-4 opacity-0 group-hover:opacity-100"
                                  aria-hidden="true"
                                >
                                  <Link
                                    to={`/course/${product.name.replace(/ /g, "_")}`}
                                    className="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 dark:text-gray-400 backdrop-blur backdrop-filter"
                                  >
                                    View Course
                                  </Link>
                                </div>
                              </div>
                              <div className="mt-2 p-2 flex items-center justify-between space-x-8 text-base font-medium text-gray-900 dark:text-gray-400 dark:text-white">
                                <h3>
                                  <Link
                                    to={`/course/${product.name.replace(/ /g, "_")}`}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className="absolute inset-0 dark:text-white"
                                    />
                                    {product.name}
                                  </Link>
                                </h3>
                                <p className="text-gray-900 dark:text-gray-400 text-sm dark:text-white">
                                  {product.hours}
                                </p>
                              </div>
                              <p
                                className="m-3 text-sm text-gray-900 dark:text-gray-400 dark:text-white"
                                dangerouslySetInnerHTML={{
                                  __html: product.desc,
                                }}
                              ></p>
                            </div>
                          ))}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          ))}
          {posts && posts.length === 0 && (
            <div className="bg-white shadow rounded-xl dark:bg-gray-900 p-6 text-center col-span-3 mx-auto text-gray-900 dark:text-gray-400 dark:text-gray-400 w-full">
              No Courses available.
            </div>
          )}
          {posts == null && (
            <div className="bg-white shadow rounded-xl dark:bg-gray-900 p-6 text-center col-span-3 mx-auto text-gray-900 dark:text-gray-400 dark:text-gray-400 w-full">
              No Courses available.
            </div>
          )}
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
                      <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div className="flex-1">
                          {/* Header */}
                          <div className="bg-gray-50 px-4 py-6 sm:px-6">
                            <div className="flex items-start justify-between space-x-3">
                              <div className="space-y-1">
                                <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-400">
                                  New Course
                                </h2>
                                <p className="text-sm text-gray-900 dark:text-gray-400">
                                  Fill in the information below to create your
                                  new course.
                                </p>
                              </div>
                              <div className="flex h-7 items-center">
                                <button
                                  type="button"
                                  className="text-gray-400 hover:text-gray-900 dark:text-gray-400"
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
                                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
                                >
                                  Course Name
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  value={courseData.name}
                                  onChange={handleChange}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="category"
                                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
                                >
                                  Course Category
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <input
                                  type="text"
                                  name="category"
                                  id="category"
                                  value={courseData.category}
                                  onChange={handleChange}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                            {/* Course Description */}
                            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="desc"
                                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
                                >
                                  Description
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <ReactQuill
                                  theme="snow"
                                  modules={modules}
                                  formats={formats}
                                  value={courseData.desc}
                                  onChange={handleDescChange}
                                />

                                <script></script>
                              </div>
                            </div>

                            {/* Course Hours */}
                            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="hours"
                                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
                                >
                                  Hours
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <input
                                  type="text"
                                  name="hours"
                                  id="hours"
                                  value={courseData.hours}
                                  onChange={handleChange}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                            {/* Course Image */}
                            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <h3 className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-400">
                                  Cover Image
                                </h3>
                              </div>
                              <div className="sm:col-span-2">
                                <div className="flex space-x-2 mb-2">
                                  <label
                                    htmlFor="image-upload"
                                    className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  >
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </label>
                                </div>
                                {courseData.media && (
                                  <img
                                    src={courseData.media}
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
                              <h3 className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-400">
                                Chapters
                              </h3>
                              {courseData.chapters.map((chapter, index) => (
                                <div
                                  key={index}
                                  className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 relative pr-20 pb-10"
                                >
                                  <span
                                    className="absolute top-5 right-5"
                                    onClick={() => RemoveChapter(index)}
                                  >
                                    <Trash2 />
                                  </span>
                                  <div>
                                    <label
                                      htmlFor={`chapter-name-${index}`}
                                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
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
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor={`chapter-videourl-${index}`}
                                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
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
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor={`chapter-image-${index}`}
                                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
                                    >
                                      Or Image
                                    </label>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <div className="flex space-x-2 mb-2">
                                      <label
                                        htmlFor={`chapter-image-${index}`}
                                        className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
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
                              <h3 className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-400">
                                Files
                              </h3>
                              {courseData.files.map((file, index) => (
                                <div
                                  key={index}
                                  className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 relative pr-20 pb-10"
                                >
                                  <span
                                    className="absolute top-5 right-5"
                                    onClick={() => RemoveFile(index)}
                                  >
                                    <Trash2 />
                                  </span>
                                  <div>
                                    <label
                                      htmlFor={`file-name-${index}`}
                                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
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
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    <label className="text-sm">
                                      {file.url}
                                    </label>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`file-name-${index}`}
                                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 sm:mt-1.5"
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
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                onClick={() => setOpen(false)}
                              >
                                Cancel
                              </button>
                              <LoadingButton
                                type="button"
                                onClick={() => chandleSubmit()}
                                variant="default"
                                className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                loading={loading}
                              >
                                {" "}
                                Create
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
    </div>
  );
}
