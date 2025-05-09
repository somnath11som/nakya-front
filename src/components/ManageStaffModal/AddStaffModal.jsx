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
              required>
              <option value="">Select Designation</option>
              <option value="Research Assistant I">Research Assistant I</option>
              <option value="Research Assistant II">Research Assistant II</option>
              <option value="Research Assistant III">Research Assistant III</option>
              <option value="Research Associate I">Research Associate I</option>
              <option value="Research Associate II">Research Associate II</option>
              <option value="Research Associate III">Research Associate III</option>
              <option value="Scientist I">Scientist I</option>
              <option value="Scientist II">Scientist II</option>
              <option value="Scientist III">Scientist III</option>
              <option value="Senior Scientist">Senior Scientist</option>
              <option value="Principal Scientist">Principal Scientist</option>
              <option value="Staff Scientist">Staff Scientist</option>
              <option value="Distinguished Scientist">Distinguished Scientist</option>
              <option value="Research Fellow">Research Fellow</option>
              <option value="Senior Research Fellow">Senior Research Fellow</option>
              <option value="Associate Director">Associate Director</option>
              <option value="Director">Director</option>
              <option value="Senior Director">Senior Director</option>
              <option value="VP">VP</option>
              <option value="Chief Scientific Officer">Chief Scientific Officer</option>
              <option value="Process Development Associate I">Process Development Associate I</option>
              <option value="Process Development Associate II">Process Development Associate II</option>
              <option value="Process Development Associate III">Process Development Associate III</option>
              <option value="Process Engineer I">Process Engineer I</option>
              <option value="Process Engineer II">Process Engineer II</option>
              <option value="Process Engineer III">Process Engineer III</option>
              <option value="Process Engineer IV">Process Engineer IV</option>
              <option value="Senior Process Engineer">Senior Process Engineer</option>
              <option value="Staff Engineer">Staff Engineer</option>
              <option value="Lead Engineer">Lead Engineer</option>
              <option value="Technical Transfer Specialist">Technical Transfer Specialist</option>
              <option value="MSAT Scientist">MSAT Scientist</option>
              <option value="MSAT Engineer">MSAT Engineer</option>
              <option value="Pilot Plant Scientist">Pilot Plant Scientist</option>
              <option value="Analytical Associate I">Analytical Associate I</option>
              <option value="Analytical Associate II">Analytical Associate II</option>
              <option value="Analytical Scientist I">Analytical Scientist I</option>
              <option value="Analytical Scientist II">Analytical Scientist II</option>
              <option value="Analytical Scientist III">Analytical Scientist III</option>
              <option value="Senior Analytical Scientist">Senior Analytical Scientist</option>
              <option value="Principal Analytical Scientist">Principal Analytical Scientist</option>
              <option value="Staff Analytical Scientist">Staff Analytical Scientist</option>
              <option value="Assay Development Scientist">Assay Development Scientist</option>
              <option value="Method Development Scientist">Method Development Scientist</option>
              <option value="Formulation Scientist I">Formulation Scientist I</option>
              <option value="Formulation Scientist II">Formulation Scientist II</option>
              <option value="Formulation Scientist III">Formulation Scientist III</option>
              <option value="QA Associate I">QA Associate I</option>
              <option value="QA Associate II">QA Associate II</option>
              <option value="QA Associate III">QA Associate III</option>
              <option value="QC Analyst I">QC Analyst I</option>
              <option value="QC Analyst II">QC Analyst II</option>
              <option value="QC Analyst III">QC Analyst III</option>
              <option value="QA Specialist">QA Specialist</option>
              <option value="QC Specialist">QC Specialist</option>
              <option value="Validation Engineer I">Validation Engineer I</option>
              <option value="Validation Engineer II">Validation Engineer II</option>
              <option value="Validation Engineer III">Validation Engineer III</option>
              <option value="Validation Engineer IV">Validation Engineer IV</option>
              <option value="Senior QA Specialist">Senior QA Specialist</option>
              <option value="Senior QC Specialist">Senior QC Specialist</option>
              <option value="QA Manager">QA Manager</option>
              <option value="QC Manager">QC Manager</option>
              <option value="Chief Quality Officer">Chief Quality Officer</option>
              <option value="Regulatory Affairs Assistant">Regulatory Affairs Assistant</option>
              <option value="Regulatory Affairs Coordinator">Regulatory Affairs Coordinator</option>
              <option value="Regulatory Affairs Associate I">Regulatory Affairs Associate I</option>
              <option value="Regulatory Affairs Associate II">Regulatory Affairs Associate II</option>
              <option value="Regulatory Affairs Associate III">Regulatory Affairs Associate III</option>
              <option value="Regulatory Affairs Specialist I">Regulatory Affairs Specialist I</option>
              <option value="Regulatory Affairs Specialist II">Regulatory Affairs Specialist II</option>
              <option value="Senior Regulatory Affairs Specialist">Senior Regulatory Affairs Specialist</option>
              <option value="CMC Regulatory Writer">CMC Regulatory Writer</option>
              <option value="Regulatory Submissions Manager">Regulatory Submissions Manager</option>
              <option value="Regulatory Affairs Manager">Regulatory Affairs Manager</option>
              <option value="Chief Regulatory Officer">Chief Regulatory Officer</option>
              <option value="Clinical Trial Assistant">Clinical Trial Assistant</option>
              <option value="Clinical Research Coordinator">Clinical Research Coordinator</option>
              <option value="CRA I">CRA I</option>
              <option value="CRA II">CRA II</option>
              <option value="CRA III">CRA III</option>
              <option value="Clinical Data Analyst">Clinical Data Analyst</option>
              <option value="Clinical Project Manager">Clinical Project Manager</option>
              <option value="Clinical Program Manager">Clinical Program Manager</option>
              <option value="Pharmacovigilance Associate">Pharmacovigilance Associate</option>
              <option value="Drug Safety Associate">Drug Safety Associate</option>
              <option value="Medical Writer">Medical Writer</option>
              <option value="Regulatory Medical Writer">Regulatory Medical Writer</option>
              <option value="Medical Science Liaison">Medical Science Liaison</option>
              <option value="Chief Medical Officer">Chief Medical Officer</option>
              <option value="Junior Engineer">Junior Engineer</option>
              <option value="Associate Engineer">Associate Engineer</option>
              <option value="Assistant Engineer">Assistant Engineer</option>
              <option value="Automation Engineer">Automation Engineer</option>
              <option value="Senior Automation Engineer">Senior Automation Engineer</option>
              <option value="Control Systems Engineer">Control Systems Engineer</option>
              <option value="Equipment Validation Engineer">Equipment Validation Engineer</option>
              <option value="Facilities Engineer">Facilities Engineer</option>
              <option value="Engineering Manager">Engineering Manager</option>
              <option value="Chief Technology Officer">Chief Technology Officer</option>
              <option value="Bioinformatics Analyst">Bioinformatics Analyst</option>
              <option value="Bioinformatics Scientist I">Bioinformatics Scientist I</option>
              <option value="Bioinformatics Scientist II">Bioinformatics Scientist II</option>
              <option value="Bioinformatics Scientist III">Bioinformatics Scientist III</option>
              <option value="Genomics Data Scientist">Genomics Data Scientist</option>
              <option value="Proteomics Analyst">Proteomics Analyst</option>
              <option value="Machine Learning Engineer (Biotech)">Machine Learning Engineer (Biotech)</option>
              <option value="Biostatistician I">Biostatistician I</option>
              <option value="Biostatistician II">Biostatistician II</option>
              <option value="Biostatistician III">Biostatistician III</option>
              <option value="AI Scientist">AI Scientist</option>
              <option value="Scientific Software Engineer">Scientific Software Engineer</option>
              <option value="Computational Biologist">Computational Biologist</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Senior Data Scientist">Senior Data Scientist</option>
              <option value="Principal Data Scientist">Principal Data Scientist</option>
              <option value="Director of Data Science">Director of Data Science</option>
              <option value="Sr. Field Application Scientist">Sr. Field Application Scientist</option>
              <option value="Cell Therapy Process Engineer">Cell Therapy Process Engineer</option>
              <option value="Viral Vector Scientist">Viral Vector Scientist</option>
              <option value="AAV Production Scientist">AAV Production Scientist</option>
              <option value="Gene Editing Scientist">Gene Editing Scientist</option>
              <option value="GMP Cell Therapy Associate">GMP Cell Therapy Associate</option>
              <option value="CAR-T Scientist">CAR-T Scientist</option>
              <option value="CMC Scientist">CMC Scientist</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="Lab Manager">Lab Manager</option>
              <option value="Core Facility Manager">Core Facility Manager</option>
              <option value="Confocal Microscopist">Confocal Microscopist</option>
              <option value="Histotechnologist">Histotechnologist</option>
              <option value="Patch Clamp Specialist">Patch Clamp Specialist</option>
              <option value="Electrophysiologist">Electrophysiologist</option>
              <option value="Biosafety Officer">Biosafety Officer</option>
              <option value="Containment Specialist">Containment Specialist</option>
              <option value="Scientific Affairs Manager">Scientific Affairs Manager</option>
              <option value="Technology Transfer Specialist">Technology Transfer Specialist</option>
              <option value="Knowledge Transfer Lead">Knowledge Transfer Lead</option>
              <option value="Scientific Communications Associate">Scientific Communications Associate</option>
              <option value="Translational Scientist">Translational Scientist</option>
              <option value="Translational Medicine Lead">Translational Medicine Lead</option>
              <option value="LIMS Administrator">LIMS Administrator</option>
              <option value="LIMS Analyst">LIMS Analyst</option>
              <option value="Laboratory Informatics Specialist">Laboratory Informatics Specialist</option>
              <option value="Scientific Software Product Manager">Scientific Software Product Manager</option>
              <option value="ELN Specialist">ELN Specialist</option>
              <option value="Cheminformatics Scientist">Cheminformatics Scientist</option>
              <option value="Field Application Scientist">Field Application Scientist</option>
              <option value="Technical Support Scientist">Technical Support Scientist</option>
              <option value="Scientific Enablement Lead">Scientific Enablement Lead</option>
              <option value="Training & Onboarding Specialist">Training & Onboarding Specialist</option>
              <option value="Scientific Strategy Lead">Scientific Strategy Lead</option>
              <option value="Portfolio Manager">Portfolio Manager</option>
              <option value="Innovation Lab Lead">Innovation Lab Lead</option>
              <option value="Digital Transformation Scientist">Digital Transformation Scientist</option>
              <option value="Scientific Program Director">Scientific Program Director</option>
              <option value="Scientific Project Manager">Scientific Project Manager</option>
              <option value="Chief Executive Officer">Chief Executive Officer</option>
              <option value="Chief Operating Officer">Chief Operating Officer</option>
              <option value="Chief Innovation Officer">Chief Innovation Officer</option>
              <option value="Chief Business Office">Chief Business Office</option>
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
