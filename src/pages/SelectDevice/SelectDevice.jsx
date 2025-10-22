import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import styles from "./SelectDevice.module.css";
import AppFooter from "../../components/AppFooter";
import apple_watch from "../../assets/apple_watch.png";
import * as XLSX from "xlsx";
// import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { IoIosArrowBack, IoIosArrowForward, IoMdSearch } from "react-icons/io";
import { BeatLoader } from "react-spinners";
import AdminNavbar from "../../components/Admin_Navbar";
import SideMenu from "../../components/SideMenu";
import toast from "react-hot-toast";
const data = JSON.parse(sessionStorage.getItem("dataModel"));

const DeviceType = sessionStorage.getItem("DeviceType");
console.log(DeviceType);
export const SeriesFilter = ({
  selectedBtn,
  setSelectedBtn,
  setSeriesType,
  seriesList,
}) => {
  const catContainerRef = useRef(null);
  const scrollCategory = (direction) => {
    const scrollAmount = 200;

    if (catContainerRef.current) {
      if (direction === "right") {
        catContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      } else if (direction === "left") {
        catContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className={`${styles.select_button_wrap}`}>
      <button
        onClick={() => scrollCategory("left")}
        className={`translate-x-3 ${styles.scroll_button}`}
      >
        <IoIosArrowBack size={30} />
      </button>
      <div
        ref={catContainerRef}
        className={`flex flex-shrink-0 px-1 gap-4 overflow-x-auto scroll-smooth scrollbar-hide ${styles.select_button_box}`}
      >
        {seriesList.map((category, index) => (
          <div
            className={`${
              selectedBtn === category.name
                ? styles.button_checked
                : styles.button_unchecked
            } text-xs font-medium text-nowrap flex-shrink-0 px-0`}
            key={index}
            onClick={() => {
              setSelectedBtn(category.name);
              setSeriesType(category.seriesKey);
            }}
          >
            <p className="px-0 mx-0">{category.name}</p>
          </div>
        ))}
      </div>
      <button
        className={`-translate-x-3 ${styles.scroll_button}`}
        onClick={() => scrollCategory("right")}
      >
        <IoIosArrowForward size={30} />
      </button>
    </div>
  );
};

const SelectDevice = () => {
  const [modelInfo, setModelInfo] = useState();
  const userToken = sessionStorage.getItem("authToken");
  const Device = sessionStorage.getItem("DeviceType");
  const [selectedBtn, setSelectedBtn] = useState("All");
  const [seriesType, setSeriesType] = useState("");
  const [seriesList, setSeriesList] = useState([]);
  const [searchModel, setSearchModel] = useState("");
  const [imagesBox, setImagesBox] = useState(false);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadBox, setUploadBox] = useState(false);
  const [validationResults, setValidationResults] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Controls the modal visibility
  const [isTransferPopupOpen, setIsTransferPopupOpen] = useState(false); // Controls the modal visibility
  const [isEditing, setIsEditing] = useState(false); // Determines if we're adding or editing
  const [selectedModels, setSelectedModels] = useState([]);
  const [isModelDeleteConfirmOpen, setIsModelDeleteConfirmOpen] = useState(false);
  const { brandId } = useParams();
  const [modelForm, setModelForm] = useState({
    brandId: brandId,
    name: "",
    config: [{ storage: "", RAM: "", price: "" }],
    type: Device,
    series: "",
  }); // Form data for models
  const containerRef = useRef(null);
  const [dbList, setDbList] = useState([]);
  const fromDb = "UnicornUAT";
  const [toDb, setToDb] = useState("");
  const [sideMenu, setsideMenu] = useState(false);
  const [activeDB, setActiveDB] = useState(
    sessionStorage.getItem("activeDB") || "UnicornUAT"
  );
  const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
  };
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const DummyImg =
    "https://grest-c2b-images.s3.ap-south-1.amazonaws.com/gresTest/1705473080031front.jpg";
    const token = sessionStorage.getItem("authToken");

  const navigate = useNavigate();

  const fetchModels = () => {
    setIsTableLoaded(true);
    const config = {
      method: "post",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/brands/getSelectedBrandModels`,
      headers: {
        Authorization: `${userToken}`,
        activeDB: activeDB,
      },
      data: {
        brandId: brandId,
        deviceType: Device,
        series: seriesType,
        search: searchModel,
      },
    };
    console.log(config);
    axios
      .request(config)
      .then((res) => {
        console.log("asd", res?.data);
        setModelInfo(res.data.models);
        setSeriesList(res.data.seriesList);
        setIsTableLoaded(false);
      })
      .catch((err) => {
        console.log(err);
        setIsTableLoaded(false);
      });
  };

  useEffect(() => {
    fetchModels();
  }, [seriesType, activeDB]);

    useEffect(() => {
      fetchDbs();
    }, []);
  
    // Fetch stored images with pagination and search
    const fetchDbs = async () => {
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
        setDbList(response.data.dbList);
      } catch (error) {
        console.error(error);
      }
    };
  const handleExcelFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setModelForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleNestedChange = (field, index, subField, value) => {
    setModelForm((prevForm) => ({
      ...prevForm,
      [field]: prevForm[field].map((item, i) =>
        i === index ? { ...item, [subField]: value } : item
      ),
    }));
  };

  const resetModelForm = () => {
    setModelForm({
      brandId: brandId,
      name: "",
      config: [{ storage: "", RAM: "", price: "" }],
      type: Device,
      series: "",
    });
  };
const loadModelDetails = (model) => {
  setModelForm({
    brandId: model.brandId,
    name: model.name,
    config: model.config,
    type: model.type,
    series: model.series,
  });
};
const handleSubmit = async () => {
  try {
        setIsTableLoaded(true);
        if (isEditing && selectedModels.length !== 1) {
          toast.error("Please select exactly one model to edit.");
          return;
        }
    // Create a FormData object
    const formData = new FormData();
    formData.append("name", modelForm.name);
    formData.append("type", modelForm.type);
    formData.append("series", modelForm.series);
    formData.append("brandId", brandId); // Include brandId if needed
    formData.append("config", JSON.stringify(modelForm.config)); // Convert config array to string
    if(images){
      // Append images to formData
      images.forEach((image) => {
        formData.append("files", image);
      });
    }
    console.log(selectedModels);
    // Determine the API endpoint and method
    const url = isEditing
    ? `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/models/updateModel?id=${selectedModels[0]._id}`
    : `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/models/createModel`;

    const method = isEditing ? "put" : "post";

    // Send the request
    await axios({
      method,
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${token}`,
        activeDB: activeDB,
      },
    });

    // Handle success
    fetchModels(); // Refresh the list
    setIsPopupOpen(false); // Close the modal
    resetModelForm(); // Reset the form
    setImages([]); // Clear uploaded images
        setIsTableLoaded(false);

  } catch (error) {
        setIsTableLoaded(false);
    toast.error(
      `Error saving model: ${error.response?.data?.message || error.message}`
    );
    console.error("Error saving model:", error);
  }
};

