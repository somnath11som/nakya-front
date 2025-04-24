import { useState } from "react";
import logoImg from "../assets/Images/loginImg/LogoImg.png";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
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
      password: "",
    };

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post("https://crp.mydevfactory.com/api/users/login/admin/", data, { headers: { "Content-Type": "multipart/form-data" } });
      console.log(response.data);
      setError("");
      dispatch(setUser(response.data));
      toast.success(response?.data?.message)
      navigate("/admin-dashbord");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.error || "Something went wrong");
      toast.error(error.response?.data?.error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div id="main" className="container mx-auto flex justify-center px-6">
        {/* Login Form */}
        <div id="right" className="bg-[#38383866] p-8 rounded-lg w-full max-w-md shadow-lg px-10">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logoImg} alt="Logo" className="w-28" />
          </div>

          <h2 className="text-2xl font-semibold text-white text-center">Welcome To Admin Portal</h2>
          <p className="text-white text-center text-sm mt-2">Enter your email & password to access your account.</p>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mt-4">{error}</div>}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-6">
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

            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Password</label>
              <input
                type="password"
                onChange={handleChange}
                name="password"
                placeholder="Enter your password"
                className={`w-full p-3 bg-black border ${
                  validationErrors.password ? "border-red-500" : "border-gray-700"
                } text-white rounded-lg focus:outline-none focus:border-gray-500`}
              />
              {validationErrors.password && <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>}
            </div>

            <div className="flex align-center justify-between">
              {/* <Link to="/login" className="text-[#BBA14F] text-sm hover:underline">
                Member Login
              </Link> */}
              <a href="#" className="text-[#BBA14F] text-sm hover:underline">
                Forgot Password?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-[#BBA14F] text-black font-semibold py-3 rounded-lg mt-4 hover:bg-yellow-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

         
        </div>
      </div>
    </div>
  );
};

export default Login;