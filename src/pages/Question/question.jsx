import React, { useEffect, useState } from "react";
import styles from "./question.module.css";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoMdSearch,
} from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa6";
import AdminNavbar from "../../components/Admin_Navbar";
import SideMenu from "../../components/SideMenu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setMobileID,
  setRam,
  setStorage,
} from "../../store/slices/newAdminGrade";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import { ImArrowLeft } from "react-icons/im";
import useUserProfile from "../../utils/useUserProfile";

const getEvenRowClass = (index, selectmodel, selectstorage, selectram, val) => {
  if (index % 2 === 0) {
    if (
      selectmodel === val.modelId &&
      selectstorage === val?.storage &&
      selectram === val?.RAM
    ) {
      return "bg-[#eb869c]";
    }
    return "bg-gray-200";
  }
  return "";
};

const downloadExcel = (data) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const formattedData = data.map((item) => {
    return {
      "Brand Id": item.brandId?._id,
      "Brand Name": item.brandId?.name,
      Question: item?.question,
    };
  });

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataFile = new Blob([excelBuffer], { type: fileType });
  saveAs(dataFile, "All_Models_Data" + fileExtension);
};

const getRowClass = (selectmodel, selectstorage, selectram, val) => {
  if (
    selectmodel === val.modelId &&
    selectstorage === val?.storage &&
    selectram === val?.RAM
  ) {
    return "bg-[#eb869c]";
  }
  return "";
};

const getTextColorClass = (isSuccess) =>
  isSuccess ? "text-green-500" : "text-[#EC2752]";
const grestTheme = "bg-[#EC2752] text-white";
const errMsg = "";
const selectedModel = "";

