import React, { Fragment, useEffect, useState } from 'react';
import {ChevronDownIcon, MinusSmallIcon, PlusSmallIcon} from "@heroicons/react/20/solid";
import {Disclosure, Menu, Transition} from "@headlessui/react";
import { getApiDomain } from "../../lib/auth/supertokens";
import { CommunityCollection, Courses } from "../../interfaces/interfaces";
import {CheckCircleIcon, InformationCircleIcon} from "@heroicons/react/16/solid";

interface HomeProps {
  host?: string;
  channel?: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function FAQ({ host, channel }: HomeProps) {
  const faqs = [
    {
      question: "How to contact the B:Hive Team\n",
      answer:
        "Do you need assistance? This article explains how to contact the B:hive Team based on the type of inquiry that you have.\n" +
        "\n" +
        "Note: If you have a Community Success Manager please contact them directly for assistance." +
      "\n"+
      "<h2 class='text-2xl py-10'>Contact Support<h2>"+
      "If you need assistance with issues relating to your site or need to share sensitive information with the B:hive Team (for example: need to share app credentials or personal information), please contact the Support Team directly through the Contact B:hive modal or email us directly at support@bhivecommunity.co.uk."
    },

    // More questions...
  ]

  return (
    <div className="h-[100vh]">

    <div
      className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 text-center mb-3 lg:-ml-72">
      <div className="min-w-0 flex-1">

        <h2
          className="mt-2 text-3xl leading-7 tracking-wider text-sky-950 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
          FAQ's
        </h2>

      </div>
    </div><div className="mx-auto max-w-4xl">
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10 dark:divide-white/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({open}) => (
                  <>
                    <dt>
                      <Disclosure.Button
                        className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white">
                        <span className="text-base font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true"/>
                          ) : (
                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true"/>
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{__html: faq.answer}}></p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl></div>
        </div>
  )
}
