/*
 * Copyright (c) 2024.  Footfallfit & FICTIVITY. All rights reserved.
 * This code is confidential and proprietary to Footfallfit & FICTIVITY.
 * Unauthorized copying, modification, or distribution of this code is strictly prohibited.
 *
 * Authors:
 *
 * [@sam1f100](https://www.github.com/sam1f100)
 *
 */

import React, {FC, useState, FormEvent, useEffect} from 'react';
import axios from 'axios';
import {getApiDomain} from '../../lib/auth/supertokens';
import UINotificationSuccess from "../../components/ui/uiNotificationSuccess";
import {Channel, Community, Walk} from "../../models/models";
import {useParams} from "react-router-dom";
import { ObjectId } from 'bson';


export const AdminChannelAdd: FC = () => {
    const { ID } = useParams();
    var mongoose = require('mongoose');
    const [newChannel, setNewChannel] = useState<Partial<Channel>>({
        name: '',
        parent:  new ObjectId(ID),
        locked: false
    });

    const [userData, setUserData] = useState({ first_name: "", last_name: "", fff_tenant: "", gravatar: "", email:"" });

    useEffect(() => {
        // Fetch user data
        axios.get(getApiDomain() + "/v1/userMeta")
            .then(function (response) {
                // handle success
                console.log(response.data[0]);
                // Update user data state with the received data
                setUserData(response.data[0]);

                setNewChannel(prevState => ({
                    ...prevState,
                    tenant: response.data[0].fff_tenant
                }));

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }, []);



    const [message, setMessage] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setNewChannel(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            const base64String = event.target?.result as string;
            setNewChannel(prevState => ({
                ...prevState,
                logo: base64String,
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            var result = await axios.post(`${getApiDomain()}/v1/admin/channel`, newChannel); // Update the endpoint to the correct one for adding walks
            // Handle success
            setMessage(true)

            console.log(result.data)
            const timer = setTimeout(() => {
                // Redirect to the desired location after 3 seconds
                window.location.href = '/dashboard/' + result.data;
            }, 3000);
        } catch (error) {
            // Handle error
            console.log(error);
        }
    };
    return (
        <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto p-4 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900">New Channel Information</h3>
            <div className="mt-6 space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Channel Name"
                        value={newChannel.name || ''}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Additional input fields for logo upload or other properties can go here */}
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Save
                </button>
            </div>
            <UINotificationSuccess open={message} setOpen={setMessage} message="Added." />
        </form>
    );
};

export default AdminChannelAdd;