const AdminQuestion = () => {
  const [admincategory, setAdminCategory] = useState(
    sessionStorage.getItem("admincategory") === "Watch" ? "Watch" : "Mobile"
  );
  const [questions, setQuestions] = useState([]);
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectmodel, setSelectModel] = useState("");
  const [selectstorage, setSelectstorage] = useState("");
  const [selectram, setSelectram] = useState("");
  const [category, setCategory] = useState("Mobile");
  const token = sessionStorage.getItem("authToken");
  const [sucBox, setSucBox] = useState(false);
  const [failBox, setFailBox] = useState(false);
  const [confBox, setConfBox] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [maxPages, setMaxPage] = useState(0);
  const [brandList, setBrandList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [brandID, setBrandID] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const getData = async () => {
    const brandID = selectedBrand?._id;
    if (!brandID) {
      return;
    } else {
      setIsTableLoaded(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_ENDPOINT
          }/api/questionnaires/getQNA?page=${page}&limit=10&brandId=${brandID}`,
          { headers: { Authorization: token } }
        );
        setQuestions(response.data.data);
        setMaxPage(Math.ceil(response.data.totalCounts / 10));
      } catch (error) {
        toast.error("Failed to fetch data. Please try again.");
      } finally {
        setIsTableLoaded(false);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [page, selectedBrand]);

  const getDataBySearch = () => {
    setIsTableLoaded(true);
    const config = {
      method: "post",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/user/Dashboard/search/phones`,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      data: {
        name: searchValue,
        deviceType: admincategory,
      },
    };
    axios
      .request(config)
      .then((response) => {
        const responseData = response.data;
        const allConfigurations = [];
        responseData.forEach((model) => {
          const brandName = model.name.split(" ")[0];
          model.config.forEach((conf) => {
            const newConfig = {
              brandId: model.brandId,
              modelId: model._id,
              brandName: brandName,
              modelName: model.name,
              storage: conf.storage,
              RAM: conf.RAM,
              price: conf.price,
            };
            allConfigurations.push(newConfig);
          });
        });
        setQuestions(allConfigurations);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setIsTableLoaded(false);
      });
  };
  const selectHandler = (modelId, modelStorage, ram, modelName) => {
    sessionStorage.setItem(
      "adminModelName",
      `${modelName} (${ram}/${modelStorage})`
    );
    if (category === "Watch") {
      sessionStorage.setItem("adminModelName", modelName);
    }
    setSelectModel(modelId);
    setSelectstorage(modelStorage);
    setSelectram(ram);
    dispatch(setMobileID(modelId));
    dispatch(setStorage(modelStorage));
    dispatch(setRam(ram));
  };
  const deleteHandler = (userID) => {
    setIsTableLoaded(true);
    setIsTableLoaded(false);
  };

  const handleSearchClear = () => {
    setSearchValue("");
    getData();
  };

  function handleNext() {
    // Check if all questions are answered
    if (
      questions.every((question) =>
        answers.some((answer) => answer.question === question.question)
      )
    ) {
      // All questions answered
      setPage(page + 1);
    } else {
      // Show toast if not all questions are answered
      toast.warning("Please answer all the questions!!");
    }
  }

  function handlePrev() {
    if (page > 1) {
      setPage(page - 1);
    }
  }
  const [uploadBox, setUploadBox] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [file, setFile] = useState(null);

  const fetchModels = () => {
    setIsTableLoading(true);
    const config = {
      method: "post",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/brands/getNewSelectedBrandModels`,
      headers: {
        Authorization: `${token}`,
      },
      data: {
        brandId: selectedBrand?._id,
        deviceType: "Mobile",
        series: "",
        search: "",
      },
    };
    axios
      .request(config)
      .then((res) => {
        console.log("asd", res?.data);
        setDeviceList(res.data.models);
        setIsTableLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsTableLoading(false);
      });
  };

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/brands/getBrands?deviceType=Mobile`,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        const brands = res.data.data;
        setBrandList(brands);

        // Check if there are any brands and set the first one as selected
        if (brands.length > 0) {
          setSelectedBrand(brands[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Add this useEffect to call getData whenever the selected brand changes
  useEffect(() => {
    if (selectedBrand) {
      getData();
      fetchModels();
    }
  }, [selectedBrand]);

  const handleExcelFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleBulkSubmit = (e) => {
    setIsTableLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("brandId", brandID);

    let url = `${
      import.meta.env.VITE_REACT_APP_ENDPOINT
    }/api/questionnaires/uploadQNA`;

    axios
      .post(url, formData, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        toast.success("Succussfully Uploaded");
        setUploadBox(false);
        getData();
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

  // State to track the selected answers
  const [answers, setAnswers] = useState([]);

  const handleChange = (questionId, answer, per, questionText) => {
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (item) => item.question === questionText
      );

      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = {
          question: questionText,
          answer: {
            answer,
            per,
          },
        };
        return updatedAnswers;
      } else {
        return [
          ...prev,
          {
            question: questionText,
            answer: {
              answer,
              per,
            },
          },
        ];
      }
    });
  };

  const handleBrandChange = (e) => {
    const selectedId = e.target.value;
    const selectedObject = brandList.find((item) => item._id === selectedId);
    setSelectedBrand(selectedObject);
    setSelectedDevice(null);
    setDeviceList([]);
    setAnswers([]);
  };

  const handleModelChange = (e) => {
    const [deviceId, configId] = e.target.value.split("|"); // Split the value to get both device and config ID

    const selectedDevice = deviceList.find((item) => item._id === deviceId); // Find the device by _id
    const selectedConfig = selectedDevice?.config.find(
      (conf) => conf._id === configId
    ); // Find the config by its ID

    if (selectedDevice && selectedConfig) {
      setSelectedDevice({
        ...selectedDevice,
        selectedConfig, // Add the selected config to the selected device object
      });
    }
    setAnswers([]); // Clear answers
  };

  const [isLoading, setIsLoading] = useState(false);
  const profile = useUserProfile();

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log(selectedDevice, "arijit");

    const payload = {
      price: selectedDevice?.selectedConfig?.price,
      data: answers,
      phoneNumber: "123456789",
      aadharNumber: "123456789012",
      modelId: selectedDevice?._id,
      storage: selectedDevice?.selectedConfig?.storage,
      ram: selectedDevice?.selectedConfig?.RAM,
      name: profile?.name,
    };
    const response = await axios.post(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/questionnaires/calcuatleModelPrice`,
      payload,
      { headers: { Authorization: token } }
    );
    setIsLoading(false);
    toast.success(response?.data?.message);

    sessionStorage.setItem("selectedDevice", JSON.stringify(selectedDevice));
    sessionStorage.setItem("calculatedAdminPrice", response?.data?.data?.price);
    navigate("/adminfinalprice");
    // sessionStorage.setItem(
    //   "responsedatadata",
    //   JSON.stringify({ ...response.data.data, bonus: 0 })
    // );
    // store.dispatch(setResponseData({ ...response.data.data, bonus: 0 }));
    // setIsLoading(false);
  };

  return (
    <div className={`${styles.pickedup_page}`}>
      <ExtComps
        isTableLoaded={isTableLoaded}
        setIsTableLoaded={setIsTableLoaded}
        sucBox={sucBox}
        setSucBox={setSucBox}
        setFailBox={setFailBox}
        failBox={failBox}
        confBox={confBox}
        deleteHandler={deleteHandler}
        category={category}
        setConfBox={setConfBox}
        setCategory={setCategory}
      />
      <div className="m-2 flex flex-col gap-2 items-center w-[100%]">
        <div className="flex gap-2 items-center justify-between px-8 outline-none mt-5 w-[100%]">
          {/* <div className={`${styles.search_bar_wrap}`}>
            <input
              onChange={(e) => setSearchValue(e.target.value)}
              className="text-sm"
              type="text"
              placeholder="Search Model"
              value={searchValue}
            />
            <IoMdSearch onClick={() => getDataBySearch()} />
          </div>
          <div className={styles.icons_box}>
            <IoRefresh onClick={handleSearchClear} className="" size={25} />
          </div> */}
          {/* <button
            className={`${styles.bulkdown_button}`}
            onClick={() => downloadExcel(data)}
          >
            <FaDownload /> Bulk Download
          </button> */}

          <div className="flex gap-2 my-4">
            <p className="font-medium">Select Brand</p>
            <select
              name=""
              id=""
              className="bg-[#EC2752] text-white rounded-lg outline-none px-2 py-1"
              onChange={handleBrandChange}
              value={selectedBrand?._id || ""}
            >
              <option value="" className="bg-white text-[#EC2752] font-medium">
                Choose Brand
              </option>
              {brandList?.map((item, index) => (
                <option
                  key={index}
                  className="bg-white text-[#EC2752] font-medium"
                  value={item._id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 my-4">
            <p className="font-medium">Select Device</p>
            <select
              className="bg-[#EC2752] text-white rounded-lg outline-none px-2 py-1"
              onChange={handleModelChange}
              value={
                selectedDevice?._id
                  ? `${selectedDevice._id}|${selectedDevice.selectedConfig?._id}`
                  : ""
              }
            >
              <option value="" className="bg-white text-[#EC2752] font-medium">
                Choose Device
              </option>
              {deviceList?.map((device) =>
                device.config.map((config) => (
                  <option
                    key={config._id}
                    className="bg-white text-[#EC2752] font-medium"
                    value={`${device._id}|${config._id}`} // Pass both device and config IDs
                  >
                    {`${device.name} (${config.storage} , ${config.RAM})`}
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            className={`${styles.bulkdown_button}`}
            onClick={() => {
              setUploadBox(true);
            }}
          >
            <FaUpload /> Bulk Upload
          </button>
        </div>
      </div>

      {uploadBox && (
        <div className="fixed top-0 left-0 z-48 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div
            className={`${styles.err_mod_box} w-full max-w-lg p-6 bg-white rounded-lg shadow-lg`}
          >
            <form className="flex flex-col gap-4" onSubmit={handleBulkSubmit}>
              <div className="flex flex-col">
                <p className="mb-1 text-lg text-center text-slate-500">
                  Upload QNA Sheet
                </p>
                <div className="flex gap-2 my-4">
                  <p className="font-medium">Select Brand</p>
                  <select
                    name=""
                    id=""
                    className="bg-[#EC2752] text-white rounded-lg outline-none px-2 py-1"
                    onChange={(e) => setBrandID(e.target.value)}
                  >
                    <option
                      value=""
                      className="bg-white text-[#EC2752] font-medium"
                    >
                      Choose Brand
                    </option>
                    {brandList?.map((item, index) => (
                      <option
                        key={index}
                        className="bg-white text-[#EC2752] font-medium"
                        value={item._id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="file"
                  name="excelFile"
                  id="excelFile"
                  accept=".xlsx, .xls"
                  onChange={(e) => handleExcelFileChange(e)}
                  required={true}
                />
              </div>
              <div className="flex flex-row gap-2">
                <button
                  type="submit"
                  className="bg-[#EC2752] text-white px-4 py-2 rounded"
                >
                  Upload
                </button>
                <button
                  type="reset"
                  onClick={() => {
                    setUploadBox(false);
                    setIsTableLoading(false);
                  }}
                  className="bg-white text-[#EC2752] px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedBrand && selectedDevice ? (
        <div className={`${styles.pd_cont}`}>
          {questions?.length > 0 ? (
            <div className="flex flex-col gap-2 mt-4 px-2 md:flex-row justify-between space-y-4 md:space-y-0">
              <div className="md:w-2/3 p-4 bg-white shadow-2xl">
                <h1 className="text-2xl text-center font-semibold mb-2">
                  Tell us more about your device?
                </h1>
                <p className="text-base text-gray-500 text-center font-semibold mb-4">
                  Please answer a few questions about your device.
                </p>
                {questions.map((item, index) => (
                  <div
                    key={item._id}
                    className="mb-3 p-3 bg-gray-100 rounded-lg"
                  >
                    <h2 className="text-lg font-medium mb-2">
                      {index + 1}.{item.question}
                    </h2>
                    <div className="flex space-x-4">
                      {item.options.map((option) => (
                        <label
                          key={option.answer}
                          className="flex items-center"
                        >
                          <input
                            type="radio"
                            name={item.question}
                            value={option.answer}
                            checked={
                              answers?.find(
                                (ans) => ans.question === item.question
                              )?.answer.answer === option.answer
                            }
                            onChange={() =>
                              handleChange(
                                item._id,
                                option.answer,
                                option.per,
                                item.question
                              )
                            }
                            className="mr-2"
                          />
                          <span>{option.answer}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-0 mb-4 flex justify-center ">
                  {page > 0 && (
                    <button
                      className={`mx-2 px-6 py-2 rounded-lg ${"bg-[#EC2752]  cursor-pointer text-white"}`}
                      onClick={handlePrev}
                    >
                      Back
                    </button>
                  )}

                  {page === maxPages - 1 ? (
                    <button
                      className="mx-2 px-4 py-2 rounded-lg bg-[#EC2752]  cursor-pointer text-white"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      className="mx-2 px-4 py-2 rounded-lg bg-[#EC2752]  cursor-pointer text-white"
                      onClick={handleNext}
                    >
                      Continue
                    </button>
                  )}
                </div>
                {/* {page === maxPages ? (
                  <div className="fixed bottom-0 flex justify-center gap-2 p-3 bg-white border-t-2">
                    <div
                      onClick={handleSubtract}
                      className={`bg-[#EC2752] w-[30%] px-6 py-2 rounded-lg flex items-center justify-center`}
                    >
                      <ImArrowLeft color="white" size={20} />
                    </div>
                    <div
                      onClick={handlesubmit}
                      className="bg-[#EC2752] w-[70%] relative text-center py-1 px-2 rounded-lg cursor-pointer flex justify-between text-white items-center"
                    >
                      {isLoading && (
                        <CgSpinner
                          size={20}
                          className="absolute left-[18%] top-[8px] mt-1 animate-spin"
                        />
                      )}
                      <p className="w-full p-1 text-xl font-medium">
                        {isLoading ? "Submitting" : "Submit"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="fixed bottom-0 justify-center flex w-full gap-2 p-3 bg-white border-t-2">
                    {page > 0 && page <= 6 && (
                      <button
                        onClick={handlePrev}
                        className={`  ${
                          page < 2
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-[#EC2752] cursor-pointer"
                        }  w-[30%] px-6 py-2 rounded-lg flex items-center justify-center`}
                      >
                        <ImArrowLeft color="white" size={20} />
                      </button>
                    )}
                    <div
                      onClick={handleNext}
                      className="bg-[#EC2752] w-[70%] py-1 px-2 text-center rounded-lg cursor-pointer flex justify-between text-white items-center"
                    >
                      <p className="w-full p-1 text-xl font-medium">Continue</p>
                    </div>
                  </div>
                )} */}
              </div>

              <div className="md:w-1/3 p-4 bg-blue-50 rounded-lg shadow-md">
                <div className="flex gap-2 items-center justify-center border-b-2 pb-2">
                  <img src={selectedBrand?.logo} alt="" className="h-10 w-10" />
                  <h2 className="text-2xl text-center font-semibold">
                    {selectedBrand?.name}
                  </h2>
                </div>
                {/* {Object.keys(answers).length > 0 && (
              <h2 className="text-xl font-semibold mb-4">Device Evaluation</h2>
            )} */}
                <div className="pt-2">
                  {answers.map((answerData, index) => (
                    <div key={index} className="mb-4 text-sm">
                      <p>Q. {answerData?.question}</p>
                      <p>
                        A. {answerData?.answer.answer} (Percentage:{" "}
                        {answerData?.answer.per}%)
                      </p>
                      <hr className="my-4 border-gray-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <h3 className="text-center text-xl font-semibold">
              No question uploaded for this brand!!
            </h3>
          )}
        </div>
      ) : (
        <h3 className="text-center text-xl font-semibold">
          Please select a brand and a device
        </h3>
      )}
    </div>
  );
};

const ExtComps = ({
  isTableLoaded,
  setIsTableLoaded,
  sucBox,
  setSucBox,
  setFailBox,
  failBox,
  confBox,
  deleteHandler,
  setConfBox,
  category,
  setCategory,
}) => {
  const [sideMenu, setsideMenu] = useState(false);
  return (
    <React.Fragment>
      <div className="flex items-center w-screen h-16 py-4 bg-white border-b-2 HEADER ">
        <div className="navbar">
          <AdminNavbar
        setsideMenu={setsideMenu}
        sideMenu={sideMenu}
        onActiveDbChange={updateActiveDb}
    />
          <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
        </div>
      </div>
      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color={"#EC2752"} loading={isTableLoaded} size={15} />
        </div>
      )}
      {(sucBox || failBox) && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${getTextColorClass(sucBox)}`}>
            {sucBox ? (
              <IoIosCheckmarkCircle
                className={`${getTextColorClass(sucBox)}`}
                size={90}
              />
            ) : (
              <IoIosCloseCircle
                className={`${getTextColorClass(sucBox)}`}
                size={90}
              />
            )}
            <h6 className={`${getTextColorClass(sucBox)}`}>
              {sucBox ? "Success!" : "Error!"}
            </h6>
            <p className="text-slate-500">{errMsg}</p>
            <button
              onClick={() => {
                setSucBox(false);
                setFailBox(false);
              }}
              className={sucBox ? "bg-green-500 text-white" : grestTheme}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {confBox && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${getTextColorClass(sucBox)}`}>
            <h6 className={`${getTextColorClass(sucBox)}`}>Confirmation!</h6>
            <p className="text-slate-500">
              {`Do you want to delete store - ${selectedModel} ?`} ?
            </p>
            <div className="flex flex-row gap-2">
              <button
                onClick={() => deleteHandler(selectedModel)}
                className={grestTheme}
              >
                Okay
              </button>
              <button
                onClick={() => {
                  setConfBox(false);
                  setIsTableLoaded(false);
                }}
                className="bg-white text-[#EC2752]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <div className="m-2 flex  gap-2 items-center w-[100%]">
        <div className="flex gap-2">
          <p className="font-medium">Select Category</p>
          <select
            className="bg-[#EC2752] text-white rounded-lg outline-none px-2 py-1"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option
              className="bg-white text-[#EC2752] font-medium"
              value="Mobile"
            >
              Mobile
            </option>
            <option
              className="bg-white text-[#EC2752] font-medium"
              value="Watch"
            >
              Watch
            </option>
          </select>
        </div>
      </div> */}
    </React.Fragment>
  );
};

export default AdminQuestion;
