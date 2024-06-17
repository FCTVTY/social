import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
    // Define an array of navigation items
    const navItems = [
        { path: '/dashboard', icon: <svg width={25} height={25} xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                         className="dark:text-white inline-block mb-1 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
            </svg>, label: 'Home'
        },
        {
            path: '/vouchers/id', icon: <svg width={25} height={25} xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                             className="dark:text-white inline-block mb-1 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"/>
            </svg>, label: 'Vouchers'
        },
        {
            path: '/settings', icon: <svg width={25} height={25} xmlns="http://www.w3.org/2000/svg" fill="none"
                                          viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                          className="dark:text-white inline-block mb-1 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>, label: 'Account'
        }
    ];

    return (
        <section id="bottom-navigation"
                 className="block fixed inset-x-0 bottom-0 z-10 bg-white dark:bg-slate-800 dark:text-white shadow pb-2">
            <div id="tabs" className="flex justify-between">
            {navItems.map((item, index) => (
                    <Link key={index} to={item.path} className="dark:text-white w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
                        {item.icon}
                        <span className="tab tab-home block text-xs dark:text-white ">{item.label}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default Navbar;
