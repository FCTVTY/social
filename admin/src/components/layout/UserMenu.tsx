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

import {GraduationCap, LogOutIcon} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui";
import {useAuthContext} from "../../lib/providers/AuthProvider";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";

export const UserMenu = () => {
  const {currentUser} = useAuthContext();
  const [userData, setUserData] = useState({first_name: "", last_name: "", fff_tenant: "", gravatar: "", email: ""});
  useEffect(() => {
    // Fetch user data
    axios.get(getApiDomain() + "/v1/userMeta")
      .then(function (response) {
        // handle success
        console.log(response.data[0]);
        // Update user data state with the received data
        setUserData(response.data[0]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <li
          className="mb-2 mt-auto flex h-full cursor-pointer items-center rounded-md p-2 px-4 text-sm font-medium text-muted-foreground transition-all hover:text-foreground">
          <span className="ml-2">{userData.email}</span>
        </li>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <Link to="https://docs.pezzo.ai" target="_blank">
          <DropdownMenuItem>
            <GraduationCap className="mr-2 h-4 w-4"/>
            <span>Documentation</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/logout">
          <DropdownMenuItem>
            <LogOutIcon className="mr-2 h-4 w-4"/>
            <span>Sign out</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};