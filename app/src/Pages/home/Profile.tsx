import React, {useEffect, useState} from 'react';
import {Ads, Post, Profile} from "../../interfaces/interfaces";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
interface HomeProps {
    host?: string;
    profileid?: string;
}

export default function ProfilePage({ host, profileid }: HomeProps) {
    const [profile, setProfile] = useState<Profile>();

    console.log(profileid)

    useEffect(() => {
        if (profileid) {
            fetchDetails();
        }
    }, [host, profileid]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${getApiDomain()}/profile?oid=${profileid}`);

            setProfile(response.data);

        } catch (error) {
            console.error('Error fetching profile details:', error);
        }
    };
    return (
        <main className="profile-page">
            {profile && (

            <div className=" min-h-screen">
                <div className="container mx-auto p-4">
                    {/* Header */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="relative">
                            <img
                                src="https://images.pexels.com/photos/22475982/pexels-photo-22475982/free-photo-of-historic-stone-house-with-a-roof-overgrown-with-grass-in-an-icelandic-fjord.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="Cover Photo"
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 p-4">
                                <div className="flex items-center">
                                    <img
                                        src={profile.profilePicture}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full border-4 border-white -mt-16"
                                    />
                                    <div className="ml-4">
                                        <h1 className="text-2xl font-bold text-white">{profile.first_name} {profile.last_name}</h1>
                                        <p className="text-gray-200 hidden">Software Engineer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {profile.me && (
                        <div className="p-4">
                            <div className="flex justify-end">

                                <button
                                    className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300">
                                    Edit Profile
                                </button>
                            </div>
                        </div>)}
                    </div>

                    {/* Main Content */}
                    <div className="mt-4 lg:flex gap-4">
                        {/* Sidebar */}
                        <div className="lg:w-1/3 sm:w-full">
                            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <h2 className="text-lg font-bold mb-2">About</h2>
                                <p className="text-gray-700">
                                    {profile.bio}
                                </p>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <h2 className="text-lg font-bold mb-2">Communities</h2>
                                <div className="flex flex-wrap">
                                    {/* Example Friends */}
                                    {Array.from({length: 6}).map((_, i) => (
                                        <img
                                            key={i}
                                            src={`https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&h=130`}
                                            alt={`COMMUNITY ${i + 1}`}
                                            className="w-12 h-12 rounded-full border-2 border-white m-1"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Posts */}
                        <div className="lg:w-2/3 sm:w-full">

                            {/* Example Post */}
                            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <div className="flex items-center mb-2">
                                    <img
                                        src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="ml-2">
                                        <p className="font-bold">John Doe</p>
                                        <p className="text-gray-600 text-sm">2 hrs ago</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </p>
                                <img
                                    src="https://images.pexels.com/photos/2793440/pexels-photo-2793440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="Post"
                                    className="w-full h-auto rounded-lg"
                                />
                                <div className="mt-2 flex justify-between">
                                    <button className="text-gray-600 hover:text-blue-600">
                                        Like
                                    </button>
                                    <button className="text-gray-600 hover:text-blue-600">
                                        Comment
                                    </button>
                                    <button className="text-gray-600 hover:text-blue-600">
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
            }
                </main>
                )
}