import React, { useState, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../Admin_Navbar";
import SideMenu from "../SideMenu";
import { IoMdSettings } from "react-icons/io";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { FaCircleQuestion } from "react-icons/fa6";
import { SiBrandfolder } from "react-icons/si";
import toast from "react-hot-toast";

const Category = () => {
  const [companies, setCompanies] = useState([]);
  const [activeDB, setActiveDB] = useState(sessionStorage.getItem("activeDB") || "UnicornUAT");
  const containerRef = useRef(null);
  const fromDb = "UnicornUAT";

const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
};
  const [sideMenu, setsideMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const userToken = sessionStorage.getItem("authToken");
  const navigate = useNavigate();
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSelectedCategory(null); // Unselect category
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [activeDB]);

  const fetchCategories = () => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/getCategoryWithCounts`, {
        headers: {
          Authorization: `${userToken}`,
          activeDB: activeDB
        },
      })
      .then((res) => {
        console.log('category res:',res?.data?.dbList)
        setCompanies(res?.data?.dbList);
        setCategories(res?.data?.data);
        setIsLoading(false);
      })
      .catch((err) => { 
        setCompanies(err?.response?.data?.dbList);
        console.error(err);
        setIsLoading(false);
      });
  };
  const handleDelete = (id) => {
    setIsLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/delete`,
        {
          categoryId: id,
        },
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB
          },
        }
      )
      .then((res) => {
        fetchCategories();
        toast.success("Category deleted successfully");
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to delete category");
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleAddCategory = () => {
    setIsLoading(true);
    const endpoint = isEditing
      ? `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/update`
      : `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/create`;
 const payload = new FormData();
 payload.append("categoryId", currentCategory?._id);
 payload.append("categoryName", newCategory);
 payload.append("files", newCategoryImage);
    axios
      .post(
        endpoint,
        payload,
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB
          },
        }
      )
      .then(() => {
        resetForm();
        fetchCategories();
        setIsPopupOpen(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const openEditPopup = (category) => {
    setIsPopupOpen(true);
    setIsEditing(true);
    setCurrentCategory(category);
    setNewCategory(category.categoryName);
        // setNewCategoryImage(category?.logo);
  };

  const resetForm = () => {
    setNewCategory("");
    setNewCategoryImage("");
    setIsEditing(false);
    setCurrentCategory(null);
    setIsLoading(false);
  };
  const handleNext = (category) => {
  sessionStorage.setItem("DeviceType", category);
  navigate("/brands/" + category);
}
  return (
    <div>
      <div className="navbar">
        <AdminNavbar
          setsideMenu={setsideMenu}
          sideMenu={sideMenu}
          onActiveDbChange={updateActiveDb}
        />
        <SideMenu
          setsideMenu={setsideMenu}
          sideMenu={sideMenu}
          className={"shadow-lg"}
        />
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
      <div className="items-start flex py-8 justify-center min-h-screen bg-slate-100">
        <div className="flex flex-col w-screen">
          <div ref={containerRef}>
            <div className="relative mb-6 flex items-center justify-between gap-2 border-b-2 pb-2 ml-10">
              <p className="text-4xl font-bold">Manage Categories</p>
              {selectedCategory && (
                <div className="ml-10 flex items-center justify-end pr-10 gap-4">
                  <button
                    onClick={() => openEditPopup(selectedCategory)}
                    className="font-medium text-sm text-white px-4 py-2 rounded bg-primary"
                  >
                    Edit Category
                  </button>
                  <div className="relative group">
                    <button
                      onClick={() => {
                        setCategoryToDelete(selectedCategory._id);
                        setIsDeleteConfirmOpen(true);
                      }}
                      className={`font-medium text-sm text-white px-4 py-2 rounded
                        ${selectedCategory?.brandCount > 0 || selectedCategory?.modelCount > 0
                          ? 'bg-red-300 cursor-not-allowed'
                          : 'bg-red-500'}`}
                    >
                      Delete Category
                    </button>
                    {(selectedCategory?.brandCount > 0 || selectedCategory?.modelCount > 0) && (
                      <div className="absolute top-full mt-1 right-1 w-max max-w-xs p-2 text-sm bg-gray-800 text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                        Cannot delete. This category has {selectedCategory?.brandCount} brand(s) and {selectedCategory?.modelCount} product(s).
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleNext(selectedCategory?.categoryCode)}
                    className="font-medium text-sm text-white px-4 py-2 rounded bg-blue-500"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            {/* <div className="ml-10">
            <div className="flex flex-row bg-gray-100 w-fit gap-4 px-4">
              {companies?.map((company, cindex) => (
                <div
                  key={cindex}
                  onClick={() => {
                    setActiveDB(company);
                    sessionStorage.setItem("activeDB", company);
                  }}
                  className={`cursor-pointer font-medium text-sm  p-3 rounded ${
                    activeDB === company ? "bg-primary text-white" : ""
                  } hover:bg-primary hover:text-white`}
                >
                  {company}
                </div>
              ))}
            </div>
          </div> */}
            <div className="mt-8 mx-10 flex flex-wrap gap-6">
              {/* Card for Adding New Category */}
              <div
                onClick={() => {
                  setIsPopupOpen(true);
                  resetForm();
                  setIsEditing(false);
                }}
                className="w-40 h-40 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-md"
              >
                <span className="text-primary text-4xl font-bold">+</span>
              </div>

              {/* Cards for Existing Categories */}
              {categories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-40 h-40 border rounded-lg shadow-lg p-4 flex flex-col justify-center items-center text-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
                    selectedCategory?._id === category._id
                      ? "border-primary bg-gray-50"
                      : ""
                  } ${fromDb !== activeDB && category?.status === "Initiated" ? "border-2 border-yellow-300" : ""}`}
                >
                  <img src={category?.logo} alt="" className="rounded-lg" />
                  <p className="text-lg font-medium text-gray-700">
                    {category.categoryName}
                  </p>
                </div>
              ))}

              {/* No Categories Found */}
              {categories.length === 0 && (
                <div className="text-center text-gray-500 py-4 w-full">
                  No categories found.
                </div>
              )}
            </div>

            {/* Action Buttons for Selected Category */}
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
            <IoClose
              size={24}
              className="absolute top-3 right-3 text-primary cursor-pointer"
              onClick={() => setIsPopupOpen(false)}
            />
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h3>
            <div className="mb-4">
              <label className="block font-medium mb-2">Category Name</label>
              <input
                type="text"
                className="border-2 px-3 py-2 rounded-lg w-full outline-none"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div className="space-y-1 text-center  bg-slate-100 p-2 rounded-lg mb-4">
              <label
                htmlFor="files"
                className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
              >
                <div className="flex flex-col items-center justify-center text-sm text-gray-600">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8a6 6 0 00-12 0v12a6 6 0 0012 0V12h8v14a6 6 0 01-12 0v-2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M36 36v2a6 6 0 01-6 6H18a6 6 0 01-6-6v-2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>{" "}
                  <span className="bg-slate-100">Upload Logo</span>
                  <input
                    id="files"
                    name="files"
                    type="file"
                    className="sr-only"
                    onChange={(e) => setNewCategoryImage(e.target.files[0])}
                  />
                </div>
                <p className="text-xs text-gray-500">Up to 10MB per file</p>
              </label>
              {newCategoryImage && (
                <div className="mt-2 text-gray-500">
                {newCategoryImage?.name}
                </div>
              )}
            </div>
            <button
              onClick={handleAddCategory}
              disabled={isLoading} // Disable button when loading
              className={`w-full py-2 rounded font-medium ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Please wait...
                </div>
              ) : isEditing ? (
                "Update"
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      )}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setCategoryToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(categoryToDelete);
                  setIsDeleteConfirmOpen(false);
                }}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
