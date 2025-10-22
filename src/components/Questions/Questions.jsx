import React, { useState, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../Admin_Navbar";
import SideMenu from "../SideMenu";

import { MdEdit, MdDeleteForever } from "react-icons/md";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

const downloadSheet = (apiData, downloadType) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const formattedData =
    downloadType === "sample"
      ? [
          {
            group: "",
            quetion: "",
            yes: "",
            no: "",
            default: "",
            viewOn: "",
            caption: "",
            img: "",
            type: "",
            quick: "",
          },
        ]
      : apiData.flatMap((item) =>
          item.options.map((op) => {
            if (downloadType === "updateSheet") {
              return {
                id: item?._id,
                group: item?.group?.name || null,
                quetion: item?.quetion || null,
                yes: item?.yes || null,
                no: item?.no || null,
                default: item?.default || null,
                viewOn: item?.viewOn || null,
                caption: op?.caption || null,
                img: op?.img || null,
                Newcaption: op?.caption || null,
                Newimg: op?.img || null,
                type: item?.type || null,
                quick: item?.quick|| null,
              };
            } else {
              return {
                group: item?.group?.name || null,
                quetion: item?.quetion || null,
                yes: item?.yes || null,
                no: item?.no || null,
                default: item?.default || null,
                viewOn: item?.viewOn || null,
                caption: op?.caption || null,
                img: op?.img || null,
                type: item?.type || null,
                quick: item?.quick|| null,
                updatedat: new Date(item?.updatedAt).toLocaleDateString(
                  "en-IN"
                ),
              };
            }
          })
        );

  const wsLeadsCompleted = XLSX.utils.json_to_sheet(formattedData);
  const wbLeadsCompleted = {
    Sheets: { data: wsLeadsCompleted },
    SheetNames: ["data"],
  };

  const excelBufferLeadsCompleted = XLSX.write(wbLeadsCompleted, {
    bookType: "xlsx",
    type: "array",
  });

  const dataFileLeadsCompleted = new Blob([excelBufferLeadsCompleted], {
    type: fileType,
  });
  saveAs(dataFileLeadsCompleted, "Questions " + downloadType + fileExtension);
};

const Questions = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [questions, setQuestions] = useState([]);
    const Device = sessionStorage.getItem("DeviceType");
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [sideMenu, setsideMenu] = useState(false);
  const [uploadMode, setUploadMode] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
    const { category } = useParams();
  const [images, setImages] = useState([]);
  const [imagesBox, setImagesBox] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [groups, setGroups] = useState([]);

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Adjust delay as needed (300ms is common)
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
    useEffect(() => {
      if (debouncedSearchTerm) {
        fetchQuestions();
      }
    }, [debouncedSearchTerm]);
  const [newQuestion, setNewQuestion] = useState(
    {
      id:"",
      type: category,
      quetion: "",
      group: "",
      yes: "",
      no: "",
      default: "",
      viewOn: "",
      quick: false,
      options: [
        {
          img: "",
          caption: "",
        },
      ],
    },
  );
const [newQuestions, setNewQuestions] = useState([
  {
    type: category,
    quetion: "",
    group: "",
    yes: "",
    no: "",
    default: "",
    // viewOn: "",
    quick: false,
    options: [
      {
        img: "",
        caption: "",
      },
    ],
  },
]);
useEffect(() => {
console.log(newQuestions)
},[newQuestions])
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("authToken");
  const [activeDB, setActiveDB] = useState(sessionStorage.getItem("activeDB") || "");

