import React, { useEffect, useState } from "react";
import { CommunityCollection, Profile } from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import { LoadingButton } from "../../components/LoadingButton";
import logo from "../../assets/logo-light.svg";
import { ImageIcon } from "lucide-react";

interface HomeProps {
  host: string;
  channel?: string;
}
function OnboardingPage({ host, channel }: HomeProps) {
  // @ts-ignore
  const [formData, setFormData] = useState<Profile>({
    coverPicture: "",
    first_name: "",
    last_name: "",
    location: "",
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
  const [community, setCommunity] = useState<Partial<CommunityCollection>>();

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
    try {
      const response = await axios.get(
        `${getApiDomain()}/community?name=${host}`,
      );
      setCommunity(response.data);
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      setFormData((prevState) => ({
        ...prevState,
        profilePicture: base64String,
      }));
      // @ts-ignore
      setSelectedImage(base64String);
    };

    reader.readAsDataURL(file);
  };

  const handleImageCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      setFormData((prevState) => ({
        ...prevState,
        coverPicture: base64String,
      }));
      // @ts-ignore
      setSelectedImage(base64String);
    };

    reader.readAsDataURL(file);
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
      window.location.href = "/onboarding-2/";
    }, 3000);
  };
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <>
      <div className="flex w-screen flex-wrap text-slate-800">
        <div
          className="relative hidden h-screen select-none flex-col justify-center bg-gray-200
 bg-gradient-to-br md:flex md:w-1/3 "
        >
          <div className="py-16 px-8  text-gray-700 xl:w-[40rem]">
            <a href="#" className="text-2xl font-bold text-blue-600">
              <img src={logo} className="h-10 w-auto" alt="Logo" />
            </a>
            <ol className="relative text-gray-900  mt-10 ml-5">
              <li className="mb-10 ms-10">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                  <svg
                    className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </span>
                <h5 className="font-medium leading-tight">Profile Image</h5>
                <p className="text-sm">Lets upload a awesome picture</p>
              </li>
              <li className="mb-10 ms-10">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                  <svg
                    className="w-3.5 h-3.5 text-gray-900 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                  </svg>
                </span>
                <h5 className="font-medium leading-tight">Cover Photo</h5>
                <p className="text-sm">Lets make your profile pop!</p>
              </li>
              <li className="mb-10 ms-10">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                  <svg
                    className="w-3.5 h-3.5 text-gray-900 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                  </svg>
                </span>
                <h5 className="font-medium leading-tight">Bio</h5>
                <p className="text-sm">Let people know who you are!</p>
              </li>
              <li className="ms-10">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                  <svg
                    className="w-3.5 h-3.5 text-gray-900 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                  </svg>
                </span>
                <h5 className="font-medium leading-tight">Finished</h5>
                <p className="text-sm">Lets get going</p>
              </li>
            </ol>
          </div>
        </div>
        <div className="flex w-full flex-col md:w-2/3">
          <div className="flex justify-center py-12 md:justify-start md:pl-12"></div>
          <div className="my-auto mx-auto flex flex-col justify-center pt-8 md:justify-start lg:w-[34rem]">
            <div className="flex w-full flex-col  px-2 sm:px-14">
              <div className="mx-auto w-full max-w-md   sm:px-0"></div>
              <h2 className="font-serif  font-semibold text-gray-700 text-center">
                <img
                  src={community?.community?.logo}
                  className="h-10 w-auto mx-auto my-5"
                  alt="Logo"
                />
                Hey 👋 lets get your profile up and running
              </h2>
              <form className="" onSubmit={handleSubmit}>
                <div className="mt-8 flex w-full flex-col pb-8">
                  <div className="relative text-center">
                    <div className="relative mb-4">
                      <h3 className=" font-semibold text-gray-700">
                        Upload Profile Picture
                      </h3>
                      <div className="flex items-center text-center">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer mx-auto mt-10"
                        >
                          {formData.profilePicture != "" ? (
                            <img
                              src={formData.profilePicture}
                              alt="Profile"
                              className="w-64 border-4 border-white mx-auto"
                            />
                          ) : (
                            <>
                              <div className="w-64 h-64 bg-indigo-700 h-screen flex items-center justify-center">
                                <span className="text-white h-20 w-20 bg-indigo-500 flex items-center justify-center rounded-3xl">
                                  <ImageIcon className="" />
                                </span>
                              </div>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="my-4 space-y-3">
                    <label htmlFor="terms" className="flex space-x-4">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-6 w-6 shrink-0 accent-gray-900"
                        defaultChecked=""
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      <span
                        id="terms-description"
                        className="text-sm text-gray-600"
                      >
                        I agree to the{" "}
                        <a className="underline" href="terms.html">
                          Terms and Conditions
                        </a>
                        . Learn about our Privacy Policy and our measures to
                        keep your data safe and secure.
                      </span>
                    </label>
                  </div>
                  <LoadingButton
                    type="submit"
                    size="lg"
                    disabled={!isChecked}
                    variant="ghost"
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
                    <label htmlFor="imagec-upload" className="cursor-pointer">
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
                          {formData.profilePicture != "" ? (
                            <img
                              src={formData.profilePicture}
                              alt="Profile"
                              className="w-32 h-32 rounded-full border-4 border-white -mt-16"
                            />
                          ) : (
                            <>
                              <div className="">
                                <ImageIcon />
                              </div>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <input
                  type="file"
                  id="imagec-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageCChange}
                />
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
  );
}

export default OnboardingPage;
