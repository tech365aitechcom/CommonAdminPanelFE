import React, { useState, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../Admin_Navbar";
import SideMenu from "../SideMenu";

import { MdEdit, MdDeleteForever } from "react-icons/md";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

const downloadSheet = (apiData, downloadType) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const defaultGroups = [
    "warrenty",
    "core",
    "display",
    "functionalMajor",
    "functionalMinor",
    "cosmetics",
    "functional",
    "accessories",
  ];

  const formattedData =
    downloadType === "sample"
      ? [
          Object.fromEntries(
            [
              "deviceType",
              ...defaultGroups.flatMap((g) => [`${g}Code`, `${g}Condition`]),
              "grade",
            ].map((key) => [key, ""])
          ),
        ]
      : apiData.map((item) => {
          const row = {
            deviceType: item.deviceType || "",
            grade: item.grade || "",
          };

          // Flatten conditions into code + reason pairs
          item.conditions?.forEach((cond) => {
            const group = cond.group;
            row[`${group}Code`] = cond.code?.code || cond.code || "";
            row[`${group}Condition`] = cond.reason || "";
          });

          if (downloadType === "updateSheet") {
            row.id = item._id;
          }

          return row;
        });

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = {
    Sheets: { data: ws },
    SheetNames: ["data"],
  };

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: fileType });

  saveAs(dataBlob, `ConditionSheet_${downloadType}${fileExtension}`);
};

const Conditions = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadMode, setUploadMode] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
    const { category } = useParams();
    const [sideMenu, setsideMenu] = useState(false);
  const [groups, setGroups] = useState([]);

  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("authToken");
  const [activeDB, setActiveDB] = useState(sessionStorage.getItem("activeDB") || "");

