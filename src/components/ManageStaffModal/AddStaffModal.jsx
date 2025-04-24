import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import uploadIcon from "../../assets/Images/loginImg/uplodeicon.png";
import profileImg from "../../assets/Images/loginImg/profileImg.png";

const AddStaffModal = ({ isOpen, onClose, fetchStaffs, departments, tokens }) => {
  const [countryCode, setCountryCode] = React.useState("+91");
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
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (!formData.name || !formData.dob || !formData.department || !formData.designation || !formData.email || !formData.phone || !formData.site) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form data to FormData object
      formDataToSend.append("name", formData.name);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", countryCode + formData.phone);
      formDataToSend.append("site", formData.site);
      formDataToSend.append("description", formData.description);
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const response = await axios.post("https://crp.mydevfactory.com/api/users/staffs/", formDataToSend, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Staff added successfully:", response.data);
      toast.success("Staff added successfully");

      // Refresh staff list
      fetchStaffs();

      // Reset form and close modal
      setFormData({
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
      setPreviewImage(null);
      onClose();
    } catch (error) {
      console.error("Error adding staff:", error.response ? error.response.data : error);
      toast.error(error.response?.data?.error || "Failed to add staff");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white w-[700px] p-3 px-6 rounded-lg relative">
        {/* Close Button */}
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        {/* Title */}
        <h2 className="text-center text-xl font-bold mb-6 text-black">Add New Staff</h2>

        <div className="grid grid-cols-2 gap-2">
          {/* Profile Upload */}
          <div className="relative h-full">
            <label htmlFor="file-upload" className="border-dashed border-2 border-[#BBA14F] p-6 rounded-lg flex items-center gap-4 cursor-pointer w-full h-full">
              {previewImage ? (
                <img src={previewImage} alt="Profile Preview" className="h-20 w-20 object-cover rounded-full" />
              ) : (
                <img src={profileImg} alt="Profile" className="h-20 w-20 object-cover" />
              )}
              <div className="flex flex-row items-center">
                <img src={uploadIcon} alt="Upload Icon" className="w-7 h-7 mr-2" />
                <div>
                  <p className="text-[#BBA14F] text-sm font-semibold">Upload Profile Image</p>
                  <p className="text-xs text-gray-500">Support: JPEG, PDF 15 MB</p>
                </div>
              </div>
            </label>
            <input id="file-upload" type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleFileChange} />
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
                departments.map((dept, index) => (
                  <option key={index} value={dept.id}>
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
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                className="border border-[#BBA14F] bg-white text-black p-2 rounded-md w-full focus:outline-none"
                required
              />
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
          <button type="submit" className="bg-[#BBA14F] text-white px-6 py-2 rounded-md hover:bg-[#9D8A3F] transition">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaffModal;
