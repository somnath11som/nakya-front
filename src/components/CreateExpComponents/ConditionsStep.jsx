import React, { useState } from "react";
import { RiFileCopyLine } from "react-icons/ri"; // Remix icon for copy
import calenderIcon from "../../assets/Images/createExpImg/calenderIcon.png";
import VesselTypeModal from "../ConditionsStepModal/VesselTypeModal";
import SubCellLineModal from "../ConditionsStepModal/SubCellLineModal";
import SelectTemperatureModal from "../ConditionsStepModal/SelectTemperatureModal";
import SelectFeedTypeModal from "../ConditionsStepModal/SelectFeedTypeModal";
import SelectNutrientsSupplementsModal from "../ConditionsStepModal/SelectNutrientsSupplementsModal";
import SelectInstrumentsModal from "../ConditionsStepModal/SelectInstrumentsModal";
import MediaVolumeModal from "../ConditionsStepModal/MediaVolumeModal";

const ConditionsStep = () => {
  const [selectedVesselType, setSelectedVesselType] = useState("");
  const [selectedTemperature, setSelectedTemperature] = useState("");
  const [selectedFeed, setSelectedFeed] = useState("");
  const [selectedNutrients, setSelectedNutrients] = useState("");
  const [selectedAdditionalNutrients, setSelectedAdditionalNutrients] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState("");
  const [selectedMediaVolume, setSelectedMediaVolume] = useState("");
  const [selectedSubCellLine, setSelectedSubCellLine] = useState("");
  const [isVesselTypeModalOpen, setIsVesselTypeModalOpen] = useState(false);
  const [isSubCellLineModalOpen, setIsSubCellLineModalOpen] = useState(false);
  const [isTemperatureModalOpen, setIsTemperatureModalOpen] = useState(false);
  const [isFeedTypeModalOpen, setIsFeedTypeModalOpen] = useState(false);
  const [isNutrientsModalOpen, setIsNutrientsModalOpen] = useState(false);
  const [isAdditionalNutrientsModalOpen, setIsAdditionalNutrientsModalOpen] = useState(false);
  const [isInstrumentsModalOpen, setIsInstrumentsModalOpen] = useState(false);
  const [isMediaVolumeModalOpen, setIsMediaVolumeModalOpen] = useState(false);

  const vesselID = "VR-24-PP-003-07-001"; // Example Vessel ID

  const handleCopy = () => {
    navigator.clipboard.writeText(vesselID);
    alert("Vessel ID copied!"); // Optional feedback
  };

  const handleSelectVesselType = (vesselType) => {
    setSelectedVesselType(vesselType);
  };

  const handleSelectSubCellLine = (subCellLine) => {
    setSelectedSubCellLine(subCellLine);
  };

  const handleSelectTemperature = (temperature) => {
    setSelectedTemperature(temperature);
  };

  const handleSelectFeed = (feed) => {
    setSelectedFeed(feed);
  };

  const handleSelectNutrients = (nutrients) => {
    setSelectedNutrients(nutrients);
  };

  const handleSelectAdditionalNutrients = (nutrients) => {
    setSelectedAdditionalNutrients(nutrients);
  };

  const handleSelectInstruments = (instruments) => {
    setSelectedInstruments(instruments);
  };

  const handleSelectMediaVolume = (volume) => {
    setSelectedMediaVolume(volume);
  };

  return (
    <div className="px-8 py-8 bg-[#171717] rounded-lg mt-5 ">
      <div className="flex items-center gap-2 mb-4">
        
        <div className="bg-white text-black px-5 py-3 rounded cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center">
          Number of Conditions: 1
        </div>
      </div>
<div className="border rounded-lg border-[#292929] p-4">
      {/* Vessel ID Field */}
      <div className="flex items-center justify-between border-b-2 border-[#292929] text-white p-3 rounded mb-4">
        <span className="text-gray-300">Vessel ID:</span>
        <div className="flex items-center">
          <span className="mr-2">{vesselID}</span>
          <RiFileCopyLine className="cursor-pointer text-gray-400 hover:text-white" onClick={handleCopy} />
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        {/* Vessel Type */}
        <div>
          <label className="text-gray-300">Vessel Type</label>
          <div 
            className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer"
            onClick={() => setIsVesselTypeModalOpen(true)}
          >
            <span>{selectedVesselType || "Select Vessel Type"}</span>
            <span>▼</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* pH SP Level */}
        <div>
          <label className="text-gray-300">pH SP Level</label>
          <input
            type="text"
            className="w-full bg-black text-white p-3 rounded"
            placeholder="Enter pH SP level"
          />
        </div>

        {/* Sub Cell Line */}
        <div>
          <label className="text-gray-300">Sub Cell Line</label>
          <div 
            className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer"
            onClick={() => setIsSubCellLineModalOpen(true)}
          >
            <span>{selectedSubCellLine || "Select Sub Cell Line"}</span>
            <span>▼</span>
          </div>
        </div>

        {/* Temperature */}
        <div>
          <label className="text-gray-300">Temperatures</label>
          <div 
            className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer"
            onClick={() => setIsTemperatureModalOpen(true)}
          >
            <span>{selectedTemperature || "Select Temperatures"}</span>
            <span>▼</span>
          </div>
        </div>

        {/* Feed */}
        <div>
          <label className="text-gray-300">Feed</label>
          <div 
            className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer"
            onClick={() => setIsFeedTypeModalOpen(true)}
          >
            <span>{selectedFeed || "Select Feed"}</span>
            <span>▼</span>
          </div>
        </div>

        {/* Nutrients / Supplements */}
        <div>
          <label className="text-gray-300">Nutrients / Supplements</label>
          <div 
            className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer"
            onClick={() => setIsNutrientsModalOpen(true)}
          >
            <span>{selectedNutrients || "Select Nutrients / Supplements"}</span>
            <span>▼</span>
          </div>
        </div>

        {/* Additional Nutrients / Supplements */}
        <div>
          <label className="text-gray-300">Additional Nutrients / Supplements</label>
          <div 
            className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer"
            onClick={() => setIsAdditionalNutrientsModalOpen(true)}
          >
            <span>{selectedAdditionalNutrients || "Select Additional Nutrients / Supplements"}</span>
            <span>▼</span>
          </div>
        </div>

        {/* Specific Instruments */}
        <div>
          <label className="text-gray-300">Specific Instruments</label>
          <div 
            className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer"
            onClick={() => setIsInstrumentsModalOpen(true)}
          >
            <span>{selectedInstruments || "Select Specific Instruments"}</span>
            <span>▼</span>
          </div>
        </div>

        {/* Seeding Density */}
        <div>
          <label className="text-gray-300">Seeding Density</label>
          <input
            type="text"
            className="w-full bg-black text-white p-3 rounded"
            placeholder="Enter Seeding Density"
          />
        </div>

        {/* Source Density */}
        <div>
          <label className="text-gray-300">Source Density</label>
          <input
            type="text"
            className="w-full bg-black text-white p-3 rounded"
            placeholder="Enter Source Density"
          />
        </div>

        {/* Source Culture Volume */}
        <div>
          <label className="text-gray-300">Source Culture Volume</label>
          <input
            type="text"
            className="w-full bg-black text-white p-3 rounded"
            placeholder="Enter Source Culture Volume"
          />
        </div>

        {/* Final Culture Volume */}
        <div>
          <label className="text-gray-300">Final Culture Volume</label>
          <input
            type="text"
            className="w-full bg-black text-white p-3 rounded"
            placeholder="Enter Final Culture Volume"
          />
        </div>

        {/* Media Volume */}
        <div>
          <label className="text-gray-300">Media Volume</label>
          <div 
            className="w-full bg-black text-white p-3 rounded flex justify-between items-center cursor-pointer"
            onClick={() => setIsMediaVolumeModalOpen(true)}
          >
            <span>{selectedMediaVolume || "Media Volume"}</span>
            <span>▼</span>
          </div>
        </div>
      </div>
      </div>

      {/* Render Modals */}
      {isVesselTypeModalOpen && (
        <VesselTypeModal
          onClose={() => setIsVesselTypeModalOpen(false)}
          onSelect={handleSelectVesselType}
        />
      )}
      {isSubCellLineModalOpen && (
        <SubCellLineModal
          onClose={() => setIsSubCellLineModalOpen(false)}
          onSelect={handleSelectSubCellLine}
        />
      )}
      {isTemperatureModalOpen && (
        <SelectTemperatureModal
          onClose={() => setIsTemperatureModalOpen(false)}
          onSelect={handleSelectTemperature}
        />
      )}
      {isFeedTypeModalOpen && (
        <SelectFeedTypeModal
          onClose={() => setIsFeedTypeModalOpen(false)}
          onSelect={handleSelectFeed}
        />
      )}
      {isNutrientsModalOpen && (
        <SelectNutrientsSupplementsModal
          onClose={() => setIsNutrientsModalOpen(false)}
          onSelect={handleSelectNutrients}
        />
      )}
      {isAdditionalNutrientsModalOpen && (
        <SelectNutrientsSupplementsModal
          onClose={() => setIsAdditionalNutrientsModalOpen(false)}
          onSelect={handleSelectAdditionalNutrients}
        />
      )}
      {isInstrumentsModalOpen && (
        <SelectInstrumentsModal
          onClose={() => setIsInstrumentsModalOpen(false)}
          onSelect={handleSelectInstruments}
        />
      )}
      {isMediaVolumeModalOpen && (
        <MediaVolumeModal
          onClose={() => setIsMediaVolumeModalOpen(false)}
          onSelect={handleSelectMediaVolume}
        />
      )}
    </div>
  );
};

export default ConditionsStep;
