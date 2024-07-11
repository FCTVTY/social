import React, {useEffect, useState} from "react";
import axios from "axios";
import Button from "../../components/Button";
import { getApiDomain } from "../../lib/auth/supertokens";
import {Post} from "../../interfaces/interfaces";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import ReactQuill from "react-quill"; // will work
interface CreateProps {
    onSubmit: () => void;
    post: string;
    supertokensId: string;
}

export default function Comment({ onSubmit, post, supertokensId }: CreateProps) {
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);




    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setMessage(value)
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {




            await axios.post(`${getApiDomain()}/comment`, {
                postId: post,
                userId: supertokensId,
                comment: message
            });
            // Clear form fields after successful submission
            setMessage("");
            setSelectedImage(null);

            onSubmit();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
                <form onSubmit={handleSubmit} className=" bg-white shadow rounded-3xl p-3">

                <textarea
                    id="desc"
                    name="desc"
                    placeholder="Type something..."
                    onChange={handleInputChange}
                    className="w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-tg placeholder-gray-400"
                />
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


