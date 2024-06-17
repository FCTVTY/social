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
import {Branding, Walk} from "../../models/models";
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


  const [walks, setWalks] = useState<Walk[]>([]);
  const [enabled, setEnabled] = useState(false)
  const [userData, setUserData] = useState({ first_name: "", last_name: "", fff_tenant: "", gravatar: "", email:"" });
    const [branding, setBrand] = useState<Partial<Branding>>({  logo: "", name: "", personalWalks :false,  mapboxToken: ""});
    const [dataloaded, setdataloaded] = useState(false)


    useEffect(() => {
        // Fetch walks data
        axios.get(getApiDomain() + "/v1/walks?tenant=" + userData.fff_tenant)
            .then(function (response) {
                // handle success
                console.log(response);
                // Update walks state with the received data
                setWalks(response.data);
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

    useEffect(() => {
        // Fetch tenants data
        axios.get(getApiDomain() + "/v1/tenants?name=" + userData.fff_tenant)
            .then(function (response) {
                // handle success
                console.log(response);
                // Update walks state with the received data
                setBrand(response.data[0]);
                setEnabled(response.data[0].personalWalks)

                setdataloaded(true)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }, [userData.fff_tenant]);


    useEffect(() => {
        // Perform your action here when 'enabled' changes
        console.log('Enabled state changed:', enabled);


    }, [dataloaded, enabled, branding?.personalWalks]); // Dependency array specifies when the effect should run


    useEffect(() => {
        if (branding?.personalWalks !== enabled && dataloaded) {
            console.log('Enabled state changed:', enabled);

        }
    }, [userData, branding, enabled, dataloaded]);


    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            axios.post(`${getApiDomain()}/v1/tenants/update?name=${userData.fff_tenant}&key=${branding?.mapboxToken}&state=${enabled}`)
                .then(response => {
                    console.log(response);

                })
                .catch(error => {
                    console.error(error);
                });

            setMessage(true)


            const timer = setTimeout(() => {
                // Redirect to the desired location after 3 seconds
                window.location.href = '/dashboard/';
            }, 3000);
        } catch (error) {
            // Handle error
            console.log(error);
        }
    };
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
      <>    <form onSubmit={handleFormSubmit}>
          <UINotificationSuccess open={message} setOpen={setMessage} message="Settings saved. reloading..."/>

      <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        <Switch.Label as="span" className="text-sm font-medium leading-6 text-gray-900" passive>
          Personal walks
        </Switch.Label>
        <Switch.Description as="span" className="text-sm text-gray-500">
          toggle the ability to setup Personal Walks
        </Switch.Description>
      </span>
              <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  className={classNames(
                      enabled ? 'bg-primary' : 'bg-gray-200',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  )}
              >
        <span
            aria-hidden="true"
            className={classNames(
                enabled ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
        />
              </Switch>
          </Switch.Group>
          <div className="mt-6 sm:mt-8">
              <label htmlFor="mapboxToken" className="block text-sm font-medium text-gray-700">
                  Mapbox token
              </label>
              <div className="mt-1">
                  <input
                      type="text"
                      name="mapboxToken"
                      id="mapboxToken"
                      onChange={handleInputChange}
                      defaultValue={branding?.mapboxToken}
                      className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                      placeholder="Enter your Mapbox token"
                  />
              </div>
          </div>

          <div className="mt-6 sm:mt-8">
              <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                  Save
              </button>
          </div>
      </form>
          <main className="">
              <header
                  className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                  <h1 className="text-base font-semibold leading-7">Walks</h1>
                  <a
                      href={`/dashboard/add`}
                      className="rounded bg-white/10 px-2 py-1 text-xs font-semibold  shadow-sm hover:bg-white/20"
                  >
                      Add walk
                  </a>

              </header>

              {/* Deployment list */}
              <ul role="list" className="divide-y divide-white/5">
                  {walks && walks.map((walk) => (
                      <li key={walk.id} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                          <div className="min-w-0 flex-auto">
                              <div className="flex items-center gap-x-3">

                                  <h2 className="min-w-0 text-sm font-semibold leading-6 ">
                                      <a href={`/dashboard/${walk.id}`} className="flex gap-x-2">
                                          <span className="truncate">{walk.tenant}</span>
                                          <span className="text-gray-400">/</span>
                                          <span className="whitespace-nowrap">{walk.name}</span>
                                          <span className="absolute inset-0"/>
                                      </a>
                                  </h2>
                              </div>
                              <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                                  <p className="truncate">{walk.details}</p>
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
