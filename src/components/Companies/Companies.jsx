import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import AdminNavbar from "../Admin_Navbar";
import UniImg from "../../assets/unidb.jpeg";
import GrestImg from "../../assets/grestdb1.jpg";
import SwitchKartImg from "../../assets/switchkartdb.jpg";
import { Link, useNavigate } from "react-router-dom";
import SideMenu from "../SideMenu";

const CompaniesPage = () => {
  const [sideMenu, setSideMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storedDbs, setStoredImages] = useState([]);

  const userToken = sessionStorage.getItem("authToken");
  const [activeDB, setActiveDB] = useState(
    sessionStorage.getItem("activeDB") || ""
  );
  const navigate = useNavigate();

  const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
  };

  useEffect(() => {
    fetchStoredImages();
  }, []);

  // Fetch stored images with pagination and search
  const fetchStoredImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/getDbList`,
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB,
          },
        }
      );
      setStoredImages(response.data.dbList);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="navbar">
        <AdminNavbar
          setsideMenu={setSideMenu}
          sideMenu={sideMenu}
          onActiveDbChange={updateActiveDb}
        />
        <SideMenu setsideMenu={setSideMenu} sideMenu={sideMenu} />
      </div>
      {isLoading && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader
            color="var(--primary-color)"
            loading={isLoading}
            size={15}
          />
        </div>
      )}
      <div className="items-start flex py-8 justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col w-full max-w-screen-xl px-5">
          <div className="mt-8 mx-5 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-5">
              Select a Company
            </h1>
            <p className="text-lg text-gray-600 mb-10">
              Click on a company to view its categories and details.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {storedDbs?.map((company, cindex) => {
                // Map images to specific company names
                const companyImage =
                  company === "GrestC2B"
                    ? GrestImg
                    : company === "UnicornUAT" || company === "UnicornProd"
                    ? UniImg
                    : company === "Switchkart"
                    ? SwitchKartImg
                    : null; // Default to no image if no match

                return (
                  <div
                    key={cindex}
                    onClick={() => {
                      setActiveDB(company);
                      sessionStorage.setItem("activeDB", company);
                      navigate("/category");
                    }}
                    className="border bg-white rounded-lg shadow-lg p-5 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer transform"
                  >
                    {companyImage && (
                      <img
                        src={companyImage}
                        alt={company}
                        className="w-40 h-40 object-contain rounded-full shadow-md mb-4" // Changed object-fit to object-contain for no cropping
                      />
                    )}
                    <p className="text-xl font-semibold text-gray-800">
                      {company}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
