import { useState, useEffect } from 'react';
import axios from 'axios';
import {getApiDomain} from "../lib/auth/supertokens";
import {Community} from "../interfaces/interfaces";

const useCommunityDetails = (host: string) => {
    const [community, setCommunity] = useState<Partial<Community>>({})

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${getApiDomain()}/community?name=${host}`);
                setCommunity(response.data);
            } catch (error) {
                console.error('Error fetching community details:', error);
            }
        };

        fetchDetails();

        return () => {
           community
        };
    }, [host]); // Run effect whenever `host` changes

    return community;
};

export default useCommunityDetails;