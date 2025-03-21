import React, { useEffect, useState } from 'react';

import {
    FaFilePdf,
    FaSpinner,
    FaHeadphones
} from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from './constant';
import AudioPlayer from './AudioPlayer';






// Main SessionSummary Component with API loading and error handling
const SessionSummary = ({ sessionId }) => {
    const [data, setData] = useState(null);
    const [loadingSession, setLoadingSession] = useState(true);
    const [errorSession, setErrorSession] = useState(null);

    const getDetails = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/session/${sessionId}/`);
            setData(res.data);
            setLoadingSession(false);
        } catch (err) {
            setErrorSession('Error fetching session details.');
            setLoadingSession(false);
        }
    };

    useEffect(() => {
        getDetails();
    }, [sessionId]);

    if (loadingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <FaSpinner className="animate-spin text-red-500 text-5xl" />
            </div>
        );
    }

    if (errorSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-red-500 text-xl font-bold">{errorSession}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-2">
            <div className="mx-auto bg-white  rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-red-600 p-6 flex flex-col sm:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Session Summary</h1>
                        <p className="text-white mt-1">Session ID: {data.session_id}</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <FaHeadphones className="text-white text-5xl" />
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    {/* Session Details Card */}
                    <div className="mb-6">
                        <div className='flex justify-between p-3'>
                            <h2 className="text-2xl font-semibold text-red-500">Session Details</h2>
                            <a
                                href={data.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-500  mt-2 p-2 rounded-lg hover:bg-red-500 hover:text-white transition duration-300 shadow-sm"
                            >
                                <p className=" flex items-center gap-2">
                                    <FaFilePdf className="text-red-500" />
                                    <span className="font-medium">View Resume</span>
                                </p>
                            </a>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 gap-4">
                            {/* Details Card */}
                            <div className="p-4  shadow-sm rounded-lg hover:shadow-lg transition duration-300">
                                <p className="text-gray-700">
                                    <span className="font-medium">Title:</span> {data.title}
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <span className="font-medium">Job Description:</span> {data.job_description}
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <span className="font-medium">Active:</span> {data.is_active ? 'Yes' : 'No'}
                                </p>
                            </div>
                            {/* Resume Card */}

                        </div>
                    </div>

                    {/* Questions & Answers */}
                    <div>
                        <h2 className="text-2xl font-semibold text-red-500 mb-4">Questions & Answers</h2>
                        <div className="space-y-6">
                            {data.questions.map((q) => (
                                <div key={q.id} className="p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                                    <p className="text-gray-800 font-medium">{q.question}</p>
                                    <div className="mt-3">
                                        {q.answer ? (
                                            // Assuming the answer is an audio file URL to be played via WaveSurfer
                                            <AudioPlayer audioUrl={q.answer} />
                                        ) : (
                                            <p className="text-red-500">No answer provided yet.</p>
                                        )}
                                    </div>
                                    {q.transcript && (
                                        <p className="mt-2 text-gray-600 italic">Transcript: {q.transcript}</p>
                                    )}
                                    {q.feedback && (
                                        <p className="mt-2 text-green-600 font-medium">Feedback: {q.feedback}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="space-y-6">
                           
                                <div  className="p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                                    <p className="text-gray-800 font-medium">{data.overall_feedback}</p>
                                    
                                </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionSummary;
