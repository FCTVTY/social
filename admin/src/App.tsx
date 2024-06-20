/*
 * Copyright (c) 2024.  Footfallfit & FICTIVITY. All rights reserved.
 * This code is confidential and proprietary to Footfallfit & FICTIVITY.
 * Unauthorized copying, modification, or distribution of this code is strictly prohibited.
 *
 * Authors:
 *
 * [@sam1f100](https://www.github.com/sam1f100)
 *
 */

import React, {useState, useEffect} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import {SuperTokensWrapper} from 'supertokens-auth-react';
import {initSuperTokens} from './lib/auth/supertokens';
import {LogoutPage} from './pages/auth/LogoutPage';
import {LoginPage} from './pages/auth/LoginPage';
import {DashboardPage} from './pages/Dashboard/DashboardPage';
import VoucherPage from './pages/vouchers/VoucherPage';
import "./output.css";
import {PwaPrompt} from 'react-ios-pwa-prompt-ts'
import axios from 'axios';
import ScrollToTop from "react-scroll-to-top";
import OfflineBanner from "./components/common/Offline";
import {LayoutWrapper} from "./components/layout/LayoutWrapper";
import AdminWalkDetails from "./pages/Dashboard/AdminWalkDetails";
import AdminWalkEdit from "./pages/Dashboard/AdminWalkEdit";
import AdminWalkPlaces from "./pages/Dashboard/AdminWalkPlaces";
import AdminWalkAdd from "./pages/Dashboard/AdminWalkAdd";
import AdminWalkVoucher from "./pages/Dashboard/AdminWalkVouchers";

import Session from "supertokens-auth-react/recipe/session";
import {UserRoleClaim} from "supertokens-auth-react/recipe/userroles"
import AdminVoucherDetails, {VoucherDetailPage} from "./pages/vouchers/AdminVoucherDetails";
import AdminvoucherEdit from "./pages/vouchers/AdminvoucherEdit";
import AdminvoucherAdd from "./pages/vouchers/AdminvoucherAdd";
import {AdminRoute} from "./components/common/AdminRoute";
import AdminChannelAdd from "./pages/Dashboard/AdminChannelAdd";


initSuperTokens();

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isGPSDisabled, setIsGPSDisabled] = useState(false);
  const [isPermissionRequested, setIsPermissionRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [isAdmin, setAdmin] = useState(false); // State to track loading status

  useEffect(() => {


    // Check if GPS is enabled
    if ('geolocation' in navigator) {
      navigator.permissions.query({name: 'geolocation'}).then(permissionStatus => {
        setIsGPSDisabled(permissionStatus.state === 'denied');
      });
    } else {
      console.error('Geolocation API is not supported');
    }

    // Set loading to true when a request starts
    const requestInterceptor = axios.interceptors.request.use(config => {
      setIsLoading(true);
      return config;
    });

    // Set loading to false when a request finishes
    const responseInterceptor = axios.interceptors.response.use(response => {
      setIsLoading(false);
      return response;
    }, error => {
      setIsLoading(false);
      return Promise.reject(error);
    });

    // Cleanup interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log('GPS is enabled');
      },
      error => {
        console.error('Error getting GPS location:', error);
        setIsPermissionRequested(true);
      }
    );
  };


  return (
    <div className="relative h-full">
      <SuperTokensWrapper>
        <OfflineBanner/>
        {/* Display loader if loading */}
        {isLoading && (
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">

              <svg fill='none' className="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
                <path clip-rule='evenodd'
                      d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                      fill='currentColor' fill-rule='evenodd'/>
              </svg>


              <div>Loading ...</div>
            </div>
          </div>
        )}


        {/* Your existing routes */}
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/logout" element={<LogoutPage/>}/>
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <LayoutWrapper withSideNav={true}>
                  <DashboardPage/>
                </LayoutWrapper>
              </AdminRoute>
            }
          />

          <Route
            path="/dashboard/:ID"
            element={<AdminRoute>
              <LayoutWrapper withSideNav={true}>
                <AdminWalkDetails/>
              </LayoutWrapper></AdminRoute>}
          />
          <Route
            path="/dashboard/add"
            element={<AdminRoute>
              <LayoutWrapper withSideNav={true}>
                <AdminWalkAdd/>
              </LayoutWrapper></AdminRoute>}
          />

            <Route
                path="/dashboard/addChannel/:ID"
                element={<AdminRoute>
                    <LayoutWrapper withSideNav={true}>
                        <AdminChannelAdd/>
                    </LayoutWrapper></AdminRoute>}
            />
          <Route
            path="/dashboard/edit/:ID"
            element={<AdminRoute>
              <LayoutWrapper withSideNav={true}>
                <AdminWalkEdit/>
              </LayoutWrapper></AdminRoute>}
          />
          <Route
            path="/dashboard/editPlaces/:ID"
            element={<AdminRoute>
              <LayoutWrapper withSideNav={true}>
                <AdminWalkPlaces/>
              </LayoutWrapper></AdminRoute>}
          />
          <Route
            path="/dashboard/editAd/:ID"
            element={<AdminRoute>
              <LayoutWrapper withSideNav={true}>
                <AdminWalkVoucher/>
              </LayoutWrapper></AdminRoute>}
          />







          <Route
            path="/Ad"
            element={
              <AdminRoute>
                <LayoutWrapper withSideNav={true}>
                  <VoucherPage/>
                </LayoutWrapper>
              </AdminRoute>
            }
          />

          <Route
            path="/Ad/:ID"
            element={
              <AdminRoute>
                <LayoutWrapper withSideNav={true}>
                  <VoucherDetailPage/>
                </LayoutWrapper>
              </AdminRoute>
            }
          />
          <Route
            path="/Ad/edit/:ID"
            element={
              <AdminRoute>
                <LayoutWrapper withSideNav={true}>
                  <AdminvoucherEdit/>
                </LayoutWrapper>
              </AdminRoute>
            }
          />
          <Route
            path="/Ad/add"
            element={
              <AdminRoute>
                <LayoutWrapper withSideNav={true}>
                  <AdminvoucherAdd/>
                </LayoutWrapper>
              </AdminRoute>
            }
          />


          <Route path="*" element={<Navigate to="/login"/>}/>
        </Routes>
      </SuperTokensWrapper>

    </div>
  );
}

export default App;
