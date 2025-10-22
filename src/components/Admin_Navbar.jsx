import React, { useEffect, useState } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AdminNavbar({ setsideMenu, sideMenu, onActiveDbChange }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    navigate("/");
  };

  const userToken = sessionStorage.getItem("authToken");
  const activeDB = sessionStorage.getItem("activeDB") || "UnicornUAT";

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchDbs();
  }, [activeDB]);

  const fetchDbs = () => {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/getDbList`,
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB,
          },
        }
      )
      .then((res) => {
        setCompanies(res?.data?.dbList);
      })
      .catch((err) => {
        setCompanies(err?.response?.data?.dbList);
        console.error(err);
      });
  };

  return (
    <>
      <div className="flex items-center justify-between w-full h-16 px-6 py-2 bg-white shadow-md border-b">
        {/* Hamburger Menu */}
        <div
          className={`flex flex-col justify-between w-[32px] h-[25px] cursor-pointer z-[100] transition-all duration-300 ease-in-out ${
            sideMenu && "translate-x-[149px]"
          }`}
          onClick={() => setsideMenu(!sideMenu)}
        >
          <span
            className={`w-full h-[3px] bg-black origin-left transition-all duration-300 ease-in-out ${
              sideMenu && "rotate-45"
            }`}
          ></span>
          <span
            className={`w-full h-[3px] bg-black origin-left transition-all duration-300 ease-in-out ${
              sideMenu && "opacity-0"
            }`}
          ></span>
          <span
            className={`w-full h-[3px] bg-black origin-left transition-all duration-300 ease-in-out ${
              sideMenu && "-rotate-45"
            }`}
          ></span>
        </div>

        {/* Logo and Database Selector */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          {/* Active DB */}
          <div className="cursor-pointer text-sm font-semibold text-gray-700 p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-all duration-300" onClick={() =>navigate("/companies")}>
            {activeDB}
          </div>
        </div>

        {/* Logout Button */}
        <div
          className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-md cursor-pointer transition-all duration-300"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </>
  );
}

export default AdminNavbar;
