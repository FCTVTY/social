import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

export default function RemoveComment({ host, profileid }: HomeProps) {
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
        `${getApiDomain()}/removecomment?oid=${profileid}`,
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
              Please wait.. Removing Post
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Removing Comment <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
