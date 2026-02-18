import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import AdminNavbar from "../Admin_Navbar";
import UniImg from "../../assets/unidb.jpeg";
import GrestImg from "../../assets/grestdb1.jpg";
import SwitchKartImg from "../../assets/switchkartdb.jpg";
import { useNavigate } from "react-router-dom";
import SideMenu from "../SideMenu";
import { MdOutlineStarBorder, MdStar } from "react-icons/md";

const CompaniesPage = () => {
  const [sideMenu, setSideMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storedDbs, setStoredImages] = useState([]);

  const userToken = sessionStorage.getItem("authToken");
  const [activeDB, setActiveDB] = useState(
    sessionStorage.getItem("activeDB") || ""
  );
  const [mainDB, setMainDB] = useState(
    sessionStorage.getItem("mainDB") || ""
  );
  const navigate = useNavigate();

  const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
  };

  useEffect(() => {
    fetchStoredImages();
  }, []);

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

  const handleSetMainDB = (e, company) => {
    e.stopPropagation();
    setMainDB(company);
    sessionStorage.setItem("mainDB", company);
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
          <BeatLoader color="var(--primary-color)" loading={isLoading} size={15} />
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
                const companyImage =
                  company === "GrestC2B"
                    ? GrestImg
                    : company === "UnicornUAT" || company === "UnicornProd"
                    ? UniImg
                    : company === "Switchkart"
                    ? SwitchKartImg
                    : null;

                const isMain = mainDB === company;

                return (
                  <div
                    key={cindex}
                    onClick={() => {
                      setActiveDB(company);
                      sessionStorage.setItem("activeDB", company);
                      navigate("/category");
                    }}
                    className="relative border bg-white rounded-lg shadow-lg p-5 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer transform"
                  >
                    {/* Star button — top-right corner */}
                    <button
                      onClick={(e) => handleSetMainDB(e, company)}
                      title={isMain ? "Main DB" : "Set as Main DB"}
                      className={`
                        absolute top-3 right-3
                        flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border
                        transition-all duration-150
                        ${isMain
                          ? "bg-amber-50 border-amber-300 text-amber-600 cursor-default"
                          : "bg-white border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50"
                        }
                      `}
                      disabled={isMain}
                    >
                      {isMain
                        ? <MdStar size={13} className="text-amber-500" />
                        : <MdOutlineStarBorder size={13} />
                      }
                      {isMain ? "Main DB" : "Set as Main"}
                    </button>

                    <img
                      src={companyImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&size=160&background=f3f4f6&color=374151&bold=true&rounded=true`}
                      alt={company}
                      className="w-40 h-40 object-contain rounded-full shadow-md mb-4 mt-2"
                    />
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
