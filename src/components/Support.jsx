import React from 'react';
import Layout from './Layout';
import rightImg from "../assets/Images/SupportImg/rightSideImg.png"

const Support = () => {
  return (
    <Layout title="Support">
      <div className="flex flex-col md:flex-row items-center justify-center bg-black text-white">
        {/* Form Section */}
        <div className="bg-[#171717] p-8 rounded-2xl shadow-lg w-full md:w-1/2 mx-4">
          <h2 className="text-xl font-bold mb-2 text-center">Have A Query?</h2>
          <p className="text-sm text-gray-400 mb-6 text-center">
            Please fill out the information and we will get back to you.
          </p>
          
          {/* Query Type Dropdown */}
          <select className="w-full bg-[#000000] text-gray-400 p-3 rounded-md mb-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <option value="">Select Query Type</option>
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
          </select>
          
          {/* Message Input */}
          <textarea 
            className="w-full bg-[#000000] text-gray-400 p-3 rounded-md mb-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
            placeholder="Enter Message Here..."
            rows="4"
          ></textarea>
          
          {/* Submit Button */}
          <button className="w-1/2 mx-auto block bg-[#BBA14F] text-black font-semibold py-3 rounded-lg mt-4 hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Submit
          </button>
        </div>

        {/* Illustration Section */}
        <div className="hidden md:flex items-center justify-center ml-10 w-1/2">
          <img src={rightImg} alt="Support Illustration" className="" />
        </div>
      </div>
    </Layout>
  );
};

export default Support;
