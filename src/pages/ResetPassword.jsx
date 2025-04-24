import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import leftimg from "../assets/Images/ForgotPassImg/restPassImg.png";
import logoImg from "../assets/Images/loginImg/LogoImg.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`https://crp.mydevfactory.com/api/users/reset-password/${token}/`, { password: formData.password });
      setMessage("Password reset successfully! Redirecting to login...");
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong. Please try again.");
      toast.error(error.response?.data?.error || "Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-20">
        {/* Left Section - Illustration */}
        <div className="hidden md:flex justify-center w-1/2">
          <img src={leftimg} alt="Illustration" />
        </div>

        {/* Right Section - Form */}
        <div className="bg-[#38383866] p-8 rounded-lg md:w-2/5 w-full shadow-lg px-10 py-14">
          <div className="flex justify-center mb-4">
            <img src={logoImg} alt="Logo" className="w-28" />
          </div>

          <h2 className="text-2xl font-semibold text-white text-center">Reset Your Password</h2>
          <p className="text-gray-400 text-center text-sm mt-2">Please enter your new password.</p>

          {/* {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md mt-4 text-center">{message}</div>} */}

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword.password ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-3 bg-black border ${
                    validationErrors.password ? "border-red-500" : "border-gray-700"
                  } text-white rounded-lg focus:outline-none focus:border-gray-500`}
                />
                <button type="button" onClick={() => togglePasswordVisibility("password")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showPassword.password ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {validationErrors.password && <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-3 bg-black border ${
                    validationErrors.confirmPassword ? "border-red-500" : "border-gray-700"
                  } text-white rounded-lg focus:outline-none focus:border-gray-500`}
                />
                <button type="button" onClick={() => togglePasswordVisibility("confirmPassword")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {validationErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-1/2 mx-auto block bg-[#BBA14F] text-black font-semibold py-3 rounded-lg mt-4 hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
