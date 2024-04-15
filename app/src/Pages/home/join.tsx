import {useState} from 'react'
import {Dialog} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'

const navigation = [
    {name: 'Product', href: '#'},
    {name: 'Features', href: '#'},
    {name: 'Marketplace', href: '#'},
    {name: 'Company', href: '#'},
]

interface JoinProps {
    text?: string,
    logo?: string
}

export default function Join({text, logo}: JoinProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>

            <div className="relative isolate px-6 pt-3 lg:px-8">

                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">

                    <div className="text-center">
                        <div className="bg-purple-300 mx-auto ">
                            <img className="object-contain h-48 w-48 mx-auto my -2" src={logo}/>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Join Community
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            {text}
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="#"
                                className="rounded-md bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Request to join
                            </a>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