const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
};
  useEffect(() => {
    fetchQuestions();
    getCategories();
    fetchGroups();
  }, [activeDB]);
  useEffect(() => {
    fetchQuestions();
  }, [category]);

    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/group/getGroupsByCategory?category=${category}`, {
          headers: { Authorization: userToken, activeDB },
        });
        setGroups(res.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch groups");
        setIsLoading(false);
      }
    };

  const fetchQuestions = () => {
    setIsLoading(true);
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/questionnaires/findAll?type=${category}&search=${debouncedSearchTerm}`,
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB,
          },
        }
      )
      .then((res) => {
        setQuestions(res?.data?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
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
  //   const handleDeviceCategory = (e) => {
  //     setCategory(e.target.value);
  // };
  const handleAddQuestions = () => {
    setIsLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/questionnaires/createMultiple`,
        { questions: newQuestions },
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB,
          },
        }
      )
      .then(() => {
        fetchQuestions();
        setIsPopupOpen(false);
        resetForm();
        setIsLoading(false);
      })
      .catch((err) => console.error(err)).finally(() => {
            setIsLoading(false);
      })
  };

  const handleEditQuestion = () => {
    setIsLoading(true);
    const endpoint =`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/questionnaires/edit`
    const method = "put";
    axios[method](endpoint, newQuestion, {
      headers: {
        Authorization: `${userToken}`,
        activeDB: activeDB,
      },
    })
      .then(() => {
        fetchQuestions();
        setIsEditBoxOpen(false);
        setNewQuestion({
          type: category,
          quetion: "",
          group: "",
          yes: "",
          no: "",
          default: "",
          viewOn: "",
          quick: false,
          options: [
            {
              img: "",
              caption: "",
            },
          ],
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const openEditPopup = (question) => {
    setIsEditBoxOpen(true);
    setIsEditing(true);
    setCurrentQuestions(question);
    setNewQuestion({
      id:question._id,
      type: question.type,
      quetion: question.quetion,
      group: question.group?._id,
      yes: question.yes,
      no: question.no,
      default: question.default,
      viewOn: question.viewOn,
      quick: question.quick,
      options:
        question.options.length > 0
          ? [...question.options]
          : [{ img: "", caption: "" }],
    });
  };
  const resetForm = () => {
    setIsPopupOpen(false);
    setIsEditBoxOpen(false);
    setIsEditing(false); // Ensure editing state is also reset
    setNewQuestions([
      {
        type: category,
        quetion: "",
        group: "",
        yes: "",
        no: "",
        default: "",
        viewOn: "",
        quick: false,
        options: [
          {
            img: "",
            caption: "",
          },
        ],
      },
    ]);
     setNewQuestion(
       {
         type: category,
         quetion: "",
         group: "",
         yes: "",
         no: "",
         default: "",
         viewOn: "",
         quick: false,
         options: [
           {
             img: "",
             caption: "",
           },
         ],
       },
     );
  };
  const handleDelete = (questionId) => {
    setIsLoading(true);
    axios
      .delete(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/questionnaires/deleteById`,
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB,
          },
          data: { id: questionId }, // Pass the data here
        }
      )
      .then((res) => {
        fetchQuestions();
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the input click
    }
  };
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint =
        uploadMode === 1
          ? `${
              import.meta.env.VITE_REACT_APP_ENDPOINT
            }/api/questionnaires/bulkAdd`
          : `${
              import.meta.env.VITE_REACT_APP_ENDPOINT
            }/api/questionnaires/bulkUpdate`;
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${userToken}`,
          activeDB: activeDB,
        },
      });
      fetchQuestions();
      alert("File uploaded successfully.");
      console.log(response.data);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload file.");
    } finally {
      setUploadMode(0);
      setLoading(false);
    }
  };
    const handleNext = (category) => {
      navigate("/conditions/" + category);
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
     formData.append("category", Device);
     Array.from(images).forEach((file) => formData.append("files", file));

     await axios.post(
       `${
         import.meta.env.VITE_REACT_APP_ENDPOINT
       }/api/questionnaires/bulkuploadQuesImage`,
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
     fetchQuestions();
     setImagesBox(false);
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
          setsideMenu={setsideMenu}
          sideMenu={sideMenu}
          onActiveDbChange={updateActiveDb}
        />
        <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
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
          {/* Header Section */}
          <div className="relative mb-6 flex items-center justify-between gap-2 border-b-2 pb-2 mx-10">
            <p className="text-4xl font-bold">
              Manage Questions -{" "}
              <span className="text-primary">
                {
                  categories.find((item) => item.categoryCode === category)
                    ?.categoryName
                }
              </span>
            </p>

            <button
              onClick={() => handleNext(Device)}
              className=" w-20 font-medium text-sm text-white px-4 py-2 rounded bg-blue-500"
            >
              Next
            </button>
          </div>

          {/* Controls */}
          <div className="ml-10 flex gap-4 items-center">
            {/* <select
              name="category"
              id="category"
              className="font-medium text-sm text-white p-3 rounded bg-primary"
              onChange={handleDeviceCategory}
            >
              {categories.map((cat) => (
                <option
                  className="bg-white text-primary"
                  key={cat?._id}
                  value={cat?.categoryCode}
                >
                  {cat?.categoryName}
                </option>
              ))}
            </select> */}
            <button
              onClick={() => setIsPopupOpen(true)}
              className="font-medium text-sm text-white p-3 rounded bg-primary"
            >
              Add New Question
            </button>
            <button
              onClick={() => downloadSheet(questions, "Bulk Sheet")}
              className="font-medium text-sm text-white p-3 rounded bg-primary"
            >
              Bulk Download
            </button>
            <button
              onClick={() => setUploadMode(1)}
              className="font-medium text-sm text-white p-3 rounded bg-primary"
            >
              Bulk Upload
            </button>
            <button
              onClick={() => setUploadMode(2)}
              className="font-medium text-sm text-white p-3 rounded bg-primary"
            >
              Bulk Update
            </button>
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
              placeholder="Search Questions"
              className="border-2 px-3 py-2 rounded-lg outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Questions Display */}
          <div className="mt-8 mx-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {questions.map((q, qid) => (
              <div
                key={q?._id}
                className={`border rounded-lg shadow-lg p-4 ${
                  qid % 2 === 0 ? "bg-pink-50" : "bg-white"
                }`}
              >
                {/* Question Header */}
                <div className="flex justify-between items-center mb-4">
                  <p className="font-bold text-gray-700">{q?.quetion}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditPopup(q)}
                      className="text-primary"
                    >
                      <MdEdit size={24} />
                    </button>
                    <button
                      onClick={() => handleDelete(q?._id)}
                      className="text-primary"
                    >
                      <MdDeleteForever size={24} />
                    </button>
                  </div>
                </div>

                {/* Question Details */}
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Group:</strong> {q?.group?.name}
                  </p>
                  <p>
                    <strong>Yes:</strong> {q?.yes}
                  </p>
                  <p>
                    <strong>No:</strong> {q?.no}
                  </p>
                  <p>
                    <strong>Default:</strong> {q?.default}
                  </p>
                  <p>
                    <strong>Index:</strong> {q?.viewOn}
                  </p>
                  <p>
                    <strong>Quick Quote:</strong> {q?.quick ? "Yes" : "No"}
                  </p>
                </div>

                {/* Options Section */}
                {q?.options && q?.options.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 mb-2">Options:</p>
                    {q?.options.map((op) => (
                      <div
                        key={op?._id}
                        className="p-2 border rounded-md bg-gray-50 mb-2"
                      >
                        <p>
                          <strong>Caption:</strong> {op?.caption}
                        </p>
                        <p>
                          <img src={op?.img} alt={"Image: " + op?.img} />
                          {/* <strong>Image:</strong> {op.img || "No Image"} */}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* No Questions Found */}
            {questions.length === 0 && (
              <div className="text-center text-gray-500 py-4 col-span-full">
                No questions found.
              </div>
            )}
          </div>
        </div>
      </div>
      {uploadMode && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-[400px]">
            <IoClose
              size={24}
              className="absolute top-3 right-3 text-primary cursor-pointer"
              onClick={() => setUploadMode(0)}
            />
            <h3 className="text-xl font-bold text-center mb-4 mt-2">
              {uploadMode === 1 ? "Bulk Upload" : "Bulk Update"}
            </h3>
            <p className="text-sm text-center">
              {uploadMode === 1
                ? "Note: Download sample sheet, fill details and then upload it."
                : "Note: Download update sheet, update sheet without changing ID's & deviceType and then upload it."}
            </p>
            <div
              onClick={handleDivClick}
              className="flex flex-row justify-center mt-4 p-3 font-medium text-sm rounded bg-primary text-white"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? file.name : "Choose Excel Sheet"}
            </div>
            <div className="flex flex-row w-full items-center justify-between mt-4 mb-4">
              {uploadMode === 1 ? (
                <button
                  onClick={() => downloadSheet(questions, "sample")}
                  className="font-medium text-sm text-white py-3 px-8 rounded bg-primary"
                >
                  Sample Sheet
                </button>
              ) : (
                <button
                  onClick={() => downloadSheet(questions, "updateSheet")}
                  className="font-medium text-sm text-white py-3 px-8 rounded bg-primary"
                >
                  Update Sheet
                </button>
              )}
              <button
                onClick={handleUpload}
                disabled={loading}
                className="font-medium text-sm text-white py-3 px-8 rounded bg-primary"
              >
                {loading ? "Uploading..." : "Upload File"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditBoxOpen && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto w-full sm:w-[90%] md:w-[70%] lg:w-[50%]">
            <IoClose
              size={24}
              className="absolute top-4 right-4 text-primary cursor-pointer hover:text-primary-dark transition-all"
              onClick={() => resetForm()}
            />
            <h3 className="text-xl font-bold mb-6 text-center">
              {isEditing ? "Edit Question" : "Add New Question"}
            </h3>
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="flex-1 mb-4 sm:mb-0">
                <label className="block font-medium text-sm text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  className="border-2 px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary"
                  value={newQuestion?.quetion}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      quetion: e.target.value,
                    })
                  }
                  placeholder="Enter your question here"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium text-sm text-gray-700 mb-2">
                  Group
                </label>
                <select
                  className="border-2 px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary"
                  value={newQuestion?.group}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      group: e.target.value,
                      yes: "",
                      no: "",
                      default: "", // Reset codes if group changes
                    })
                  }
                >
                  <option value="" disabled>
                    Select a Group
                  </option>
                  {groups.map((group) => (
                    <option key={group?._id} value={group?._id}>
                      {group?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {["yes", "no", "default"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block font-medium text-sm text-gray-700 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <select
                    className="border-2 px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary"
                    value={newQuestion[field]}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        [field]: e.target.value,
                      })
                    }
                  >
                    <option value="">Select a code</option>
                    {groups
                      .find((grp) => grp._id === newQuestion.group)
                      ?.codes?.map((code) => (
                        <option key={code?._id} value={code?.code}>
                          {code?.code} - {code?.description}
                        </option>
                      ))}
                  </select>
                </div>
              ))}
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newQuestion.quick}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, quick: e.target.checked })
                  }
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
                <label className="text-sm text-gray-700 font-medium">
                  Mark as Quick Quote
                </label>
              </div>
              <div className="mb-4">
                <label className="block font-medium text-sm text-gray-700 mb-2">
                  Index
                </label>
                <input
                  type="text"
                  className="border-2 px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary"
                  value={newQuestion?.viewOn}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      viewOn: e.target.value,
                    })
                  }
                  placeholder="Enter view index"
                />
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">Options</h4>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex gap-4 items-end mb-4">
                  <div className="flex-1">
                    <label className="block font-medium text-sm text-gray-700 mb-2">
                      Option Caption
                    </label>
                    <input
                      type="text"
                      className="border-2 px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary"
                      value={option.caption}
                      onChange={(e) => {
                        const updatedOptions = [...newQuestion.options];
                        updatedOptions[index].caption = e.target.value;
                        setNewQuestion({
                          ...newQuestion,
                          options: updatedOptions,
                        });
                      }}
                      placeholder="Enter option caption"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-sm text-gray-700 mb-2">
                      Option Image
                    </label>
                    <input
                      type="text"
                      className="border-2 px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary"
                      value={option.img}
                      onChange={(e) => {
                        const updatedOptions = [...newQuestion.options];
                        updatedOptions[index].img = e.target.value;
                        setNewQuestion({
                          ...newQuestion,
                          options: updatedOptions,
                        });
                      }}
                      placeholder="Enter image URL"
                    />
                  </div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 mb-2 rounded-md"
                    onClick={() => {
                      const updatedOptions = newQuestion.options.filter(
                        (_, i) => i !== index
                      );
                      setNewQuestion({
                        ...newQuestion,
                        options: updatedOptions,
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg mb-6 hover:bg-primary-dark transition-all"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    options: [...newQuestion.options, { caption: "", img: "" }],
                  })
                }
              >
                Add Option
              </button>
            </div>

            <button
              onClick={handleEditQuestion}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium text-lg hover:bg-primary-dark transition-all"
            >
              {isEditing ? "Update Question" : "Add Question"}
            </button>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto w-full sm:w-[80%] md:w-[70%] lg:w-[50%]">
            <IoClose
              size={24}
              className="absolute top-4 right-4 text-primary cursor-pointer"
              onClick={() => resetForm()}
            />
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Add Multiple Questions
            </h3>
            <h3 className="text-lg font-medium text-neutral-600 mb-6 text-center">
              Note - Questions will show in the order you add them, you can
              change the order later by editing.
            </h3>

            {newQuestions.map((question, qIndex) => (
              <div key={qIndex} className="mb-6 border-b pb-4">
                <h4 className="font-semibold mb-2 text-lg">
                  Question {qIndex + 1}
                </h4>

                <div className="flex flex-wrap justify-between gap-6">
                  <div className="mb-4 w-full sm:w-3/4">
                    <label className="block text-sm font-medium mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      className="border-2 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary transition-all"
                      value={question?.quetion}
                      onChange={(e) => {
                        const updatedQuestions = [...newQuestions];
                        updatedQuestions[qIndex].quetion = e.target.value;
                        setNewQuestions(updatedQuestions);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-full">
                      <label className="text-sm font-medium mb-2 mr-10">
                        Group
                      </label>
                    <select
                      className="border-2 px-4 p-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary transition-all"
                      value={question.group}
                      onChange={(e) => {
                        const updatedQuestions = [...newQuestions];
                        updatedQuestions[qIndex].group = e.target.value;
                        updatedQuestions[qIndex].yes = "";
                        updatedQuestions[qIndex].no = "";
                        updatedQuestions[qIndex].default = "";
                        setNewQuestions(updatedQuestions);
                      }}
                    >
                      <option value="" disabled>Select a Group</option>
                      {groups.map((group) => (
                        <option key={group._id} value={group._id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    </div>
                    <button
                      onClick={() => navigate("/groups")}
                      className="w-full bg-primary text-white py-2 rounded-md font-medium mt-6"
                      >
                      Add Group
                    </button>
                    </div>
                  </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {["yes", "no", "default"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-2">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <select
                        className="border-2 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary transition-all"
                        value={question[field]}
                        onChange={(e) => {
                          const updatedQuestions = [...newQuestions];
                          updatedQuestions[qIndex][field] = e.target.value;
                          setNewQuestions(updatedQuestions);
                        }}
                      >
                        <option value="">Select a code</option>
                        {groups
                          .find((g) => g._id === question.group)
                          ?.codes?.map((code) => (
                            <option key={code?._id} value={code.code}>
                              {code?.code} - {code?.description}
                            </option>
                          ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="my-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={question.quick}
                    onChange={(e) => {
                      const updatedQuestions = [...newQuestions];
                      updatedQuestions[qIndex].quick = e.target.checked;
                      setNewQuestions(updatedQuestions);
                    }}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <label className="text-sm text-gray-700 font-medium">
                    Mark as Quick Quote
                  </label>
                </div>

                <h5 className="font-semibold mt-6 text-lg">Options</h5>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-6 items-center mb-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Caption"
                        className="border-2 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary transition-all"
                        value={option.caption}
                        onChange={(e) => {
                          const updatedOptions = [...question.options];
                          updatedOptions[oIndex].caption = e.target.value;
                          const updatedQuestions = [...newQuestions];
                          updatedQuestions[qIndex].options = updatedOptions;
                          setNewQuestions(updatedQuestions);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="border-2 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary transition-all"
                        value={option.img}
                        onChange={(e) => {
                          const updatedOptions = [...question.options];
                          updatedOptions[oIndex].img = e.target.value;
                          const updatedQuestions = [...newQuestions];
                          updatedQuestions[qIndex].options = updatedOptions;
                          setNewQuestions(updatedQuestions);
                        }}
                      />
                    </div>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        const updatedOptions = question.options.filter(
                          (_, i) => i !== oIndex
                        );
                        const updatedQuestions = [...newQuestions];
                        updatedQuestions[qIndex].options = updatedOptions;
                        setNewQuestions(updatedQuestions);
                      }}
                    >
                      Remove Option
                    </button>
                  </div>
                ))}

                <button
                  className="bg-primary text-white px-4 py-2 rounded-md mt-4 w-full sm:w-auto"
                  onClick={() => {
                    const updatedQuestions = [...newQuestions];
                    updatedQuestions[qIndex].options.push({
                      caption: "",
                      img: "",
                    });
                    setNewQuestions(updatedQuestions);
                  }}
                >
                  Add Option
                </button>

                <button
                  className="bg-red-500 text-white ml-4 px-4 py-2 rounded-md mt-4 w-full sm:w-auto"
                  onClick={() => {
                    const updatedQuestions = newQuestions.filter(
                      (_, i) => i !== qIndex
                    );
                    setNewQuestions(updatedQuestions);
                  }}
                >
                  Remove Question
                </button>
              </div>
            ))}

            <button
              className="bg-primary text-white px-6 py-3 rounded-md mt-6 w-full sm:w-auto"
              onClick={() =>
                setNewQuestions([
                  ...newQuestions,
                  {
                    type: category,
                    quetion: "",
                    group: "",
                    yes: "",
                    no: "",
                    default: "",
                    viewOn: "",
                    quick: false,
                    options: [{ img: "", caption: "" }],
                  },
                ])
              }
            >
              Add Another Question
            </button>

            <button
              onClick={handleAddQuestions}
              className="w-full bg-primary text-white py-3 rounded-md font-medium mt-6"
            >
              Submit Questions
            </button>
          </div>
        </div>
      )}
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

export default Questions;
