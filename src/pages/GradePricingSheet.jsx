import React, { useEffect, useState } from "react";
import GradePricingTable from "../components/GradePricingTable";
import Footer from "../components/Footer";
import AdminNavbar from "../components/Admin_Navbar";
import SideMenu from "../components/SideMenu";
import * as XLSX from "xlsx";
import styles from "./CompanyListingDetails/CompanyListingDetails.module.css";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { IoMdSearch } from "react-icons/io";
import { FaDownload, FaUpload } from "react-icons/fa6";
import { IoRefresh } from "react-icons/io5";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const pageLimit = 10;

const downloadExcelGradePricingSheet = (apiData) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const formattedData = apiData.map((item) => {
    return {
      "More Details": item.model?.name,
      "A+(0.00%)": item.grades?.A_PLUS,
      "A(10.00%)": item.grades?.A,
      "B(15.00%)": item.grades?.B,
      "B-(20.00%)": item.grades?.B_MINUS,
      "C+(40.00%)": item.grades?.C_PLUS,
      "C(50.00%)": item.grades?.C,
      "C-(60.00%)": item.grades?.C_MINUS,
      "D+(65.00%)": item.grades?.D_PLUS,
      "D(70.00%)": item.grades?.D,
      "D-(70.00%)": item.grades?.D_MINUS,
      "E(90.00%)": item.grades?.E,
    };
  });
  const wsGradePricingSheet = XLSX.utils.json_to_sheet(formattedData);
  const wbGradePricingSheet = {
    Sheets: { data: wsGradePricingSheet },
    SheetNames: ["data"],
  };
  const excelBufferGradePricingSheet = XLSX.write(wbGradePricingSheet, {
    bookType: "xlsx",
    type: "array",
  });
  const dataFileGradePricingSheet = new Blob([excelBufferGradePricingSheet], {
    type: fileType,
  });
  saveAs(dataFileGradePricingSheet, "GradePricingSheet" + fileExtension);
};

const handleSampleDownload = () => {
  const sampleFilePath = "sample-file.xlsx";
  saveAs(sampleFilePath, "sample-file.xlsx");
};

