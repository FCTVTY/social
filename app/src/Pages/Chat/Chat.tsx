import React, {Fragment, useEffect, useState} from 'react';
import {
  BriefcaseIcon,
  CheckIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon, PlusIcon, QuestionMarkCircleIcon
} from "@heroicons/react/16/solid";
import {Dialog, Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {CalendarIcon} from "@heroicons/react/24/outline";
import {
  Community,
  CommunityCollection,
  Post,
  PPosts,
  Profile,
  Channel,
  EventDetails, PEvent
} from "../../interfaces/interfaces";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import moment from 'moment';
import {date} from "zod";
import {PickaxeIcon, ShieldX, TicketPlus} from "lucide-react";
import {json, useSearchParams} from "react-router-dom";
import EventItem from "./Eventitem";

interface HomeProps {
  host?: string;
  channel?: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
export default function Locked({ host, channel ,roles, setRoles}: HomeProps) {

  const [searchParams, setSearchParams] = useSearchParams();


  return (
    <>

      <form name="myForm" id="myForm" className="flex min-h-screen items-center justify-center">
        <div className="min-h-[20px] bg-gray-900  border border-gray-900 rounded-2xl shadow shadow-lg p-3 -mt-12">
          <div
            className="mx-4 sm:mx-24 md:mx-34 lg:mx-56 mx-auto  flex items-center space-y-4 py-16  text-white flex-col">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 className="lucide lucide-shield-x text-red-600">
              <path
                d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
              <path d="m14.5 9.5-5 5"/>
              <path d="m9.5 9.5 5 5"/>
            </svg>

            <h1 className="text-white text-2xl">Whoops.</h1>


            <p>
              {searchParams.get("message")}            </p>
            <code>Error: {searchParams.get("code")}
            </code>
          </div>
        </div>
      </form>


    </>
  )
};