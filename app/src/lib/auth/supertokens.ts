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

import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";


export function getApiDomain() {
  const apiUrl = import.meta.env.VITE_API_DOMAIN || 'http://localhost:3001/v1';
  console.log(apiUrl);
  return apiUrl;
}

export function getWebsiteDomain() {
  const websiteUrl = import.meta.env.VITE_WEBSITE_DOMAIN || 'http://localhost:5173';
  console.log(websiteUrl);
  return websiteUrl;
}

export const SuperTokensConfig = {
  appInfo: {
    appName: "bhive",
    apiDomain: getApiDomain(),
    websiteDomain: getWebsiteDomain(),
  },
  // recipeList contains all the modules that you want to
  // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
  recipeList: [EmailPassword.init(), Session.init(),
  ],
};

export const recipeDetails = {
  docsLink: "https://supertokens.com/docs/emailpassword/introduction",
};


export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
  return props.children;
};


export const initSuperTokens = () => {


  SuperTokens.init(SuperTokensConfig);
};