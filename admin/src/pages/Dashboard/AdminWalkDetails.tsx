import { Fragment, useState, useEffect } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  Bars3Icon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PaperClipIcon
} from '@heroicons/react/20/solid';
import { usePageTitle } from "../../lib/hooks/usePageTitle";
import React, { FC } from "react";
import axios from "axios";
import {getApiDomain, getWebsiteDomain} from "../../lib/auth/supertokens";
import { useParams } from "react-router-dom";
import {Community, Channel, Voucher, Walk} from "../../models/models";


export const DashboardPage: FC = () => {
  usePageTitle("Dashboard");
  const { ID } = useParams();

  const stats = [
    { name: 'Users', value: '405' },
    { name: 'Walks', value: '365', unit: '' },
    { name: 'Vouchers', value: '3' },
    { name: 'Completed Rate', value: '98.5%' },
  ];

  const statuses: Record<string, string> = {
    draft: 'text-gray-500 bg-gray-100/10',
    online: 'text-green-400 bg-green-400/10',
    error: 'text-rose-400 bg-rose-400/10',
  };

  const environments: Record<string, string> = {
    Draft: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    Live: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
    Disabled: 'text-red-400 bg-red-400/10 ring-red-400/30',
  };

  const [community, setCommunity] = useState<Community | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch walks data
        const walkResponse = await axios.get<Community>(`${getApiDomain()}/v1/admin/community?id=${ID}`);
        // Update walks state with the received data
        setCommunity(walkResponse.data);
        const Response = await axios.get<Channel[]>(`${getApiDomain()}/v1/admin/channel?oid=${ID}`);
        // Update walks state with the received data
       setChannels(Response.data);

      } catch (error) {
        // handle error
        console.log(error);
      }
    };

    fetchData();

  }, [ID]); // Trigger useEffect when ID changes

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  // Function to handle delete action
  const handleDelete = async () => {
    try {
      await axios.post(`${getApiDomain()}/v1/admin/walk/delete?walk=${ID}`);
      // Redirect to desired page after successful deletion
      // Replace '/desired-page' with the actual page you want to navigate to
      // Simulate an HTTP redirect:
      window.location.replace(`${getWebsiteDomain()}/dashboard`);
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  return (
      <>
        {community && (
            <div className="my-3 px-3">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 ">Community Information </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">{community.name}</p>
                 <a href={`http://${community.url}.app.bhivecommunity.co.uk`}
                       className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold mt-10  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-white"
                    >
                     visit Community
                    </a>
              </div>
              <div className="mt-6 border-t border-white/10">
                <dl className="divide-y divide-white/10">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                      <tr>
                        <th scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                          Channels
                        </th>

                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                      {channels.map((c) => (
                          <tr key={c.name}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {c.name}
                            </td>

                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">

                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </dl>
                <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <a href={`/dashboard/addChannel/${ID}`}
                       className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-white"
                    >
                      Add Channel
                    </a>

                  </div>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default DashboardPage;
