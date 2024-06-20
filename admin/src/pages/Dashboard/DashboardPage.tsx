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
import {FormEvent, Fragment, useState} from 'react'
import {Dialog, Menu, Transition} from '@headlessui/react'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {Bars3Icon, ChevronRightIcon, ChevronUpDownIcon, MagnifyingGlassIcon} from '@heroicons/react/20/solid'

import {usePageTitle} from "../../lib/hooks/usePageTitle";
import React, {FC, useEffect} from "react";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import {Branding, Community, Walk} from "../../models/models";
import { Switch } from '@headlessui/react'
import UINotificationSuccess from "../../components/ui/uiNotificationSuccess";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
export const DashboardPage: FC = () => {
  usePageTitle("Dashboard");

  const stats = [
    {name: 'Users', value: '405'},
    {name: 'Walks', value: '365', unit: ''},
    {name: 'Vouchers', value: '3'},
    {name: 'Completed Rate', value: '98.5%'},
  ]

  const statuses: Record<string, string> = {
    draft: 'text-gray-500 bg-gray-100/10',
    online: 'text-green-400 bg-green-400/10',
    error: 'text-rose-400 bg-rose-400/10',
  }
  const environments: Record<string, string> = {

    Draft: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    Live: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
    Disabled: 'text-red-400 bg-red-400/10 ring-red-400/30',

  }


  const [Communities, setCommunities] = useState<Community[]>([]);
  const [enabled, setEnabled] = useState(false)
  const [userData, setUserData] = useState({ first_name: "", last_name: "", fff_tenant: "", gravatar: "", email:"" });
    const [branding, setBrand] = useState<Partial<Branding>>({  logo: "", name: "", personalWalks :false,  mapboxToken: ""});
    const [dataloaded, setdataloaded] = useState(false)


    useEffect(() => {
        // Fetch walks data
        axios.get(getApiDomain() + "/v1/communities")
            .then(function (response) {
                // handle success
                console.log(response);
                // Update walks state with the received data
                setCommunities(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }, [userData.fff_tenant]); // Trigger useEffect when userData.fff_tenant changes

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



    const [message, setMessage] = useState(false);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setBrand(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

  return (
      <>
          <main className="">
              <header
                  className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                  <h1 className="text-base font-semibold leading-7">Communities</h1>
                  <a
                      href={`/dashboard/add`}
                      className="rounded bg-white/10 px-2 py-1 text-xs font-semibold  shadow-sm hover:bg-white/20"
                  >
                      Add Community
                  </a>

              </header>

              {/* Deployment list */}
              <ul role="list" className="divide-y divide-white/5">
                  {Communities && Communities.map((Community) => (
                      <li key={Community.name} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                          <div className="min-w-0 flex-auto">
                              <div className="flex items-center gap-x-3">

                                  <h2 className="min-w-0 text-sm font-semibold leading-6 ">
                                      <a href={`/dashboard/${Community._id}`} className="flex gap-x-2">
                                          <span className="text-gray-400">/</span>
                                          <span className="whitespace-nowrap">{Community.name} - https://{Community.name}.app.bhivecommunity.co.uk </span>
                                          <span className="absolute inset-0"/>
                                      </a>
                                  </h2>
                              </div>
                              <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                                  <p className="truncate"><img src={Community.logo} className="h-5"/></p>
                                  <p className="truncate">{Community.desc}</p>
                                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                                      <circle cx={1} cy={1} r={1}/>
                                  </svg>
                                  <p className="whitespace-nowrap"></p>
                              </div>
                          </div>

                          <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true"/>
                      </li>
                  ))}
              </ul>
          </main>


      </>


  )
};

export default DashboardPage;
