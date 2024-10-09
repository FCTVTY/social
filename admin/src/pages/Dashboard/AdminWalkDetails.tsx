import { Fragment, useState, useEffect, FC } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Bars3Icon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
} from "@heroicons/react/20/solid";
import { usePageTitle } from "../../lib/hooks/usePageTitle";
import axios from "axios";
import { getApiDomain, getWebsiteDomain } from "../../lib/auth/supertokens";
import { useParams } from "react-router-dom";
import { Community, Channel } from "../../models/models";

export const DashboardPage: FC = () => {
  usePageTitle("Dashboard");
  const { ID } = useParams();

  const [community, setCommunity] = useState<Community | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walkResponse = await axios.get<Community>(
          `${getApiDomain()}/v1/admin/community?id=${ID}`,
        );
        setCommunity(walkResponse.data);

        const channelResponse = await axios.get<Channel[]>(
          `${getApiDomain()}/v1/admin/channel?oid=${ID}`,
        );
        setChannels(channelResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [ID]);

  const handleDelete = async () => {
    try {
      await axios.post(`${getApiDomain()}/v1/admin/walk/delete?walk=${ID}`);
      window.location.replace(`${getWebsiteDomain()}/dashboard`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {community && (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-400">
              Community Information
            </h3>
            <p className="mt-2 text-gray-600">{community.name}</p>
            <a
              href={`http://${community.url}.app.bhivecommunity.co.uk`}
              className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Visit Community
            </a>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="p-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-400">
                Channels
              </h4>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-400 sm:pl-0">
                        Channel Name
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {channels.map((c) => (
                      <tr key={c.name}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-400 sm:pl-0">
                          {c.name}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          {/* Add any action buttons if needed */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-end">
                <a
                  href={`/dashboard/addChannel/${ID}`}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
