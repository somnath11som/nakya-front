import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import uploadIcon from "../../assets/Images/loginImg/uplodeicon.png";
import profileImg from "../../assets/Images/loginImg/profileImg.png";

const EditStaffModal = ({ isOpen, onClose, fetchStaffs, departments, tokens, selectedStaff, selectedStaffId }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    dob: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    site: "",
    description: "",
    photo: null,
  });
  const [previewImage, setPreviewImage] = React.useState(null);
  const [countryCode, setCountryCode] = React.useState("+91");
  const [formSubmitting, setFormSubmitting] = React.useState(false);

  // Initialize form data when selectedStaff changes
  React.useEffect(() => {
    if (selectedStaff) {
      // Handle phone number and country code
      let phoneNumber = selectedStaff.phone || "";
      let phoneCode = "+91"; // Default

      // Extract country code from phone number if it exists
      if (phoneNumber && phoneNumber.startsWith("+")) {
        // If the number is longer than 10 digits after the + sign
        if (phoneNumber.length > 11) {
          // +[country code][10 digits]
          // Extract the last 10 digits as the actual phone number
          const actualNumber = phoneNumber.slice(-10);
          // Everything before that is the country code (including the +)
          phoneCode = phoneNumber.slice(0, phoneNumber.length - 10);
          phoneNumber = actualNumber;
        } else {
          // If the number is short, use the default extraction
          const matches = phoneNumber.match(/^\+(\d{1,4})/);
          if (matches) {
            const codeDigits = matches[1];
            phoneCode = `+${codeDigits}`;
            phoneNumber = phoneNumber.substring(phoneCode.length);
          }
        }
      }

      setCountryCode(phoneCode);

      // Set form data with proper mapping
      setFormData({
        name: selectedStaff.name || "",
        dob: selectedStaff.dob || "",
        department: selectedStaff.department || "", // This is the department ID
        designation: selectedStaff.designation || "",
        email: selectedStaff.email || "",
        phone: phoneNumber,
        site: selectedStaff.site || "",
        description: selectedStaff.description || "",
        // Don't include photo here, as we're not storing the file object
      });

      // Set preview image if photo exists
      if (selectedStaff.photo) {
        const photoUrl = `https://crp.mydevfactory.com/${selectedStaff.photo}`;
        setPreviewImage(photoUrl);
      } else {
        setPreviewImage(null);
      }
    }
  }, [selectedStaff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormData({
        ...formData,
        photo: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    // Show loading state
    setFormSubmitting(true);

    try {
      // Make a copy of the formData to prepare for submission
      const submissionData = { ...formData };

      // Format and add country code to phone number
      if (submissionData.phone) {
        // Remove any existing "+" signs or spaces from the phone number
        let cleanPhone = submissionData.phone.replace(/\+|\s/g, "");

        // Remove leading zeros
        cleanPhone = cleanPhone.replace(/^0+/, "");

        // Ensure we only use the last 10 digits of the phone number if it's longer
        if (cleanPhone.length > 10) {
          cleanPhone = cleanPhone.slice(-10);
        }

        // Add the country code
        submissionData.phone = countryCode + cleanPhone;
      }

      // If there's a photo file to be uploaded, create FormData
      if (formData.photo instanceof File) {
        const formDataToSend = new FormData();

        // Append all form fields to FormData
        Object.keys(submissionData).forEach((key) => {
          if (key === "photo") {
            formDataToSend.append(key, formData.photo);
          } else {
            formDataToSend.append(key, submissionData[key]);
          }
        });

        const response = await axios.put(`https://crp.mydevfactory.com/api/users/staffs/${selectedStaffId}/`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success("Staff updated successfully!");
          onClose();
          fetchStaffs();
        }
      } else {
        // Otherwise use regular JSON submission
        const response = await axios.put(`https://crp.mydevfactory.com/api/users/staffs/${selectedStaffId}/`, submissionData, {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          toast.success("Staff updated successfully!");
          onClose();
          fetchStaffs();
        }
      }
    } catch (error) {
      console.error("Error updating staff:", error);

      // Show appropriate error message based on the response
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 401) {
          toast.error("Authentication error. Please login again.");
        } else if (error.response.status === 400) {
          toast.error("Invalid data submitted. Please check your inputs.");
        } else {
          toast.error(`Error ${error.response.status}: ${error.response.statusText}`);
        }
      } else if (error.request) {
        toast.error("No response received from server. Please check your connection.");
      } else {
        toast.error("Error updating staff. Please try again.");
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  if (!isOpen || !selectedStaff) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white w-[700px] p-3 px-6 rounded-lg relative">
        {/* Close Button */}
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        {/* Title */}
        <h2 className="text-center text-xl font-bold mb-6 text-black">Edit Staff Details</h2>

        <div className="grid grid-cols-2 gap-2">
          {/* Profile Upload */}
          <div className="relative h-full">
            <label htmlFor="file-upload-edit" className="border-dashed border-2 border-[#BBA14F] p-6 rounded-lg flex items-center gap-4 cursor-pointer w-full h-full">
              {previewImage ? (
                <img src={previewImage} alt="Profile Preview" className="h-20 w-20 object-cover rounded-full" />
              ) : (
                <img src={profileImg} alt="Profile" className="h-20 w-20 object-cover" />
              )}
              <div className="flex flex-row items-center">
                <img src={uploadIcon} alt="Upload Icon" className="w-7 h-7 mr-2" />
                <div>
                  <p className="text-[#BBA14F] text-sm font-semibold">Upload Profile Image</p>
                  <p className="text-xs text-gray-500">Support: JPEG, PNG 15 MB</p>
                </div>
              </div>
            </label>
            <input id="file-upload-edit" type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleFileChange} />
          </div>

          <div className="h-full">
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                className="border border-[#BBA14F] bg-white text-black p-2 rounded-md w-full focus:outline-none"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Date of Birth</label>
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="border border-[#BBA14F] bg-white text-black p-2 rounded-md w-full focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border border-[#BBA14F] bg-white text-black p-2 rounded-md w-full focus:outline-none"
              required
            >
              <option value="">Select Department</option>
              {departments &&
                departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Designation</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="border border-[#BBA14F] bg-white text-black p-2 rounded-md w-full focus:outline-none"
              required
            >
              <option value="">Select Designation</option>
              <option value="Scientist">Scientist</option>
              <option value="Technician">Technician</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email ID"
              className="border border-[#BBA14F] bg-white text-black p-2 rounded-md w-full focus:outline-none"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Mobile Number</label>
            <div className="flex gap-2">
              <select
                className="border border-[#BBA14F] bg-white text-black p-2 rounded-md w-20 focus:outline-none"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                required
              >
                <option value="+91">+91</option>
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
              <div className="relative w-full">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    // Only allow digits and limit to 10 characters
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      handleChange({
                        target: {
                          name: "phone",
                          value,
                        },
                      });
                    }
                  }}
                  placeholder="Enter Mobile Number (10 digits)"
                  className="border border-[#BBA14F] bg-white text-black p-2 rounded-md w-full focus:outline-none"
                  required
                  maxLength="10"
                />
                {formData.phone && formData.phone.length < 10 && <p className="text-red-500 text-xs absolute">Please enter a 10-digit number</p>}
              </div>
            </div>
          </div>

          {/* Site Location */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-black mb-2">Site(Location)</label>
            <input
              type="text"
              name="site"
              value={formData.site}
              onChange={handleChange}
              placeholder="Enter Site(Location)"
              className="border border-[#BBA14F] bg-white text-black p-2 rounded-md w-full focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-black mb-2">Description</label>
            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Description"
              className="border border-[#BBA14F] bg-white text-black p-3 rounded-md w-full focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button type="submit" className="bg-[#BBA14F] text-white px-6 py-2 rounded-md hover:bg-[#9D8A3F] transition" disabled={formSubmitting}>
            {formSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </div>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStaffModal;
