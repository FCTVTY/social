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

export default function NotFound() {
  return (
    <>
      <main className="relative isolate min-h-full dark">
        <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
          <p className="text-base font-semibold leading-8 ">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-5xl">Page not found</h1>
          <p className="mt-4 text-base /70 sm:mt-6">Sorry, we couldn’t find the page you’re looking for.</p>
          <div className="mt-10 flex justify-center">
            <a href="/dashboard" className="text-sm font-semibold leading-7 ">
              <span aria-hidden="true">&larr;</span> Back to home
            </a>
          </div>
        </div>
      </main>
    </>
  )
};
