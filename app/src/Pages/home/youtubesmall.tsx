import React from 'react';

const YouTubeEmbedsmall = ({ url }) => {
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

            <div className="aspect-w-1 aspect-h-1">
                <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen></iframe>
            </div>


        </div>
    ) : (<></>); // Return null if videoId is falsy
};

export default YouTubeEmbedsmall;