const handleTransfer = async () => {
  if (!toDb) {
    alert("Please select a destination database.");
    return;
  }
  const modelIds = selectedModels.map((model) => model._id); // extract only _id

  try {
    setIsTableLoaded(true);
    await axios.post(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/transfer/transferBrandModels`, {
      categoryCode: Device,
      brandId,
      modelIds: modelIds,
      fromDb,
      toDb,
    }, {
      headers: {
        Authorization: `${userToken}`,
        activeDB: activeDB,
      },
    });

    toast.success("Data has been Transferred Successfully");
    setIsTransferPopupOpen(false);
    setToDb("");
    setIsTableLoaded(false);
  } catch (err) {
    setIsTableLoaded(false);
    console.error(err);
    toast.error("Transfer failed.");
  }
};

const handleActivate = async () => {
  if (selectedModels.length === 0) {
    alert("Please select a Models to Activate.");
    return;
  }
  const modelIds = selectedModels.map((model) => model._id); // extract only _id

  try {
    setIsTableLoaded(true);
    await axios.post(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/transfer/activateCategoryBrandModels`, {
      categoryCode: Device,
      brandId,
      modelIds: modelIds,
    }, {
      headers: {
        Authorization: `${userToken}`,
        activeDB: activeDB,
      },
    });

    toast.success("Activation completed.");
    fetchModels();
    setIsTableLoaded(false);
  } catch (err) {
    setIsTableLoaded(false);
    console.error(err);
    toast.error("Activation failed.");
  }
};


