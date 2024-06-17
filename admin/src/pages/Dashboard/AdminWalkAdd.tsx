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

import React, {FC, useState, FormEvent, useEffect} from 'react';
import axios from 'axios';
import {getApiDomain} from '../../lib/auth/supertokens';
import UINotificationSuccess from "../../components/ui/uiNotificationSuccess";
import {Walk} from "../../models/models";


export const AdminWalkAdd: FC = () => {
  const [newWalk, setNewWalk] = useState<Partial<Walk>>({
    name: '',
    tenant: 'app',
    details: '',
    tags: [],
    likes: 0,
    vouchers: [],
    places: [],
    image: '',
    status: false,
    calories: 0,
    distance: 0,
    duration: 0,
    steps: 0,
    geo: [{coordinate: [0, 0]}, {coordinate: [0, 0]}],
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
  
       setNewWalk(prevState => ({
              ...prevState,
              tenant: response.data[0].fff_tenant
            }));
  
              })
              .catch(function (error) {
                  // handle error
                  console.log(error);
              });
      }, []);
  


  const [message, setMessage] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setNewWalk(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      setNewWalk(prevState => ({
        ...prevState,
        image: base64String,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      var result = await axios.post(`${getApiDomain()}/v1/admin/walks`, newWalk); // Update the endpoint to the correct one for adding walks
      // Handle success

      setMessage(true)

      console.log(result.data)
      const timer = setTimeout(() => {
        // Redirect to the desired location after 3 seconds
        window.location.href = '/dashboard/' + result.data;
      }, 3000);
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="my-3 px-3">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 ">Walk Information</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              placeholder={newWalk.name}
              value={newWalk.name}
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
                  name="image"
                  id="image"
                  autoComplete="image"
                  className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder={newWalk.image}
                  defaultValue={newWalk.image}
                  onChange={handleInputChange}
                />
                <div className="divider">OR</div>

                <input
                  type="file"
                  name="image"
                  id="image"
                  className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={handleImageChange}
                />

                <div className="text-center rounded-lg overflow-hidden w-56 sm:w-96 mx-auto">
                  <img className="object-contain h-48 w-full "
                       src={newWalk.image}/>
                </div>
              </dd>
            </div>


            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Distance</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"><input
                type="number"
                name="distance"
                id="distance"
                autoComplete="distance"
                className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                defaultValue={newWalk.distance}
                onChange={handleInputChange}
              />
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Steps</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"><input
                type="number"
                name="steps"
                id="steps"
                autoComplete="steps"
                className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                defaultValue={newWalk.steps}
                onChange={handleInputChange}
              />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Duration</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"><input
                type="number"
                name="duration"
                id="duration"
                autoComplete="duration"
                className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                defaultValue={newWalk.duration}
                onChange={handleInputChange}
              />
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Calories</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"><input
                type="number"
                name="calories"
                id="calories"
                autoComplete="calories"
                className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                defaultValue={newWalk.calories}
                onChange={handleInputChange}
              />
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Details</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"><textarea id="details"
                                                                                                   name="details"
                                                                                                   rows={3}
                                                                                                   className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                                                                                   defaultValue={newWalk.details}
                                                                                                   onChange={handleInputChange}
              />
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Map</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                <span className="text-sm font-medium leading-6 ">Start Lat/lng</span>

                <input
                  type="text"
                  name="coordinate1"
                  id="coordinate1"
                  autoComplete="coordinate1"
                  onChange={handleInputChange}

                  className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder={newWalk.geo?.[0]?.coordinate[0].toString() + "," + newWalk.geo?.[0]?.coordinate[1].toString()}
                  defaultValue={newWalk.geo?.[0]?.coordinate[0].toString() + "," + newWalk.geo?.[0]?.coordinate[1].toString()}
                />

                <br/>
                <span className="text-sm font-medium leading-6 ">End Lat/lng</span>

                <input
                  type="text"
                  name="coordinate2"
                  id="coordinate2"
                  autoComplete="coordinate2"
                  onChange={handleInputChange}

                  className="px-1  block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder={newWalk.geo?.[1]?.coordinate[0].toString() + "," + newWalk.geo?.[1]?.coordinate[1].toString()}
                  defaultValue={newWalk.geo?.[1]?.coordinate[0].toString() + "," + newWalk.geo?.[1]?.coordinate[1].toString()}
                />
                <br/>
                <a
                  href={`https://www.google.com/maps/dir/${newWalk.geo?.[0].coordinate[0]},${newWalk.geo?.[0].coordinate[1]}/${newWalk.geo?.slice(-1)[0].coordinate[0]},${newWalk.geo?.slice(-1)[0].coordinate[1]}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block bg-white hover:bg-blue-700 text-dark font-bold py-2 px-4 rounded">Preview in
                  maps</a>
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
      <UINotificationSuccess open={message} setOpen={setMessage} message="Walk Added."/>
    </form>

  );
};

export default AdminWalkAdd;


