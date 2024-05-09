import {EnvelopeIcon, PhoneIcon} from '@heroicons/react/20/solid'
import React from "react";
import {XMarkIcon} from '@heroicons/react/20/solid'

const people = [
    {
        name: 'Tim Cook',
        title: 'Paradigm Representative',
        role: 'Admin',
        email: 'janecooper@example.com',
        telephone: '+1-202-555-0170',
        imageUrl:
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Tim Cook',
        title: 'Paradigm Representative',
        role: 'Admin',
        email: 'janecooper@example.com',
        telephone: '+1-202-555-0170',
        imageUrl:
            'https://images.unsplash.com/photo-1527208043690-e3db1cc93456?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Tim Cook',
        title: 'Paradigm Representative',
        role: 'Admin',
        email: 'janecooper@example.com',
        telephone: '+1-202-555-0170',
        imageUrl:
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    }
]

interface HomeProps {
    host?: string
}

export default function Home({host}: HomeProps) {
    return (

        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
                    Join one of our many communites
                </h2>
                <div className="-mx-6 grid grid-cols-2 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
                    <div className="bg-gray-400/5 p-8 sm:p-10">
                        <img
                            className="max-h-12 w-full object-contain"
                            src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
                            alt="Transistor"
                            width={158}
                            height={48}
                        />
                    </div>
                    <div className="bg-gray-400/5 p-6 sm:p-10">
                        <img
                            className="max-h-12 w-full object-contain"
                            src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
                            alt="Reform"
                            width={158}
                            height={48}
                        />
                    </div>
                    <div className="bg-gray-400/5 p-6 sm:p-10">
                        <img
                            className="max-h-12 w-full object-contain"
                            src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
                            alt="Tuple"
                            width={158}
                            height={48}
                        />
                    </div>
                    <div className="bg-gray-400/5 p-6 sm:p-10">
                        <img
                            className="max-h-12 w-full object-contain"
                            src="https://tailwindui.com/img/logos/158x48/laravel-logo-gray-900.svg"
                            alt="Laravel"
                            width={158}
                            height={48}
                        />
                    </div>
                    <div className="bg-gray-400/5 p-6 sm:p-10">
                        <img
                            className="max-h-12 w-full object-contain"
                            src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
                            alt="SavvyCal"
                            width={158}
                            height={48}
                        />
                    </div>
                    <div className="bg-gray-400/5 p-6 sm:p-10">
                        <img
                            className="max-h-12 w-full object-contain"
                            src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
                            alt="Statamic"
                            width={158}
                            height={48}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
