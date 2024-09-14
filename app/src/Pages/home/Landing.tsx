import React, { useEffect, useState } from "react";
import {
  Ads,
  CommunityCollection,
  Post,
  Profile,
} from "../../interfaces/interfaces";
import { getApiDomain } from "../../lib/auth/supertokens";
import PostItem from "./Feeditem";
import PostItemLite from "./FeeditemLite";
import {
  BadgeCheck,
  CakeIcon,
  LockIcon,
  MessageCircle,
  PenTool,
  ScrollText,
  Star,
} from "lucide-react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

interface HomeProps {
  host?: string;
  profileid?: string;
}

export default function Landing({ host, profileid }: HomeProps) {
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    fetchDetails();
  });

  const fetchDetails = async () => {
    try {
      const response = await fetch(`${getApiDomain()}/profile`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  return (
    <main className="profile-page">
      <div className=" min-h-screen">
        <div className="container mx-auto p-4 lg:max-w-7xl">
          {/* Header */}

          <div className=" bg-white dark:bg-gray-900  shadow-md rounded-lg p-4 mb-4">
            <div className="flex flex-wrap">
              <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
                    Your Communities{" "}
                  </h2>
                  <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                    {/* Example Friends */}
                    {profile &&
                      profile.communitesFull &&
                      profile.communitesFull
                        .filter((x) => x.url !== "auth")
                        .map((c) => (
                          <a href={`https://${c.url}.app.bhivecommunity.co.uk`}>
                            {" "}
                            <img
                              key={c.id}
                              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                              src={c.logo}
                              alt="Transistor"
                              width="158"
                              height="48"
                            />
                          </a>
                        ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
