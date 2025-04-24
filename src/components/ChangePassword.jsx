import React, { useState } from "react";
import Layout from "./Layout";
import rightimg from "../assets/Images/ForgotPassImg/updatePasswordImg.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import backIcon from "../assets/Images/manageInstru/backIcon.png";
import { useNavigate } from "react-router-dom";


const ChangePassword = () => {
    const navigate = useNavigate();

  const token = useSelector((state) => state.user.token)
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "", 
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [validationErrors, setValidationErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({
      ...validationErrors,
      [name]: "",
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };

    if (!formData.oldPassword.trim()) {
      errors.oldPassword = "Old password is required";
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters long";
      isValid = false;
    }

    if (!formData.confirmNewPassword.trim()) {
      errors.confirmNewPassword = "Confirm password is required";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (!token) {
        toast.error("You must be logged in to change your password");
        setIsLoading(false);
        return;
      }

      const response = await axios.put(
        "https://crp.mydevfactory.com/api/users/change-password/",
        {
          current_password: formData.oldPassword,
          new_password: formData.newPassword,
          confirm_password: formData.confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password updated successfully!");

      // Reset form after successful password change
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);

      if (error.response && error.response.data) {
        // Handle specific API error messages
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else if (error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Failed to update password. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout  title={
        <div className="flex items-center gap-2">
          <div className="border border-[#BBA14F] rounded-full p-3" onClick={() => navigate(-1)} >
            <img src={backIcon} alt="Back" className="h-6 w-6 cursor-pointer"  />
          </div>
          <span>Change Password</span>
        </div>
      }>
 

      <div className="flex flex-col md:flex-row items-center justify-center bg-black text-white">
        {/* Left Section - Form */}
        <div className="bg-[#171717] p-8 rounded-2xl shadow-lg w-full md:w-1/2 mx-4">
          <h2 className="text-2xl font-semibold text-white text-center mb-4">Change Password</h2>

          <form onSubmit={handleSubmit}>
            {/* Old Password */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword.oldPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className={`w-full p-3 bg-black border ${
                    validationErrors.oldPassword ? "border-red-500" : "border-gray-700"
                  } text-white rounded-lg focus:outline-none focus:border-gray-500`}
                />
                <button type="button" onClick={() => togglePasswordVisibility("oldPassword")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {validationErrors.oldPassword && <p className="text-red-500 text-sm mt-1">{validationErrors.oldPassword}</p>}
            </div>

            {/* New Password */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full p-3 bg-black border ${
                    validationErrors.newPassword ? "border-red-500" : "border-gray-700"
                  } text-white rounded-lg focus:outline-none focus:border-gray-500`}
                />
                <button type="button" onClick={() => togglePasswordVisibility("newPassword")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {validationErrors.newPassword && <p className="text-red-500 text-sm mt-1">{validationErrors.newPassword}</p>}
            </div>

            {/* Confirm New Password */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword.confirmNewPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className={`w-full p-3 bg-black border ${
                    validationErrors.confirmNewPassword ? "border-red-500" : "border-gray-700"
                  } text-white rounded-lg focus:outline-none focus:border-gray-500`}
                />
                <button type="button" onClick={() => togglePasswordVisibility("confirmNewPassword")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showPassword.confirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {validationErrors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{validationErrors.confirmNewPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-1/2 mx-auto block bg-[#BBA14F] text-black font-semibold py-3 rounded-lg mt-4 hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:flex items-center justify-center ml-10 w-1/2">
          <img src={rightimg} alt="Support Illustration" className="" />
        </div>
      </div>
    
    </Layout>
  );
};

export default ChangePassword;
