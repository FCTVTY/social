import React, { useEffect, useState } from 'react';
import { getApiDomain } from "../../lib/auth/supertokens";
import { Community } from "../../interfaces/interfaces";

interface HomeProps {
    host?: string;
    channel?: string;
    roles?: any; // Add appropriate type
    setRoles?: (roles: any) => void; // Add appropriate type
}

export default function Site({ host, channel, roles, setRoles }: HomeProps) {
    const [community, setCommunity] = useState<Community | undefined>(undefined);

    useEffect(() => {
        if (host) {
            fetchDetails();
        } else {
            console.warn('Host is undefined');
        }
    }, [host, channel]);

    const fetchDetails = async () => {
        try {
            const response = await fetch(`${getApiDomain()}/community?name=${host}`);
            if (!response.ok) {
                throw new Error('Network response was not ok for community fetch');
            }
            const data = await response.json();
            setCommunity(data.community);
        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCommunity(prevState => prevState ? {
            ...prevState,
            [name]: value,
        } : prevState);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target?.result as string;
            setCommunity(prevState => prevState ? {
                ...prevState,
                logo: base64String,
            } : prevState);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${getApiDomain()}/admin/community`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(community)
            });
            if (!response.ok) {
                throw new Error('Failed to update community details');
            }
            alert('Community details updated successfully');
        } catch (error) {
            console.error('Error saving community details:', error);
            alert('Error saving community details');
        }
    };

    const handlePublishToggle = async () => {
        try {
            if (!community) return;

            const response = await fetch(`${getApiDomain()}/admin/community`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...community, published: !community.published })
            });
            if (!response.ok) {
                throw new Error('Failed to update community publish status');
            }
            setCommunity(prevState => prevState ? {
                ...prevState,
                published: !prevState.published,
            } : prevState);
            alert(`Community has been ${community.published ? 'unpublished' : 'published'} successfully`);
        } catch (error) {
            console.error('Error updating publish status:', error);
            alert('Error updating publish status');
        }
    };

    return (
        <>
            {community && (
                <div className="container mx-auto p-6 h-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">General Settings</h2>
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Community Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={community.name || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="logo"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Branding Logo
                            </label>
                            <input
                                type="file"
                                id="logo"
                                name="logo"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                onChange={handleImageChange}
                            />
                            {community.logo && (
                                <img src={community.logo} alt="Community Logo" className="mt-2 max-w-full h-auto" />
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="desc"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <textarea
                                id="desc"
                                name="desc"
                                value={community.desc || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600"
                        >
                            Save
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                        <h2 className="text-2xl font-bold mb-6">Publish Settings</h2>
                        <div className="mb-4">
                            <p>Your website is currently {community.published ? 'published' : 'unpublished'} and can only be viewed by administrators.</p>
                            <button
                                onClick={handlePublishToggle}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
                            >
                                {community.published ? 'Unpublish Site' : 'Publish Site'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
