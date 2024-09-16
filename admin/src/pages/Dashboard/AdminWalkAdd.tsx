import React, { FC, useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import UINotificationSuccess from "../../components/ui/uiNotificationSuccess";
import { Community } from "../../models/models";

export const AdminWalkAdd: FC = () => {
  const [newCommunity, setNewCommunity] = useState<Partial<Community>>({
    name: "",
    logo: "",
    desc: "",
    url: "",
    access: "",
  });

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    fff_tenant: "",
    gravatar: "",
    email: "",
  });

  useEffect(() => {
    axios
      .get(getApiDomain() + "/v1/userMeta")
      .then((response) => {
        setUserData(response.data[0]);
        setNewCommunity((prevState) => ({
          ...prevState,
          tenant: response.data[0].fff_tenant,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [message, setMessage] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewCommunity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setNewCommunity((prevState) => ({
        ...prevState,
        logo: base64String,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${getApiDomain()}/v1/admin/community`,
        newCommunity,
      );
      setMessage(true);
      const timer = setTimeout(() => {
        window.location.href = "/dashboard/" + result.data;
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Community Information</h3>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Community Name"
              value={newCommunity.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium">
              URL - please make sure there's no spaces and no-other community is using the same domain
            </label>
            <div className="flex">
              <input
                type="text"
                name="url"
                id="url"
                autoComplete="url"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="URL, e.g., sc"
                value={newCommunity.url}
                onChange={handleInputChange}
              />
             
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="logo" className="block text-sm font-medium">
              Image
            </label>
            <div className="mt-1 flex flex-col space-y-2">
              <input
                type="text"
                name="logo"
                id="logo"
                autoComplete="logo"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Logo URL"
                value={newCommunity.logo}
                onChange={handleInputChange}
              />
              <div className="text-center">OR</div>
              <input
                type="file"
                name="logoFile"
                id="logoFile"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={handleImageChange}
              />
              {newCommunity.logo && (
                <div className="mt-4">
                  <img
                    className="object-contain h-48 w-full mx-auto"
                    src={newCommunity.logo}
                    alt="Community Logo"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="desc" className="block text-sm font-medium">
              Details
            </label>
            <textarea
              id="desc"
              name="desc"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Community Description"
              value={newCommunity.desc}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="access" className="block text-sm font-medium">
              Enter Password to lock Community
            </label>
            <input
              id="access"
              name="access"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Community Pasword"
              value={newCommunity.access}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-4 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>

      <UINotificationSuccess
        open={message}
        setOpen={setMessage}
        message="Added."
      />
    </div>
  );
};

export default AdminWalkAdd;
