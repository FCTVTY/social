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

import React, {FC, useState, useEffect, FormEvent} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {getApiDomain} from '../../lib/auth/supertokens';
import {Ads, Place, Voucher} from "../../models/models";
import UINotificationSuccess from "../../components/ui/uiNotificationSuccess";

export const AdminvoucherAdd: FC = () => {
  const {ID} = useParams<{ ID: string }>();
  const [message, setMessage] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);

  const [updatedWalk, setUpdatedWalk] = useState<Partial<Ads>>({
    name: '',
    logo: '',
    ad: '',
    url: '',
  });



  const [userData, setUserData] = useState({ first_name: "", last_name: "", fff_tenant: "", gravatar: "", email:"" });

  useEffect(() => {
          // Fetch user data
          axios.get(getApiDomain() + "/v1/userMeta")
              .then(function (response) {
                  // handle success
                  console.log(response.data[0]);
                  // Update user data state with the received data
                  setUserData(response.data[0]);
  
                  setUpdatedWalk(prevState => ({
              ...prevState,
              tenant: response.data[0].fff_tenant
            }));
  
              })
              .catch(function (error) {
                  // handle error
                  console.log(error);
              });
      }, []);
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.get(getApiDomain() + "/v1/adminplaces")
          .then(function (response) {
            // handle success
            console.log(response);
            // Update walks state with the received data
            setPlaces(response.data);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;

    // For other input fields, update normally
    setUpdatedWalk(prevUpdatedWalk => ({
      ...prevUpdatedWalk,
      [name]: value,
    }));

  };

  const handlePlaceChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPlaceId = e.target.value;
    setUpdatedWalk((prevUpdatedWalk) => ({
      ...prevUpdatedWalk,
      pid: selectedPlaceId,
    }));
  };


  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      var result = await axios.post(`${getApiDomain()}/v1/admin/addAd`, updatedWalk); // Update the endpoint to the correct one for adding walks
      // Handle success

      setMessage(true)

      console.log(result.data)
      const timer = setTimeout(() => {
        // Redirect to the desired location after 3 seconds
        window.location.href = '/ad/';
      }, 3000);
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      setUpdatedWalk(prevState => ({
        ...prevState,
        logo: base64String,
      }));
    };

    reader.readAsDataURL(file);
  };

  // @ts-ignore

  // @ts-ignore
  return (
    <form onSubmit={handleFormSubmit}>
      {updatedWalk && (
        <div className="my-3 px-3">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 ">Advert Information</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder={updatedWalk.name}
                value={updatedWalk.name}
                onChange={handleInputChange}
              />
            </p>
          </div>
          <div className="mt-6 border-t border-white/10">
            <dl className="divide-y divide-white/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Image</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="logo"
                    id="logo"
                    autoComplete="logo"
                    className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    placeholder={updatedWalk.logo}
                    defaultValue={updatedWalk.logo}
                    onChange={handleInputChange}
                  />
                  <div className="divider">OR</div>

                  <input
                    type="file"
                    name="logo"
                    id="logo"
                    className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    onChange={handleImageChange}
                  />
                  <div className="text-center rounded-lg overflow-hidden w-56 sm:w-96 mx-auto">
                    <img className="object-contain h-48 w-full "
                         src={updatedWalk.logo}/>
                  </div>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">URL</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="url"
                    id="url"
                    autoComplete="url"
                    className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    placeholder={updatedWalk.url}
                    defaultValue={updatedWalk.url}
                    onChange={handleInputChange}
                  />

                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Details</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"><textarea id="ad"
                                                                                                     name="ad"
                                                                                                     rows={3}
                                                                                                     className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                                                                                     defaultValue={updatedWalk.ad}
                                                                                                     onChange={handleInputChange}
                />
                </dd>
              </div>


            </dl>
            <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 ">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AdminvoucherAdd;


