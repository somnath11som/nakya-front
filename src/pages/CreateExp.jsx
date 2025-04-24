import React, { useState } from "react";

import SetupStep from "../components/CreateExpComponents/SetupStep";
import ConditionsStep from "../components/CreateExpComponents/ConditionsStep";
import SchedulingStep from "../components/CreateExpComponents/SchedulingStep";
import SummaryStep from "../components/CreateExpComponents/SummaryStep";
import Layout from "../components/Layout";

const CreateExp = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Layout title="Create Experiment">
      <div className="relative bg-[#171717]   rounded-lg w-full shadow-lg overflow-x-auto max-h-[calc(100vh-19.8vh)] overflow-auto scrollbar-hide">
        {/* Step Navigation */}
        {/* <div className="flex items-center justify-between mb-6 border-b border-gray-700 p-4 sticky top-0 bg-[#171717] px-8">
          {["Setup", "Conditions", "Scheduling", "Summary"].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                  step === index + 1 ? "bg-yellow-500 text-black" : "bg-gray-700 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <p className={`mt-2 text-sm ${step === index + 1 ? "text-yellow-500" : "text-gray-400"}`}>
                {item}
              </p>
              {index !== 3 && <div className="w-16 h-1 bg-gray-700 mx-2 mt-4"></div>}
            </div>
          ))}
        </div> */}

        {/* Step Navigation */}
        <div className="flex items-center justify-between mb-0 border-b border-gray-700 p-4 sticky top-0 bg-[#171717] px-16 z-10">
          {["Setup", "Conditions", "Scheduling", "Summary"].map(
            (item, index) => (
              <div key={index} className="flex items-center w-full">
                {/* Left Line */}
                {index !== 0 && (
                  <div className="flex-1 h-[2px] bg-gray-700 relative -top-3">
                    <div
                      className={`absolute top-0 left-0 h-full ${
                        step > index ? "bg-yellow-500" : "bg-gray-700"
                      } transition-all duration-300`}
                      style={{ width: step > index ? "100%" : "0%" }}
                    ></div>
                  </div>
                )}

                {/* Step Circle and Label */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 m-2 flex items-center justify-center rounded-full text-sm font-semibold ${
                      step === index + 1
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      step === index + 1 ? "text-yellow-500" : "text-gray-400"
                    }`}
                  >
                    {item}
                  </p>
                </div>

                {/* Right Line */}
                {index !== 3 && (
                  <div className="flex-1 h-[2px] bg-gray-700 relative -top-3">
                    <div
                      className={`absolute top-0 left-0 h-full ${
                        step > index + 1 ? "bg-yellow-500" : "bg-gray-700"
                      } transition-all duration-300`}
                      style={{ width: step > index + 1 ? "100%" : "0%" }}
                    ></div>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Step Forms */}
        {step === 1 && <SetupStep />}
        {step === 2 && <ConditionsStep />}
        {step === 3 && <SchedulingStep />}
        {step === 4 && <SummaryStep />}

        {/* Navigation Buttons */}
        <div
          className={`flex ${
            step === 1 ? "justify-end" : "justify-between"
          } sticky bottom-0 right-0 p-4 bg-black z-20`}
        >
          {step > 1 && (
            <button
              onClick={prevStep}
              className="bg-[#BBA14F] text-black px-8 py-3 rounded text-lg font-medium flex items-center transform hover:scale-105 hover:bg-[#CEB161] transition-all duration-300 hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Preview
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={nextStep}
              className="bg-[#BBA14F] text-black px-8 py-3 rounded text-lg font-medium flex items-center transform hover:scale-105 hover:bg-[#CEB161] transition-all duration-300 hover:shadow-lg"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
            <button className="bg-[#BBA14F] text-black px-8 py-3 rounded text-lg font-medium flex items-center transform hover:scale-105 hover:bg-[#CEB161] transition-all duration-300 hover:shadow-lg">
              Submit
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateExp;
