import React, { useState } from "react";
import Stepper from "./Stepper";
import ResumeStep from "./ResumeStep";
import JobTitleStep from "./JobTitleStep";
import JobDescriptionStep from "./JobDescriptionStep";
import QuestionStep from "./QuestionStep";
import DrivingQuestionStep from "./DrivingQuestion";
import { showSuccess } from '../utils/toast.jsx';
import { FaCheckCircle } from 'react-icons/fa';

// The main container that holds the stepper and card and manages state.
const DrivingStepperCard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});

  const steps = ["Resume", "Job Title", "Job Description", "Questions"];

  // Called when a step is successfully completed.
  const nextStep = (stepData) => {
    setCollectedData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Final submission after all steps are complete.
  const handleFinalSubmit = (data) => {
    const finalData = { ...collectedData, ...data };
    showSuccess('Data submitted successfully!');
    // Replace with your API call.
    // alert("Data submitted successfully!");
  };

  return (
    <div className=" min-h-[80vh] bg-gray flex flex-col justify-center items-center text-gray-900 mx-4">
      <Stepper currentStep={currentStep} steps={steps} />
      <div className=" border-[0.5px] border-gray-2  rounded-lg shadow-lg p-6 w-full   ">
        {/* A helpful title and description for the user */}
        <h1 className="text-3xl font-bold text-center  mb-4">
          Resume & Interview Wizard
        </h1>
        <p className="text-center text-sm mb-6">
          Providing your resume, job title, and (optionally) a description helps us generate more relevant interview questions.
        </p>
        {currentStep === 1 && <ResumeStep data={collectedData} onNext={nextStep} />}
        {currentStep === 2 && (
          <JobTitleStep data={collectedData} onNext={nextStep} onBack={prevStep} />
        )}
        {currentStep === 3 && (
          <JobDescriptionStep data={collectedData} onNext={nextStep} onBack={prevStep} handlesubmit={handleFinalSubmit} />
        )}
        {currentStep === 4 && (
          <DrivingQuestionStep data={collectedData} onNext={handleFinalSubmit} onBack={prevStep} />
        )}
      </div>
    </div>
  );
};

export default DrivingStepperCard;
