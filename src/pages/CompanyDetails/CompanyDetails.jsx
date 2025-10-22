import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Admin_Navbar";
import SideMenu from "../../components/SideMenu";
import { AiOutlineFile } from "react-icons/ai";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CompanyDetails = () => {
  const [sideMenu, setsideMenu] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [company, setCompany] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [companyCode, setCompnayCode] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [activeDB, setActiveDB] = useState(
    sessionStorage.getItem("activeDB") || ""
  );
  const [isEditable, setIsEditable] = useState(false); // New state to track edit mode
  const navigate = useNavigate();

  const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = () => {
    const userToken = sessionStorage.getItem("authToken");
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/company/findByName?companyName=${activeDB}`,
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB,
          },
        }
      )
      .then((res) => {
        const fetchedCompany = res.data.result;
        // Pre-fill form fields with fetched data
        setCompany(fetchedCompany);
        setCompanyName(fetchedCompany.companyName);
        setUniqueId(fetchedCompany.uniqueId);
        setCompnayCode(fetchedCompany.companyCode);
        setContactNumber(fetchedCompany.contactNumber);
        setAddress(fetchedCompany.address);
        setGstNumber(fetchedCompany.gstNumber);
        setPanNumber(fetchedCompany.panNumber);
        setRemarks(fetchedCompany.remarks);
        setDocuments(fetchedCompany.documents || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileUpload = (e) => {
    console.log(e)
    const files = e.target.files;
    setAttachedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
  };

const handleDeleteImage = (imageUrl) => {
  setDocuments((prevDocs) => prevDocs.filter((doc) => doc !== imageUrl));
  setDeletedImages((prevDeletedImages) => [...prevDeletedImages, imageUrl]);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("_id", company?._id);
  formData.append("companyName", companyName);
  formData.append("uniqueId", uniqueId);
  formData.append("companyCode", companyCode);
  formData.append("contactNumber", contactNumber);
  formData.append("address", address);
  formData.append("gstNumber", gstNumber);
  formData.append("panNumber", panNumber);
  formData.append("remarks", remarks);
  attachedFiles.forEach((file) => {
    formData.append("files", file);
  });

  if (deletedImages.length) {
    formData.append("deleteImages", JSON.stringify(deletedImages));
  }

  const userToken = sessionStorage.getItem("authToken");
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/company/edit`,
      formData,
      {
        headers: {
          Authorization: `${userToken}`,
          activeDB: activeDB,
        },
      }
    );
    const updatedCompany = res.data.result;
    setCompany(updatedCompany);
    setDocuments(updatedCompany.documents || []);
    setAttachedFiles([]);
    setIsEditable(false);
    toast.success("Company updated successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update the company.");
  }
};


  return (
    <div>
      <div className="navbar">
        <AdminNavbar
          setsideMenu={setsideMenu}
          sideMenu={sideMenu}
          onActiveDbChange={updateActiveDb}
        />
        <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
      </div>

      <div
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.3) 0px 0px 10px, rgba(0, 0, 0, 0.1) 0px 5px 12px",
        }}
        className="items-center bg-white max-w-[900px] flex py-8 mx-auto mt-4 justify-center flex-col rounded-lg shadow-lg"
      >
        <div className="flex flex-col w-full">
          <div className="mb-6 flex flex-col gap-2 border-b-2 mr-10 pb-2 ml-10">
            <p className="text-4xl font-bold text-gray-800">Company Details</p>
            <p className="text-lg text-gray-600">
              All fields marked with * are required
            </p>
          </div>
          <div className="mx-10 flex flex-col gap-6">
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col w-[48%] gap-2">
                <label className="font-medium text-xl text-gray-700">
                  Name*
                </label>
                <input
                  className="border-2 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  value={companyName}
                  required
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={!isEditable} // Disable input when not editable
                />
              </div>
              <div className="flex flex-col w-[48%] gap-2">
                <label className="font-medium text-xl text-gray-700">
                  Unique Id*
                </label>
                <input
                  className="border-2 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  value={uniqueId}
                  required
                  onChange={(e) => setUniqueId(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col w-[48%] gap-2">
                <label className="font-medium text-xl text-gray-700">
                  Company Code*
                </label>
                <input
                  className="border-2 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  value={companyCode}
                  required
                  onChange={(e) => setCompnayCode(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
              <div className="flex flex-col w-[48%] gap-2">
                <label className="font-medium text-xl text-gray-700">
                  Address
                </label>
                <input
                  className="border-2 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col w-[48%] gap-2">
                <label className="font-medium text-xl text-gray-700">
                  Contact Number
                </label>
                <input
                  className="border-2 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
              <div className="flex flex-col w-[48%] gap-2">
                <label className="font-medium text-xl text-gray-700">
                  GST Number
                </label>
                <input
                  className="border-2 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  value={gstNumber}
                  maxLength={15}
                  onChange={(e) => setGstNumber(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col w-[48%] gap-2">
                <label className="font-medium text-xl text-gray-700">
                  PAN Number
                </label>
                <input
                  className="border-2 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
              <div className="flex flex-col w-[48%] gap-2">
                <label className="font-medium text-xl text-gray-700">
                  Remarks
                </label>
                <input
                  className="border-2 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
            </div>
            {isEditable && (
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
                    <span className="bg-slate-100"> Attach Images</span>
                    <input
                      type="file"
                      id="files"
                      multiple
                      disabled={!isEditable}
                      className="sr-only"
                      onChange={(e) => handleFileUpload(e)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Up to 10MB per file</p>
                </label>
              </div>
            )}

            <div className="flex flex-wrap w-[90%] gap-4 mt-4">
              {isEditable &&
                attachedFiles.length > 0 &&
                attachedFiles.map((file, index) => (
                  <div className="flex flex-col items-center" key={index}>
                    {file.type.startsWith("image") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-[80px] h-[80px] object-cover rounded-lg"
                      />
                    ) : (
                      <AiOutlineFile size={80} />
                    )}
                    <p className="text-center text-sm">{file.name}</p>
                  </div>
                ))}

              <div className="flex flex-wrap w-[90%] gap-4 mt-4">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center"
                  >
                    <img
                      src={doc}
                      alt={`Document-${index}`}
                      className="w-[100px] h-[100px] object-cover rounded-lg"
                    />
                    {isEditable && (
                      <button
                        onClick={() => handleDeleteImage(doc)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsEditable(!isEditable)} // Toggle edit mode
                className=" w-20 font-medium text-sm text-white p-3 rounded bg-[#EC2752] hover:bg-[#d31f44] transition-all"
              >
                {isEditable ? "Cancel" : "Edit"}
              </button>
              {isEditable ? (
                <button
                  onClick={handleSubmit}
                  className="font-medium text-sm text-white p-3 rounded bg-[#EC2752] hover:bg-[#d31f44] transition-all"
                >
                  Submit Form
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
