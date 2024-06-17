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
import {Fragment, useState} from 'react'
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
import {Place, Voucher, Walk} from "../../models/models";

export const VoucherPage: FC = () => {
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


  const [walks, setWalks] = useState<Voucher[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const fetchData = async () => {
    try {


      const vouchersResponse = await axios.get<Voucher[]>(`${getApiDomain()}/v1/adminvouchers`);
      setVouchers(vouchersResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>
      <div className="border-b border-b-border">
        <div className="container flex h-24 items-center justify-between p-6">
          <h1>Voucher Dashboard</h1>
          <div className="flex gap-2">
          </div>
        </div>
      </div>


      <main className="">
        <header
          className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="text-base font-semibold leading-7 ">Vouchers</h1>
          <a
            href={`/vouchers/add`}
            className="rounded bg-white/10 px-2 py-1 text-xs font-semibold  shadow-sm hover:bg-white/20"
          >
            Add Voucher
          </a>

        </header>

        {/* Deployment list */}
        <ul role="list" className="divide-y divide-white/5">
          {vouchers && vouchers.map((walk) => (
            <li key={walk.id} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="min-w-0 flex-auto">
                <div className="flex items-center gap-x-3">

                  <h2 className="min-w-0 text-sm font-semibold leading-6 ">
                    <a href={`/vouchers/${walk.id}`} className="flex gap-x-2">
                      <span className="truncate">{walk.tenant}</span>
                      <span className="text-gray-400">/</span>
                      <span className="whitespace-nowrap">{walk.name}</span>
                      <span className="absolute inset-0"/>
                    </a>
                  </h2>
                </div>
                <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                  <p className="truncate">{walk.details} : {walk.code} </p>
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                    <circle cx={1} cy={1} r={1}/>
                  </svg>
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

export default VoucherPage;
