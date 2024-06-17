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
import {Fragment, useState, useEffect} from 'react';
import {Dialog, Menu, Transition} from '@headlessui/react';
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
import {usePageTitle} from "../../lib/hooks/usePageTitle";
import React, {FC} from "react";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import {useParams} from "react-router-dom";
import {Place, Voucher, Walk} from "../../models/models";


export const VoucherDetailPage: FC = () => {
  usePageTitle("Dashboard");
  const {ID} = useParams();

  const stats = [
    {name: 'Users', value: '405'},
    {name: 'Walks', value: '365', unit: ''},
    {name: 'Vouchers', value: '3'},
    {name: 'Completed Rate', value: '98.5%'},
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


  const [place, setPlaces] = useState<Voucher>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch walks data
        const walkResponse = await axios.get<Voucher>(`${getApiDomain()}/v1/admin/voucherdetails?vID=${ID}`);
        // Update walks state with the received data
        setPlaces(walkResponse.data);


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


  return (
    <>
      {place && (
        <div className="my-3 px-3">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 ">Voucher Information</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">{place.name}</p>
          </div>
          <div className="mt-6 border-t border-white/10">
            <dl className="divide-y divide-white/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Image</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <div className="text-center rounded-lg overflow-hidden w-56 sm:w-96 mx-auto">
                    <img className="object-contain h-48 w-full "
                         src={place.logo}/>
                  </div>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Details</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{place.details}</dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Code</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{place.code}</dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Linked Place</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{place.pid}</dd>

              </div>

            </dl>
            <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
              <div className="mt-6 flex items-center justify-end gap-x-6">

                <a href={`/vouchers/edit/${place.id}`}
                   className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-white"
                >
                  Edit
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoucherDetailPage;
