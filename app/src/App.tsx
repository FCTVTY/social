import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, Navigate, useNavigation } from "react-router-dom";
import Feed from "./Pages/home/Feed";
import ApplicationLayout from "./layout/applicationLayout";
import Join from "./Pages/home/join";
import AuthLayout from "./layout/AuthLayout";
import Login from "./Pages/auth/login";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { initSuperTokens } from "./lib/auth/supertokens";
import Register from "./Pages/auth/register";
import Settings from "./Pages/profile/settings";
import Home from "./Pages/home/Home";
import Post from "./Pages/home/Post";
import PostView from "./Pages/home/Post";
import EventsPage from "./Pages/home/events";
import EventPage from "./Pages/home/event";
import MembersPage from "./Pages/home/members";
import Onboarding from "./Pages/auth/Onboarding";
import Onboarding2 from "./Pages/auth/Onboarding2";
import Onboarding3 from "./Pages/auth/Onboarding3";
import { AccessDeniedScreen } from "supertokens-auth-react/recipe/session/prebuiltui";
import { Provider as RollbarProvider } from "@rollbar/react";
import { Provider } from "react-redux";

import RemovePost from "./Pages/home/RemovePost";
import UserRoles from "supertokens-auth-react/recipe/userroles";
import {
  UserRoleClaim,
  PermissionClaim,
} from "supertokens-auth-react/recipe/userroles";
import { SessionContext } from "supertokens-auth-react/recipe/session";
import Session from "supertokens-auth-react/recipe/session";
import CustomSwitch, { NavigationLoadingBar } from "./layout/loader";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import Chat from "./Pages/Chat/Chat";
import PasswordReset from "./Pages/auth/passwordReset";
import DeleteAccount from "./Pages/auth/DeleteAccount";
import ResourcesPage from "./Pages/resources/Resources";
import RemoveCourse from "./Pages/home/RemoveCourse";
import CoursesPage from "./Pages/courses/Courses";
import CoursePage from "./Pages/courses/Course";
import Site from "./Pages/admin/site";
import ChangeLogPage from "./Pages/ChangeLog/ChangeLogPage";
import FAQ from "./Pages/home/FAQ";
import PostBox from "./Pages/home/PostBox";
import Locked from "./Pages/Chat/Chat";
import Recover from "./Pages/auth/Recover";
import Landing from "./Pages/home/Landing";
import CourseMangement from "./Pages/courses/CourseMangement";
import store from "./store/store";
import ApplicationLayoutFull from "./layout/applicationLayoutFull";
import LockPost from "./Pages/home/LockPost";
import ProfilePage from "./Pages/profile/Profile";

initSuperTokens();

// Define context types
interface AppContextType {
  host: string;
  setHost: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context

function App() {
  if (process.env.NODE_ENV !== "development") {
    // Disable all console methods in production
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
  }

  const [subdomain, setSubDomain] = useState("null");
  const [communityFound, setCommunity] = useState("null");
  const [channel, setChannel] = useState("null");
  const [post, setPost] = useState("null");
  const [host, setHost] = useState(window.location.host); // Use state for host

  useEffect(() => {
    const arr = host.split(".").slice(0, host.includes("local") ? -1 : -2);
    if (arr.length > 0) {
      setSubDomain(arr[0]);
      console.log(arr[0]);
      console.log("using:" + host);
    }
    console.log(host);
    if (host === "localhost:5173") {
      // setSubDomain("neo-egvzkmsh")
      setSubDomain("meta");
      setHost("meta");
    }

    // Parse the URL
    const parsedUrl = window.location.href;
    const url = new URL(window.location.href);

    // Extracting the channel and post IDs from the URL
    const pathnameParts = url.pathname.split("/");
    const channelID = pathnameParts[2];
    const postID = pathnameParts[3]; // This may be undefined if the URL structure changes

    console.info("host:", host);
    console.log("Channel ID:", channelID);
    console.log("Post ID:", postID);

    setChannel(channelID);
    setPost(postID);

    if (url.pathname.includes("event")) {
      console.log("event page");
      const postID = pathnameParts[2];
      console.log("Post ID:", postID);
      setPost(postID);
    }
  }, []);
  const isDebugMode = import.meta.env.VITE_DEBUG_MODE === "true";

  return (
    <div>
      {isDebugMode && (
        <div
          id="toast-default"
          className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 fixed z-[9999999] bottom-5 left-5"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
              />
            </svg>
            <span className="sr-only">Fire icon</span>
          </div>
          <div className="ms-3 text-sm font-normal">Using DEV</div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-dismiss-target="#toast-default"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
      <Provider store={store}>
        <SuperTokensWrapper>
          <CustomSwitch>
            <Suspense fallback={<LoadingBar />}>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <AuthLayout host={subdomain}>
                      <Login host={subdomain} />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/auth"
                  element={
                    <AuthLayout host={subdomain}>
                      <Login host={subdomain} />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AuthLayout host={subdomain}>
                      <Register host={subdomain} />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/auth/recover"
                  element={
                    <AuthLayout host={subdomain}>
                      <Recover host={subdomain} />{" "}
                    </AuthLayout>
                  }
                />
                <Route
                  path="/auth/reset-password"
                  element={
                    <AuthLayout host={subdomain}>
                      <PasswordReset host={subdomain} />{" "}
                    </AuthLayout>
                  }
                />

                <Route
                  path="/s/:channel"
                  element={
                    <SessionAuth>
                      <ApplicationLayout
                        host={subdomain}
                        channel={channel}
                        isChanelPage={true}
                      >
                        <Feed host={subdomain} channel={channel} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />

                <Route
                  path="/s/:ID/:post"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <PostView host={subdomain} post={post} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />
                <Route
                  path="/members/:ID"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <MembersPage host={subdomain} />
                      </ApplicationLayout>
                    </SessionAuth>
                  }
                />
                <Route
                  path="/events/:ID"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <EventsPage host={subdomain} />
                      </ApplicationLayout>
                    </SessionAuth>
                  }
                />
                <Route
                  path="/event/:ID"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <EventPage host={subdomain} post={channel} />
                      </ApplicationLayout>
                    </SessionAuth>
                  }
                />

                <Route
                  path="/error"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <Locked host={subdomain} />
                      </ApplicationLayout>
                    </SessionAuth>
                  }
                />

                <Route
                  path="/profile/:id"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <ProfilePage host={subdomain} profileid={channel} />
                      </ApplicationLayout>
                    </SessionAuth>
                  }
                />

                <Route
                  path="/auth/deleteAccount"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <DeleteAccount host={subdomain} profileid={channel} />
                      </ApplicationLayout>
                    </SessionAuth>
                  }
                />

