import React from 'react';
import { Link } from 'react-router';

export default function Navbar() {
    return (
        <nav className="bg-primary border-red-400 border-b-2 shadow-lg">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
                    {/* <span className="self-center text-2xl font-semibold whitespace-nowrap text-red-600">HubInterview.com</span> */}
                </Link>
                <div className="" >
                    <ul className="font-medium flex justify-end gap-6  p-2 md:p-0 mt-4">
                        <li>
                            <Link to="/" className="block py-2 px-3 text-white rounded-sm   md:border-0  md:p-0">Home</Link>
                        </li>
                        <li>
                            <Link to="/sessions" className="block py-2 px-3 text-white rounded-sm   md:border-0   md:p-0">Sessions</Link>
                        </li>
                        <li>
                            <Link to="/driving" className="block py-2 px-3 text-white rounded-sm   md:border-0   md:p-0">Driving</Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}