const GradePricingSheet = () => {
  const userToken = sessionStorage.getItem("authToken");
  const [sideMenu, setsideMenu] = useState(false);
  const [maxPages, setMaxPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [uploadBox, setUploadBox] = useState(false);
  const [imagesBox, setImagesBox] = useState(false);
  const [deviceCategory, setDeviceCategory] = useState("CTG1");
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dialogCategories, setDialogCategories] = useState([]);
  const [activeDB, setActiveDB] = useState(sessionStorage.getItem("activeDB") || "");
    const [validationResults, setValidationResults] = useState([]);

const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
};

  const fetchData = () => {
    setIsTableLoading(true);
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/grades/modelPriceList?page=${currentPage}&limit=${pageLimit}&deviceType=${deviceCategory}`,
        {
          headers: {
            authorization: `${userToken}`,
            activeDB: activeDB,
          },
        }
      )
      .then((res) => {
        setMaxPages(Math.ceil(res.data.totalRecords / 10));
        setTableData(res.data.result);
        setTotalCount(res.data.totalRecords);
        setIsTableLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsTableLoading(false);
      });
  };

  useEffect(() => {
    if (searchValue === "") {
      fetchData();
    } else {
      getDataBySearch();
    }
  }, [currentPage, pageLimit, deviceCategory, activeDB]);
  useEffect(() => {
    getCategories();
  }, [activeDB]);
  const getDataBySearch = () => {
    setIsTableLoading(true);
    const config = {
      method: "get",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/grades/modelPriceList?page=${currentPage}&limit=${pageLimit}&search=${searchValue}&deviceType=${deviceCategory}`,
      headers: { Authorization: userToken, activeDB: activeDB },
    };
    axios
      .request(config)
      .then((res) => {
        setTableData(res.data.result);
        setIsTableLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsTableLoading(false);
      });
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
  const handleSearchClick = () => {
    getDataBySearch();
  };

  const fetchDownloadDataGradePricingSheet = () => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/grades/modelPriceList?page=${0}&limit=${totalCount}&deviceType=${deviceCategory}`,
        {
          headers: {
            authorization: `${userToken}`,
            activeDB: activeDB,
          },
        }
      )
      .then((res) => {
        downloadExcelGradePricingSheet(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearchClear = () => {
    setSearchValue("");
    fetchData();
  };

  const handleExcelFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const handleImagesChange = (e) => {
    const selectedFile = e.target.files;
    setImages(selectedFile);
  };
  const handleImagesSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("authToken");
      try {
    // Create FormData for file upload
    const formData = new FormData();
    console.log(images);
    
Array.from(images).forEach((file) => formData.append("files", file));

    // Upload images to the backend
    const response = await axios.post(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/grades/uploadImagesAndReturnJson`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
          activeDB: activeDB,
        },
      }
    );

    const { data } = response.data;

    // Prepare data for Excel
    const excelData = data.map((item) => ({
      "File Name": item.name,
      URL: item.url,
    }));

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Uploaded Images");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "uploaded_images.xlsx";
    link.click();
        setImagesBox(false);

    console.log("Excel generated successfully.");
      } catch (error) {
                setImagesBox(false);

    console.error("Error uploading images or generating Excel:", error);
  }
  }
  const handleBulkSubmit = (e) => {
    e.preventDefault();
    setIsTableLoading(true);
    const token = sessionStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", deviceCategory);

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/grades/addEditModelsAndPrice`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            activeDB: activeDB,
          },
        }
      )
      .then((res) => {
        toast.success("Succussfully submitted");
        setUploadBox(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to submit");
        setUploadBox(false);
      })
      .finally(() => {
        setIsTableLoading(false);
      });
  };
  const handleValidate = () => {
    // Log the event and the files object
  
    validateExcel(file); // Proceed with validation if file is selected
  };
  
    // Validate Excel file for duplicates and missing data
  const validateExcel = (uploadedFile) => {
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Assuming first sheet
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      const issues = [];
      const headers = rows[0]; // First row as headers
      const brandIndex = headers.indexOf("Brand");
      const modelDetailsIndex = headers.indexOf("Model Details");
  
      if (brandIndex === -1 || modelDetailsIndex === -1) {
        issues.push("Missing required columns: 'Brand' or 'Model Details'");
      }
  
      // Check each row for missing Brand or Model Details
      rows.slice(1).forEach((row, rowIndex) => {
        if (!row[brandIndex] || row[brandIndex].trim() === "") {
          issues.push(`Row ${rowIndex + 2}: Brand is missing or empty`);
        }
        if (!row[modelDetailsIndex] || row[modelDetailsIndex].trim() === "") {
          issues.push(`Row ${rowIndex + 2}: Model Details is missing or empty`);
        }
  
        // Check for duplicate words in each cell
        row.forEach((cell, cellIndex) => {
          if (typeof cell === "string") {
            const words = cell.split(/\s+/); // Split cell content into words
            const wordCounts = {};
  
            words.forEach((word) => {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            });
  
            const duplicates = Object.entries(wordCounts)
              .filter(([_, count]) => count > 1)
              .map(([word]) => word);
  
            if (duplicates.length > 0) {
              issues.push(
                `Row ${rowIndex + 2}, Column ${
                  cellIndex + 1
                }: Duplicate words found: ${duplicates.join(", ")}`
              );
            }
          }
        });
      });
  
      // Set the validation results
      setValidationResults(issues);
  
      // Show toast based on the validation result
      if (issues.length > 0) {
        toast.error("Validation failed. Check the errors.");
      } else {
        toast.success("Validation passed!");
      }
    };
  
    // Check if the uploaded file is of type Blob
    console.log("Uploaded file:", uploadedFile);
    if (uploadedFile instanceof Blob) {
      reader.readAsArrayBuffer(uploadedFile);
    } else {
      console.error("Uploaded file is not a valid Blob", uploadedFile);
    }
  };

  const handleDeviceCategory = (e) => {
    setDeviceCategory(e.target.value);
  };
   const handleUploadDeviceCategory = (e) => {
     setDialogCategories(e.target.value);
   };
  return (
    <div>
      <GradePricingSheetSub
        file={file}
        setsideMenu={setsideMenu}
        sideMenu={sideMenu}
        isTableLoading={isTableLoading}
        uploadBox={uploadBox}
        handleBulkSubmit={handleBulkSubmit}
        handleImagesSubmit={handleImagesSubmit}
        handleExcelFileChange={handleExcelFileChange}
        handleImagesChange={handleImagesChange}
        setUploadBox={setUploadBox}
        imagesBox={imagesBox}
        setImagesBox={setImagesBox}
        setIsTableLoading={setIsTableLoading}
        handleDeviceCategory={handleDeviceCategory}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        handleSearchClick={handleSearchClick}
        handleSearchClear={handleSearchClear}
        fetchDownloadDataGradePricingSheet={fetchDownloadDataGradePricingSheet}
        deviceCategory={deviceCategory}
        tableData={tableData}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        maxPages={maxPages}
        categories={categories}
        updateActiveDb={updateActiveDb}
        handleUploadDeviceCategory={handleUploadDeviceCategory}
        handleValidate={handleValidate}
        validationResults={validationResults}
      />
    </div>
  );
};

const GradePricingSheetSub = ({
  file,
  setsideMenu,
  sideMenu,
  isTableLoading,
  uploadBox,
  handleBulkSubmit,
  handleExcelFileChange,
  handleImagesSubmit,
  handleImagesChange,
  imagesBox,
  setImagesBox,
  setUploadBox,
  setIsTableLoading,
  handleDeviceCategory,
  setSearchValue,
  searchValue,
  handleSearchClick,
  handleSearchClear,
  fetchDownloadDataGradePricingSheet,
  deviceCategory,
  tableData,
  setCurrentPage,
  currentPage,
  maxPages,
  categories,
  updateActiveDb,
  handleUploadDeviceCategory,
  handleValidate,
  validationResults,
}) => {
  const navigate = useNavigate();
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
      {/* <Searchbar /> */}
      {isTableLoading && (
        <div className="fixed top-0 left-0 z-49 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader
            color="var(--primary-color)"
            loading={isTableLoading}
            size={15}
          />
        </div>
      )}

      {uploadBox && (
        <div className="fixed top-0 left-0 z-48 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
            {/* <div className="flex gap-2">
              <p className="font-medium">Select Category</p>
              <select
                name=""
                id=""
                className="bg-primary text-white rounded-lg outline-none px-2 py-1"
                onChange={handleUploadDeviceCategory}
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
            </div> */}
            <div className="flex flex-col gap-4">
              {validationResults.length > 0 && (
                <div className="bg-red-100 p-2 rounded-lg">
                  <h2 className="text-red-500 font-medium">
                    Validation Issues
                  </h2>
                  <ul className="list-disc list-inside text-sm text-red-500">
                    {validationResults.slice(0, 10).map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                  {validationResults.length > 10 && (
                    <p className="text-sm text-red-500 mt-2">
                      There are more than 10 errors. Please check the full list.
                    </p>
                  )}
                </div>
              )}
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
                    <span className="bg-slate-100">
                      Upload Grade Price Sheet
                    </span>
                    <input
                      id="files"
                      name="files"
                      type="file"
                      accept=".xlsx, .xls"
                      className="sr-only"
                      onChange={(e) => handleExcelFileChange(e)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Up to 10MB per file</p>
                </label>
                {file && <div className="mt-2 text-gray-500">{file?.name}</div>}
              </div>
              <div className="flex flex-row gap-2">
                <button
                  type="reset"
                  onClick={() => {
                    setUploadBox(false);
                    setIsTableLoading(false);
                  }}
                  className="w-full py-2 rounded font-medium  bg-primary text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleBulkSubmit}
                  className={`w-full py-2 rounded font-medium bg-primary text-white ${
                    isTableLoading && "bg-slate-400"
                  }`}
                  disabled={isTableLoading}
                >
                  {isTableLoading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={handleValidate}
                  className={`w-full py-2 rounded font-medium bg-primary text-white ${
                    isTableLoading && "bg-slate-400"
                  }`}
                  disabled={isTableLoading}
                >
                  {isTableLoading ? "Validating..." : "Validate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {imagesBox && (
        <div className="fixed top-0 left-0 z-48 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} `}>
            <form className="flex flex-col gap-4" onSubmit={handleImagesSubmit}>
              <div className="flex flex-col">
                <p className="mb-1 text-lg items-start text-slate-500">
                  Upload Images (.png, .jpg, .jpeg)
                </p>
                <input
                  type="file"
                  name=""
                  id=""
                  accept=".png, .jpg, .jpeg"
                  multiple={true}
                  onChange={(e) => handleImagesChange(e)}
                  required={true}
                />
              </div>
              <div className="flex flex-row gap-2">
                <button type="submit" className={"bg-primary text-white"}>
                  Upload
                </button>
                <button
                  type="reset"
                  onClick={() => {
                    setImagesBox(false);
                    setIsTableLoading(false);
                  }}
                  className="bg-white text-primary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-2 items-center justify-center outline-none mt-5 w-[100%]">
        <div className="flex gap-2">
          <p className="font-medium">Select Category</p>
          <select
            name=""
            id=""
            className="bg-primary text-white rounded-lg outline-none px-2 py-1"
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
        <div className={`${styles.search_bar_wrap}`}>
          <input
            className="text-sm"
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            value={searchValue}
            placeholder="Search..."
          />
          <IoMdSearch size={25} onClick={handleSearchClick} />
        </div>
        <div className={styles.icons_box}>
          <IoRefresh onClick={handleSearchClear} size={25} className="" />
        </div>
        <button
          onClick={fetchDownloadDataGradePricingSheet}
          className={`${styles.bulkdown_button}`}
        >
          <FaDownload /> Bulk Download
        </button>
        <button
          className={`${styles.bulkdown_button}`}
          onClick={handleSampleDownload}
        >
          <FaDownload /> Download Sample
        </button>
        <button
          className={`${styles.bulkdown_button}`}
          onClick={() => {
            setUploadBox(true);
          }}
        >
          <FaUpload /> Bulk Upload
        </button>
        <button
          className={`${styles.bulkdown_button}`}
          // setImagesBox(true);
          onClick={() => window.open("/storedImages", "_blank")}
        >
          <FaUpload /> Upload Images
        </button>
      </div>
      <div className="tableconatiner flex justify-center items-center">
        <GradePricingTable
          deviceCategory={deviceCategory}
          tableData={tableData}
        />
      </div>
      <div className="mt-0 mb-4 flex justify-center ">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`mx-2 px-4 py-2 rounded-lg ${
            currentPage === 0
              ? " text-gray-600 cursor-not-allowed bg-gray-400"
              : " text-white cursor-pointer bg-primary"
          }`}
        >
          Previous
        </button>
        <button
          disabled={currentPage === maxPages - 1}
          className={`mx-2 px-4 py-2 rounded-lg ${
            currentPage === maxPages - 1
              ? "text-gray-600 bg-gray-400  cursor-not-allowed"
              : "bg-primary  cursor-pointer text-white"
          }`}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GradePricingSheet;
