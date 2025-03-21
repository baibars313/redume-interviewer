import React from 'react';
import { Link } from 'react-router';

export default function Navbar() {
    return (
        <nav className="bg-white border-red-400 border-b-2 shadow-lg">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-red-600">Brand</span>
                </Link>
                <div className=" w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-red-200 rounded-lg bg-white md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent">
                        <li>
                            <Link to="/" className="block py-2 px-3 text-red-600 rounded-sm hover:bg-red-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0">Home</Link>
                        </li>
                        <li>
                            <Link to="/sessions" className="block py-2 px-3 text-red-600 rounded-sm hover:bg-red-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0">Sessions</Link>
                        </li>
                        <li>
                            <Link to="/driving" className="block py-2 px-3 text-red-600 rounded-sm hover:bg-red-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0">Driving</Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}
