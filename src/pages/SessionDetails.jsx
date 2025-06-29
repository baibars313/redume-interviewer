import React from 'react'
import SessionSummary from '../compnents/Details'
import { Link } from 'react-router'

export default function SessionDetails () {

  const queryParams = new URLSearchParams(location.search)
  const sessionId = queryParams.get('sessionId')

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className=" py-8 px-2 my-4">
         <div className='mb-6 mx-4'>
         <Link
            to={"/sessions"}
            className="text-blue-500 py-2 my-4 px-4 border-blue-500 border rounded-lg mb-4 p-2 shadow-md  hover:bg-blue-600 hover:text-white font-semibold"
          >
            {"<"} Go Back
          </Link>
         </div>
          <SessionSummary sessionId={sessionId} />
        </div>
      </div>
    </div>
  )
}