const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
};
  const [newCondition, setNewCondition] = useState({
    id: "",
    grade: "",
    deviceType: category,
    groupValues: {}, // { Warranty: { codeId: "abc123", reason: "Something" }, ... }
  });

  useEffect(() => {
    fetchConditions();
    getCategories();
    fetchGroups();
  }, [activeDB]);
  useEffect(() => {
    fetchConditions();
  }, [category]);
  const fetchConditions = () => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/getAll?deviceType=${category}`, {
        headers: { Authorization: `${userToken}`, activeDB: activeDB },
      })
      .then((res) => {
        setConditions(res?.data?.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/group/getGroups`, {
          headers: { Authorization: userToken, activeDB },
        });
        setGroups(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch groups");
      }
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
      const handleDeviceCategory = (e) => {
        // setCategory(e.target.value);
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
          ? `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/bulkAdd`
          : `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/bulkUpdate`;
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${userToken}`,
          activeDB: activeDB,
        },
      });
      fetchConditions();
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

  const handleAddCondition = () => {
    setIsLoading(true);

    const conditions = Object.entries(newCondition.groupValues || {}).map(([group, { codeId, reason }]) => ({
      group,
      code: codeId,
      reason,
    }));

    const payload = {
      id: newCondition.id,
      deviceType: newCondition.deviceType,
      grade: newCondition.grade,
      conditions,
    };

    const endpoint = isEditing
      ? `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/update`
      : `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/create`;

    axios
      .post(endpoint, payload, {
        headers: { Authorization: `${userToken}`, activeDB: activeDB },
      })
      .then(() => {
        fetchConditions();
        resetForm();
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleDeleteCondition = (conditionId) => {
    setIsLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/delete`,
        { conditionId },
        {
          headers: { Authorization: `${userToken}`, activeDB: activeDB },
        }
      )
      .then(() => {
        fetchConditions();
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const openEditPopup = (condition) => {
    const groupValues = {};
    (condition.conditions || []).forEach(({ group, code, reason }) => {
      groupValues[group] = {
        codeId: typeof code === "object" ? String(code._id) : String(code),
        reason,
      };
    });

    setNewCondition({
      id: condition._id,
      grade: condition.grade,
      deviceType: category,
      groupValues,
    });

    setIsPopupOpen(true);
    setIsEditing(true);
  };

  const resetForm = () => {
    setIsPopupOpen(false);
    setIsEditing(false);
    setNewCondition({
      id: "",
      grade: "",
      deviceType: category,
      groupValues: {},
    });
  };

  const formattedRows = conditions.map((entry) => {
    const row = {
      _id: entry._id,
      grade: entry.grade,
    };

    entry.conditions.forEach((cond) => {
      const group = cond.group;
      row[`${group}_code`] = cond.code?.code || "-";
      row[`${group}_reason`] = cond.reason || "-";
    });

    return row;
  });
  const dynamicKeys = new Set(["grade"]); // Always include grade

  formattedRows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== "_id") {
        dynamicKeys.add(key);
      }
    });
  });

  const keysWithData = Array.from(dynamicKeys);
  const columnLabels = {
    grade: "Grade",
  };

  keysWithData.forEach((key) => {
    if (key.endsWith("_code")) {
      const group = key.replace("_code", "");
      columnLabels[key] = `${group} Code`;
    } else if (key.endsWith("_reason")) {
      const group = key.replace("_reason", "");
      columnLabels[key] = `${group} Reason`;
    }
  });

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
      <div className="flex flex-col items-center py-8 justify-start bg-slate-100 min-h-screen">
        <div className="flex flex-col w-full max-w-7xl px-8">
          {/* Header Section */}
          <div className="relative mb-6 flex flex-col gap-2 border-b-2 pb-2">
            <p className="text-4xl font-bold text-gray-800">
              Manage Conditions -{" "}
              <span className="text-primary">
                {categories.find((item) => item.categoryCode === category)
                  ?.categoryName || "Category not found"}
              </span>{" "}
            </p>
          </div>

          <div className="flex gap-4 mb-8 items-center">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="font-medium text-sm text-white p-3 rounded bg-primary"
            >
              Add New Condition
            </button>
            <button
              onClick={() => downloadSheet(conditions, "Bulk Sheet")}
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
          </div>

          {/* Conditions Display */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse border border-gray-300 rounded-lg shadow-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 border">Actions</th>
                  {keysWithData.map((key) => (
                    <th key={key} className="px-6 py-3 border">
                      {columnLabels[key] || key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {formattedRows.map((row) => (
                  <tr key={row._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 border flex gap-4">
                      <button
                        onClick={() => {
                          const original = conditions.find(c => c._id === row._id);
                          openEditPopup(original);
                        }}
                        className="text-primary"
                      >
                        <MdEdit size={24} />
                      </button>
                      <button onClick={() => handleDeleteCondition(row._id)} className="text-primary">
                        <MdDeleteForever size={24} />
                      </button>
                    </td>
                    {keysWithData.map((key) => (
                      <td key={key} className="px-6 py-3 border text-sm text-gray-600">
                        {row[key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
                  onClick={() => downloadSheet(conditions, "Bulk Sheet")}
                  className="font-medium text-sm text-white py-3 px-8 rounded bg-primary"
                >
                  Sample Sheet
                </button>
              ) : (
                <button
                  onClick={() => downloadSheet(conditions, "updateSheet")}
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

      {isPopupOpen && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-lg relative w-full max-w-4xl">
            {/* Close Button */}
            <IoClose
              size={24}
              className="absolute top-4 right-4 text-primary cursor-pointer hover:text-red-500 transition-all"
              onClick={resetForm}
            />

            {/* Modal Title */}
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditing ? "Edit Condition" : "Add New Condition"}
            </h3>

            {/* Form Fields */}
            <div className="max-h-[60vh] overflow-y-auto mb-6 pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {groups.map((group) => {
                  const currentGroupKey = group.name;
                  const selectedValue = newCondition.groupValues?.[currentGroupKey]?.codeId || "";
                  const selectedReason = newCondition.groupValues?.[currentGroupKey]?.reason || "";

                  return (
                    <div
                      key={currentGroupKey}
                      className="border border-gray-200 rounded-2xl shadow-sm p-6 bg-white space-y-4"
                    >
                      <h4 className="text-xl font-semibold text-gray-800 border-b pb-2">
                        {group.name}
                      </h4>

                      {/* Code Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Code
                        </label>
                        <select
                          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          value={selectedValue}
                          onChange={(e) => {
                            const selectedCodeId = e.target.value;
                            const selectedReason =
                              group.codes.find((code) => code._id === selectedCodeId)?.description || "";
                            setNewCondition((prev) => ({
                              ...prev,
                              groupValues: {
                                ...prev.groupValues,
                                [currentGroupKey]: {
                                  codeId: selectedCodeId,
                                  reason: selectedReason,
                                },
                              },
                            }));
                          }}
                        >
                          <option value="">-- Select Code --</option>
                          {group.codes.map((code) => (
                            <option key={code._id} value={code._id}>
                              {code.code}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Reason Display */}
                      {selectedReason && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason
                          </label>
                          <input
                            readOnly
                            className="w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg px-4 py-2 text-sm cursor-not-allowed"
                            value={selectedReason}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Grade Input (full width on small, half on sm+) */}
                <div className="border border-gray-200 rounded-2xl shadow-sm p-6 bg-white space-y-4 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Is Equal to Grade
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary px-4 py-2 text-sm"
                    value={newCondition.grade}
                    onChange={(e) =>
                      setNewCondition({
                        ...newCondition,
                        grade: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddCondition}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all mt-6"
            >
              {isEditing ? "Update Condition" : "Submit Condition"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conditions;
