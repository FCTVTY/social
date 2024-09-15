import React, { useEffect, useState } from "react";
import { Ads, Post, Profile } from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import PostItem from "./Feeditem";
import PostItemLite from "./FeeditemLite";
import {
  LinkIcon,
  PlusIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/16/solid";
import { useLocation } from "react-router-dom";

interface HomeProps {
  host?: string;
  profileid?: string;
}

export default function LockPost({ host, profileid }: HomeProps) {
  const location = useLocation();
  profileid = location.pathname.split("/")[2];

  console.log(profileid);

  useEffect(() => {
    if (profileid) {
      fetchDetails();
    }
  }, [host, profileid]);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${getApiDomain()}/lockpost?oid=${profileid}`,
      );
      const timer = setTimeout(() => {
        // Redirect to the desired location after 3 seconds
        window.location.href = "/feed/";
      }, 3000);
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };
  return (
    <main className="profile-page">
      <div className="rounded-md bg-yellow-50 p-4 m-10">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Please wait.. Locking Post
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Restricting Comments.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
