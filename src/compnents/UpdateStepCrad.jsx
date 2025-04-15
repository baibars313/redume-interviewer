import React, { useState } from "react";
import Stepper from "./Stepper";
import ResumeStep from "./ResumeStep";
import JobTitleStep from "./JobTitleStep";
import JobDescriptionStep from "./JobDescriptionStep";
import QuestionStep from "./QuestionStep";

// The main container that holds the stepper and card and manages state.
const UpdateStepperCard = () => {
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
      console.log("Submitting final data:", finalData);
      // Replace with your API call.
      alert("Data submitted successfully!");
    };
    const goBack = () => {
      setCurrentStep(1);
      setCollectedData(null)
    }
  
    return (
      <div className="min-h-screen bg-gray flex flex-col justify-center items-center text-gray-900 mx-4">
        <Stepper currentStep={currentStep} steps={steps} />
        <div className=" border-[0.5px] border-gray-2  rounded-lg shadow-lg p-6 w-full md:w-1/2 lg:w-1/2  ">
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
            <QuestionStep data={collectedData} onNext={handleFinalSubmit} onBack={goBack} />
          )}
        </div>
      </div>
    );
  };
  
  export default UpdateStepperCard;
  