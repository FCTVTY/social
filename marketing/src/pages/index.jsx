import Head from 'next/head'

import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'

export default function Home() {
  return (
    <>
      <Head>
        <title>b:hive - Communities reimagined</title>
        <meta name="description" content="Community reimagined" />
      </Head>
      <div className="h-full">
        <div className="mx-auto overflow-hidden sm:h-screen sm:pb-32 lg:flex 2xl:max-w-7xl 2xl:overflow-visible">
          <div className="hidden md:block">
            <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-cover pl-10 md:pl-16 lg:!-left-44 lg:pl-0 2xl:!left-0 dark:block"></div>
            <div className="pointer-events-none absolute inset-0 -z-10 bg-cover pl-10 md:pl-16 lg:!-left-44 lg:pl-0 2xl:!left-0 dark:hidden"></div>
          </div>
          <div className="mx-auto flex max-w-3xl shrink-0 flex-col justify-center sm:h-screen">
            <div className="mx-auto flex size-full flex-col px-6 pt-10 lg:pt-0 2xl:px-0">
              <div className="flex grow flex-col space-y-9 md:justify-center">
                <img
                  className="h-6 w-auto self-start object-contain md:h-8"
                  src="/public/logo-dark.svg"
                />
                <div className="flex flex-col space-y-1">
                  <p className="font-sans !text-3xl text-base font-bold normal-case leading-5 tracking-normal text-gray-900 md:!text-5xl dark:text-gray-100">
                    Your voice.
                  </p>
                  <p className="font-sans !text-3xl text-base font-bold normal-case leading-5 tracking-normal text-gray-900 md:!text-5xl dark:text-gray-100">
                    Your freedom.
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <div>
                    <div>
                      <button
                        className="bg-primary-500 hover:bg-primary-400 disabled:hover:bg-primary-500 dark:disabled:hover:bg-primary-500 dark:hover:bg-primary-600 focus:bg-primary-500 focus:ring-primary-300 flex inline-flex w-full appearance-none place-content-center items-center justify-center space-x-2 whitespace-nowrap rounded-full border-2 border-transparent px-6 py-3 text-base font-medium text-gray-100 transition-all focus:outline-none focus:ring-2 rtl:space-x-reverse"
                        type="button"
                        data-testid="create-account"
                      >
                        <span>Create Account</span>
                      </button>
                    </div>
                  </div>
                  <button
                    className="flex inline-flex w-full appearance-none place-content-center items-center justify-center space-x-2 whitespace-nowrap rounded-full border-2 !border-gray-300 border-gray-300 !bg-white bg-transparent px-6 py-3 text-base font-medium text-gray-900 transition-all hover:!border-gray-400 hover:border-gray-500 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 rtl:space-x-reverse dark:!border-gray-800 dark:border-gray-800 dark:!bg-gray-900 dark:text-gray-100 dark:hover:!border-gray-700/50 dark:hover:border-gray-700 dark:focus:border-gray-800 dark:focus:ring-gray-700"
                    type="button"
                    data-testid="button"
                  >
                    <span>Sign In</span>
                  </button>
                  <p className="text-center font-sans text-xs font-normal normal-case tracking-normal text-gray-700 dark:text-gray-600">
                    By continuing, you agree to our{' '}
                    <a
                      href="https://help.truthsocial.com/legal/terms-of-service"
                      target="_blank"
                      className="font-medium underline"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://help.truthsocial.com/legal/privacy-policy"
                      target="_blank"
                      className="font-medium underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
                <div className="relative sm:hidden" data-testid="divider">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-solid border-gray-300 dark:border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span
                      className="bg-white px-2 text-gray-700 dark:bg-gray-900 dark:text-gray-600"
                      data-testid="divider-text"
                    >
                      <span className="font-sans text-base font-normal normal-case leading-5 tracking-normal text-inherit">
                        or
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-x-0 gap-y-2 sm:flex-row sm:justify-center sm:gap-x-2 sm:gap-y-0 lg:justify-start">
                  <a
                    href="https://apps.apple.com/app/apple-store/id1586018825?pt=123469648&amp;ct=TruthSocial.com&amp;mt=8"
                    target="_blank"
                    className="flex w-full items-center justify-center rounded-full border-2 border-solid border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <div className="mr-3">
                      <svg viewBox="0 0 384 512" className="h-7">
                        <path
                          fill="currentColor"
                          d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex flex-col whitespace-nowrap">
                      <p className="font-sans text-xs font-medium normal-case tracking-normal text-gray-900 dark:text-gray-100">
                        Download on the
                      </p>
                      <p className="font-sans text-base font-bold normal-case leading-5 tracking-normal text-gray-900 dark:text-gray-100">
                        App Store
                      </p>
                    </div>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.truthsocial.android.app"
                    target="_blank"
                    className="flex w-full items-center justify-center rounded-full border-2 border-solid border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <div className="mr-3">
                      <svg
                        viewBox="0 0 22 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7"
                      >
                        <g clip-path="url(#clip0_7775_19695)">
                          <path
                            d="M10.1785 11.459L0.25 22.0033C0.557932 23.1511 1.60303 24.0002 2.84409 24.0002C3.33865 24.0002 3.80521 23.8696 4.20645 23.6269L4.23445 23.6083L15.4133 17.1604L10.1785 11.459Z"
                            fill="#EA4335"
                          ></path>
                          <path
                            d="M20.2366 9.66808H20.2273L15.403 6.85938L9.96289 11.7023L15.4217 17.1611L20.2273 14.3897C21.0671 13.9325 21.6363 13.046 21.6363 12.0289C21.6363 11.0118 21.0764 10.1253 20.2366 9.67742V9.66808Z"
                            fill="#FBBC04"
                          ></path>
                          <path
                            d="M0.249563 1.99609C0.193575 2.22004 0.15625 2.44399 0.15625 2.68661V21.3118C0.15625 21.5544 0.184244 21.7784 0.249563 22.0023L10.5233 11.7286L0.249563 1.99609Z"
                            fill="#4285F4"
                          ></path>
                          <path
                            d="M10.2531 12L15.3946 6.85848L4.22512 0.382582C3.82387 0.139969 3.34798 0 2.83476 0C1.60303 0 0.5486 0.849145 0.25 1.98756L10.2531 12Z"
                            fill="#34A853"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_7775_19695">
                            <rect
                              width="21.4712"
                              height="24"
                              fill="white"
                              transform="translate(0.15625)"
                            ></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="flex flex-col whitespace-nowrap">
                      <p className="font-sans text-xs font-medium normal-case tracking-normal text-gray-900 dark:text-gray-100">
                        Download on the
                      </p>
                      <p className="font-sans text-base font-bold normal-case leading-5 tracking-normal text-gray-900 dark:text-gray-100">
                        Play Store
                      </p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="mt-auto flex flex-col py-10 lg:pt-0">
                <div className="flex flex-col items-center">
                  <div className="flex flex-row flex-wrap items-center justify-center gap-6">
                    <div>
                      <a
                        href="https://help.truthsocial.com/legal/gdpr"
                        target="_blank"
                        className="text-primary-600 dark:text-accent-blue hover:underline"
                      >
                        <span className="font-sans text-sm font-medium normal-case tracking-normal text-inherit">
                          GDPR
                        </span>
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://help.truthsocial.com/legal/ccpa-privacy-policy"
                        target="_blank"
                        className="text-primary-600 dark:text-accent-blue hover:underline"
                      >
                        <span className="font-sans text-sm font-medium normal-case tracking-normal text-inherit">
                          CCPA Privacy Policy
                        </span>
                      </a>
                    </div>
                    <div>
                      <a
                        className="text-primary-600 dark:text-accent-blue hover:underline"
                        href="/advertising"
                      >
                        <span className="font-sans text-sm font-medium normal-case tracking-normal text-inherit">
                          Advertise
                        </span>
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://help.truthsocial.com"
                        target="_blank"
                        className="text-primary-600 dark:text-accent-blue hover:underline"
                      >
                        <span className="font-sans text-sm font-medium normal-case tracking-normal text-inherit">
                          Help Center
                        </span>
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://help.truthsocial.com/legal/open-source"
                        target="_blank"
                        className="text-primary-600 dark:text-accent-blue hover:underline"
                      >
                        <span className="font-sans text-sm font-medium normal-case tracking-normal text-inherit">
                          Open Source
                        </span>
                      </a>
                    </div>
                  </div>
                  <p className="pt-10 text-center font-sans text-sm font-normal normal-case tracking-normal text-gray-700 lg:pt-2 dark:text-gray-600">
                    ©2024 Truth Social
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none relative mx-auto ml-16 hidden h-screen max-w-2xl overflow-hidden lg:flex lg:flex-none lg:items-end lg:justify-end xl:ml-32">
            <div className="grid size-full max-w-3xl flex-none grid-cols-2 gap-4 overflow-hidden sm:max-w-5xl lg:max-w-none">
              <div className="animate-slide-down flex size-full origin-center flex-col gap-4">
                <img
                  src="/instance/images/landing-page/light/column-1.webp"
                  alt="Truth Social card"
                  className="w-full dark:hidden"
                  loading="lazy"
                />
                <img
                  src="/instance/images/landing-page/light/column-1.webp"
                  alt="Truth Social card"
                  className="w-full dark:hidden"
                  loading="lazy"
                />
                <img
                  src="/instance/images/landing-page/dark/column-1.webp"
                  alt="Truth Social card"
                  className="hidden w-full dark:block"
                  loading="eager"
                />
                <img
                  src="/instance/images/landing-page/dark/column-1.webp"
                  alt="Truth Social card"
                  className="hidden w-full dark:block"
                  loading="eager"
                />
              </div>
              <div className="animate-slide-up flex size-full origin-center flex-col gap-4">
                <img
                  src="/instance/images/landing-page/light/column-2.webp"
                  alt="Truth Social card"
                  className="w-full dark:hidden"
                  loading="lazy"
                />
                <img
                  src="/instance/images/landing-page/light/column-2.webp"
                  alt="Truth Social card"
                  className="w-full dark:hidden"
                  loading="lazy"
                />
                <img
                  src="/instance/images/landing-page/dark/column-2.webp"
                  alt="Truth Social card"
                  className="hidden w-full dark:block"
                  loading="eager"
                />
                <img
                  src="/instance/images/landing-page/dark/column-2.webp"
                  alt="Truth Social card"
                  className="hidden w-full dark:block"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
