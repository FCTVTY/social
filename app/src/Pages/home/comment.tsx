import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import Button from "../../components/Button";
import { getApiDomain } from "../../lib/auth/supertokens";
import {Post, Profile} from "../../interfaces/interfaces";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import ReactQuill from "react-quill"; // will work
interface CreateProps {
    onSubmit: () => void;
    post: string;
    supertokensId: string;
    profiles: Profile[];
    channel:string
}

export default function Comment({ onSubmit, post, supertokensId, profiles, channel}: CreateProps) {
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [content, setContent] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [taggedUsers, setTaggedUsers] = useState([]);
    const contentEditableRef = useRef(null);

    useEffect(() => {
        setSuggestions(profiles);
    }, [profiles]);

    const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setMessage(value)
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {




            await axios.post(`${getApiDomain()}/comment`, {
                postId: post,
                userId: supertokensId,
                comment: message,
                taggedUsers: taggedUsers,
                channelstring:channel
            });
            // Clear form fields after successful submission
            setMessage("");
            setSelectedImage(null);

            onSubmit();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };
    const handleInputChange = () => {
        const text = contentEditableRef.current.innerHTML;
        setMessage(text);

        const lastWord = text.split(' ').pop().replace(/<[^>]*>?/gm, '');
        if (lastWord.startsWith('@')) {
            const query = lastWord.slice(1).toLowerCase();
            const filtered = suggestions.filter(suggestion =>
                suggestion.first_name.toLowerCase().includes(query)
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const text = contentEditableRef.current.innerHTML;
        const words = text.split(' ');
        words.pop();
        const newText = `${words.join(' ')} <span class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-gray-600">@${suggestion.first_name} ${suggestion.last_name}</span> `;
        setContent(newText);

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
        if (e.key === 'Enter' && showSuggestions) {
            e.preventDefault();
            handleSuggestionClick(filteredSuggestions[0]);
        }
    };
    return (
        <>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
                <form onSubmit={handleSubmit} className=" bg-white dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:border-2
 shadow rounded-3xl p-3">

                <textarea
                    id="desc"
                    name="desc"
                    placeholder="Type something..."
                    onChange={handleInputChange}
                    className="hidden w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-tg placeholder-gray-400 dark:bg-zinc-800"
                />

                    <div
                        ref={contentEditableRef}
                        contentEditable
                        onInput={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="What's on your mind?"
                        className="w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-tg placeholder-gray-400 dark:bg-zinc-800"
                        style={{minHeight: '4rem', whiteSpace: 'pre-wrap'}}
                    ></div>
                    {showSuggestions && (
                        <ul className="border border-gray-300 rounded mt-2 bg-white shadow-md max-h-40 overflow-y-auto">
                            {filteredSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                ><span className="inline-flex">
                                <div className="avatar mr-2">
                                    <div className="w-8 rounded-full">
                                        <img
                                            src={suggestion.profilePicture}
                                            alt="Tailwind-CSS-Avatar-component"/>
                                    </div>
                                </div>
                                    {suggestion.first_name} {suggestion.last_name}</span>
                                </li>
                            ))}
                        </ul>
                    )}


                    <footer className="flex justify-between mt-2">
                        <div className="flex gap-2">

                        </div>
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <Button className="flex items-center mr-2" color="slate" variant="solid" type="submit">Leave
                                Comment</Button>


                        </label>
                    </footer>
                </form>
            </div>

        </>
    );
}


