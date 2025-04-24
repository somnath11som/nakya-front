import React from 'react'
import Layout from '../Layout'
import backIcon from "../../assets/Images/manageInstru/backIcon.png";
import {useNavigate } from "react-router-dom";

const ExperimentalSummary = () => {
    const navigate = useNavigate();

  return (
    <Layout
    title={
      <div className="flex items-center gap-2">
        <div className="border border-[#BBA14F] rounded-full p-3">
          <img src={backIcon} alt="Back" className="h-5 w-5 cursor-pointer" onClick={() => navigate(-1)} />
        </div>
        <span> Experimental Summary </span>
      </div>
    }
  >



   </Layout>
  )
}

export default ExperimentalSummary
