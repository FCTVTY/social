import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import { getApiDomain } from "../../lib/auth/supertokens";
import { Post, Profile } from "../../interfaces/interfaces";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import ReactQuill from "react-quill";
import { LoadingButton } from "../../components/LoadingButton"; // will work
import loadImage from "blueimp-load-image";
import { json } from "react-router-dom";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { CircleX, PlusIcon } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
interface CreateProps {
  onSubmit: () => void;
  channel: string;
  profiles: Profile[];
}

export default function Create({ onSubmit, channel, profiles }: CreateProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [post, setPost] = useState<Partial<Post>>({});
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const contentEditableRef = useRef(null);

  useEffect(() => {
    if (channel) {
      setPost((prevState) => ({
        ...prevState,
        channelstring: channel,
      }));
    }
  }, [channel]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    loadImage(
      file,
      (img) => {
        // Convert the image to a base64 string
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64String = canvas.toDataURL("image/jpeg");
          setPost((prevState) => ({
            ...prevState,
            media: base64String,
          }));
          setSelectedImage(base64String);
          console.log(base64String);
        }
      },
      { orientation: true }, // This option ensures the image is correctly oriented
    );
  };

  const handleInputChange2 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);

      await axios.post(`${getApiDomain()}/community/createpost`, post, {});
      // Clear form fields after successful submission
      setMessage("");
      setSelectedImage(null);
      toast.success("Post Created");
      onSubmit();
      setLoading(false);
      setContent("");
      setPost((prevState) => ({
        ...prevState,
        desc: "",
        media: undefined,
      }));
      contentEditableRef.current.innerHTML = "";
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  useEffect(() => {
    setSuggestions(profiles);
  }, [profiles]);

  const handleInputChange = () => {
    const text = contentEditableRef.current.innerHTML;
    console.log(text);
    setContent(text);
    setPost((prevState) => ({
      ...prevState,
      desc: text,
    }));
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

  const handleSuggestionClick = (suggestion) => {
    const text = contentEditableRef.current.innerHTML.replace(/\n/g, "<br />");
    const words = text.split(" ");
    words.pop();
    const newText = `${words.join(" ")} <a href="/profile/${suggestion.id}" class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-gray-600">${suggestion.first_name} ${suggestion.last_name}</span> `;
    setContent(newText);
    setPost((prevState) => ({
      ...prevState,
      desc: newText,
      taggedUsers: Array.isArray(prevState.taggedUsers)
        ? [...prevState.taggedUsers, suggestion]
        : [suggestion], // Fallback to a new array if prevState.taggedUsers is not an array
    }));
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

  const HandleBG = (colour, custom) => {
    var newText =
      '<div  class="flex h-[200px] sm:h-[50vh] rounded-xl items-center justify-center ' +
      colour +
      '" style="' +
      custom +
      '">\n' +
      '      <div class="text-3xl text-white/50 text-center">Whats on your mind?</div>\n' +
      "  </div>";
    setContent(newText);
    setPost((prevState) => ({
      ...prevState,
      desc: newText,
    }));
    setTimeout(() => {
      contentEditableRef.current.innerHTML = newText;
      //placeCaretAtEnd(contentEditableRef.current);
    }, 0);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 dark:shadow-gray-800  dark:text-white shadow rounded-xl  p-4 dark:border-gray-800 dark:border dark:rounded-none"
      >
        {selectedImage && (
          <div className="mt-4 mx-auto">
            <img
              src={post.media}
              alt="Selected"
              className="max-w-full rounded-lg mx-auto"
            />
          </div>
        )}
        <textarea
          id="desc"
          name="desc"
          placeholder="Type something..."
          value={post.desc}
          onChange={handleInputChange}
          className="hidden w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-lg placeholder-gray-400 dark:bg-gray-900"
        />
        <div className="relative">
          <div
            ref={contentEditableRef}
            contentEditable
            onInput={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            className="w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-lg placeholder-gray-400 dark:bg-gray-900 mb-4"
            style={{ minHeight: "4rem", whiteSpace: "pre-wrap" }}
          ></div>

          <button
            type="button"
            onClick={() => {
              setContent("");
              setPost((prevState) => ({
                ...prevState,
                desc: "",
              }));
              contentEditableRef.current.innerHTML = "";
            }}
            className="duration-300 absolute top-2 right-2 dark:text-gray-700 text-gray-400"
          >
            <CircleX />
          </button>
        </div>
        {showSuggestions && (
          <ul className="border border-gray-300 rounded mt-2 bg-white dark:bg-gray-800 dark:border-gray-800 shadow-md max-h-40 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 hover:bg-gray-200 hover:bg-indigo-600 cursor-pointer"
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

        <footer className="flex justify-between mt-2">
          <div className="flex gap-2">
            <label htmlFor="image-upload" className="cursor-pointer">
              <span className="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="css-i6dzq1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </span>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div className="inline-flex rounded-md shadow-sm">
            <LoadingButton
              type="submit"
              variant="ghost"
              className=" py-3 font-medium text-white bg-gray-950 hover:bg-gray-800 bg-primary"
              loading={loading}
            >
              {" "}
              Create
            </LoadingButton>
            <Menu as="div" className="relative -ml-px block hidden">
              <Menu.Button className="relative inline-flex items-center rounded-r-md bg-primary px-2 py-2 text-white   hhover:bg-gray-800  focus:z-10">
                <span className="sr-only">Open options</span>
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      <a
                        href="#"
                        onClick={() => HandleBG("bg-gray-800", "")}
                        className={classNames(
                          "text-gray-700 hover:bg-gray-200",
                          "block px-4 py-2 text-sm inline-flex w-full",
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-gray-800"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Dark Background
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href="#"
                        onClick={() => HandleBG("bg-indigo-800", "")}
                        className={classNames(
                          "text-gray-700",
                          "text-gray-700 hover:bg-gray-200",
                          "block px-4 py-2 text-sm inline-flex w-full",
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-indigo-800"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Blue Background
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href="#"
                        onClick={() => HandleBG("bg-pink-400", "")}
                        className={classNames(
                          "text-gray-700",
                          "text-gray-700 hover:bg-gray-200",
                          "block px-4 py-2 text-sm inline-flex w-full",
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-pink-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Pink Background
                      </a>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </footer>
      </form>

      <div className="container mx-auto mt-10 hidden">
        <h1 className="text-3xl font-bold mb-4">Create a New Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <ReactQuill
              theme="snow"
              className="border border-gray-300 rounded-md"
              style={{ height: "300px" }} // Set editor height
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-900">
              Separate tags with commas (e.g., react, javascript)
            </p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Publish
          </button>
        </form>
      </div>
    </>
  );
}
