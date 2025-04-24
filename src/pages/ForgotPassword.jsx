import { useState } from "react";
import leftimg from "../assets/Images/ForgotPassImg/leftImg.png";
import logoImg from "../assets/Images/loginImg/LogoImg.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error when user starts typing
    setValidationErrors({
      ...validationErrors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: "",
    };

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!formData.email.trim()) {
      errors.email = "Email cannot be just whitespace";
      isValid = false;
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post("https://crp.mydevfactory.com/api/users/forgot-password/", formData);

      setMessage(response.data.message);
      toast.success("Password reset link sent successfully!");
      setFormData({ email: "" }); // Clear the form after success
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong. Please try again.");
      toast.error(error.response?.data?.error || "Failed to send reset link. Please try again.");
      console.error("Password reset error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div id="main" className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-20 ">
        {/* Left Section - Illustration */}
        <div id="left" className="hidden md:flex justify-center w-1/2">
          <img src={leftimg} alt="Illustration" className="" />
        </div>

        {/* Right Section - Login Form */}
        <div id="right" className="bg-[#38383866] p-8 rounded-lg md:w-2/5 w-full shadow-lg px-10 py-20  ">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logoImg} alt="Logo" className="w-28" />
          </div>

          <h2 className="text-2xl font-semibold text-white text-center">Forgot Password?</h2>
          <p className="text-gray-400 text-center text-sm mt-2">Please enter the registered email ID below and we will send you a link to reset your password.</p>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mt-4">{error}</div>}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Email ID</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                onChange={handleChange}
                className={`w-full p-3 bg-black border ${
                  validationErrors.email ? "border-red-500" : "border-gray-700"
                } text-white rounded-lg focus:outline-none focus:border-gray-500`}
              />
              {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-1/2 mx-auto block bg-[#BBA14F] text-black font-semibold py-3 rounded-lg mt-4 hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>

          <p className="text-gray-400 text-center text-sm mt-4">
            <Link to="/login" className="text-[#BBA14F] hover:underline">
              Back To Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