                <Route
                  path="/Onboarding"
                  element={
                    <SessionAuth>
                      <Onboarding host={subdomain} />{" "}
                    </SessionAuth>
                  }
                />

                <Route
                  path="/Onboarding-2"
                  element={
                    <SessionAuth>
                      <Onboarding2 host={subdomain} />{" "}
                    </SessionAuth>
                  }
                />
                <Route
                  path="/Onboarding-3"
                  element={
                    <SessionAuth>
                      <Onboarding3 host={subdomain} />{" "}
                    </SessionAuth>
                  }
                />
                <Route
                  path="/removepost/:id"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <RemovePost host={subdomain} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />
                <Route
                  path="/lockpost/:id"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <LockPost host={subdomain} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />
                <Route
                  path="/removeCourse/:id"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <RemoveCourse host={subdomain} profileid={channel} />
                      </ApplicationLayout>
                    </SessionAuth>
                  }
                />

                <Route
                  path="/home"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <Home />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <Settings />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />
                <Route
                  path="/Landing"
                  element={
                    <SessionAuth>
                      <Landing />
                    </SessionAuth>
                  }
                />
                <Route
                  path="/admin/site"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <Site host={subdomain} channel={channel} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />
                <Route
                  path="/resources"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <ResourcesPage host={subdomain} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />

                <Route
                  path="/Academy"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <CoursesPage host={subdomain} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />
                <Route
                  path="/AcademyManagement"
                  element={
                    <SessionAuth
                      accessDeniedScreen={AccessDeniedScreen}
                      overrideGlobalClaimValidators={(globalValidators) => [
                        ...globalValidators,
                        UserRoleClaim.validators.includes("admin"),
                      ]}
                    >
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <CourseMangement host={subdomain} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />

                <Route
                  path="/Course/:ID"
                  element={
                    <SessionAuth>
                      <ApplicationLayoutFull host={subdomain} channel={channel}>
                        <CoursePage host={subdomain} />
                      </ApplicationLayoutFull>{" "}
                    </SessionAuth>
                  }
                />

                <Route
                  path="/changelog"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <ChangeLogPage host={subdomain} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />

                <Route
                  path="/FAQ"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain} channel={channel}>
                        <FAQ host={subdomain} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />

                <Route
                  path="*"
                  element={
                    <SessionAuth>
                      <ApplicationLayout host={subdomain}>
                        <Feed host={subdomain} />
                      </ApplicationLayout>{" "}
                    </SessionAuth>
                  }
                />
              </Routes>
            </Suspense>
          </CustomSwitch>
        </SuperTokensWrapper>
      </Provider>
    </div>
  );
}

window.UserRoleClaim = UserRoles.UserRoleClaim;
window.PermissionClaim = UserRoles.PermissionClaim;
export default App;
