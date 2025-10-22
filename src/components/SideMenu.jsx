import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaQuestionCircle,
  FaRegListAlt,
  FaUserPlus,
  FaClipboardList,
  FaBuilding,
  FaStore,
  FaSignOutAlt,
  FaLayerGroup
} from "react-icons/fa";
import { RiSoundModuleFill } from "react-icons/ri";
import { GoFileSubmodule } from "react-icons/go";

function SideMenu({ setsideMenu, sideMenu }) {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    setsideMenu(!sideMenu);
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div
      className={
        "menu fixed justify-center left-[-200px] top-0 w-[200px] h-full bg-gradient-to-b from-pink-400 to-pink-700 z-50 flex items-center transition-all duration-950 ease-in-out  " +
        (sideMenu && "left-[0]")
      }
      //   {`menu fixed left-[-250px] justify-center  top-0 w-[250px] h-full bg-gradient-to-b from-pink-500 to-pink-700 z-50 flex flex-col items-start py-8 px-6 transition-all duration-500 ease-in ${
      // sideMenu && "left-0"
      // }`}
    >
      <ul className="list-none flex flex-col w-full gap-1">
        {/* Home */}
        <li
          onClick={() => handleNavigation("/companies")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <FaHome className="mr-4" />
          Home
        </li>

        {/* Categories */}
        <li
          onClick={() => handleNavigation("/category")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <FaList className="mr-4" />
          Categories
        </li>
        <li
          onClick={() => handleNavigation("/codes")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <RiSoundModuleFill className="mr-4" />
          Code Settings
        </li>
        <li
          onClick={() => handleNavigation("/groups")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <FaLayerGroup className="mr-4" />
          Group Settings
        </li>
        <li
          onClick={() => handleNavigation("/modules")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <GoFileSubmodule className="mr-4" />
          Module Settings
        </li>

        {/* Questions */}
        {/* <li
          onClick={() => handleNavigation("/questions")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <FaQuestionCircle className="mr-4" />
          Questions
        </li> */}

        {/* Conditions */}
        {/* <li
          onClick={() => handleNavigation("/conditions")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <FaRegListAlt className="mr-4" />
          Conditions
        </li> */}

        {/* Register User */}
        <li
          onClick={() => handleNavigation("/registeruser")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <FaUserPlus className="mr-4" />
          Register User
        </li>

        {/* Grade Pricing */}
        <li
          onClick={() => handleNavigation("/gradepricingsheet")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <FaClipboardList className="mr-4" />
          Grade Pricing
        </li>

        {/* Company Listing */}
        <li
          onClick={() => handleNavigation("/companydetails")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <FaBuilding className="mr-4" />
          Company Details
        </li>

        {/* Store Listing */}
        <li
          onClick={() => handleNavigation("/storelisting")}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-pink-600 rounded-lg p-3 transition-all"
        >
          <FaStore className="mr-4" />
          Store Listing
        </li>

        {/* Logout */}
        {/* <li
          onClick={handleLogout}
          className="flex items-center text-white text-xl font-semibold cursor-pointer hover:bg-red-600 rounded-lg p-3 transition-all"
        >
          <FaSignOutAlt className="mr-4" />
          Logout
        </li> */}
      </ul>
    </div>
  );
}

export default SideMenu;
