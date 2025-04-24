

// New code with profile image preview functionality
import { useState } from "react";
import leftsideImg from "../assets/Images/loginImg/leftimg.png";
import logoImg from "../assets/Images/loginImg/LogoImg.png";
import profileImg from "../assets/Images/loginImg/profileImg.png";
import uploadIcon from "../assets/Images/loginImg/uplodeicon.png";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apiCallBack } from "../utils/fetchAPI";
import { toast} from "react-toastify";
import axios from "axios";

const Signup = () => {
  // Redux and navigation hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // New state for profile image preview
  const [previewImage, setPreviewImage] = useState(null);
  
  // Add state for country code
  const [countryCode, setCountryCode] = useState("+91");

  // Form initial state
  let initialState = {
    first_name: "",
    last_name: "",
    organization_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    username: "",
    photo: null,
  };

  // Form states
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message,setMessage] = useState("")
  const [fieldErrors, setFieldErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors({
      ...fieldErrors,
      [name]: "",
    });

    if (name === "email") {
      setFormData({
        ...formData,
        [name]: value,
        username: value,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Enhanced file change handler with preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Update form data with selected file
      setFormData({ ...formData, photo: file });
      setFieldErrors({
        ...fieldErrors,
        photo: "",
      });
      
      // Create and set preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserChange = () => {
    setFormData({ ...formData, userName: formData["email"] });
  };

  // Password visibility toggles
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim())
      errors.first_name = "First name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required";
    if (!formData.organization_name.trim())
      errors.organization_name = "Organization name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.confirm_password)
      errors.confirm_password = "Confirm password is required";
    //if (!formData.photo) errors.photo = "Profile photo is required";

    if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    return errors;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   const validationErrors = validateForm();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setFieldErrors(validationErrors);
  //     return;
  //   }

  //   const data = new FormData();
  //   Object.keys(formData).forEach((key) => {
  //     data.append(key, formData[key]);
  //   });

  //   setIsLoading(true);
  //   try {
  //     const response = await apiCallBack("POST", "users/register/", data, null);
  //     if (response.status) {
  //       setError("");
  //       toast.success(response?.message);
  //       dispatch(setUser(response.data));
  //       setFormData(initialState);
  //       navigate("/login");
  //     } else {
  //       toast.error(response?.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setError(error.response?.data?.message || "Something went wrong");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    // Client-side validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone || !formData.password || !formData.organization_name) {
        setError('All fields are required!');
        setIsLoading(false);
        return;
    }

    if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
    }
    
    if (formData.password !== formData.confirm_password) {
        setError('Password and confirm password do not match');
        setIsLoading(false);
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
        setError('Invalid email format');
        setIsLoading(false);
        return;
    }

    const phoneRegex = /^\+?1?\d{9,15}$/;
    if (!phoneRegex.test(formData.phone)) {
        setError('Invalid phone number format');
        setIsLoading(false);
        return;
    }

    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('email', formData.email);
    data.append('phone', `${countryCode}${formData.phone}`); // Combine country code with phone
    data.append('password', formData.password);
    data.append('organization_name', formData.organization_name);
    if (formData.photo) {
        data.append('photo', formData.photo);
    }

    try {
        const response = await axios.post('https://crp.mydevfactory.com/api/users/register/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.status === 1) {
            setMessage(response.data.message);
            setIsLoading(false);
            toast.success(response.data.message)
          
            navigate('/login')

        } else {
          console.log(response)
            setError(response.data.error);
            setIsLoading(false);
            
        }
    } catch (err) {
        console.log(err)
        toast.error(err.response.data.error)
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleSubmit}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-20">
          {/* Left Section */}
          <div id="left" className="hidden md:flex justify-center w-1/2">
            <img src={leftsideImg} alt="Illustration" className="" />
          </div>

          {/* Right Section */}
          <div
            id="right"
            className=" flex justify-center bg-[#38383866] p-8 rounded-lg md:w-2/5 w-full shadow-lg px-10"
          >
            <div className=" ">
              {/* Fixed Header */}
              <img src={logoImg} alt="Logo" className="mx-auto mb-4 w-28" />
              <h2 className="text-white text-2xl font-bold text-center mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-400 text-center mb-4">
                Please enter the credentials below to complete your profile.
              </p>

              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}

              {/* Scrollable Section: Upload Profile to Confirm Password */}
              <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
                {/* Enhanced Profile Upload Box with Preview */}
                <div className="border-2 border-dashed border-yellow-500 rounded-lg p-4 text-center mb-4 flex items-center">
                  <img
                    src={previewImage || profileImg}
                    alt="Profile"
                    className="rounded-full w-16 h-16 object-cover"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <img
                      src={uploadIcon}
                      alt="Upload Icon"
                      className="w-8 h-8 cursor-pointer md:ml-4 ml-4"
                    />
                  </label>

                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/jpeg, image/png"
                    name="photo"
                    onChange={handleFileChange}
                  />
                  <div className="ml-4 flex-1">
                    <p className="text-yellow-500 font-medium">
                      Upload Profile Image
                    </p>
                    <p className="text-gray-400 text-xs">
                      Support: JPEG, PNG (Max 2MB)
                    </p>
                    {fieldErrors.photo && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldErrors.photo}
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-black border border-gray-700 text-white"
                  />
                  {fieldErrors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.first_name}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-black border border-gray-700 text-white"
                  />
                  {fieldErrors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.last_name}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Organization Name"
                    name="organization_name"
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-black border border-gray-700 text-white"
                  />
                  {fieldErrors.organization_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.organization_name}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    placeholder="Email ID"
                    name="email"
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-black border border-gray-700 text-white"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div className="mb-3">
                  <div className="flex">
                    <select 
                      className="bg-black border border-gray-700 text-white p-2 rounded-l"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+1">+1</option>
                      <option value="+7">+7</option>
                      <option value="+20">+20</option>
                      <option value="+27">+27</option>
                      <option value="+30">+30</option>
                      <option value="+31">+31</option>
                      <option value="+32">+32</option>
                      <option value="+33">+33</option>
                      <option value="+34">+34</option>
                      <option value="+36">+36</option>
                      <option value="+39">+39</option>
                      <option value="+40">+40</option>
                      <option value="+41">+41</option>
                      <option value="+43">+43</option>
                      <option value="+44">+44</option>
                      <option value="+45">+45</option>
                      <option value="+46">+46</option>
                      <option value="+47">+47</option>
                      <option value="+48">+48</option>
                      <option value="+49">+49</option>
                      <option value="+51">+51</option>
                      <option value="+52">+52</option>
                      <option value="+54">+54</option>
                      <option value="+55">+55</option>
                      <option value="+56">+56</option>
                      <option value="+57">+57</option>
                      <option value="+61">+61</option>
                      <option value="+64">+64</option>
                      <option value="+65">+65</option>
                      <option value="+81">+81</option>
                      <option value="+82">+82</option>
                      <option value="+86">+86</option>
                      <option value="+90">+90</option>
                      <option value="+91">+91</option>
                      <option value="+92">+92</option>
                      <option value="+93">+93</option>
                      <option value="+94">+94</option>
                      <option value="+95">+95</option>
                      <option value="+98">+98</option>
                      <option value="+212">+212</option>
                      <option value="+213">+213</option>
                      <option value="+216">+216</option>
                      <option value="+218">+218</option>
                      <option value="+220">+220</option>
                      <option value="+221">+221</option>
                      <option value="+223">+223</option>
                      <option value="+234">+234</option>
                      <option value="+249">+249</option>
                      <option value="+250">+250</option>
                      <option value="+251">+251</option>
                      <option value="+254">+254</option>
                      <option value="+255">+255</option>
                      <option value="+256">+256</option>
                      <option value="+260">+260</option>
                      <option value="+263">+263</option>
                      <option value="+264">+264</option>
                      <option value="+265">+265</option>
                      <option value="+266">+266</option>
                      <option value="+267">+267</option>
                      <option value="+268">+268</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Mobile Number"
                      name="phone"
                      onChange={handleChange}
                      className="w-full p-2 rounded-r bg-black border border-gray-700 text-white"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="relative mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-black border border-gray-700 text-white pr-10"
                  />
                  <span
                    className="absolute right-3 top-2 text-gray-400 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <div className="relative mb-3">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    name="confirm_password"
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-black border border-gray-700 text-white pr-10"
                  />
                  <span
                    className="absolute right-3 top-2 text-gray-400 cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {fieldErrors.confirm_password && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.confirm_password}
                    </p>
                  )}
                </div>

                <input
                  id="file-upload"
                  type="hidden"
                  name="username"
                  onChange={handleUserChange}
                />
              </div>

              {/* Fixed Footer: Submit Button & Login Link */}
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#BBA14F] text-black p-2 rounded font-bold"
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>

                <p className="text-gray-400 text-center mt-4">
                  Already have an account?{" "}
                  <span className="text-[#BBA14F] cursor-pointer">
                    <Link to="/Login">Login</Link>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
     
    </div>
  );
};

export default Signup;
