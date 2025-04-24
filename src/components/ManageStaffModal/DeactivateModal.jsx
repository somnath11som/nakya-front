import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeactivateModal = ({ isOpen, onClose, fetchStaffs, tokens, selectedStaffId }) => {
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const handleDeactivateConfirm = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(`https://crp.mydevfactory.com/api/users/staffs/${selectedStaffId}/`, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });

      // Close modal first
      onClose();

      // Show success toast
      toast.success("Staff deactivated successfully!");

      // Refresh staff list
      fetchStaffs();
    } catch (error) {
      console.error("Error deactivating staff:", error);
      toast.error(error.response?.data?.message || "Error deactivating staff");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-[400px] p-6 rounded-lg relative">
        {/* Close Button */}
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        {/* Content */}
        <h2 className="text-center text-xl font-bold mb-4 text-black">Confirm Deactivation</h2>
        <p className="text-center text-gray-600 mb-6">Are you sure you want to deactivate this staff member? This action cannot be undone.</p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-6 py-2 border border-[#BBA14F] text-[#BBA14F] rounded-md hover:bg-gray-100 transition">
            Cancel
          </button>
          <button onClick={handleDeactivateConfirm} className="px-6 py-2 bg-[#BBA14F] text-white rounded-md hover:bg-[#BBA14F] transition" disabled={deleteLoading}>
            {deleteLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deactivating...
              </div>
            ) : (
              "Deactivate"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateModal;
