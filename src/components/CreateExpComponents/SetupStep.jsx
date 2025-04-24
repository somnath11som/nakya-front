import React, { useState } from "react";
import CollaboratorModal from "../SetupStepModalsComponent/CollaboratorModal";
import SelectDepartmentModal from "../SetupStepModalsComponent/SelectDepartmentModal";
import SelectExpType from "../SetupStepModalsComponent/SelectExpType";
import SelectGeneralCellLine from "../SetupStepModalsComponent/SelectGeneralCellLine";
import SelectInstruments from "../SetupStepModalsComponent/SelectInstruments";
import SelectPlotTypeModal from "../SetupStepModalsComponent/SelectPlotTypeModal";
import calenderIcon from "../../assets/Images/createExpImg/calenderIcon.png";

//-------------------------
import { format } from "date-fns"; // for date formatting
import DatePickerModal from "../SetupStepModalsComponent/DatePickerModal"; 


//--------------------------

import { RiUserFill } from "react-icons/ri";

const SetupStep = () => {
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isExpTypeModalOpen, setIsExpTypeModalOpen] = useState(false);
  const [isGeneralCellLineModalOpen, setIsGeneralCellLineModalOpen] = useState(false);
  const [isInstrumentsModalOpen, setIsInstrumentsModalOpen] = useState(false);
  const [isPlotTypeModalOpen, setIsPlotTypeModalOpen] = useState(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Store only ONE department
  const [selectedExpType, setSelectedExpType] = useState("");
  const [selectedGeneralCellLine, setSelectedGeneralCellLine] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [selectedPlotType, setSelectedPlotType] = useState("");

  // -----------------------
  const [isStartDateModalOpen, setIsStartDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);

  const [isEndDateModalOpen, setIsEndDateModalOpen] = useState(false);
  const [endDate, setEndDate] = useState(null);

  // --------------------------

  // Function to handle collaborator selection
  const handleSelectCollaborators = (collaborators) => {
    setSelectedCollaborators(collaborators);
  };

  // Function to handle department selection (replaces previous selection)
  const handleSelectDepartment = (dept) => {
    setSelectedDepartment(dept); // Set selected department (overwrite previous)
  };

  // Function to handle experiment type selection
  const handleSelectExpType = (type) => {
    setSelectedExpType(type);
  };

  // Function to handle general cell line selection
  const handleSelectGeneralCellLine = (cellLine) => {
    setSelectedGeneralCellLine(cellLine);
  };

  // Function to handle instrument selection
  const handleSelectInstrument = (instrument) => {
    setSelectedInstrument(instrument);
  };

  // Function to handle plot type selection
  const handleSelectPlotType = (plotType) => {
    setSelectedPlotType(plotType);
  };

  return (
    <div className="px-8 pb-8 bg-[#171717] rounded-lg mt-2">
      <form>
        <div className="grid grid-cols-2 gap-4">
          {/* Collaborators Section */}
          <div>
            <label className="text-gray-300">Collaborators</label>
            <div className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer" onClick={() => setIsCollaboratorModalOpen(true)}>
              <span>{selectedCollaborators.length > 0 ? `${selectedCollaborators.length} Collaborator(s) Selected` : "Add Collaborators"}</span>
              <span>▼</span>
            </div>
            {selectedCollaborators.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {selectedCollaborators.map((collaborator) => (
                  <div key={collaborator.id} className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center">
                    <RiUserFill className="mr-2" />
                    <span>{collaborator.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Department Section */}
          <div>
            <label className="text-gray-300">Department</label>
            <div className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer" onClick={() => setIsDepartmentModalOpen(true)}>
              <span>{selectedDepartment?.name || "Select Department"}</span>
              <span>▼</span>
            </div>
          </div>

          {/* start date and end date  */}
          {/* <div>
            <label className="text-gray-300">Start Date</label>
            <div className="relative">
              <input type="date" className="w-full bg-black text-white p-3 rounded" />
              <img src={calenderIcon} alt="calendar" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>
          </div>
          <div>
            <label className="text-gray-300">End Date</label>
            <div className="relative">
              <input type="date" className="w-full bg-black text-white p-3 rounded" />
              <img src={calenderIcon} alt="calendar" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>
          </div> */}

          {/* Start Date Picker */}
          <div>
            <label className="text-gray-300">Start Date</label>
            <div className="relative bg-black text-white p-3 rounded cursor-pointer flex justify-between items-center" onClick={() => setIsStartDateModalOpen(true)}>
              <span>{startDate ? format(startDate, "MM-dd-yyyy") : "mm/dd/yyyy"}</span>
              {/* <span>{startDate ? format(startDate, "PPP") : "mm/dd/yyyy"}</span> */}
              <img src={calenderIcon} alt="calendar" className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* End Date Picker */}
          <div>
            <label className="text-gray-300">End Date</label>
            <div className="relative bg-black text-white p-3 rounded cursor-pointer flex justify-between items-center" onClick={() => setIsEndDateModalOpen(true)}>
              <span>{endDate ? format(endDate, "MM-dd-yyyy") : "mm/dd/yyyy"}</span>
              {/* <span>{endDate ? format(endDate, "PPP") : "mm/dd/yyyy"}</span> */}

              <img src={calenderIcon} alt="calendar" className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* //---------------------------------------- */}

          <div>
            <label className="text-gray-300">Programme Name</label>
            <input type="text" className="w-full bg-black text-white p-3 rounded" placeholder="Enter Programme Name" />
          </div>
          <div>
            <label className="text-gray-300">Experiment Type</label>
            <div className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer" onClick={() => setIsExpTypeModalOpen(true)}>
              <span>{selectedExpType || "Select Experiment Type"}</span>
              <span>▼</span>
            </div>
          </div>
        </div>

        {/* Experiment Title */}
        <div className="mt-4">
          <label className="text-gray-300">Experiment Title</label>
          <input type="text" className="w-full bg-black text-white p-3 rounded" placeholder="Enter Experiment Title" />
        </div>

        {/* Objective */}
        <div className="mt-4">
          <label className="text-gray-300">Objective</label>
          <textarea className="w-full bg-black text-white p-3 rounded" placeholder="Enter Objective"></textarea>
        </div>

        {/* Other Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div>
              <label className="text-gray-300 block mb-1">General Cell Line</label>
              <div className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer" onClick={() => setIsGeneralCellLineModalOpen(true)}>
                <span>{selectedGeneralCellLine || "Select General Cell Line"}</span>
                <span>▼</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-gray-300 block mb-1">Plot Type</label>
              <div className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer" onClick={() => setIsPlotTypeModalOpen(true)}>
                <span>{selectedPlotType || "Select Plot Type"}</span>
                <span>▼</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Instruments</label>
            <div className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer" onClick={() => setIsInstrumentsModalOpen(true)}>
              <span>{selectedInstrument || "Select Instruments"}</span>
              <span>▼</span>
            </div>
          </div>
        </div>
      </form>

      {/* Render Modals */}
      {isCollaboratorModalOpen && <CollaboratorModal onClose={() => setIsCollaboratorModalOpen(false)} onSelect={handleSelectCollaborators} />}
      {isDepartmentModalOpen && (
        <SelectDepartmentModal
          onClose={() => setIsDepartmentModalOpen(false)}
          onSelect={handleSelectDepartment} // Pass function to update state
        />
      )}
      {isExpTypeModalOpen && <SelectExpType onClose={() => setIsExpTypeModalOpen(false)} onSelect={handleSelectExpType} />}
      {isGeneralCellLineModalOpen && <SelectGeneralCellLine onClose={() => setIsGeneralCellLineModalOpen(false)} onSelect={handleSelectGeneralCellLine} />}
      {isInstrumentsModalOpen && <SelectInstruments onClose={() => setIsInstrumentsModalOpen(false)} onSelect={handleSelectInstrument} />}
      {isPlotTypeModalOpen && <SelectPlotTypeModal onClose={() => setIsPlotTypeModalOpen(false)} onSelect={handleSelectPlotType} />}

      {isStartDateModalOpen && <DatePickerModal onClose={() => setIsStartDateModalOpen(false)} onSubmit={setStartDate} />}
      {isEndDateModalOpen && <DatePickerModal onClose={() => setIsEndDateModalOpen(false)} onSubmit={setEndDate} />}
    </div>
  );
};

export default SetupStep;
