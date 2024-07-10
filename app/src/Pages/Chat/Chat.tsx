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
import {TicketPlus} from "lucide-react";
import {json} from "react-router-dom";
import EventItem from "./Eventitem";

interface HomeProps {
  host?: string;
  channel?: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
export default function Chat({ host, channel ,roles, setRoles}: HomeProps) {
  return (
    <>
      <div
        className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 bg-white border-b bg-gray-200 mb-3">
        <div className="min-w-0 flex-1">

          <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Chatroom
          </h2>

        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">


          <span className="sm:ml-3">

                  </span>


        </div>
      </div>

  <div className="h-dvh flex flex-col mt-[-0.8rem] w-full">
    <div className="bg-gray-200 flex-1 max-h-[40vh] overflow-y-scroll">
      <div className="px-4 py-2">
        <div className="flex items-center mb-2">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
          <div className="font-medium">John Doe</div>
        </div>
        <div className="bg-white rounded-lg p-2 shadow mb-2 max-w-sm">
          Hi, how can I help you?
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
            Sure, I can help with that.
          </div>
          <img
            className="w-8 h-8 rounded-full"
            src="https://picsum.photos/50/50"
            alt="User Avatar"
          />
        </div>
      </div>
    </div>
    <div className="bg-gray-100 px-4 py-2 fixed bottom-0 w-full	">
      <div className="flex items-center">
        <input
          className="w-full border rounded-full py-2 px-4 mr-2"
          type="text"
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full">
          Send
        </button>
      </div>
    </div>
  </div>
    </>
)
};