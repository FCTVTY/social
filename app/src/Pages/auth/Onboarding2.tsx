import React, { useEffect, useState, useCallback } from "react";
import { Profile } from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import { LoadingButton } from "../../components/LoadingButton";
import logo from "../../assets/logo-light.svg";
import Cropper, { Area } from "react-easy-crop";
import { BadgeCheck, ImageIcon } from "lucide-react";

interface HomeProps {
  host: string;
  channel?: string;
}
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Avoid CORS issues
    image.src = url;
  });
export async function getCroppedImg(imageSrc: string, pixelCrop: any) {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
}

function OnboardingPage({ host, channel }: HomeProps) {
  const [formData, setFormData] = useState<Profile>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(3);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // For image selection
  const [croppedImage, setCroppedImage] = useState<string | null>(null); // For cropped image

  useEffect(() => {
    fetchDetails();
  }, [host]);

  const fetchDetails = async () => {
    try {
      const profileresponse = await axios.get(`${getApiDomain()}/profile`);
      setFormData(profileresponse.data);
    } catch (error) {
      console.error("Error fetching profile details:", error);
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
      setSelectedImage(event.target?.result as string); // Set image for cropping
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      // Get the cropped image as a Blob
      const croppedImgBlob = await getCroppedImg(
        selectedImage,
        croppedAreaPixels,
      );

      // Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(croppedImgBlob);
      reader.onloadend = () => {
        const base64data = reader.result as string;

        // Update the state with the Base64 string
        setCroppedImage(base64data);
        setFormData((prevState) => ({
          ...prevState,
          coverPicture: base64data, // Update formData with the Base64 image
        }));
      };
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  const handleImageCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      setSelectedImage(event.target?.result as string); // Set image for cropping
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${getApiDomain()}/createProfile`,
        formData,
      );
      console.log(result.data);
      setTimeout(() => {
        window.location.href = "/onboarding-3/";
      }, 3000);
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setLoading(false);
    }
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
            <div className="flex w-full flex-col sm:px-14">
              <div className="mx-auto w-full max-w-md pb-20 px-8 sm:px-0"></div>
              <h2 className="font-serif font-semibold text-gray-700 text-center">
                Awesome, let's upload a cover photo
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mt-8 flex w-full flex-col pb-8">
                  <div className="relative text-center">
                    <div className="relative mb-4">
                      <h3 className="font-semibold text-gray-700">
                        Upload Cover Photo
                      </h3>
                      <div className="flex items-center text-center">
                        {selectedImage ? (
                          <div className="crop-container h-[200px] w-[200px]">
                            <Cropper
                              image={selectedImage}
                              crop={crop}
                              zoom={1}
                              aspect={2.1}
                              onCropChange={setCrop}
                              onZoomChange={setZoom}
                              onCropComplete={onCropComplete}
                            />
                          </div>
                        ) : (
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer mx-auto mt-10"
                          >
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />

                            <div className="rounded-xl w-[400px] border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 mb-4 dark:text-white ">
                              <div className="rounded-t-lg overflow-hidden">
                                {formData.coverPicture != "" ? (
                                  <img
                                    src={formData.coverPicture}
                                    alt="Profile"
                                    className="object-cover object-top w-full aspect-video"
                                  />
                                ) : (
                                  <>
                                    <div className="w-[400px] h-64 bg-indigo-700 flex items-center justify-center">
                                      <span className="text-white h-20 w-20 bg-indigo-500 flex items-center justify-center rounded-3xl mx-auto">
                                        <ImageIcon className="" />
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden">
                                <img
                                  className="object-cover object-center "
                                  src={formData?.profilePicture}
                                  alt=""
                                />
                              </div>
                              <div className="text-center mt-2 mx-auto">
                                <h2 className="font-semibold">
                                  <span className="inline-flex">
                                    {formData?.first_name} {formData?.last_name}
                                  </span>
                                </h2>
                                <p
                                  className="text-gray-900 pb-5"
                                  dangerouslySetInnerHTML={{
                                    __html: formData?.bio,
                                  }}
                                ></p>
                              </div>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedImage && (
                    <button
                      type="button"
                      onClick={handleCrop}
                      className="mt-2 p-2 bg-blue-500 text-white rounded"
                    >
                      Crop and Save
                    </button>
                  )}

                  <LoadingButton
                    type="submit"
                    size="lg"
                    variant="ghost"
                    className="my-2 flex items-center justify-center rounded-md py-3 font-medium text-white bg-gray-900"
                    loading={loading}
                  >
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
    </>
  );
}

export default OnboardingPage;
