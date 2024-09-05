import React, { useEffect, useState, useCallback } from "react";
import { Profile } from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import { LoadingButton } from "../../components/LoadingButton";
import logo from "../../assets/logo-light.svg";
import Cropper, { Area } from "react-easy-crop";

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
                    <div className="absolute h-full w-1/3 bg-gray-900" />
                    <div className="left absolute left-1/3 h-full w-1/3 bg-gradient-to-r from-gray-900" />
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
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white ring ring-gray-600 ring-offset-2"
                        href="#"
                      >
                        2
                      </a>
                    </li>
                    <li className="text-left">
                      <a
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-white"
                        href="#"
                      >
                        3
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <h2 className="font-serif text-2xl font-semibold text-gray-700">
                Awesome, let's upload a cover photo
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mt-8 flex w-full flex-col pb-8">
                  <div className="relative text-center">
                    <div className="relative mb-4">
                      <h2 className="font-semibold text-gray-700">
                        Upload Cover Photo
                      </h2>
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
                              onChange={handleImageChange}
                            />

                            <img
                              src={formData.coverPicture}
                              alt="Profile"
                              className="w-64 border-4 border-white mx-auto"
                            />
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
        <div className="relative hidden h-screen select-none flex-col justify-center bg-yellow-500 bg-gradient-to-br md:flex md:w-1/2">
          <div className="py-16 px-8 text-gray-700 xl:w-[40rem]">
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
              experience
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default OnboardingPage;
