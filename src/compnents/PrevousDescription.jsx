import React, { useState } from 'react'

export default function PrevousDescription({setJobDescription}) {
    const jobs = [
        {
            "title": "Software Engineer",
            "description": "Develop, maintain, and optimize software solutions."
        },
        {
            "title": null,
            "description": "Provide technical support and troubleshooting."
        },
        {
            "title": "Data Scientist",
            "description": "Analyze large data sets to extract insights."
        },
        {
            "title": null,
            "description": "Manage customer service inquiries and support tasks."
        }
    ]
    const [data, setData] = useState([])
    return (
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-1 ">
            {jobs.map((job, index) => (
                <div key={index} className="border border-red-500 p-2 rounded-full" onClick={() => setJobDescription(job.description)}>
                    <h2 className="text-sm font-bold text-center text-red-500">{job?.title?.slice(0,12) || job.description.slice(0,12)}...</h2>
                </div>
            ))}
        </div>
    )
}
