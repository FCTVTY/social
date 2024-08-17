import React, { useEffect, useState } from "react";
import { Profile } from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import { LoadingButton } from "../../components/LoadingButton";
import logo from "../../assets/logo-light.svg";

interface HomeProps {
  host: string;
  channel?: string;
}
function OnboardingPage3({ host, channel }: HomeProps) {
  // @ts-ignore
  const [formData, setFormData] = useState<Profile>({
    coverPicture: "",
    first_name: "",
    last_name: "",
    bio: "",
    profilePicture: "",
    _id: "",
    email: "",
    me: true,
    posts: [],
    supertokensId: "",
    username: host,
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDetails();
  }, [host]);

  const fetchDetails = async () => {
    try {
      const profileresponse = await axios.get(`${getApiDomain()}/profile`);

      setFormData(profileresponse.data);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // Do whatever you need to do with the form data
    setLoading(true);
    var result = await axios.post(
      `${getApiDomain()}/createProfile`,
      formData,
      {},
    );
    console.log(result.data);
    const timer = setTimeout(() => {
      // Redirect to the desired location after 3 seconds
      window.location.href = "/s/";
    }, 3000);
  };
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <>
      {formData && (
        <>
          <div className="flex w-screen flex-wrap text-slate-800">
            <div className="flex w-full flex-col md:w-1/2">
              <div className="flex justify-center py-12 md:justify-start md:pl-12">
                <a href="#" className="text-2xl font-bold text-blue-600">
                  <img src={logo} className="h-10 w-auto" alt="Logo" />
                </a>
              </div>
              <div className="my-auto mx-auto flex flex-col justify-center pt-8 md:justify-start lg:w-[34rem]">
                <div className="flex w-full flex-col rounded-2xl bg-white px-2 sm:px-14">
                  <div className="mx-auto w-full max-w-md pb-20 px-8 sm:px-0">
                    <div className="relative mt-5">
                      <div
                        className="absolute left-0 top-2 h-0.5 w-full bg-gray-200"
                        aria-hidden="true"
                      >
                        <div className="absolute h-full w-2/3 bg-gray-900" />
                        {/* change to w-2/3 for next step */}
                        <div className="absolute h-full w-full bg-gray-900" />
                        {/* change to left-1/2 for next step */}
                      </div>
                      <ul className="relative flex w-full justify-between">
                        <li className="text-left">
                          <a
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white"
                            href="#"
                          >
                            1
                          </a>
                        </li>
                        <li className="text-left">
                          <a
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white"
                            href="#"
                          >
                            2
                          </a>
                        </li>
                        <li className="text-left">
                          <a
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white ring ring-gray-600 ring-offset-2"
                            href="#"
                          >
                            3
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-gray-700">
                    One final thing, lets set a bio
                  </h2>
                  <form className="" onSubmit={handleSubmit}>
                    <div className="mt-8 flex w-full flex-col pb-8">
                      <div className="relative text-center">
                        <div className="relative mb-4">
                          <h2 className=" font-semibold text-gray-700">
                            Upload your bio
                          </h2>
                          <div className="flex items-center text-center">
                            <div className="mt-1 ml-auo space-y-4 w-full">
                              <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                rows={3}
                                className="w-full rounded-md px-4 border text-sm pt-2.5 outline-[#007bff] w-full"
                                placeholder="Tell us a little about yourself"
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <LoadingButton
                        type="submit"
                        size="lg"
                        variant="ghost"
                        disabled={!isChecked}
                        className={`my-2 flex items-center justify-center rounded-md py-3 font-medium text-white ${isChecked ? "bg-gray-900" : "bg-gray-400"}`}
                        loading={loading}
                      >
                        {" "}
                        Continue
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-4 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </LoadingButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="relative hidden h-screen select-none flex-col justify-center bg-yellow-500 bg-gradient-to-br md:flex md:w-1/2 ">
              <div className="py-16 px-8  text-gray-700 xl:w-[40rem]">
                <span className="rounded-full bg-white px-3 py-1 font-medium text-black">
                  New Feature
                </span>
                <p className="my-6 text-3xl font-semibold leading-10 text-gray-700">
                  Channel Support within{" "}
                  <span className="whitespace-nowrap py-2 text-gray-800">
                    Communities
                  </span>
                  .
                </p>
                <p className="mb-4">
                  Split out the feed into Channels to declutter your viewing
                  experiance
                </p>
              </div>
            </div>
          </div>

          <div className="hidden min-h-screen flex flex-col  py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md md:w-3/5">
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Welcome to b:hive
              </h2>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create your profile
              </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full ">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                      <div className="relative">
                        <label
                          htmlFor="imagec-upload"
                          className="cursor-pointer"
                        >
                          {" "}
                          <img
                            src={formData.coverPicture}
                            alt="Cover Photo"
                            className="w-full h-48 object-cover"
                          />
                        </label>
                        <div className="absolute bottom-0 left-0 p-4">
                          <div className="flex items-center">
                            <label
                              htmlFor="image-upload"
                              className="cursor-pointer"
                            >
                              {" "}
                              <img
                                src={formData.profilePicture}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white -mt-16"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add more input fields for email, password, etc. */}

                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bio
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Tell us a little about yourself"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <LoadingButton
                      type="submit"
                      size="lg"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      loading={loading}
                    >
                      Continue
                    </LoadingButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OnboardingPage3;
