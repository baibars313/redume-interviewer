// The Stepper displays numbered circles with connecting lines.
const Stepper = ({ currentStep, steps }) => {
  return (
    <div className="flex justify-center items-center mb-4 my-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex justify-center items-center border-2 ${
              currentStep > index ? "bg-primary-circle text-white" : "bg-white text-red-500"
            } border-red-500`}
          >
            {index + 1}
          </div>
          {index !== steps.length - 1 && <div className="w-8 h-1 bg-primary mx-2"></div>}
        </div>
      ))}
    </div>
  );
};
export default Stepper;