import React, { useState } from "react";
import Stepper from "./Stepper";
import ResumeStep from "./ResumeStep";
import JobTitleStep from "./JobTitleStep";
import QuestionStep from "./QuestionStep";
import { FaCheckCircle } from 'react-icons/fa';
import { showSuccess } from '../utils/toast.jsx';

// The main container that holds the stepper and card and manages state.
const StepperCard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});

  const steps = ["Resume", "Job Title", "Questions"];

  // Called when a step is successfully completed.
  const nextStep = (stepData) => {
    setCollectedData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const setData=(stepData)=>{
    setCollectedData((prev) => ({ ...prev, ...stepData }));
  }
  // Final submission after all steps are complete.
  const handleFinalSubmit = (data) => {
    const finalData = { ...collectedData, ...data };
    showSuccess('Data submitted successfully!');
    // Replace with your API call.
    // alert("Data submitted successfully!");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 flex flex-col justify-center items-center text-gray-900 mx-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Resume & Interview Wizard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Providing your resume, job title, and (optionally) a description helps us generate more relevant interview questions.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper currentStep={currentStep} steps={steps} />
        </div>

        {/* Content Cards */}
        <div className="w-full">
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 transform transition-all duration-300 hover:shadow-3xl">
              <ResumeStep data={collectedData} onNext={nextStep} />
            </div>
          )}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 transform transition-all duration-300 hover:shadow-3xl">
              <JobTitleStep data={collectedData} onNext={nextStep} setData={setData} onBack={prevStep} submit={handleFinalSubmit} />
            </div>
          )}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 transform transition-all duration-300 hover:shadow-3xl">
              <QuestionStep data={collectedData} onNext={handleFinalSubmit} onBack={prevStep} />
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <FaCheckCircle className="text-red-500 animate-pulse-slow" />
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {steps.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepperCard;
