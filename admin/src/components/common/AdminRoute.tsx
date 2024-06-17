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

import React from "react";
import {SessionAuth} from 'supertokens-auth-react/recipe/session';
import {AccessDeniedScreen} from 'supertokens-auth-react/recipe/session/prebuiltui';
import {UserRoleClaim, /*PermissionClaim*/} from 'supertokens-auth-react/recipe/userroles';

export const AdminRoute = (props: React.PropsWithChildren<any>) => {
  return (
    <SessionAuth
      accessDeniedScreen={AccessDeniedScreen}
      overrideGlobalClaimValidators={(globalValidators) => [
        ...globalValidators, UserRoleClaim.validators.includes("admin"),
      ]
      }>
      {props.children}
    </SessionAuth>
  );
}
