import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminNavbar from "../Admin_Navbar";
import SideMenu from "../SideMenu";
import axios from "axios";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const downloadSheet = (apiData, downloadType, categories) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const formattedData =
    downloadType === "sample"
      ? [
          {
            "Group Name": "",
            Categories: "",
            Codes: "",
          },
        ]
      : apiData.map((item) => {
          const categoryNames = item.categories
            .map((categoryCode) => {
              const category = categories.find(
                (cat) => cat.categoryCode === categoryCode
              );
              return category ? category.categoryName : categoryCode;
            })
            .join(", ");

          const groupCodes = item.codes.map((code) => code.code).join(", ");

          return {
            "Group Name": item?.name || null,
            Categories: categoryNames || null,
            Codes: groupCodes || null,
            "Last Updated": item?.updatedAt
              ? new Date(item.updatedAt).toLocaleDateString("en-IN")
              : null,
          };
        });

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  saveAs(data, "Groups " + downloadType + fileExtension);
};

const GroupMgmt = () => {
  const [groups, setGroups] = useState([]);
  const [codes, setCodes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupCodes, setGroupCodes] = useState([]);
  const [groupCategories, setGroupCategories] = useState([]);
  const [activeDB, setActiveDB] = useState(sessionStorage.getItem("activeDB") || "UnicornUAT");
  const [isEditing, setIsEditing] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [sideMenu, setsideMenu] = useState(false);
    const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
    };
  const userToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    fetchGroups();
    fetchCodes();
    fetchCategories();
  }, [activeDB]);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/group/getGroups`, {
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
        setCategories(res?.data?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const fetchCodes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/code/getAllCodes`, {
        headers: { Authorization: userToken, activeDB },
      });
      setCodes(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || groupCodes.length === 0 || groupCategories.length === 0) {
      return toast.error("Please fill all fields");
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/group/createGroup`,
        {
          name: groupName,
          codes: groupCodes,
          categories: groupCategories,
        },
        {
          headers: { Authorization: userToken, activeDB },
        }
      );
      toast.success("Group created successfully");
      fetchGroups();
      closePopup();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create group");
    } finally {
      setIsLoading(false);
    }
  };

    const handleEditGroup = (group) => {
    setIsEditing(true);
    setCurrentGroup(group);
    setGroupName(group.name);
    setGroupCodes(group.codes.map(code => typeof code === 'string' ? code : code._id));
    setGroupCategories(group.categories);
    setIsPopupOpen(true);
    };

  const handleUpdateGroup = async () => {
    if (!groupName || groupCodes.length === 0 || groupCategories.length === 0) {
      return toast.error("Please fill all fields");
    }

    try {
      setIsLoading(true);
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/group/updateGroup?id=${currentGroup._id}`,
        {
          name: groupName,
          codes: groupCodes,
          categories: groupCategories,
        },
        {
          headers: { Authorization: userToken, activeDB },
        }
      );
      toast.success("Group updated successfully");
      fetchGroups();
      closePopup();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update group");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      setIsLoading(true);
      await axios.delete(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/group/deleteGroup?id=${groupId}`, {
        headers: { Authorization: userToken, activeDB },
      });
      toast.success("Group deleted successfully");
      fetchGroups();
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
      setIsDeleteConfirmOpen(false);
      setGroupToDelete(null);
    }
  };

  const confirmDelete = (group) => {
    setGroupToDelete(group);
    setIsDeleteConfirmOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setIsEditing(false);
    setCurrentGroup(null);
    setGroupName("");
    setGroupCodes([]);
    setGroupCategories([]);
  };

  const filteredGroups = selectedCategory
    ? groups.filter(group => group.categories.includes(selectedCategory))
    : groups;

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
          <BeatLoader color="var(--primary-color)" loading={isLoading} size={15} />
        </div>
      )}

      <div className="p-8 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Manage Groups</h2>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat?._id} value={cat?.categoryCode}>{cat?.categoryName}</option>
              ))}
            </select>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              + Create Group
            </button>
            <button
              onClick={() => downloadSheet(groups , "Bulk Sheet", categories)}
              className="font-medium text-sm text-white p-3 rounded bg-primary"
            >
              Bulk Download
            </button>
          </div>
        </div>

        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Categories</th>
              <th className="border px-4 py-2 text-left">Codes</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((group) => (
              <tr key={group?._id} className="border-t">
                <td className="px-4 py-2">{group?.name}</td>
                <td className="px-4 py-2">
                    {group?.categories
                        .map((categoryCode) => {
                        const category = categories.find((cat) => cat.categoryCode === categoryCode);
                        return category ? category.categoryName : categoryCode; // Fallback to code if name not found
                        })
                        .join(", ")}
                </td>
                <td className="px-4 py-2">
                {group?.codes.map((code) => code.code).join(", ")}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(group)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredGroups.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No groups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[400px] relative">
            <IoClose
              size={24}
              className="absolute top-3 right-3 text-primary cursor-pointer"
              onClick={closePopup}
            />
            <h3 className="text-xl font-bold mb-4">{isEditing ? "Edit Group" : "Create Group"}</h3>
            <p className="text-sm font-bold mb-4">Note: Select Codes from worst to best, like : D3, D2, D1</p>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border w-full mb-4 px-3 py-2 rounded"
            />
            <label className="block font-medium mb-1">Select Codes</label>
            <div className="border rounded h-32 overflow-y-auto mb-4">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="text-left px-3 py-2 w-[50px]">Select</th>
                    <th className="text-left px-3 py-2">Code</th>
                    <th className="text-left px-3 py-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.length ? (
                    codes.map((code) => (
                      <tr key={code?._id} className="border-t">
                        <td className="px-3 py-1">
                          <input
                            type="checkbox"
                            value={code?._id}
                            checked={groupCodes.includes(code?._id)}
                            onChange={(e) => {
                              const value = e.target.value;
                              setGroupCodes((prev) =>
                                e.target.checked
                                  ? [...prev, value]
                                  : prev.filter((id) => id !== value)
                              );
                            }}
                          />
                        </td>
                        <td className="px-3 py-1">{code?.code}</td>
                        <td className="px-3 py-1">{code?.description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-3 py-2 text-gray-500 text-center">
                        No codes available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <label className="block font-medium mb-1">Select Categories</label>
            <div className="border rounded h-32 overflow-y-auto mb-4">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="text-left px-3 py-2 w-[50px]">Select</th>
                    <th className="text-left px-3 py-2">Category</th>
                    <th className="text-left px-3 py-2">Category Code</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length ? (
                    categories.map((cat) => (
                      <tr key={cat?._id} className="border-t">
                        <td className="px-3 py-1">
                          <input
                            type="checkbox"
                            value={cat?.categoryCode}
                            checked={groupCategories.includes(cat?.categoryCode)}
                            onChange={(e) => {
                              const value = e.target.value;
                              setGroupCategories((prev) =>
                                e.target.checked ? [...prev, value] : prev.filter((c) => c !== value)
                              );
                            }}
                          />
                        </td>
                        <td className="px-3 py-1">{cat?.categoryName}</td>
                        <td className="px-3 py-1">{cat?.categoryCode}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-3 py-2 text-gray-500 text-center">
                        No categories available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              onClick={isEditing ? handleUpdateGroup : handleCreateGroup}
              disabled={isLoading}
              className={`w-full py-2 rounded font-medium ${isLoading ? "bg-slate-400 cursor-not-allowed" : "bg-primary text-white"}`}
            >
              {isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Group" : "Create Group")}
            </button>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Are you sure you want to delete the group "{groupToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setGroupToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteGroup(groupToDelete?._id)}
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

export default GroupMgmt;