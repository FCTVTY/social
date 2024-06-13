import React from 'react';

const YouTubeEmbed = ({ url }) => {
    const videoId = extractYouTubeVideoId(url);

    // Function to extract YouTube video ID from URL
    function extractYouTubeVideoId(url) {
        let videoId = '';
        let regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);
        if (match && match[1]) {
            videoId = match[1];
        }
        return videoId;
    }

    // Render the YouTube video embed if videoId is truthy
    return videoId ? (
        <div className="video-responsive">
            <div className="aspect-w-16 aspect-h-9">
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allowFullScreen
                    title="Embedded YouTube Video"
                ></iframe>
            </div>
        </div>
    ) : (<></>); // Return null if videoId is falsy
};

export default YouTubeEmbed;