const handleDeleteModel = async (modelId) => {
  try {
        setIsTableLoaded(true);
    await axios.delete(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/models/deleteModel?id=${modelId}`, 
         {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
            activeDB: activeDB,
          },
        }
      
    );
        setIsTableLoaded(false);
    fetchModels(); // Refresh the list
  } catch (error) {
        setIsTableLoaded(false);
    console.error("Error deleting model:", error);
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
    setIsTableLoaded(true);
    try {
      const formData = new FormData();
      formData.append("category", Device);
      Array.from(images).forEach((file) => formData.append("files", file));

      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/storedImages/bulkuploadImage`,
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
      fetchModels();
      setImagesBox(false);
    } catch (error) {
      setImagesBox(false);
      setIsTableLoaded(false);
      console.error("Error uploading images", error);
    } finally {
      setIsTableLoaded(false);
    }
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    setIsTableLoaded(true);
    const token = sessionStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", Device);

    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/grades/createModels`,
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
        fetchModels();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to submit");
        setUploadBox(false);
      })
      .finally(() => {
        setIsTableLoaded(false);
      });
  };
  // const [validationResults, setValidationResults] = useState([]);
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
  const handleDeviceClick = (model) => {
    const updatedData = {
      ...data,
      models: model,
    };
    sessionStorage.setItem("dataModel", JSON.stringify(updatedData));
    sessionStorage.setItem("dataModelConfig", JSON.stringify(model));
    navigate("/selectmodel");
  };
  const isArray = Array.isArray(modelInfo);
  const sortedModels = isArray
    ? [...modelInfo].sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/), 10);
        const numB = parseInt(b.name.match(/\d+/), 10);
        return numA - numB;
      })
    : [];
  const handleNext = (category) => {
    navigate("/questions/" + category);
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-white">
      <div className="navbar">
        <AdminNavbar
          setsideMenu={setsideMenu}
          sideMenu={sideMenu}
          onActiveDbChange={updateActiveDb}
        />
        <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
      </div>

      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-100 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color={"#EC2752"} loading={isTableLoaded} size={15} />
        </div>
      )}
      {/* <div className="flex items-center justify-between w-full pr-2">
          <ProfileBox />
          <img
            onClick={() => navigate("/selectdevicetype")}
            className="w-40"
            src={Grest_Logo}
            alt="app logo"
          />
        </div> */}
      {/* <div className="ml-5">
        {Device === "Mobile" ? (
          <p className="text-2xl font-bold">Select Mobile Phone</p>
        ) : (
          <p className="text-2xl font-bold">Select Smartwatches</p>
        )}
      </div> */}
      {seriesList.length > 1 && (
        <SeriesFilter
          selectedBtn={selectedBtn}
          setSelectedBtn={setSelectedBtn}
          setSeriesType={setSeriesType}
          seriesList={seriesList}
        />
      )}
      <div
        className="flex items-center mt-1 mx-4 bg-[#f5f5f5] rounded-[0.55rem] overflow-hidden"
        style={{
          boxShadow:
            "1px 1px 2px 0px rgba(0, 0, 0, 0.158), 0px 0px 0px 0px rgba(0, 0, 0, 0.034)",
        }}
      >
        <input
          placeholder="Search Products"
          id="searchModel"
          name="searchModel"
          value={searchModel}
          onChange={(e) => setSearchModel(e.target.value)}
          className="inline w-full ml-4 mr-2 my-2 outline-none bg-transparent"
          type="text"
        />
        <div
          className="flex items-center justify-center bg-[#EC2752] h-[40px] w-[50px] cursor-pointer"
          onClick={fetchModels}
        >
          <IoMdSearch size={25} className="inline text-white" />
        </div>
      </div>
      <div
        className="flex items-center gap-4 justify-end p-6"
        ref={containerRef}
      >
        {/* Button for Bulk Upload */}
        <button
          className="font-medium text-sm text-white px-4 py-2 rounded bg-primary"
          onClick={() => {
            setUploadBox(true);
          }}
        >
          Bulk Upload
        </button>

        {/* Button for Upload Images */}
        <button
          className="font-medium text-sm text-white px-4 py-2 rounded bg-primary"
          onClick={() => {
            setImagesBox(true);
          }}
        >
          Upload Images
        </button>

        {/* Button for Adding a New Product */}
        {/* Add Model */}
        <button
          className="font-medium text-sm text-white px-4 py-2 rounded bg-green-500"
          onClick={() => {
            setIsPopupOpen(true);
            setIsEditing(false);
            resetModelForm();
          }}
        >
          Add Model
        </button>

        {/* Edit Model */}
        <button
          className={`font-medium text-sm text-white px-4 py-2 rounded bg-yellow-500 ${
            selectedModels.length !== 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (selectedModels.length !== 1) return;
            setIsPopupOpen(true);
            setIsEditing(true);
            loadModelDetails(selectedModels[0]);
          }}
          disabled={selectedModels.length !== 1}
        >
          Edit Model
        </button>

        {/* Delete Model */}
        <button
          className={`font-medium text-sm text-white px-4 py-2 rounded bg-red-500 ${
            selectedModels.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (selectedModels.length === 0) return;
            setIsModelDeleteConfirmOpen(true);
          }}
          disabled={selectedModels.length === 0}
        >
          Delete Model
        </button>

        {/* Button for Navigating to the Next Page */}
        <button
          onClick={() => handleNext(Device)}
          className="w-20 font-medium text-sm text-white px-4 py-2 rounded bg-blue-500"
        >
          Next
        </button>
        {/* Select All */}
        <button
          className="font-medium text-sm text-white px-4 py-2 rounded bg-blue-700"
          onClick={() => setSelectedModels(sortedModels)}
        >
          Select All
        </button>
        {activeDB === fromDb &&
          <button
          className="font-medium text-sm text-white px-4 py-2 rounded bg-primary"
          onClick={() => {
            setIsTransferPopupOpen(true);
          }}
          >
            Transfer
          </button>
        }
        {activeDB !== fromDb &&
          <button
            onClick={handleActivate}
            className={`font-medium text-sm text-white px-4 py-2 rounded bg-primary ${
              (isTableLoaded || selectedModels.length === 0) && "bg-slate-400"
            }`}
            disabled={isTableLoaded || selectedModels.length === 0}
          >
            {isTableLoaded ? "Activating..." : "Activate"}
          </button>
        }
        {/* Unselect All */}
        <button
          className="font-medium text-sm text-white px-4 py-2 rounded bg-gray-500"
          onClick={() => setSelectedModels([])}
        >
          Unselect All
        </button>

        <div
          className="font-medium text-sm text-white px-4 py-2 bg-primary rounded-full shadow shadow-primary"
        >
          Selected Models: {selectedModels.length}
        </div>
      </div>

      <div
        className={` ${styles.cardsContainer} m-4 shrink flex flex-wrap justify-center gap-2 md:gap-8`}
      >
        {modelInfo && modelInfo.length === 0 && (
          <div className="mt-[50%] font-bold text-4xl">No Product Found</div>
        )}
        {isArray &&
          sortedModels.length > 0 &&
          sortedModels.map((model) => {
            const isSelected = selectedModels.some((m) => m._id === model._id);

            // Toggle selection logic
            const toggleSelection = () => {
              setSelectedModels((prevSelected) =>
                isSelected
                  ? prevSelected.filter((m) => m._id !== model._id)
                  : [...prevSelected, model]
              );
            };
            return (
              <div
                key={model._id}
                onClick={toggleSelection}
                className={`relative ${styles.card} w-[30%] md:w-[20%] lg:w-[15%] xl:w-[16%] gap-2 flex flex-col items-center px-2 py-4 text-center ${
                  isSelected ? "bg-blue-100 border-2 border-blue-400" : ""
                } ${fromDb !== Device && model?.status === "Initiated" ? "border-2 border-yellow-300" : ""}`}
              >
                {/* Top-left checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  className="absolute top-2 left-2 h-4 w-4 cursor-pointer"
                />

                {/* Product Image */}
                {model?.phonePhotos?.front && (
                  <img
                    className="max-w-[90px] mb-2 h-[90px]"
                    src={model.phonePhotos.front}
                    alt=""
                  />
                )}
                {!model?.phonePhotos?.front && model?.phonePhotos?.upFront && (
                  <img
                    className="w-[38px] mb-2 h-[82px] mt-[2px]"
                    src={model.phonePhotos.upFront}
                    alt=""
                  />
                )}
                {!model?.phonePhotos?.front && !model?.phonePhotos?.upFront && (
                  <img className="w-[80px] mb-2 h-[90px]" src={DummyImg} alt="" />
                )}

                <p className="text-[11px] font-medium">{model.name}</p>
              </div>
            );
          })}
      </div>

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
                      Upload Images (.png, .jpg, .jpeg)
                    </span>
                    <input
                      id="files"
                      name="files"
                      type="file"
                      className="sr-only"
                      accept=".png, .jpg, .jpeg"
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
                    isTableLoaded && "bg-slate-400"
                  }`}
                  disabled={isTableLoaded}
                >
                  {isTableLoaded ? "Uploading..." : "Upload"}
                </button>
                <button
                  type="reset"
                  onClick={() => {
                    setImagesBox(false);
                    setImages([]);
                    setIsTableLoaded(false);
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
      {uploadBox && (
        <div className="fixed top-0 left-0 z-48 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
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
                    <span className="bg-slate-100">Upload Products Sheet</span>
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
                    setImages([]); // Clear uploaded images
                    setIsTableLoaded(false);
                  }}
                  className="w-full py-2 rounded font-medium  bg-primary text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleBulkSubmit}
                  className={`w-full py-2 rounded font-medium bg-primary text-white ${
                    isTableLoaded && "bg-slate-400"
                  }`}
                  disabled={isTableLoaded}
                >
                  {isTableLoaded ? "Uploading..." : "Upload"}
                </button>

                <button
                  onClick={handleValidate}
                  className={`w-full py-2 rounded font-medium bg-primary text-white ${
                    isTableLoaded && "bg-slate-400"
                  }`}
                  disabled={isTableLoaded}
                >
                  {isTableLoaded ? "Validating..." : "Validate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-96 p-6 shadow-lg overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Model" : "Add Model"}
            </h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={modelForm.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Config (Storage, RAM, Price) */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Config</label>
              {modelForm.config.map((configItem, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Storage"
                    value={configItem?.storage}
                    onChange={(e) =>
                      handleNestedChange(
                        "config",
                        index,
                        "storage",
                        e.target.value
                      )
                    }
                    className="w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    placeholder="RAM"
                    value={configItem?.RAM}
                    onChange={(e) =>
                      handleNestedChange("config", index, "RAM", e.target.value)
                    }
                    className="w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={configItem?.price}
                    onChange={(e) =>
                      handleNestedChange(
                        "config",
                        index,
                        "price",
                        e.target.value
                      )
                    }
                    className="w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {/* Remove Config Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setModelForm((prevForm) => ({
                        ...prevForm,
                        config: prevForm.config.filter(
                          (_, idx) => idx !== index
                        ),
                      }))
                    }
                    className="text-red-500 text-sm ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="text-blue-500 text-sm"
                onClick={() =>
                  setModelForm((prevForm) => ({
                    ...prevForm,
                    config: [
                      ...prevForm.config,
                      { storage: "", RAM: "", price: "" },
                    ],
                  }))
                }
              >
                Add Config
              </button>
            </div>

            {/* Series */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Series</label>
              <input
                type="text"
                name="series"
                value={modelForm.series}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="space-y-1 text-center bg-slate-100 p-2 rounded-lg">
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
                    Upload Images (.png, .jpg, .jpeg)
                  </span>
                  <input
                    id="files"
                    name="files"
                    type="file"
                    className="sr-only"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleImagesChange}
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

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => {
                  setIsPopupOpen(false);
                  setImages([]); // Clear uploaded images
                  resetModelForm();
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-primary hover:bg-primary text-white"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    {isTransferPopupOpen && activeDB === fromDb && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-96 p-6 shadow-lg overflow-auto max-h-[90vh]">
              <h2 className="text-xl font-semibold mb-4">
                Transfer Selected Models - {selectedModels.length}
              </h2>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Transfer From:</label>
                <input
                  type="text"
                  value={fromDb}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Transfer To:</label>
                <select
                  value={toDb}
                  onChange={(e) => setToDb(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Select destination DB</option>
                  {dbList
                    .filter((db) => db !== fromDb) // Prevent selecting same as fromDb
                    .map((db, index) => (
                      <option key={index} value={db}>
                        {db}
                      </option>
                    ))}
                </select>
              </div>
              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => {
                    setIsTransferPopupOpen(false);
                    setToDb("");
                  }}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  className={`w-full py-2 rounded font-medium bg-primary text-white ${
                    isTableLoaded && "bg-slate-400"
                  }`}
                  disabled={isTableLoaded}
                >
                  {isTableLoaded ? "Transfering..." : "Transfer"}
                </button>
              </div>
            </div>
          </div>
        )}
        {isModelDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4 text-center">Confirm Delete</h2>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Are you sure you want to delete {selectedModels.length} model(s)? This cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setIsModelDeleteConfirmOpen(false);
                  }}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    selectedModels.forEach((model) => handleDeleteModel(model._id));
                    setIsModelDeleteConfirmOpen(false);
                    setSelectedModels([]);
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

export default SelectDevice;
