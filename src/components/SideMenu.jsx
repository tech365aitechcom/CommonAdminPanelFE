import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaUserPlus,
  FaClipboardList,
  FaBuilding,
  FaStore,
  FaSignOutAlt,
  FaLayerGroup,
} from "react-icons/fa";
import { RiSoundModuleFill } from "react-icons/ri";
import { GoFileSubmodule } from "react-icons/go";

const navItems = [
  { label: "Home", icon: FaHome, route: "/companies" },
  { label: "Categories", icon: FaList, route: "/category" },
  { label: "Code Settings", icon: RiSoundModuleFill, route: "/codes" },
  { label: "Group Settings", icon: FaLayerGroup, route: "/groups" },
  { label: "Module Settings", icon: GoFileSubmodule, route: "/modules" },
  { label: "Register User", icon: FaUserPlus, route: "/registeruser" },
  { label: "Grade Pricing", icon: FaClipboardList, route: "/gradepricingsheet" },
  { label: "Company Details", icon: FaBuilding, route: "/companydetails" },
  { label: "Store Listing", icon: FaStore, route: "/storelisting" },
];

function SideMenu({ setsideMenu, sideMenu }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (route) => {
    setsideMenu(false);
    navigate(route);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("profile");
    sessionStorage.removeItem("DeviceType");
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* Backdrop */}
      {sideMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setsideMenu(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className="fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col
          bg-gradient-to-b from-pink-400 to-pink-700
          shadow-2xl
          transition-transform duration-300 ease-in-out"
        style={{ transform: sideMenu ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <ul className="flex flex-col gap-1">
            {navItems.map(({ label, icon: Icon, route }) => {
              const isActive = location.pathname === route;
              return (
                <li key={route}>
                  <button
                    onClick={() => handleNavigation(route)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-150
                      ${isActive
                        ? "bg-white bg-opacity-25 shadow-inner"
                        : "hover:bg-white hover:bg-opacity-15"
                      }`}
                  >
                    <Icon className={`text-base flex-shrink-0 ${isActive ? "opacity-100" : "opacity-80"}`} />
                    <span>{label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / Logout */}
        <div className="px-3 py-4 border-t border-pink-300 border-opacity-40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white
              hover:bg-red-500 hover:bg-opacity-60 transition-all duration-150"
          >
            <FaSignOutAlt className="text-base flex-shrink-0 opacity-80" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default SideMenu;
