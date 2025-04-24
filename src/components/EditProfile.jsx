import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import uploadIcon from "../assets/Images/loginImg/uplodeicon.png";
import { useSelector, useDispatch } from "react-redux";
import backIcon from "../assets/Images/manageInstru/backIcon.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    organization_name: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

  // First fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("https://crp.mydevfactory.com/api/users/update/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.user;
        setUserData(user);

        // Set form data from fetched user data
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          organization_name: user.organization_name || "",
        });

        if (user.phone) {
          // Remove any '+' prefix if present
          const cleanPhone = user.phone.replace(/^\+/, "");

          // Get the last 10 digits for phone number
          const lastTenDigits = cleanPhone.slice(-10);
          setPhoneNumber(lastTenDigits);

          // Get everything before the last 10 digits for country code
          const countryCodeDigits = cleanPhone.slice(0, cleanPhone.length - 10);
          // Add + prefix to country code if it exists
          if (countryCodeDigits) {
            setCountryCode(`+${countryCodeDigits}`);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile data");
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      setError("Authentication token not found");
      setIsLoading(false);
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear validation error when user starts typing
    setValidationErrors({
      ...validationErrors,
      [name]: "",
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
    }

    if (!formData.organization_name.trim()) {
      errors.organization_name = "Organization name is required";
    }

    if (!phoneNumber.trim()) {
      errors.phone = "Phone number is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("organization_name", formData.organization_name);

      // Combine country code and phone number
      const fullPhone = countryCode.replace("+", "") + phoneNumber;
      formDataToSend.append("phone", fullPhone);

      // Only append photo if a new one was selected
      const isPhotoUpdated = !!profileImage;
      if (profileImage) {
        formDataToSend.append("photo", profileImage);
      }

      const response = await axios.patch("https://crp.mydevfactory.com/api/users/update/profile/", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.success) {
        // Set timestamp in localStorage if photo was updated
        if (isPhotoUpdated) {
          // Set the localStorage flag to trigger a reload
          localStorage.setItem("lastPhotoUpdateTime", Date.now().toString());
          // Reset the global flag to ensure the photo will be loaded
          if (typeof window !== "undefined") {
            window._photoLoadedInSession = false;
          }
        }

        try {
          // Fetch updated user data
          const userResponse = await axios.get("https://crp.mydevfactory.com/api/users/update/profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (userResponse.data && userResponse.data.user) {
            // Update Redux store with new user data
            dispatch(
              setUser({
                user: userResponse.data.user,
                access: token,
              })
            );

            // Update local state with new user data
            setUserData(userResponse.data.user);

            toast.success("Profile updated successfully!");
            // Use navigate(-1) to go back to the previous page
            navigate(-1);
          } else {
            toast.success("Profile updated successfully!");
            // Use navigate(-1) to go back to the previous page
            navigate(-1);
          }
        } catch (fetchError) {
          // Even if fetching updated data fails, the update was successful
          console.error("Error fetching updated profile:", fetchError);
          toast.success("Profile updated successfully!");
          // Use navigate(-1) to go back to the previous page
          navigate(-1);
        }
      } else {
        toast.success(response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
      setError("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Edit Profile">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading profile data...</div>
        </div>
      </Layout>
    );
  }

  if (error && !userData) {
    return (
      <Layout title="Edit Profile">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={
        <div className="flex items-center gap-2">
          <div className="border border-[#BBA14F] rounded-full p-3">
            <img
              src={backIcon}
              alt="Back"
              className="h-6 w-6 cursor-pointer"
              onClick={() => {
                navigate("/manage-profile");
                window.location.reload();
              }}
            />
          </div>
          <span>Edit Profile</span>
        </div>
      }
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <form onSubmit={handleSubmit} className="border border-[#202020] rounded-lg overflow-hidden bg-[#292929] text-white p-6 py-8 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section - Profile Image & Organization */}
          <div className="flex flex-col gap-4">
            {/* Profile Image Upload Box */}
            <div className="border-2 border-dashed border-[#BBA14F] rounded-lg p-6 flex items-center justify-between bg-[#1a1a1a] min-h-[150px]">
              <div className="flex items-center gap-4">
                <img
                  src={profileImage ? URL.createObjectURL(profileImage) : `https://crp.mydevfactory.com/${userData.photo}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-[#BBA14F] text-sm font-semibold">Upload Profile Image</p>
                  <p className="text-gray-400 text-xs">Support: JPEG, PNG 15 MB</p>
                </div>
              </div>

              <label htmlFor="edit-file-upload" className="cursor-pointer">
                <img src={uploadIcon} alt="Upload" className="w-8 h-8 hover:opacity-80" />
              </label>
              <input id="edit-file-upload" type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleImageChange} />
            </div>

            {/* Organization Input */}
            <div>
              <input
                type="text"
                name="organization_name"
                placeholder="Organization Name"
                value={formData.organization_name}
                onChange={handleInputChange}
                className={`w-full bg-[#1a1a1a] border ${
                  validationErrors.organization_name ? "border-red-500" : "border-[#404040]"
                } rounded-md px-4 py-2 focus:outline-none focus:border-[#BBA14F]`}
              />
              {validationErrors.organization_name && <p className="text-red-500 text-sm mt-1">{validationErrors.organization_name}</p>}
            </div>
          </div>

          {/* Right Section - Form Fields */}
          <div className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={`w-full bg-[#1a1a1a] border ${
                  validationErrors.first_name ? "border-red-500" : "border-[#404040]"
                } rounded-md px-4 py-2 focus:outline-none focus:border-[#BBA14F]`}
              />
              {validationErrors.first_name && <p className="text-red-500 text-sm mt-1">{validationErrors.first_name}</p>}
            </div>

            <div>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
                className={`w-full bg-[#1a1a1a] border ${
                  validationErrors.last_name ? "border-red-500" : "border-[#404040]"
                } rounded-md px-4 py-2 focus:outline-none focus:border-[#BBA14F]`}
              />
              {validationErrors.last_name && <p className="text-red-500 text-sm mt-1">{validationErrors.last_name}</p>}
            </div>

            <div className="flex gap-2">
              <select
                className="bg-[#1a1a1a] border border-[#404040] rounded-md px-3 py-2 focus:outline-none focus:border-[#BBA14F]"
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
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setValidationErrors({ ...validationErrors, phone: "" });
                  }}
                  className={`w-full bg-[#1a1a1a] border ${
                    validationErrors.phone ? "border-red-500" : "border-[#404040]"
                  } rounded-md px-4 py-2 focus:outline-none focus:border-[#BBA14F]`}
                />
                {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <button type="submit" className="bg-[#BBA14F] text-white px-6 py-2 rounded-md hover:bg-[#9D8A3F] transition" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default EditProfile;
