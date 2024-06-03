import React, { useState } from 'react';
import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {getApiDomain} from "../../lib/auth/supertokens";

const PostItem = ({ post, profile }) => {
    const [postLikes, setPostLikes] = useState(post.postLikes);
    const userHasLiked = postLikes.some(like => like.userId === profile?.supertokensId);

    const handleLikeClick = async () => {
        let updatedLikes;
        if (userHasLiked) {
            // Remove the like
            updatedLikes = postLikes.filter(like => like.userId !== profile?.supertokensId);

        } else {
            // Add the like
            updatedLikes = [...postLikes, { _id: new Date().getTime().toString(), postId: post._id, userId: profile?.supertokensId }];
        }

        setPostLikes(updatedLikes);

        try {
            // Call the API to save the like status
            await axios.post(`${getApiDomain()}/postLikes`, {
                postId: post._id,
                userId: profile?.supertokensId,
                liked: !userHasLiked
            });
        } catch (error) {
            console.error('Error saving like status:', error);
            // Optionally revert the like status in case of error
            setPostLikes(postLikes);
        }
    };

    return (
        <li key={post._id} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow max-w-4xl">
            <div className="flex flex-1 flex-col p-3">
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                    <a href={`/profile/${post.profile._id}`} className="group block flex-shrink-0">
                        <div className="flex items-center">
                            <div>
                                <img className="inline-block h-9 w-9 rounded-full" src={post.profile.profilePicture} alt="" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    {post.profile.first_name} {post.profile.last_name}
                                </p>
                                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
                            </div>
                        </div>
                    </a>
                    <img className="mx-auto mt-2 rounded-md" src={post.media} alt="" />
                    <a className='my-3' href={`/feed/${post.channel}/${post._id}`}>
                        <h2 dangerouslySetInnerHTML={{ __html: post.desc }}></h2>
                    </a>
                    <div className="flex py-4 justify-between">
                        <div className="flex space-x-2">
                            <div className="flex space-x-1 items-center">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                </span>
                                <span>{post.postComments.length}</span>
                            </div>

                            <div className="flex space-x-1 items-center" onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
                <span>
                  {userHasLiked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                  ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                  )}
                </span>
                                <span>{postLikes.length}</span>
                            </div>
                        </div>
                    </div>
                    <dd className="mt-0.5 text-sm text-gray-500">
                        {post.tags.map(tag => (
                            <a key={tag} href={`#${tag}`} className="mr-2">#{tag} </a>
                        ))}
                    </dd>
                    <a className="mt-0.5 text-sm text-gray-500" href={`/feed/${post.channel}/${post._id}`}>View all comments</a>
                    <dd className="mt-0.5 text-sm text-gray-500 ">{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</dd>
                </dl>
            </div>
            <div></div>
            <div className="divide-x"></div>
        </li>
    );
};

export default PostItem;