import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/Images/loginImg/LogoImg.png";
import sidebaricon1 from "../assets/Images/dashbordimgs/sidebaricon1.png";
import sidebaricon2 from "../assets/Images/dashbordimgs/sidebaricon2.png";
import sidebaricon7 from "../assets/Images/dashbordimgs/sidebaricon7.png";
import sidebaricon10 from "../assets/Images/dashbordimgs/sidebaricon10.png";



import axios from "axios";
import { logout, setUser } from "../redux/userSlice";

import manageProfileicon from "../assets/Images/profilemodal/manageprofileimg.png";
import supporticon from "../assets/Images/profilemodal/supportimg.png";
import logouticon from "../assets/Images/profilemodal/logoutimg.png";

// Create a global variable to track if the photo has been loaded during this session
if (typeof window !== "undefined" && window._photoLoadedInSession === undefined) {
  window._photoLoadedInSession = false;
}

const sidebarItems = [
  { icon: sidebaricon1, label: "Dashboard", path: "/dashboard" },
  { icon: sidebaricon2, label: "Manage Department", path: "/manage-dept" },
  { icon: sidebaricon7, label: "Manage Instruments", path: "/manage-instru" },
  { icon: sidebaricon10, label: "Manage Parameters", path: "/manage-parameters" },



];

const Layout = ({ title, children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState(user?.photo || "");
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  const logOutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  // Load photo only once per session or when explicitly updated
  useEffect(() => {
    const lastPhotoUpdateTime = localStorage.getItem("lastPhotoUpdateTime");
    const hasPhotoBeenUpdated = !!lastPhotoUpdateTime;

    // Only fetch if:
    // 1. Photo was updated from EditProfile (lastPhotoUpdateTime exists in localStorage), OR
    // 2. This is the first load in this browser session (using global window variable)
    if ((hasPhotoBeenUpdated || !window._photoLoadedInSession) && token) {
      setIsPhotoLoading(true);

      axios
        .get("https://crp.mydevfactory.com/api/users/update/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data && response.data.user) {
            // Update photo state and Redux store
            setProfilePhoto(response.data.user.photo);
            dispatch(
              setUser({
                user: response.data.user,
                access: token,
              })
            );

            // Mark that we've loaded the photo in this session using global variable
            window._photoLoadedInSession = true;

            // Clear localStorage flag if it was set
            if (hasPhotoBeenUpdated) {
              localStorage.removeItem("lastPhotoUpdateTime");
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching updated profile:", error);
        })
        .finally(() => {
          setIsPhotoLoading(false);
        });
    }

    // This useEffect should run only once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex bg-black text-white">
      {/* Sidebar */}
      <aside className="fixed md:relative w-72 bg-black p-6 h-screen">
        <div className="flex items-center space-x-3 mb-14">
          <img src={logoImg} alt="Logo" className="w-1/2" />
        </div>
        <ul className="space-y-6">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className="flex items-center space-x-4 text-[#FCF0E8] hover:text-[#BBA14F]">
                <img src={item.icon} alt={item.label} className="w-5 h-5" />
                <span className="text-lg">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        {/* Vertical Line on the Right */}
        <div className="absolute top-0 right-0 h-full w-[1px] bg-[#202020]"></div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-2">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 bg-black mb-2 border-b border-[#202020] my-4 relative">
          <h2 className="text-3xl font-semibold text-white">{title}</h2>

          {/* Profile Image with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {isPhotoLoading ? (
              <div className="w-12 h-12 rounded-full border-2 border-[#BBA14F] flex items-center justify-center bg-[#151515]">
                <div className="w-6 h-6 border-t-2 border-[#BBA14F] rounded-full animate-spin"></div>
              </div>
            ) : (
              <img
                src={`https://crp.mydevfactory.com/${profilePhoto || user?.photo}`}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-[#BBA14F] cursor-pointer object-cover"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
            )}

            {/* Overlay when modal opens */}
            {isDropdownOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsDropdownOpen(false)}></div>}

            {/* Dropdown Modal */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black shadow-lg rounded-lg overflow-hidden z-50">
                <Link to="/manage-profile" className=" px-4 py-2 hover:bg-gray-100 flex items-center border-b border-[#F4F4F4]">
                  <img src={manageProfileicon} alt="Manage Profile" className="w-5 h-5 mr-2" />
                  Manage Profile
                </Link>
                <Link to="/support" className=" px-4 py-2 hover:bg-gray-100 flex items-center border-b border-[#F4F4F4]">
                  <img src={supporticon} alt="Support" className="w-5 h-5 mr-2" />
                  Support
                </Link>
                <button onClick={logOutHandler} className=" w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center border-b border-[#F4F4F4]">
                  <img src={logouticon} alt="Logout" className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="px-8 py-3 rounded-xl bg-black">{children}</div>
      </div>
    </div>
  );
};

export default Layout;




