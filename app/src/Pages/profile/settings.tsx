import {useEffect, useState} from "react";
import {Profile} from "../../interfaces/interfaces";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";

export default function Settings(){

    const [profile, setProfile] = useState<Profile | null>(null);
    const fetchDetails = async () => {
        try {

            const Presponse = await axios.get(`${getApiDomain()}/profile`);
            const profileData = Presponse.data;

            setProfile(profileData);
        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };

    useEffect(() => {
            fetchDetails();

    }, []);



    return (
        <main>
        <div className="divide-y divide-white/5">

            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="text-base font-semibold leading-7 ">Delete account</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                        No longer want to use our service? You can delete your account here. This action is not
                        reversible.
                        All information related to this account will be deleted permanently.
                    </p>
                </div>

                <form className="flex items-start md:col-span-2">
                    <a
                        href="/auth/deleteAccount"
                        className="rounded-md bg-red-500 text-white px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-red-400"
                    >
                        Yes, delete my account
                    </a>
                </form>
            </div>
        </div>
        </main>
    )
}