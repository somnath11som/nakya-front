import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import EditIcon from "../assets/Images/manageProfileimg/Editicon.png";
import DeleteIconAccount from "../assets/Images/manageProfileimg/deleteAccountIcon.png";
import ChangePasswordIcon from "../assets/Images/manageProfileimg/changePasswordicon.png";
import EmailIcon from "../assets/Images/manageProfileimg/emailicon.png";
import phoneicon from "../assets/Images/manageProfileimg/phoneicon.png";
// import ProfileIcon from "../assets/Images/loginImg/profileImg.png";

const ManageProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // const token = useSelector((state) => state.user.token);


  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (!tokens) {
    navigate("/");
  }
  tokens = tokens.replace(/"/g, "");
  console.log(`testing ${tokens}`);




  const navigate = useNavigate();

  // const API_URL_REJECT = "https://crp.mydevfactory.com/api/users/delete-user";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("https://crp.mydevfactory.com/api/users/update/profile/", {
          headers: {
            Authorization: `Bearer ${tokens}`,
            
          },
        });
        console.log(response.data.user);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    if (tokens) {
      fetchUserProfile();
    } else {
      setError("Authentication token not found");
    }
  }, [tokens, navigate]);


  //delete 
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await axios.delete("https://crp.mydevfactory.com/api/users/delete-user" + "/", {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Account deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error.message);
      toast.error("Error deleting account. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Layout title="Manage Profile">
      {error ? (
        <div>{error}</div>
      ) : !userData ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="border border-[#202020] rounded-lg overflow-hidden bg-[#292929] text-white p-6 py-8 shadow-md">
            {/* Profile Section */}
            <div className="flex items-center justify-between">
              {/* Left Section - Name & Description */}
              <div className="flex items-center gap-4">
                <img src={`https://crp.mydevfactory.com/${userData.photo}`} alt="Profile" className="w-16 h-16 rounded-full" />
                <div>
                  <h2 className="text-lg font-semibold">
                    {userData.first_name} {userData.last_name}
                  </h2>
                  <p className="text-gray-400 text-sm">{userData.organization_name}</p>
                </div>
              </div>

              {/* Vertical Line */}
              <div className="h-20 w-[1px] bg-gray-600 mx-8"></div>

              {/* Right Section - Contact Info */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <img src={EmailIcon} alt="Email" className="w-4 h-4" />
                  <span className="text-sm text-gray-300">{userData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={phoneicon} alt="Phone" className="w-4 h-4" />
                  <span className="text-sm text-gray-300">{userData.phone}</span>
                </div>
              </div>

              {/* Edit Button */}
              <Link to="/edit-profile">
                <button className="flex items-center gap-2 bg-transparent text-[#BBA14F] px-4 py-2 rounded-md border border-[#BBA14F] ml-8">
                  <img src={EditIcon} alt="Edit" className="w-4 h-4" />
                  Edit
                </button>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-6 gap-4">
            {/* Delete Account */}
            <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 border border-[#BBA14F] text-[#BBA14F] px-4 py-2 rounded-md hover:bg-[#1a1a1a]">
              <img src={DeleteIconAccount} alt="Delete Account" className="w-4 h-4" />
              Delete Account
            </button>

            {/* Change Password */}
            <Link to="/change-password">
              <button className="flex items-center gap-2 bg-[#BBA14F] text-white px-4 py-2 rounded-md hover:bg-[#9D8A3F]">
                <img src={ChangePasswordIcon} alt="Change Password" className="w-4 h-4" />
                Change Password
              </button>
            </Link>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#171717] p-6 rounded-lg w-96">
                <h2 className="text-xl font-semibold text-[#BBA14F] mb-4">Delete Account</h2>
                <p className="text-white mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-[#EA364F] text-white rounded hover:bg-red-700 disabled:opacity-50" onClick={handleDeleteAccount} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default ManageProfile;
