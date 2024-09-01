import React, { useEffect, useState } from "react";
import logo from "../assets/bob-badge.svg";
import { Link } from "react-router-dom";
import { CommunityCollection } from "../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../lib/auth/supertokens";

interface Props {
  children: React.ReactNode;
  host?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const AuthLayout: React.FC<Props> = ({ children, host }) => {
  const [community, setCommunity] = useState<Partial<CommunityCollection>>();

  useEffect(() => {
    fetchDetails();
    console.log(host);
  }, [host]);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${getApiDomain()}/community?name=${host}`,
      );
      setCommunity(response.data);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  return (
    <div className="h-lvh">
      <div className="relative flex min-h-full justify-center md:px-12 lg:px-0">
        <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-28">
          <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
            {children}
          </div>
        </div>
        <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={
              community?.community?.landingBg ||
              "https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg"
            }
            alt=""
          />
          <Link to="https://bhivecommunity.co.uk" aria-label="Feed">
            <img
              src={logo}
              className="h-10 w-auto absolute bottom-5 right-5"
              alt="Logo"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
