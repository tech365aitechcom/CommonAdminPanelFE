import React, { useState, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../Admin_Navbar";
import SideMenu from "../SideMenu";
import toast from "react-hot-toast";

const CodeMgmt = () => {
  const [codes, setCodes] = useState([]);
  const [activeDB, setActiveDB] = useState(sessionStorage.getItem("activeDB") || "UnicornUAT");
  const [sideMenu, setSideMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCode, setCurrentCode] = useState(null);
  const [newCodeName, setNewCodeName] = useState("");
  const [newCodeDesc, setNewCodeDesc] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState(null);
  const containerRef = useRef(null);
  const userToken = sessionStorage.getItem("authToken");
  const navigate = useNavigate();
const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
const [uploadFile, setUploadFile] = useState(null);
const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelectedCode(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [activeDB]);

  const fetchCodes = () => {
    setIsLoading(true);
    axios.get(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/code/getAllCodes`, {
      headers: { Authorization: `${userToken}`, activeDB }
    })
    .then((res) => {
      setCodes(res.data.data);
      setIsLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setIsLoading(false);
    });
  };

  const handleAddOrEditCode = () => {
  setIsLoading(true);
  const endpoint = isEditing
    ? `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/code/editCode`
    : `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/code/createCode`;

  const payload = {
    id: currentCode?._id,
    code: newCodeName,
    description: newCodeDesc
  };

  axios.post(endpoint, payload, {
    headers: { Authorization: `${userToken}`, activeDB }
  })
    .then(() => {
      fetchCodes();
      resetForm();
      setIsPopupOpen(false);
      toast.success(`Code ${isEditing ? 'updated' : 'created'} successfully!`);
    })
    .catch((err) => {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save code");
    })
    .finally(() => {
      setIsLoading(false);
    });
  };


  const handleDelete = (id) => {
    setIsLoading(true);
    axios.delete(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/code/deleteCode?id=${id}`, {
      headers: { Authorization: `${userToken}`, activeDB }
    })
    .then(() => {
      fetchCodes();
      toast.success("Code deleted successfully");
      setIsLoading(false);
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to delete code");
      setIsLoading(false);
    });
  };

  const resetForm = () => {
    setNewCodeName("");
    setNewCodeDesc("");
    setIsEditing(false);
    setCurrentCode(null);
    setIsLoading(false);
  };
const handleFileUpload = async () => {
  if (!uploadFile) return toast.error("Please select a CSV file");

  try {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);

    // Step 1: Upload to S3
    const uploadRes = await axios.post(
      `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/code/bulkUploadFromS3`, // use your upload endpoint
      formData,
      {
        headers: {
          Authorization: userToken,
          activeDB,
          "Content-Type": "multipart/form-data"
        }
      }
    );
    toast.success("Codes uploaded successfully");
    fetchCodes();
    setIsUploadPopupOpen(false);
    setUploadFile(null);
  } catch (error) {
    console.error(error);
    toast.error("Upload failed");
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div>
      <AdminNavbar setsideMenu={setSideMenu} sideMenu={sideMenu} onActiveDbChange={setActiveDB} />
      <SideMenu setsideMenu={setSideMenu} sideMenu={sideMenu} />

      {isLoading && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color="var(--primary-color)" loading={isLoading} size={15} />
        </div>
      )}

      <div className="items-start flex py-8 justify-center min-h-screen bg-slate-100">
        <div className="flex flex-col w-screen">
          <div ref={containerRef}>
          <div className="relative mb-6 flex items-center justify-between gap-4 border-b-2 pb-2 ml-10">
            <p className="text-4xl font-bold">Manage Codes</p>
            <div className="ml-4 flex items-center gap-4">

              {selectedCode && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setIsPopupOpen(true);
                      setIsEditing(true);
                      setCurrentCode(selectedCode);
                      setNewCodeName(selectedCode.code);
                      setNewCodeDesc(selectedCode.description);
                    }}
                    className="font-medium text-sm text-white px-4 py-2 rounded bg-primary"
                  >
                    Edit Code
                  </button>
                  <button
                    onClick={() => {
                      setCodeToDelete(selectedCode._id);
                      setIsDeleteConfirmOpen(true);
                    }}
                    className="font-medium text-sm text-white px-4 py-2 rounded bg-red-500"
                  >
                    Delete Code
                  </button>
                </div>
              )}
              <button
                onClick={() => setIsUploadPopupOpen(true)}
                className="px-4 py-2 mr-4 rounded bg-blue-600 text-white text-sm font-medium"
              >
                Bulk Upload
              </button>
            </div>
          </div>
            <div className="mt-8 mx-10 flex flex-wrap gap-6">
              <div
                onClick={() => {
                  setIsPopupOpen(true);
                  resetForm();
                }}
                className="w-40 h-40 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-md"
              >
                <span className="text-primary text-4xl font-bold">+</span>
              </div>
              {codes.map((code) => (
                <div
                  key={code._id}
                  onClick={() => setSelectedCode(code)}
                  className={`w-40 h-40 border rounded-lg shadow-lg p-4 flex flex-col justify-center items-center text-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl ${selectedCode?._id === code._id ? "border-primary bg-gray-50" : ""}`}
                >
                  <p className="text-lg font-medium text-gray-700">{code?.code}</p>
                  <p className="text-lg font-medium text-gray-700">{code?.description}</p>
                </div>
              ))}
              {codes.length === 0 && (
                <div className="text-center text-gray-500 py-4 w-full">No codes found.</div>
              )}
            </div>
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
            <h3 className="text-xl font-bold mb-4">{isEditing ? "Edit Code" : "Add New Code"}</h3>
            <div className="mb-4">
              <label className="block font-medium mb-2">Code Name</label>
              <input
                type="text"
                className="border-2 px-3 py-2 rounded-lg w-full outline-none"
                value={newCodeName}
                onChange={(e) => setNewCodeName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Code Description</label>
              <input
                type="text"
                className="border-2 px-3 py-2 rounded-lg w-full outline-none"
                value={newCodeDesc}
                onChange={(e) => setNewCodeDesc(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddOrEditCode}
              disabled={isLoading}
              className={`w-full py-2 rounded font-medium ${isLoading ? "bg-slate-400 cursor-not-allowed" : "bg-primary text-white"}`}
            >
              {isLoading ? "Please wait..." : isEditing ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Are you sure you want to delete this code? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setCodeToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(codeToDelete);
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
      {isUploadPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96 relative">
            <IoClose
              size={24}
              className="absolute top-3 right-3 text-primary cursor-pointer"
              onClick={() => setIsUploadPopupOpen(false)}
            />
            <h2 className="text-lg font-semibold mb-4">Upload File</h2>
            <input
              type="file"
              accept=".csv, .xlsx"
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="mb-4 block w-full border p-2 rounded"
            />
            <button
              onClick={handleFileUpload}
              disabled={isUploading}
              className={`w-full py-2 rounded font-medium ${isUploading ? "bg-slate-400 cursor-not-allowed" : "bg-primary text-white"}`}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeMgmt;
