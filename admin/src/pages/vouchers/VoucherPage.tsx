import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { getApiDomain } from '../../lib/auth/supertokens';
import { Ads } from "../../models/models";
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/solid';
import { usePageTitle } from "../../lib/hooks/usePageTitle";

export const VoucherPage: FC = () => {
  usePageTitle("Dashboard");

  const [vouchers, setVouchers] = useState<Ads[]>([]);

  const fetchData = async () => {
    try {
      const vouchersResponse = await axios.get<Ads[]>(`${getApiDomain()}/v1/data/get`);
      setVouchers(vouchersResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
      <>
        <header className="border-b border-gray-200">
          <div className="container flex h-20 items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Ad Dashboard</h1>
            <a
                href={`/ad/add`}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Advert
            </a>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900">Ads</h2>
          <ul role="list" className="divide-y divide-gray-200 mt-4">
            {vouchers.map(voucher => (
                <li key={voucher._id} className="relative flex items-center space-x-4 p-4 hover:bg-gray-100 rounded-lg">
                  <img src={voucher.logo} alt={voucher.name} className="h-16 w-16 object-cover rounded-md" />
                  <div className="flex-auto">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {voucher.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {voucher.ad}
                    </p>
                  </div>
                  <a href={`/ad/edit/${voucher._id}`} className="text-red-500 hover:text-red-600">
                    <ArchiveBoxXMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </a>
                </li>
            ))}
          </ul>
        </main>
      </>
  );
};

export default VoucherPage;
