import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import AdminNavbar from "../Admin_Navbar";
import SideMenu from "../SideMenu";
import { toast } from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";

const StoredImagesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sideMenu, setSideMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storedImages, setStoredImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imagesBox, setImagesBox] = useState(false);
  const [images, setImages] = useState([]);
  const [deviceCategory, setDeviceCategory] = useState("CTG1");
  const [categories, setCategories] = useState([]);

  const userToken = sessionStorage.getItem("authToken");
  const [activeDB, setActiveDB] = useState(
    sessionStorage.getItem("activeDB") || ""
  );

  const itemsPerPage = 8; // Images per page

  const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
  };

    const handleDeviceCategory = (e) => {
      setDeviceCategory(e.target.value);
    };
  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/getAll`,
        {
          headers: { Authorization: userToken, activeDB: activeDB },
        }
      );
      setCategories(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  // Fetch stored images with pagination and search
  const fetchStoredImages = async (page, search = "") => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/storedImages/getStoredImages?search=${search}&category=${deviceCategory}&limit=${itemsPerPage}&page=${page}`,
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB,
          },
        }
      );
      setStoredImages(response.data.data);
      setTotalPages(response.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
  }, [activeDB]);
  useEffect(() => {
    fetchStoredImages(currentPage, searchTerm);
  }, [currentPage, searchTerm, activeDB, deviceCategory]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleImagesChange = (e) => {
    const selectedFile = e.target.files;
    // setImages(selectedFile);
    const validFiles = Array.from(selectedFile).filter(
      (file) => file.size <= 10000000
    );
    setImages(validFiles);
  };

  const handleImagesSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("authToken");
    setIsLoading(true);
    try {
      const formData = new FormData();
      Array.from(images).forEach((file) => formData.append("files", file));
      formData.append("category", deviceCategory);
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/storedImages/uploadImagesAndStore`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
            activeDB: activeDB,
          },
        }
      );
      toast.success("Images Uploaded SuccessFully");
      setImagesBox(false);
      setImages([]);
      fetchStoredImages(currentPage, searchTerm); // Refresh images after upload
    } catch (error) {
      setImagesBox(false);
      setIsLoading(false);
      console.error("Error uploading images", error);
    } finally {
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
      <div className="items-start flex py-8 justify-center bg-white min-h-screen bg-slate-100">
        <div className="flex flex-col w-screen">
          <div className="ml-10 flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <p className="font-medium">Select Category</p>
              <select
                name=""
                id=""
                className="font-medium text-sm text-white p-3 rounded bg-primary"
                onChange={handleDeviceCategory}
              >
                {categories.map((cat) => (
                  <option
                    className="bg-white text-primary font-medium"
                    key={cat?._id}
                    value={cat?.categoryCode}
                  >
                    {cat?.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="font-medium text-sm text-white p-3 rounded bg-primary"
              onClick={() => {
                setImagesBox(true);
              }}
            >
              Upload Images
            </button>
            <input
              type="text"
              placeholder="Search Images"
              className="border-2 px-3 py-2 rounded-lg outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-8 mx-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {storedImages.map((image) => (
                <div
                  key={image._id}
                  className="border rounded-lg shadow-lg p-4 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-48 object-contain rounded-md transition-transform duration-300 hover:scale-110"
                  />
                  <p className="mt-2 text-center font-medium text-gray-700">
                    {image.name}
                  </p>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6">
              <button
                className="px-4 py-2 text-sm bg-gray-200 rounded mr-2 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <p className="text-sm">
                Page {currentPage} of {totalPages}
              </p>
              <button
                className="px-4 py-2 text-sm bg-gray-200 rounded ml-2 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Images Modal */}
      {imagesBox && (
        <div className="fixed top-0 left-0 z-48 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-h-[90vh] w-[50vh] overflow-y-auto">
            <form className="flex flex-col gap-4" onSubmit={handleImagesSubmit}>
              <div className="space-y-1 text-center  bg-slate-100 p-2 rounded-lg">
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
                    <span className="bg-slate-100">
                      Click here to Upload images
                    </span>
                    <input
                      id="files"
                      name="files"
                      type="file"
                      className="sr-only"
                      onChange={handleImagesChange}
                      multiple
                    />
                  </div>
                  <p className="text-xs text-gray-500">Up to 10MB per file</p>
                </label>
                {images?.length > 0 && (
                  <div className="mt-2 text-gray-500">
                    {images.slice(0, 10).map((file, index) => (
                      <h2 key={index}>{file.name}</h2>
                    ))}
                    {images.length > 10 && (
                      <p className="text-sm text-gray-400">
                        ...and {images.length - 10} more
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-2">
                <button
                  type="submit"
                  className={`w-full bg-primary text-white py-2 rounded font-medium${
                    isLoading && "bg-slate-400"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Uploading..." : "Upload"}
                </button>
                <button
                  type="reset"
                  onClick={() => {
                    setImagesBox(false);
                    setImages([]);
                    setIsLoading(false);
                  }}
                  className="w-full bg-primary text-white py-2 rounded font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoredImagesPage;
