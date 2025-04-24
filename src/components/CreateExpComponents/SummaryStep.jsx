import React from "react";

const ExperimentDetails = () => {
  return (
    <div className="bg-[#171717] text-white p-6 rounded-lg">
      {/* Header Section */}
      <div className="grid grid-cols-2 gap-6 border-b border-gray-700 pb-4">
        <div className="border-b  border-r border-gray-700 pr-4">
          <p className="text-gray-400">Collaborators</p>
          <p>Dr. Smith, Dr. Johnson, Dr. Brown</p>
        </div>
        <div className="border-b  border-l p-1 border-gray-700 pr-4">
          <p className="p-1 text-gray-400">Department</p>
          <p>R&D Department</p>
        </div>
        <div className="border-b  border-r border-gray-700 pr-4">
          <p className="text-gray-400">Start Date</p>
          <p>05/20/2015</p>
        </div>
        <div  className="border-b  border-l p-1 border-gray-700 pr-4">
          <p className="p-1 text-gray-400">End Date</p>
          <p>05/20/2019</p>
        </div>
        <div className="border-b  border-r border-gray-700 pr-4">
          <p className="text-gray-400">Programme Name</p>
          <p>Nakya Program</p>
        </div>
        <div className="border-b  border-l p-1 border-gray-700 pr-4">
          <p className="p-1 text-gray-400">Experiment Type</p>
          <p>Cell therapy cell expansion</p>
        </div>
        <div className="border-b  border-r border-gray-700 pr-4">
          <p className="text-gray-400">Experiment Title</p>
          <p>Figuring out cell expansion</p>
        </div>
        <div  className="border-b  border-l p-1 border-gray-700 pr-4">
          <p className="p-1 text-gray-400">Objective</p>
          <p>Figuring out cell expansion in biology program as a biologist</p>
        </div>
        <div className="border-b  border-r border-gray-700 pr-4">
          <p className="text-gray-400">General Cell Line</p>
          <p>Stem cells</p>
        </div>
        <div className="border-b  border-l p-1 border-gray-700 pr-4">
          <p className="p-1 text-gray-400">Instruments</p>
          <p>BioTek Gen5</p>
        </div>
        <div className="border-b  border-r border-gray-700 pr-4">
          <p className="text-gray-400">Plot Type</p>
          <p>Pie Chart</p>
        </div>
      </div>

      {/* Conditions Section */}
      <div className="mt-6 border border-gray-700 rounded-md">
        <p className="text-lg font-semibold">Date of Conditions: 20/05/2016</p>

        <div className=" bg-[#171717] 0 p-4 mt-2 rounded-md">
          <p className="text-yellow-500 font-semibold"># VR-24-PP-003-07-001</p>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="bg-black p-4 rounded-md">
              <p className="text-gray-400 border-b border-gray-700">Feed</p>
              <p>CHO-DXB11</p>
              <p>20 ml</p>
            </div>
            <div className="bg-black p-4 rounded-md">
              <p className="text-gray-400 border-b border-gray-700">Nutrients</p>
              <p>CHO-DXB11</p>
              <p>20 ml</p>
            </div>
            <div className="bg-black p-4 rounded-md">
              <p className="text-gray-400 border-b border-gray-700">Agitation</p>
              <p>50 RPM</p>
            </div>
          </div>
        </div>

        <div className=" bg-[#171717] 0 p-4 mt-4 rounded-md">
          <p className="text-yellow-500 font-semibold"># VR-24-PP-003-07-002</p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-black p-4 rounded-md">
              <p className="text-gray-400 border-b border-gray-700">Inoculation</p>
              <p>30</p>
            </div>
            <div className="bg-black p-4 rounded-md">
              <p className="text-gray-400 border-b border-gray-700">Sample & Volume</p>
              <p>7 Samples</p>
              <p>25 ml</p>
            </div>
          </div>
        </div>
      </div>

        {/* Conditions Section  2*/}
          <div className="mt-6 border border-gray-700 rounded-md">
        <p className="text-lg font-semibold">Date of Conditions: 20/05/2016</p>

        <div className=" bg-[#171717] 0 p-4 mt-2 rounded-md">
          <p className="text-yellow-500 font-semibold"># VR-24-PP-003-07-001</p>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="bg-black p-4 rounded-md">
              <p className="text-gray-400 border-b border-gray-700">Feed</p>
              <p>CHO-DXB11</p>
              <p>20 ml</p>
            </div>
            <div className="bg-black p-4 rounded-md">
              <p className="text-gray-400 border-b border-gray-700">Nutrients</p>
              <p>CHO-DXB11</p>
              <p>20 ml</p>
            </div>
            <div className="bg-black p-4 rounded-md">
              <p className="text-gray-400 border-b border-gray-700">Agitation</p>
              <p>50 RPM</p>
            </div>
          </div>
        </div>

        <div className=" bg-[#171717] 0 p-4 mt-4 rounded-md">
          <p className="text-yellow-500 font-semibold"># VR-24-PP-003-07-002</p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-black p-4 rounded-md">
              <p className="text-gray-400 border-b border-gray-700">Inoculation</p>
              <p>30</p>
            </div>
            <div className="bg-black p-4 rounded-md">
              <p className="text-gray-400 border-b border-gray-700">Sample & Volume</p>
              <p>7 Samples</p>
              <p>25 ml</p>
            </div>
          </div>
        </div>
      </div>
      

      {/* Table Section */}
      <div className="mt-6">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="border border-gray-700 p-2">Vessel ID</th>
              <th className="border border-gray-700 p-2">Nutrients / Supplements</th>
              <th className="border border-gray-700 p-2">Additional Nutrients / Supplements</th>
              <th className="border border-gray-700 p-2">Specific Instruments</th>
            </tr>
          </thead>
          <tbody>
            {Array(3)
              .fill({
                id: "# VR-24-PP-003-07-001",
                nutrients: "Flexible Blood Vessel",
                additional: "Flexible Blood Vessel",
                instruments: "Flexible Blood Vessel",
              })
              .map((row, index) => (
                <tr key={index} className="border border-gray-700">
                  <td className="border border-gray-700 p-2">{row.id}</td>
                  <td className="border border-gray-700 p-2">{row.nutrients}</td>
                  <td className="border border-gray-700 p-2">{row.additional}</td>
                  <td className="border border-gray-700 p-2">{row.instruments}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      
      {/* ✅ Progress Bar (If Dynamic Progress is Needed) */}
      {/* Change `w-[50%]` to dynamic width based on progress */}
      <div className="mt-4 w-full bg-gray-800 h-[10px] rounded relative">
        <div className="h-full w-[50%] bg-yellow-500 rounded-md"></div>
      </div>
    </div>
  );
};

export default ExperimentDetails;
