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

  if (previewData.videoId) {
    return (
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        <img src={previewData.videoThumbnail} alt="Video Thumbnail" />
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className=" mx-auto bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      {previewData.image && (
        <div className="h-48 bg-gray-200">
          <img
            src={previewData.image}
            alt="Link Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {previewData.title}
        </h3>
        <p className="text-sm text-gray-700 mt-1 line-clamp-3">
          {previewData.description}
        </p>
        <div className="flex justify-start mt-3">
          <div className="btn btn-sm   py-1 px-3 rounded ">Read More</div>
        </div>
      </div>
    </div>
  );
}

export default LinkPreview;
