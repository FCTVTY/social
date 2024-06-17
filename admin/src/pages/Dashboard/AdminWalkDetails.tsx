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
import { Place, Voucher, Walk } from "../../models/models";


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

  const [walk, setWalk] = useState<Walk | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch walks data
        const walkResponse = await axios.get<Walk>(`${getApiDomain()}/v1/walkdetails?walkID=${ID}`);
        // Update walks state with the received data
        setWalk(walkResponse.data);

        const placesResponse = await axios.get<Place[]>(`${getApiDomain()}/v1/places?walkID=${ID}`);
        setPlaces(placesResponse.data);

        const vouchersResponse = await axios.get(`${getApiDomain()}/v1/walkdetailsvouchers?walkID=${ID}`);
        setVouchers(vouchersResponse.data);
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
        {walk && (
            <div className="my-3 px-3">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 ">Walk Information</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">{walk.name}</p>
              </div>
              <div className="mt-6 border-t border-white/10">
                <dl className="divide-y divide-white/10">
                  {/* Walk details */}
                  {/* Place and Voucher attachments */}
                </dl>
                <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <a href={`/dashboard/edit/${walk.id}`}
                       className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-white"
                    >
                      Edit
                    </a>
                    <button
                        onClick={handleDelete} // Call handleDelete function on button click
                        className="rounded-md bg-red-800 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default DashboardPage;