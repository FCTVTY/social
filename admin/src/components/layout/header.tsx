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

import { BriefcaseIcon, ChevronsUpDown } from "lucide-react";
import LogoSquare from "../../assets/s-logo.svg";

import { Popover, PopoverContent, PopoverTrigger } from "../ui";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { useAuthContext } from "../../lib/providers/AuthProvider";
import { Tenant } from "../../models/models";
import { useEffect, useState } from "react";
import { getApiDomain } from "../../lib/auth/supertokens";
import axios from "axios";

export const Header = () => {
  const organization = { id: 1, name: "app" };
  const project = { id: 1, name: "Example Project" };
  const { currentUser } = useAuthContext();
  const [brandings, setBrandings] = useState<Tenant[]>([]);
  const [selectedBrandingId, setSelectedBrandingId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch branding data
        const brandingResponse = await axios.get<Tenant[]>(
          `${getApiDomain()}/v1/tenants`,
        );
        setBrandings(brandingResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const handleBrandingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedBrandingId(selectedId);
    axios.get(`${getApiDomain()}/v1/switchTenant?tenant=${selectedBrandingId}`);
    window.location.reload();
  };

  return (
    <nav className="bg-white dark:bg-zinc-950 flex h-[56px] items-center gap-x-2 border-b border-b-border">
      <div className={"mx-auto ml-2 h-10 w-10 p-2"}>
        <img src={LogoSquare} alt="footfallfit" />
      </div>
      <div className="flex items-center gap-x-2">
        <div className="flex items-center gap-2 rounded-full border border-dashed border-zinc-300 py-px pl-1 pr-3 text-xs/6 font-medium text-zinc-900 dark:border-white/20 dark:text-white">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 ring-1 ring-zinc-200 dark:bg-gray-800 dark:ring-white/25">
            <svg
              viewBox="0 0 8 12"
              fill="none"
              className="w-2 fill-zinc-900 dark:fill-white"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2 3.5C2 2.39543 2.89543 1.5 4 1.5C5.10457 1.5 6 2.39543 6 3.5V4C6 4.27614 5.77614 4.5 5.5 4.5H2.5C2.22386 4.5 2 4.27614 2 4V3.5ZM0.761594 4.92943C0.901674 4.81883 1 4.65765 1 4.47917V3.5C1 1.84315 2.34315 0.5 4 0.5C5.65685 0.5 7 1.84315 7 3.5V4.47917C7 4.65765 7.09833 4.81883 7.23841 4.92943C7.70228 5.2957 8 5.86308 8 6.5V9.5C8 10.6046 7.10457 11.5 6 11.5H2C0.895431 11.5 0 10.6046 0 9.5V6.5C0 5.86308 0.297724 5.2957 0.761594 4.92943Z"
              ></path>
            </svg>
          </div>
          Development preview
        </div>
      </div>
      <div className="flex flex-1 items-center gap-x-2">
        {organization && (
          <Popover>
            <div className="mx-2 text-lg text-stone-700">{"/"}</div>
            <div className="flex items-center gap-x-2">
              <select
                name="branding"
                id="branding"
                className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                value={selectedBrandingId}
                onChange={handleBrandingChange}
              >
                <option value="">Select a branding</option>
                {brandings.map((branding) => (
                  <option key={branding.name} value={branding.name}>
                    {branding.name}
                  </option>
                ))}
              </select>
            </div>
            <PopoverContent className="w-auto p-0">
              <></>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {project && (
        <div className="text-sm">
          <></>
        </div>
      )}

      {currentUser && <UserMenu />}
    </nav>
  );
};
