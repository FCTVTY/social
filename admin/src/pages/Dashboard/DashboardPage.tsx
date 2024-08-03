import React, { FC, useState, useEffect, FormEvent, Fragment } from 'react';
import axios from 'axios';
import { getApiDomain } from '../../lib/auth/supertokens';
import { usePageTitle } from "../../lib/hooks/usePageTitle";
import { Community, Branding } from "../../models/models";
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import UINotificationSuccess from "../../components/ui/uiNotificationSuccess";

export const DashboardPage: FC = () => {
    usePageTitle("Dashboard");

    const [communities, setCommunities] = useState<Community[]>([]);
    const [userData, setUserData] = useState({ first_name: "", last_name: "", fff_tenant: "", gravatar: "", email:"" });
    const [branding, setBranding] = useState<Partial<Branding>>({ logo: "", name: "", personalWalks: false, mapboxToken: "" });
    const [message, setMessage] = useState(false);

    useEffect(() => {
        axios.get(getApiDomain() + "/v1/communities")
            .then(response => {
                setCommunities(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [userData.fff_tenant]);

    useEffect(() => {
        axios.get(getApiDomain() + "/v1/userMeta")
            .then(response => {
                setUserData(response.data[0]);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBranding(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <main className="my-3 px-3 bg-white p-6 rounded-lg shadow-md">
                <header className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                    <h1 className="text-xl font-semibold">Communities</h1>
                    <a
                        href={`/dashboard/add`}
                        className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        Add Community
                    </a>
                </header>

                <ul role="list" className="divide-y divide-gray-200">
                    {communities && communities.map((community) => (
                        <li key={community.name} className="flex items-center space-x-4 py-4">
                            <div className="min-w-0 flex-auto">
                                <div className="flex items-center gap-x-3">
                                    <h2 className="text-sm font-semibold">
                                        <a href={`/dashboard/${community._id}`} className="flex gap-x-2">
                                            <span className="text-gray-500">/</span>
                                            <span className="whitespace-nowrap">{community.name} - https://{community.url}.app.bhivecommunity.co.uk</span>
                                        </a>
                                    </h2>
                                </div>
                                <div className="mt-3 flex items-center gap-x-2.5 text-xs text-gray-500">
                                    <img src={community.logo} className="h-5" alt="Community Logo" />
                                    <p className="truncate">{community.desc}</p>
                                </div>
                            </div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </li>
                    ))}
                </ul>

                <UINotificationSuccess open={message} setOpen={setMessage} message="Added." />
            </main>
        </div>
    );
};

export default DashboardPage;
