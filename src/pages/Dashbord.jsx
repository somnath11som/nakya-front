import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import cardicon1 from "../assets/Images/dashbordimgs/cardicon1.png";
import cardicon2 from "../assets/Images/dashbordimgs/cardicon2.png";
import cardicon3 from "../assets/Images/dashbordimgs/cardicon3.png";
import cardicon4 from "../assets/Images/dashbordimgs/cardicon4.png";
import cardicon5 from "../assets/Images/dashbordimgs/cardicon5.png";
import cardicon6 from "../assets/Images/dashbordimgs/cardicon6.png";

import sidebaricon1 from "../assets/Images/dashbordimgs/sidebaricon1.png";
import sidebaricon2 from "../assets/Images/dashbordimgs/sidebaricon2.png";
import sidebaricon3 from "../assets/Images/dashbordimgs/sidebaricon3.png";
import sidebaricon4 from "../assets/Images/dashbordimgs/sidebaricon4.png";
import sidebaricon5 from "../assets/Images/dashbordimgs/sidebaricon5.png";
import sidebaricon6 from "../assets/Images/dashbordimgs/sidebaricon6.png";
import sidebaricon7 from "../assets/Images/dashbordimgs/sidebaricon7.png";
import sidebaricon8 from "../assets/Images/dashbordimgs/sidebaricon8.png";
import sidebaricon9 from "../assets/Images/dashbordimgs/sidebaricon9.png";
import sidebaricon10 from "../assets/Images/dashbordimgs/sidebaricon10.png";

import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  // Get token from Redux or local storage
  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (!tokens) {
    navigate("/");
  }
  if (tokens && typeof tokens === "string") {
    tokens = tokens.replace(/"/g, "");
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://crp.mydevfactory.com/api/users/update/profile/", {
          headers: {
            Authorization: `Bearer ${tokens}`,
          },
        });
        setUserData(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Error fetching user data");
        setLoading(false);
      }
    };

    if (tokens) {
      fetchUserProfile();
    } else {
      setError("Authentication token not found");
      setLoading(false);
    }
  }, [tokens, navigate]);

  const sidebarItems = [
    { icon: sidebaricon1, label: "Dashboard", path: "/dashboard" },
    { icon: sidebaricon2, label: "Manage Department", path: "/manage-dept" },
    { icon: sidebaricon3, label: "Manage Staff", path: "/manage-staff" },
    {
      icon: sidebaricon4,
      label: "Create Experiment",
      path: "/create-experiment",
    },
    {
      icon: sidebaricon5,
      label: "Track Experiment",
      path: "/track-experiment",
    },
    {
      icon: sidebaricon6,
      label: "Data Visualization",
      path: "/data-visualization",
    },
    { icon: sidebaricon7, label: "Manage Instruments", path: "/manage-instru" },
    { icon: sidebaricon8, label: "ELN Reports", path: "/eln-reports" },
    {
      icon: sidebaricon9,
      label: "Manage Inventory",
      path: "/manage-inventory",
    },
    {
      icon: sidebaricon10,
      label: "Manage Parameters",
      path: "/manage-parameters",
    },
  ];

  const dashboardCards = [
    {
      icon: cardicon1,
      title: "Create Experiment",
      desc: "Kickstart your research - design and initiate your next experiment with ease.",
      bg: "bg-[#69F0AE12]",
      textColor: "text-[#69F0AE]"
    },
    {
      icon: cardicon2,
      title: "Track Experiment",
      desc: "Stay on top of your work - monitor and manage your experiments in real-time.",
      bg: "bg-[#FFAB4012]",
      textColor: "text-[#FFAB40]"
    },
    {
      icon: cardicon3,
      title: "Data Visualization",
      desc: "Turn data into insights - visualize your findings with clarity and depth.",
      bg: "bg-[#4158D91A]",
      textColor: "text-[#4158D9]"
    },
    {
      icon: cardicon4,
      title: "Your Instruments",
      desc: "Kickstart your research - design and initiate your next experiment with ease.",
      bg: "bg-[#CF54431A]",
      textColor: "text-[#F36257]"
    },
    {
      icon: cardicon5,
      title: "ELN Reports",
      desc: "Kickstart your research - design and initiate your next experiment with ease.",
      bg: "bg-[#1BE8FF12]",
      textColor: "text-[#2EB9C0]"
    },
    {
      icon: cardicon6,
      title: "Experiment History",
      desc: "Kickstart your research - design and initiate your next experiment with ease.",
      bg: "bg-[#AD30C61A]",
      textColor: "text-[#A556B9]"
    },
  ];

  return (
    <Layout
      title={
        <span>
          <span className="text-[#BBA14F]">Welcome</span>, {loading ? "..." : userData ? userData.first_name : user?.first_name} <br />
          <p className="text-sm mt-1 text-[#8C8C8C]">Click on any card to get started!</p>{" "}
        </span>
      }
    >
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        /* Dashboard Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-9 justify-items-center px-2 md:px-20">
          {dashboardCards.map((card, index) => (
            <div key={index} className={`${card.bg} p-4 md:p-5 w-full max-w-[260px] rounded-lg shadow-md transition duration-300 hover:scale-105 cursor-pointer`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <img src={card.icon} alt={card.title} className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                <h3 className={`text-base md:text-lg font-semibold ${card.textColor}`}>{card.title}</h3>
              </div>
              {/* Horizontal Line */}
              <div className="border-t border-gray-500 my-2"></div>
              <p className="text-gray-300 text-xs md:text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
