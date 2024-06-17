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

export interface Walk {
  calories: number;
  distance: number;
  duration: number;
  steps: number;
  id: string;
  name: string;
  tenant: string;
  details: string;
  tags: string[];
  geo: {
    coordinate: number[];
  }[];
  places: string[];
  likes: number;
  vouchers: string[];
  image: string;
  status: boolean
}

export interface Tenant {
  name: string;
}

export interface Place {
  name: string;
  tenant: string;
  logo: string;
  details: string;
  rating: string;
  toilet: boolean;
  disabled: boolean;
  coordinate: number[];
  id: string;
}

export interface Voucher {
  name: string;
  tenant: string;
  logo: string;
  details: string;
  code: string;
  expired: boolean;
  coordinate: number[];
  pid: string;
  rewarded: boolean;
  id: string;
}
export interface Branding {
  _id: string
  logo: string
  name: string
  personalWalks :boolean
  mapboxToken: string
}
export interface VoucherUserMapping {
  vid: string;
  usid: string;
  used: boolean;
}

export interface WalkPlaceMapping {
  wid: string;
  placeid: string;
}

export interface WalkVoucherMapping {
  wid: string;
  voucherid: string;
}
