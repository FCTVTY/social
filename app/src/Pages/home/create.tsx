import {useEffect, useState} from "react";
import axios from "axios";
import Button from "../../components/Button";
import { getApiDomain } from "../../lib/auth/supertokens";
import {Post} from "../../interfaces/interfaces";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import ReactQuill from "react-quill"; // will work
interface CreateProps {
    onSubmit: () => void;
    channel: string;
}

export default function Create({ onSubmit, channel }: CreateProps) {
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [post, setPost] = useState<Partial<Post>>({});

    useEffect(() => {
        if (channel) {
            setPost(prevState => ({
                ...prevState,
                channelstring: channel,
            }));
        }
    }, [channel]);


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            const base64String = event.target?.result as string;
            setPost(prevState => ({
                ...prevState,
                media: base64String,
            }));
            // @ts-ignore
            setSelectedImage(base64String)
        };

        reader.readAsDataURL(file);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setPost(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {




            await axios.post(`${getApiDomain()}/community/createpost`, post, {

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
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg mb-6 p-2">
                {selectedImage && (
                    <div className="mt-4 mx-auto">
                        <img src={post.media} alt="Selected" className="max-w-full rounded-lg mx-auto"/>
                    </div>
                )}
                <textarea
                    id="desc"
                    name="desc"
                    placeholder="Type something..."
                    value={post.desc}
                    onChange={handleInputChange}
                    className="w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-tg placeholder-gray-400"
                />
                <footer className="flex justify-between mt-2">
                    <div className="flex gap-2">
                        <label htmlFor="image-upload" className="cursor-pointer">
    <span
        className="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"
             strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
    </span>
                        </label>
                    </div>
                    <label htmlFor="image-upload" className="cursor-pointer">
                        <Button className="flex items-center mr-2" color="white" type="submit">Create Article</Button>

                        <Button className="flex items-center" color="slate" type="submit">Upload</Button>
                        <input type="file" id="image-upload" accept="image/*" style={{display: 'none'}}
                               onChange={handleImageChange}/>
                    </label>
                </footer>
            </form>

            <div className="container mx-auto mt-10 hidden">
                <h1 className="text-3xl font-bold mb-4">Create a New Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <ReactQuill
                            theme="snow"
                            className="border border-gray-300 rounded-md"
                            style={{height: '300px'}} // Set editor height
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"

                        />
                        <p className="text-sm text-gray-500">Separate tags with commas (e.g., react, javascript)</p>
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


