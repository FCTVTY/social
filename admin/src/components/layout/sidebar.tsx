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

import {
  BarChart2,
  BoxIcon,
  GraduationCapIcon, HandCoinsIcon,
  HardDriveIcon, HomeIcon,
  KeyRoundIcon, MapPin,
  RadioIcon,
} from "lucide-react";
import {Link} from "react-router-dom";
import {useState} from "react";
import {motion} from "framer-motion";
import {cn} from "../ui/utils";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const organizationId = "abc";
  const projectId = 123
  const projectNavigation = [
    {
      name: "Dashboard",
      href: `/dashboard`,
      icon: MapPin,
      isActive: (href: string) => window.location.pathname === href,
    },
    {
      name: "Places",
      href: `/places`,
      icon: HomeIcon,
      isActive: (href: string) => window.location.pathname.startsWith(href),
    },
    {
      name: "Vouchers",
      href: `/vouchers`,
      icon: HandCoinsIcon
      ,
      isActive: (href: string) => window.location.pathname.startsWith(href),
    },

  ];

  return (
    <div
      onMouseOver={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={cn(
        "z-50 flex h-full grow flex-col gap-y-4 overflow-y-auto overflow-x-hidden border-r border-border bg-white dark:bg-gray-950 px-3 pt-2"
      )}
    >
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li className="">
            <ul role="list" className={cn("space-y-1")}>
              {projectId &&
                projectNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        item.isActive(item.href)
                          ? "bg-stone-800 text-emerald-500"
                          : "text-stone-400 hover:bg-stone-800 hover:text-white",
                        "flex items-center rounded-md p-2 text-sm font-medium leading-3 transition-all"
                      )}
                    >
                      <item.icon
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                      />
                      <motion.div
                        initial={{width: 0, opacity: 0, marginLeft: 0}}
                        animate={{
                          width: collapsed ? 0 : 140,
                          opacity: collapsed ? 0 : 1,
                          marginLeft: collapsed ? 0 : 10,
                        }}
                        exit={{width: 0, opacity: 0, marginLeft: 0}}
                      >
                        {item.name}
                      </motion.div>
                    </Link>
                  </li>
                ))}
            </ul>
          </li>
          <li className="mt-auto">

            
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar