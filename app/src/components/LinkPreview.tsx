import { useState, useEffect } from "react";
import { getApiDomain } from "../lib/auth/supertokens";
import axios from "axios";

function LinkPreview({ url }) {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proxyUrl = `${getApiDomain()}/handlePreview?url=`;
        const response = await axios.get(proxyUrl + url);
        console.log(response);
        const isYouTubeVideo = isYouTubeURL(url);
        if (isYouTubeVideo) {
          const videoId = extractYouTubeVideoId(url);
          const videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

          setPreviewData({
            videoId,
            videoThumbnail,
          });
        } else {
          const title = response.data.title;
          const description = response.data.description;
          const image = response.data.image;

          setPreviewData({
            title,
            description,
            image,
          });
        }
      } catch (error) {
        console.error("Error fetching preview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const isYouTubeURL = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const extractYouTubeVideoId = (url) => {
    const videoIdRegex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?#]+)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : "";
  };

  const handleClick = () => {
    window.open(url, "_blank");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!previewData) {
    return <p>Failed to fetch link preview.</p>;
  }
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain;
    } catch (error) {
      console.error("Invalid URL", error);
      return "";
    }
  };
  if (previewData.videoId) {
    return (
      <div className="video-responsive rounded-2xl">
        <div className="aspect-w-1 aspect-h-1 ">
          <iframe
            src={`https://www.youtube.com/embed/${previewData.videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div
        onClick={handleClick}
        className="status-card compact status-card--link cursor-pointer"
      >
        <div className="status-card__image w-full md:size-auto md:shrink-0 h-[200px] rounded-l">
          <img
            className="status-card__image-image"
            src={previewData.image}
          ></img>
        </div>
        <div className="flex rtl:space-x-reverse items-start justify-between p-4">
          <div className="flex rtl:space-x-reverse items-start space-x-2">
            <span className="text-base leading-5 text-gray-700 dark:text-gray-600 font-normal tracking-normal font-sans normal-case">
              <div
                className="relative flex shrink-0 flex-col"
                data-testid="icon"
              >
                <svg
                  className="size-4.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  data-testid="svg-icon"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M9 15l6 -6"></path>
                  <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path>
                  <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path>
                </svg>
              </div>
            </span>
            <div className="flex flex-col space-y-1 flex-1 overflow-hidden">
              <span className="text-sm text-gray-700 dark:text-gray-600 font-medium tracking-normal font-sans normal-case">
                {getDomain(url)}
              </span>
              <p className="text-base leading-5 text-gray-900 dark:text-gray-100 font-normal tracking-normal font-sans normal-case">
                <span>{previewData.title}</span>
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-600 font-normal tracking-normal font-sans normal-case">
                {previewData.description}
              </p>
            </div>
          </div>
          <div className="relative"></div>
        </div>
      </div>
    </div>
  );
}

export default LinkPreview;
