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

import React, {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Navbar from '../../components/layout/navbar';
import {Header} from '../../components/layout/header';
import axios from 'axios';
import {getApiDomain} from '../../lib/auth/supertokens';
import Sidebar from "../../components/layout/sidebar";
import ThemeSwitcher from "../../components/common/ThemeSwitcher";

interface Voucher {
  _id: string;
  code: string;
  details: string;
  expired: boolean;
  logo: string;
  name: string;
  tenant: string;
  vid: string;
}

interface VoucherData {
  _id: string;
  used: boolean;
  usid: string;
  vid: string;
  vouchers: Voucher[];
}

export const SettingsPage: FC = () => {
  const {userID} = useParams<{ userID: string }>();

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [domain, setDomain] = useState<string>(window.location.href);

  useEffect(() => {
    // Fetch vouchers data
    axios
      .get<VoucherData[]>(getApiDomain() + '/vouchers')
      .then(function (response) {
        // handle success
        console.log(response);
        // Update vouchers state with the received data
        if (response.data && response.data.length > 0) {
          const voucherData = response.data[0]; // Assuming only one voucher data is returned
          setVouchers(voucherData.vouchers);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []); // Trigger useEffect only once when the component mounts

  return (
    <div className="">
      <Header/>
      <Sidebar/>
      <div className="bg-white dark:bg-slate-800 w-full px-3 pt-6 pb-20 overflow-y-auto flex-grow">
                     <span className="flex w-full flex-row items-center justify-between px-6 py-4"><strong
                       className="typo-title3 dark:">Your Settings</strong><span
                       className="flex flex-row gap-3">

                  <button
                    className="inline-flex items-center justify-center w-10 h-10 mr-2 text-zinc-500	 transition-colors duration-150 bg-slate-50	dark:bg-slate-900 rounded-full focus:shadow-outline ">
  <svg
    width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 pointer-events-none"><path
    d="M16.5 12a3 3 0 013 3v1.5a3 3 0 01-3 3H15a3 3 0 01-3-3H5.25a.75.75 0 110-1.5H12a3 3 0 013-3h1.5zm0 1.5H15a1.5 1.5 0 00-1.493 1.356L13.5 15v1.5a1.5 1.5 0 001.356 1.493L15 18h1.5a1.5 1.5 0 001.493-1.356L18 16.5V15a1.5 1.5 0 00-1.356-1.493L16.5 13.5zM9 4.5a3 3 0 013 3h6.75a.75.75 0 110 1.5H12a3 3 0 01-3 3H7.5a3 3 0 01-3-3V7.5a3 3 0 013-3H9zM7.5 6a1.5 1.5 0 00-1.493 1.356L6 7.5V9a1.5 1.5 0 001.356 1.493l.144.007H9a1.5 1.5 0 001.493-1.356L10.5 9V7.5a1.5 1.5 0 00-1.356-1.493L9 6H7.5z"
    fill="currentcolor" fill-rule="evenodd"></path></svg>
</button></span></span>
        {/* Notification Settings */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Notification Settings</h5>
            <p className="card-text">Customize your notification preferences here.</p>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="notificationEmails"/>
              <label className="form-check-label" htmlFor="notificationEmails">
                Receive notification emails
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="notificationSMS"/>
              <label className="form-check-label" htmlFor="notificationSMS">
                Receive notification SMS
              </label>
            </div>
          </div>
        </div>
        {/* Account Settings */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Account Settings</h5>
            <p className="card-text">Manage your account preferences here.</p>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username"
                     placeholder="Enter your username"/>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" className="form-control" id="email"
                     placeholder="Enter your email address"/>
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </div>
        {/* Privacy Settings */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Privacy Settings</h5>
            <p className="card-text">Manage your privacy preferences here.</p>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="publicProfile"/>
              <label className="form-check-label" htmlFor="publicProfile">
                Make my profile public
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="enableLocation"/>
              <label className="form-check-label" htmlFor="enableLocation">
                Enable location sharing
              </label>
            </div>
          </div>
        </div>
        {/* Security Settings */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Security Settings</h5>
            <p className="card-text">Manage your account security preferences here.</p>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="twoFactorAuth"/>
              <label className="form-check-label" htmlFor="twoFactorAuth">
                Enable two-factor authentication
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="passwordReset"/>
              <label className="form-check-label" htmlFor="passwordReset">
                Require password reset periodically
              </label>
            </div>
          </div>
        </div>
        {/* Language Settings */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Language Settings</h5>
            <p className="card-text">Select your preferred language here.</p>
            <select className="form-select mb-3">
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </div>
        {/* Theme Settings */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Theme Settings</h5>
            <p className="card-text">Customize your app's theme here.</p>
            <div className="form-check">
              <ThemeSwitcher/>

            </div>
          </div>
        </div>
        {/* Email Settings */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Email Settings</h5>
            <p className="card-text">Manage your email preferences here.</p>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="emailSubscriptions"/>
              <label className="form-check-label" htmlFor="emailSubscriptions">
                Subscribe to email newsletters
              </label>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="emailFrequency">Email Frequency</label>
              <select className="form-select" id="emailFrequency">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
        {/* Additional settings can be added here */}
      </div>
      <Navbar/>
    </div>
  );
};

export default SettingsPage;
