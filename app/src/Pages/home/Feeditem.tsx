import React, { Fragment, useEffect, useRef, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { getApiDomain, getWebsiteDomain } from "../../lib/auth/supertokens";
import YouTubeEmbed from "./youtube";
import YouTubeEmbedsmall from "./youtubesmall";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { XMarkIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { BadgeCheck, CakeSlice } from "lucide-react";
import Comment from "./comment";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LinkPreview from "../../components/LinkPreview";

interface PostItemProps {
  lite?: boolean;
}

const PostItem = ({ post, profile, lite, roles, supertokensId, profiles }) => {
  console.log(post._id);
  const [visibility, setVisibility] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const contentEditableRef = useRef(null);

  const [postLikes, setPostLikes] = useState(post.postLikes);
  let userHasLiked = false;
  if (!lite) {
    userHasLiked = postLikes.some(
      (like) => like.userId === profile?.supertokensId,
    );
  }

  const handleLikeClick = async () => {
    let updatedLikes;
    if (userHasLiked) {
      // Remove the like
      updatedLikes = postLikes.filter(
        (like) => like.userId !== profile?.supertokensId,
      );
    } else {
      toast("Post Liked");
      // Add the like
      updatedLikes = [
        ...postLikes,
        {
          _id: new Date().getTime().toString(),
          postId: post._id,
          userId: profile?.supertokensId,
        },
      ];
    }

    setPostLikes(updatedLikes);

    try {
      // Call the API to save the like status
      const response = await fetch(`${getApiDomain()}/postLikes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post._id,
          userId: profile?.supertokensId,
          liked: !userHasLiked,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error saving like status:", error);
      // Optionally revert the like status in case of error
      setPostLikes(postLikes);
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  async function Remove() {
    try {
      // Call the API to save the like status
      const response = await fetch(
        `${getApiDomain()}/hidepost?oid=${post._id}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setVisibility(true);
      window.location.reload();
    } catch (error) {
      console.error("Error saving like status:", error);
      // Optionally revert the like status in case of error
      setPostLikes(postLikes);
    }
  }
  function getRandomLightColor() {
    // Generate a random light color
    const r = Math.floor(Math.random() * 127 + 128); // 128-255 to ensure light colors
    const g = Math.floor(Math.random() * 127 + 128);
    const b = Math.floor(Math.random() * 127 + 128);
    return `rgb(${r}, ${g}, ${b})`;
  }

  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    setSuggestions(profiles);
  }, [profiles]);

  const handleInputChange2 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMessage(value);
  };

  const handleInputChange = () => {
    const text = contentEditableRef.current.innerHTML;
    setMessage(text);

    const lastWord = text
      .split(" ")
      .pop()
      .replace(/<[^>]*>?/gm, "");
    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      const filtered = suggestions.filter((suggestion) =>
        suggestion.first_name.toLowerCase().includes(query),
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axios.post(`${getApiDomain()}/comment`, {
        postId: post._id,
        userId: supertokensId,
        comment: message,
        taggedUsers: taggedUsers,
        channelstring: post.channelstring,
      });
      // Clear form fields after successful submission
      setMessage("");
      setSelectedImage(null);

      post.postComments = [
        ...post.postComments,
        {
          profile: profile,
          comment: message,
        },
      ];
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const text = contentEditableRef.current.innerHTML;
    const words = text.split(" ");
    words.pop();
    const newText = `${words.join(" ")} <span class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-gray-600">@${suggestion.first_name} ${suggestion.last_name}</span> `;
    setMessage(newText);

    setShowSuggestions(false);
    setTaggedUsers([...taggedUsers, suggestion]);

    setTimeout(() => {
      contentEditableRef.current.innerHTML = newText;
      placeCaretAtEnd(contentEditableRef.current);
    }, 0);
  };

  const placeCaretAtEnd = (element) => {
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && showSuggestions) {
      e.preventDefault();
      handleSuggestionClick(filteredSuggestions[0]);
    }
  };

  const checkCakeDay = (timeJoined: string): boolean => {
    const joinDate = new Date(timeJoined);
    const today = new Date();

    // Create a date object for today with the same month and day as joinDate
    const cakeDayDate = new Date(
      today.getFullYear(),
      joinDate.getMonth(),
      joinDate.getDate(),
    );

    // Check if the cake day date is today
    return today.toDateString() === cakeDayDate.toDateString();
  };
  const isCakeDay = checkCakeDay(profile?.timeJoined);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const urlPattern = /(https?:\/\/[^\s]+)/g;

  // Check if the description contains a URL
  const hasUrl = urlPattern.test(post.desc);

  return (
    <li
      key={post._id}
      onClick={() => setOpen(false)}
      className={`col-span-1 flex flex-col  rounded-2xl bg-white dark:bg-gray-900 dark:shadow-gray-800 dark:border shadow max-w-4xl dark:border-gray-800 dark:border dark:rounded-none`}
    >
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[999999]" onClose={setOpen}>
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
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Share Post
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          <div>
                            {window.location.origin}/s/{post._id}
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

      <div className="flex flex-1 flex-col p-3 relative">
        <div
          className="absolute top-0 right-[-10px] text-left"
          ref={dropdownRef}
        >
          <button
            type="button"
            className="inline-flex justify-center rounded-md px-4 py-2 text-sm text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
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
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 text-xs">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {post.deletable && (
                  <a
                    href="#"
                    onClick={() => Remove()}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 dark:hover:bg-indigo-900 dark:hover:text-white hover:text-gray-900"
                    role="menuitem"
                  >
                    Delete
                  </a>
                )}
                <a
                  href="#"
                  onClick={() => setOpen(!open)}
                  className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 dark:hover:bg-indigo-900 dark:hover:text-white hover:text-gray-900"
                  role="menuitem"
                >
                  Share
                </a>
                {roles &&
                  (roles.includes("admin") || roles.includes("moderator")) && (
                    <>
                      <span
                        className="block px-4 py-2 text-xs text-gray-700 "
                        role="menuitem"
                      >
                        MANAGE
                      </span>

                      <Link
                        to={`/removepost/${post._id}`}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 dark:hover:bg-indigo-900 dark:hover:text-white hover:text-gray-900"
                        role="menuitem"
                      >
                        Remove
                      </Link>
                      <Link
                        to={`/lockpost/${post._id}`}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 dark:hover:bg-indigo-900 dark:hover:text-white hover:text-gray-900"
                        role="menuitem"
                      >
                        Lock Comments
                      </Link>
                    </>
                  )}
              </div>
            </div>
          )}
        </div>

        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <Link
            to={`/profile/${post.profile.handle || post.profile._id}`}
            className="group block flex-shrink-0 dark:hover:text-white"
          >
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={
                    post.profile.profilePicture ||
                    `https://eu.ui-avatars.com/api/?name=${post.profile.first_name}+${post.rofile.last_name}&size=250`
                  }
                  alt=""
                />
              </div>
              <div className="ml-3">
                {post.profile.verified && (
                  <p
                    className="text-sm font-medium text-gray-700 dark:text-white group-hover:text-gray-900  dark:group-hover:text-white inline-flex tooltip"
                    data-tip="Verfied User"
                  >
                    {post.profile.first_name} {post.profile.last_name}
                    {isCakeDay && (
                      <CakeSlice
                        className="h-5 mx-1 dark:text-yellow-300 text-indigo-400 tooltip"
                        data-tip="Community Anniversary"
                      />
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 h-5 w-5 ml-2 text-rose-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </p>
                )}
                {!post.profile.verified && (
                  <p className="text-sm font-medium text-gray-700 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white inline-flex tooltip">
                    {post.profile.first_name} {post.profile.last_name}{" "}
                    {isCakeDay && (
                      <CakeSlice
                        className="h-5 mx-1 dark:text-yellow-300 text-indigo-400 tooltip"
                        data-tip="Community Anniversary"
                      />
                    )}
                  </p>
                )}
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  View profile
                </p>
              </div>
            </div>
          </Link>
          <Link
            className="my-3 dark:text-white"
            to={`/s/${post.channels.name}/${post._id}`}
          >
            <img className="mx-auto mt-2 rounded-md" src={post.media} alt="" />
            <h4
              dangerouslySetInnerHTML={{ __html: post.desc }}
              className="text-wrap"
            ></h4>
            <YouTubeEmbedsmall url={post.desc} />
          </Link>
          {hasUrl && (
            <dd className="mt-0.5 text-sm text-gray-500 ">
              <LinkPreview url={post.desc.match(urlPattern)[0]}></LinkPreview>
            </dd>
          )}
          <dd className="mt-0.5 text-sm text-gray-500 ">
            {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
          </dd>
          <div className="flex py-4 justify-between">
            <div className="flex space-x-2">
              <div className="flex space-x-1 items-center">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 dark:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                  </svg>
                </span>
                <span className="dark:text-white">
                  {post.postComments.length}
                </span>
              </div>
              {!lite && (
                <div
                  className="flex space-x-1 items-center "
                  onClick={handleLikeClick}
                  style={{ cursor: "pointer" }}
                >
                  <span className="">
                    {userHasLiked ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-red-500 "
                      >
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 dark:text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="dark:text-white">{postLikes.length}</span>
                </div>
              )}
            </div>
          </div>
          <dd className="mt-0.5 text-sm text-gray-500">
            {post.tags.map((tag) => (
              <a key={tag} href={`#${tag}`} className="mr-2">
                #{tag}{" "}
              </a>
            ))}
          </dd>
          {post && post.postComments.length > 0 && (
            <Link
              className="mt-0.5 text-sm text-gray-500"
              to={`/s/${post.channels.name}/${post._id}`}
            >
              View all comments
            </Link>
          )}
        </dl>
      </div>
      <div></div>
      <div className=" p-4">
        <Link
          to={`/s/${post.channels.name}/${post._id}`}
          className="btn btn-sm hidden"
        >
          Previous Comments
          <div className="badge badge-secondary">99</div>
        </Link>
        <div className="flow-root mt-3">
          <ul role="list" className="-mb-8">
            {post &&
              post.postComments
                .slice(-2)
                .map((activityItem, activityItemIdx) => (
                  <li key={activityItem._id}>
                    <div className="relative pb-8">
                      {activityItemIdx !== post.postComments.length - 1 ? (
                        <span
                          className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <>
                          <div className="relative">
                            <img
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 dark:ring-1 ring-white"
                              src={activityItem.profile.profilePicture}
                              alt=""
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm">
                                <Link
                                  to={activityItem._id}
                                  className="font-medium text-gray-900 dark:text-white"
                                >
                                  {activityItem.profile.first_name}{" "}
                                  {activityItem.profile.last_name}
                                </Link>
                              </div>
                              <div className="mt-2 text-sm text-gray-700 dark:text-white">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: activityItem.comment,
                                  }}
                                ></p>
                              </div>
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
        {post && post.commentsallowed && (
          <form
            onSubmit={handleSubmit}
            className=" mt-5 flex items-center mb-4 space-x-3"
          >
            <>
              <div
                ref={contentEditableRef}
                contentEditable
                onInput={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind?"
                className="a dark:bg-gray-800 flex-1 px-3 py-1.5 placeholder-blueGray-300 text-blueGray-600 relative bg-gray-200 rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                style={{ minHeight: "2rem", whiteSpace: "pre-wrap" }}
              ></div>
              {showSuggestions && (
                <ul className="absolute border border-gray-300 rounded mt-[13rem] z-[100] bg-white shadow-md h-40 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <span className="inline-flex">
                        <div className="avatar mr-2">
                          <div className="w-8 rounded-full">
                            <img
                              src={suggestion.profilePicture}
                              alt="Tailwind-CSS-Avatar-component"
                            />
                          </div>
                        </div>
                        {suggestion.first_name} {suggestion.last_name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
            <button
              className="bg-primary text-white text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
              type="submit"
            >
              Comment
            </button>
          </form>
        )}
      </div>
    </li>
  );
};

export default PostItem;
