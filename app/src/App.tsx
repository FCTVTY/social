import React, {useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Routes, Navigate, useNavigation} from 'react-router-dom';
import Feed from "./Pages/home/Feed";
import ApplicationLayout from "./layout/applicationLayout";
import Join from "./Pages/home/join";
import AuthLayout from "./layout/AuthLayout";
import Login from "./Pages/auth/login";
import {SuperTokensWrapper} from "supertokens-auth-react";
import {SessionAuth} from 'supertokens-auth-react/recipe/session';
import {initSuperTokens} from "./lib/auth/supertokens";
import Register from "./Pages/auth/register";
import Settings from "./Pages/profile/settings";
import Home from "./Pages/home/Home";
import Post from "./Pages/home/Post";
import PostView from "./Pages/home/Post";
import EventsPage from "./Pages/home/events";
import Profile from "./Pages/home/Profile";
import EventPage from "./Pages/home/event";
import MembersPage from "./Pages/home/members";
import ProfilePage from "./Pages/home/Profile";
import Onboarding from "./Pages/auth/Onboarding";
import Onboarding2 from "./Pages/auth/Onboarding2";
import Onboarding3 from "./Pages/auth/Onboarding3";

import RemovePost from "./Pages/home/RemovePost";
import UserRoles from "supertokens-auth-react/recipe/userroles";
import {UserRoleClaim, PermissionClaim} from "supertokens-auth-react/recipe/userroles";
import {SessionContext} from "supertokens-auth-react/recipe/session"
import Session from 'supertokens-auth-react/recipe/session';
import {NavigationLoadingBar} from "./layout/loader";
import LoadingBar, {LoadingBarRef} from "react-top-loading-bar";
import Courses from './Pages/courses/Courses';
import Chat from "./Pages/Chat/Chat";
import Course from './Pages/courses/Course';

initSuperTokens();


// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

// Whenever the user explicitly chooses light mode
localStorage.theme = 'light'

// Whenever the user explicitly chooses dark mode
localStorage.theme = 'dark'

// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem('theme')



function App() {




    const [subdomain, setSubDomain] = useState("null");
    const [communityFound, setCommunity] = useState("null");
    const [channel, setChannel] = useState("null");
    const [post, setPost] = useState("null");

    useEffect(() => {
        const host = window.location.host; // gets the full domain of the app

        const arr = host
            .split(".")
            .slice(0, host.includes("local") ? -1 : -2);
        if (arr.length > 0) {
            setSubDomain(arr[0]);
            console.log(arr[0])
            console.log("using:"+host)
        }
        console.log(host)
        if(host === "localhost:5173")
        {
            setSubDomain("goodwin")
        }


        // Parse the URL
        const parsedUrl = window.location.href
        const url = new URL(window.location.href);

// Extracting the channel and post IDs from the URL
        const pathnameParts = url.pathname.split('/');
        const channelID = pathnameParts[2];
        const postID = pathnameParts[3]; // This may be undefined if the URL structure changes

        console.log('Channel ID:', channelID);
        console.log('Post ID:', postID);


        setChannel(channelID)
        setPost(postID)

        if(url.pathname.includes("event"))
        {
            console.log("event page")
            const postID = pathnameParts[2];
            console.log('Post ID:', postID);
            setPost(postID)
        }

    }, []);

 


  return (
      <SuperTokensWrapper>

        <Routes>
            <Route path="/login" element={<AuthLayout>
<Login/>
                </AuthLayout>}/>
            <Route path="/register" element={<AuthLayout>
                <Register/>
            </AuthLayout>}/>

            <Route path="/feed/:ID" element={ <SessionAuth><ApplicationLayout host={subdomain} channel={channel} isChanelPage={true}>


                <Feed host={subdomain} channel={channel}/></ApplicationLayout> </SessionAuth>}/>

            <Route path="/feed/:ID/:post" element={ <SessionAuth><ApplicationLayout host={subdomain} channel={channel}>


                <PostView host={subdomain} post={post} /></ApplicationLayout> </SessionAuth>}/>
            <Route path="/members/:ID"
                   element={<SessionAuth><ApplicationLayout host={subdomain} channel={channel}>


                       <MembersPage host={subdomain}/></ApplicationLayout></SessionAuth>}/>
            <Route path="/events/:ID"
                   element={<SessionAuth><ApplicationLayout host={subdomain} channel={channel}>


                       <EventsPage host={subdomain}/></ApplicationLayout></SessionAuth>}/>
            <Route path="/event/:ID"
                   element={<SessionAuth><ApplicationLayout host={subdomain} channel={channel}>



                       <EventPage host={subdomain} post={post}/></ApplicationLayout></SessionAuth>}/>


          <Route path="/Chat"
                 element={<SessionAuth><ApplicationLayout host={subdomain} channel={channel}>


                   <Chat host={subdomain}/>
                 </ApplicationLayout></SessionAuth>}/>


            <Route path="/profile/:id"
                   element={<SessionAuth><ApplicationLayout host={subdomain} channel={channel}>


                       <ProfilePage host={subdomain} profileid={channel}/></ApplicationLayout></SessionAuth>}/>

            <Route path="/Onboarding" element={ <SessionAuth>


                <Onboarding host={subdomain}/> </SessionAuth>}/>

            <Route path="/Onboarding-2" element={ <SessionAuth>


                <Onboarding2 host={subdomain}/> </SessionAuth>}/>
            <Route path="/Onboarding-3" element={ <SessionAuth>


                <Onboarding3 host={subdomain}/> </SessionAuth>}/>
            <Route path="/removepost/:id" element={ <SessionAuth><ApplicationLayout host={subdomain} channel={channel}>


                <RemovePost host={subdomain} profileid={channel}/></ApplicationLayout> </SessionAuth>}/>

            <Route path="/home" element={ <SessionAuth><ApplicationLayout host={subdomain} channel={channel}>


                <Home/></ApplicationLayout> </SessionAuth>}/>

            <Route path="/settings" element={ <SessionAuth><ApplicationLayout host={subdomain} channel={channel}>


                <Settings/></ApplicationLayout> </SessionAuth>}/>


          <Route path="/courses" element={ <SessionAuth><ApplicationLayout host={subdomain} channel={channel}>


            <Courses/></ApplicationLayout> </SessionAuth>}/>

          <Route path="/course/:ID" element={ <SessionAuth><ApplicationLayout host={subdomain} channel={channel}>


            <Course/></ApplicationLayout> </SessionAuth>}/>


            <Route path='/auth' element={<AuthLayout>
                <Login/>
            </AuthLayout>}/>
            <Route path="*" element={ <SessionAuth><ApplicationLayout host={subdomain}>
                <Feed host={subdomain}/></ApplicationLayout> </SessionAuth>}/>


            </Routes>
      </SuperTokensWrapper>

    );
}
window.UserRoleClaim = UserRoles.UserRoleClaim;
window.PermissionClaim = UserRoles.PermissionClaim;
export default App;
