import {EnvelopeIcon, PhoneIcon} from '@heroicons/react/20/solid'
import React, { useEffect, useState } from "react";
import {XMarkIcon} from '@heroicons/react/20/solid'
import { Community, CommunityCollection } from '../../interfaces/interfaces';
import axios from 'axios';
import { getApiDomain } from '../../lib/auth/supertokens';



interface HomeProps {
    host?: string
}

export default function Home({host}: HomeProps) {

    const [communities, setCommunities] = useState<Community[]>();

    useEffect(() => {
        fetchDetails();
    }, [host]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${getApiDomain()}/communities`);
            setCommunities(response.data);


        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };

    return (

        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
                    Join one of our many communites
                </h2>
                <div className="-mx-6 grid grid-cols-2 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
                {

communities?.map((c) => (  <div className="bg-gray-400/5 p-8 sm:p-10">
                        <a href={`${c.name}.app.bhivecommunity.co.uk`}><img
                            className="max-h-12 w-full object-contain"
                            src={c.logo}
                            alt={c.name}
                            width={158}
                            height={48}
                        /></a>
                    </div>
))}
                </div>
            </div>
        </div>
    )
}
