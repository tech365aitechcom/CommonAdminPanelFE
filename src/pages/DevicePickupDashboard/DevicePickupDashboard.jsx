import React, { useEffect, useRef, useState } from "react";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import NavigateTable from "../../components/NavigateTable/NavigateTable";
import PendingDevicesTable from "../../components/PendingDevicesTable/PendingDevicesTable";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoMdSearch,
} from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
import { BsCalendarDate } from "react-icons/bs";
import styles from "./DevicePickupDashboard.module.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaAngleDown, FaDownload } from "react-icons/fa6";
import SideMenu from "../../components/SideMenu";
import AdminNavbar from "../../components/Admin_Navbar";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { useDispatch, useSelector } from "react-redux";
import { setStoreFilter } from "../../store/slices/userSlice";
const buttonStyles = "bg-[#EC2752] text-white";
const updateStatusError = "Failed to update status";
const succTextColor = "text-green-500";
const failTextColor = "text-[#EC2752]";
const PickupAvail = "Available For Pickup";
const LoggedInUser = JSON.parse(sessionStorage.getItem("profile"));
const id = LoggedInUser?._id || LoggedInUser?.id;
const RotateCss = "rotate-180";

const downloadExcel = (pendDataDown) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const formattedData = pendDataDown.map((item) => {
    return {
      "Lead Id": item._id,
      Date: new Date(item.createdAt).toLocaleDateString("en-GB"),
      "Device Name": item.modelName,
      "IMEI No": item.modelId,
      "Model Id": item.modelId,
      Storage: item.storage,
      Price: item.price,
      Status: item.status,
      Location: item.location,
    };
  });

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataFile = new Blob([excelBuffer], { type: fileType });
  saveAs(dataFile, "Pending_Devices_Data" + fileExtension);
};

const DevicePickupDashboard = () => {
  const token = sessionStorage.getItem("authToken");
  const userProfile = useSelector((state) => state.user);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [pendingTableData, setPendingTableData] = useState([]);
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [devicesCount, setDevicesCount] = useState(0);
  const [devicesPrice, setDevicesPrice] = useState("0");
  const [dateValue, setDateValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("successfully updated status");
  const [errorMsg1, setErrorMsg1] = useState(null);
  const [errorMsg2, setErrorMsg2] = useState(null);
  const [successMod, setSuccessMod] = useState(false);
  const [failMod, setFailMode] = useState(false);
  const [confMod, setConfMod] = useState(false);
  const [storeName, setStoreName] = useState(userProfile.selStore);
  const [region, setRegion] = useState(userProfile.selRegion);
  const [storeData, setStoreData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [allStore, setAllStore] = useState([]);
  const firsttime = useRef(true);

  const getData = () => {
    setIsTableLoaded(true);
    const config = {
      method: "get",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/pendingDevices/all?region=${region}&storeName=${storeName}`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.data?.length > 0) {
          setPendingTableData(response?.data?.data[0]?.documents);
          setDevicesPrice(response?.data?.data[0]?.totalPrices.toString());
          setDevicesCount(response?.data?.data[0]?.count);
        }
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setErrorMsg(`Failed to load data`);
        setFailMode(true);
        setIsTableLoaded(false);
      });
  };

  const getStore = () => {
    setIsTableLoaded(true);
    const config = {
      method: "get",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/store/findAll?page=0&limit=9999`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        const allData = response.data.result;
        const storeNamesArray = response.data.result.map(
          (store) => store.storeName
        );
        const uniqueRegionsArray = [
          ...new Set(response.data.result.map((store) => store.region)),
        ];
        setAllStore(allData);
        setStoreData(storeNamesArray);
        setRegionData(uniqueRegionsArray);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setIsTableLoaded(false);
      });
  };

  const getDataBySearch = () => {
    setIsTableLoaded(true);
    const config = {
      method: "get",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/pendingDevices/search?rid=${searchValue}&date=${dateValue}&status=${statusValue}&region=${region}&storeName=${storeName}`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        setPendingTableData([]);
        if (response.data.data.length === 0) {
          setDevicesPrice("0");
          setDevicesCount(0);
        } else {
          setPendingTableData(response.data.data[0].documents);
          setDevicesPrice(response.data.data[0].totalPrices.toString());
          setDevicesCount(response.data.data[0].count);
        }
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setErrorMsg(`Failed to load data`);
        setFailMode(true);
        setIsTableLoaded(false);
      });
  };

  useEffect(() => {
    if (firsttime.current && !!storeName && !!region) {
      getData();
      getStore();
      firsttime.current = false;
    } else if (!firsttime.current && !!storeName && !!region) {
      getDataBySearch();
    }
  }, [statusValue, dateValue, storeName, region]);

  return (
    <div className="min-h-screen bg-white pb-8">
      <ExtComps
        successMod={successMod}
        errorMsg={errorMsg}
        errorMsg1={errorMsg1}
        errorMsg2={errorMsg2}
        setSuccessMod={setSuccessMod}
        isTableLoaded={isTableLoaded}
        setIsTableLoaded={setIsTableLoaded}
        failMod={failMod}
        setFailMode={setFailMode}
        confMod={confMod}
        setConfMod={setConfMod}
        setErrorMsg={setErrorMsg}
        setErrorMsg1={setErrorMsg1}
        setErrorMsg2={setErrorMsg2}
        getData={getData}
        selectedIds={selectedIds}
        pendingTableData={pendingTableData}
        allStore={allStore}
        storeName={storeName}
        setSelectedIds={setSelectedIds}
        setSelectedData={setSelectedData}
        setSelectedRows={setSelectedRows}
      />
      <NavigateTable />
      <div className="flex flex-row justify-end items-center py-1 px-2 font-medium text-sm text-[#EC2752]">
        Total Device : {devicesCount} | Total Amount :{" "}
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(devicesPrice)}
      </div>
      <DPFilter
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        getDataBySearch={getDataBySearch}
        dateValue={dateValue}
        statusValue={statusValue}
        selectedStatus={selectedStatus}
        setStatusValue={setStatusValue}
        setDateValue={setDateValue}
        setRegion={setRegion}
        region={region}
        regionData={regionData}
        storeName={storeName}
        setStoreName={setStoreName}
        allStore={allStore}
        setStoreData={setStoreData}
        storeData={storeData}
        pendingTableData={pendingTableData}
        setSelectedStatus={setSelectedStatus}
        getData={getData}
      />
      <PDTable
        pendingTableData={pendingTableData}
        setSelectedData={setSelectedData}
        setSelectedIds={setSelectedIds}
        setSelectedRows={setSelectedRows}
        selectedData={selectedData}
        selectedRows={selectedRows}
        selectedStatus={selectedStatus}
        selectedIds={selectedIds}
        setConfMod={setConfMod}
        setErrorMsg={setErrorMsg}
        setErrorMsg1={setErrorMsg1}
        setErrorMsg2={setErrorMsg2}
        setFailMode={setFailMode}
        setSelectedStatus={setSelectedStatus}
        setIsTableLoaded={setIsTableLoaded}
        setSuccessMod={setSuccessMod}
        getData={getData}
      />
    </div>
  );
};

export default DevicePickupDashboard;

const ExtComps = ({
  successMod,
  errorMsg,
  errorMsg1,
  errorMsg2,
  setSuccessMod,
  isTableLoaded,
  setIsTableLoaded,
  failMod,
  setFailMode,
  confMod,
  setConfMod,
  setErrorMsg,
  setErrorMsg1,
  setErrorMsg2,
  getData,
  selectedIds,
  pendingTableData,
  allStore,
  storeName,
  setSelectedIds,
  setSelectedData,
  setSelectedRows,
}) => {
  const [sideMenu, setsideMenu] = useState(false);
  const token1 = sessionStorage.getItem("authToken");
  const LoggedInUser1 = JSON.parse(sessionStorage.getItem("profile"));
  const reqPickupHandler = () => {
    setConfMod(false);
    const statuschk = selectedIds.every((sId) =>
      pendingTableData.some(
        (device) => device._id === sId && device.status === PickupAvail
      )
    );
    if (!statuschk) {
      setIsTableLoaded(false);
      setErrorMsg("Some devices are not Available for Pickup");
      setFailMode(true);
      return;
    }
    const address = allStore.find(
      (store) => store.storeName === storeName
    )?._id;
    const LDIds = pendingTableData
      ?.filter((obj) => selectedIds.includes(obj._id))
      .map((obj) => obj._id.toString());

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/pendingDevices/pickupreq`,
      headers: {
        Authorization: token1,
      },
      data: {
        deviceIDs: LDIds,
        storeid: address,
        userid: LoggedInUser1?._id,
      },
    };
    axios
      .request(config)
      .then((response) => {
        setSelectedIds([]);
        setSelectedData([]);
        setSelectedRows([]);
        getData();
        setErrorMsg(`Successfully Created Lot`);
        setErrorMsg1(`Lot No. :- ${response.data.data.uniqueCode}`);
        setErrorMsg2(`Check it On Picked Up`);
        setSuccessMod(true);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setErrorMsg(`Failed to create lot`);
        setFailMode(true);
        setIsTableLoaded(false);
      });
  };

  return (
    <React.Fragment>
      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-49 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color={"#EC2752"} loading={isTableLoaded} size={15} />
        </div>
      )}
      {successMod && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${succTextColor}`}>
            <IoIosCheckmarkCircle className={succTextColor} size={90} />
            <h6 className={succTextColor}>Success!</h6>
            <p className="text-slate-500">{errorMsg}</p>
            {errorMsg1 && <p className="text-slate-500">{errorMsg1}</p>}
            {errorMsg2 && <p className="text-slate-500">{errorMsg2}</p>}
            <button
              onClick={() => {
                setSuccessMod(false);
                setErrorMsg1(null);
                setErrorMsg2(null);
              }}
              className={"text-white  bg-green-500 "}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {failMod && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center h-full w-full bg-black bg-opacity-50">
          <div className={` ${failTextColor} ${styles.err_mod_box}`}>
            <IoIosCloseCircle size={90} className={failTextColor} />
            <h6 className={failTextColor}>Error!</h6>
            <p className="text-slate-500">{errorMsg}</p>
            <button
              className={buttonStyles}
              onClick={() => {
                setFailMode(false);
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {confMod && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${failTextColor}`}>
            <h6 className={failTextColor}>Confirmation!</h6>
            <p className="text-slate-500">
              {`Do you want to send ${selectedIds.length} devices for Pickup ?`}
            </p>
            <div className="flex flex-row gap-2">
              <button onClick={reqPickupHandler} className={buttonStyles}>
                Okay
              </button>
              <button
                onClick={() => {
                  setConfMod(false);
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
      <div className="flex items-center w-screen h-16 py-4 bg-white border-b-2 HEADER header">
        {LoggedInUser?.role === "Technician" ? (
          <div className="flex items-center justify-between w-full ">
            <ProfileBox />
            <img className="w-40" src={Grest_Logo} alt="app logo" />
          </div>
        ) : (
          <div className="navbar">
            <AdminNavbar
        setsideMenu={setsideMenu}
        sideMenu={sideMenu}
        onActiveDbChange={updateActiveDb}
    />
            <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

const DPFilter = ({
  setSearchValue,
  searchValue,
  getDataBySearch,
  dateValue,
  statusValue,
  selectedStatus,
  setStatusValue,
  setDateValue,
  setRegion,
  region,
  regionData,
  storeName,
  setStoreName,
  allStore,
  setStoreData,
  storeData,
  pendingTableData,
  setSelectedStatus,
  getData,
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [regionDrop, setRegionDrop] = useState(false);
  const [storeDrop, setStoreDrop] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStores, setFilteredStores] = useState(storeData);
  const dispatch = useDispatch();

  const handleRegionChange = (value) => {
    setRegionDrop(false);
    setStoreName("");
    const filteredStores = allStore.filter((store) => store.region === value);
    const storeNamesArray = filteredStores.map((store) => store.storeName);
    setStoreData(storeNamesArray);
    setRegion(value);
    dispatch(setStoreFilter({ selStore: "", selRegion: value }));
  };

  const handleStoreChange = (value) => {
    setStoreDrop(false);
    const filteredStores = allStore?.filter(
      (store) => store.storeName === value
    );
    const newRegion = filteredStores[0].region;
    setRegion(newRegion);
    setStoreName(value);
    dispatch(setStoreFilter({ selStore: value, selRegion: newRegion }));
  };

  const handleSearchClear = () => {
    setSearchValue("");
    setSelectedStatus("");
    setDateValue("");
    setRegion("chandigarh");
    setStoreName("GrestTest");
    setSearchTerm("");
  };
  useEffect(() => {
    if (selectedStatus === "" && dateValue === "" && searchValue === "") {
      getData();
    }
  }, [dateValue, selectedStatus, searchValue]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredStores(storeData);
    } else {
      const filtered = storeData.filter((store) =>
        store.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  };
  const handleFilterClick = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const dateChangeHandler = (event) => {
    const formattedDate = new Date(event.target.value).toLocaleDateString(
      "en-GB"
    );
    setDateValue(formattedDate);
  };

  return (
    <div className="px-2 flex flex-col gap-2">
      <div className="flex gap-2 items-center outline-none">
        <div className={`${styles.search_bar_wrap}`}>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            className="text-sm"
            type="text"
            placeholder="Search"
            value={searchValue}
          />
          <IoMdSearch onClick={() => getDataBySearch()} size={34} />
        </div>
        <div className={styles.icons_box}>
          <IoRefresh onClick={handleSearchClear} className="" size={25} />
        </div>
        <div
          className={`flex flex-row justify-center items-center ${styles.date_picker_wrap}`}
        >
          <input
            type="date"
            id="datepicker"
            style={{ color: "#EC2752" }}
            className=""
            value={dateValue}
            onChange={dateChangeHandler}
          />
          <div
            className={styles.date_box}
            onClick={() => document.getElementById("datepicker").showPicker()}
          >
            <p>{dateValue ? dateValue : "DD/MM/YYYY"}</p>
            <BsCalendarDate size={25} />
          </div>
        </div>
      </div>
      <DPFilterSub
        handleFilterClick={handleFilterClick}
        statusValue={statusValue}
        showFilterDropdown={showFilterDropdown}
        setStatusValue={setStatusValue}
        pendingTableData={pendingTableData}
      />
      <div className="flex gap-2 w-100 items-center outline-none">
        <div className="relative w-[45%]">
          <div
            className={`w-[100%] ${styles.filter_button}`}
            onClick={() => {
              setRegionDrop(!regionDrop);
            }}
          >
            <p className="truncate">
              {region === "" ? "Select Region" : region}
            </p>
            <FaAngleDown size={17} className={`${regionDrop && RotateCss}`} />
          </div>
          {regionDrop && (
            <div className={`w-[100%] ${styles.filter_drop}`}>
              {regionData.map((item) => (
                <div
                  key={item}
                  onClick={() => handleRegionChange(item)}
                  className={`${styles.filter_option}`}
                >
                  <p className="truncate">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative w-[70%]">
          <div
            className={`${styles.filter_button} w-full`}
            onClick={() => setStoreDrop(!storeDrop)}
          >
            <p className="truncate">
              {searchTerm === "" ? "Select Store" : searchTerm}
            </p>
            <FaAngleDown size={17} className={`${storeDrop && RotateCss}`} />
          </div>
          {storeDrop && (
            <div className="absolute w-full bg-white shadow-md">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border-b border-gray-300"
                placeholder="Search store..."
              />
              <div
                className={`overflow-y-scroll max-h-[200px] ${styles.filter_drop} w-full`}
              >
                {filteredStores.length > 0 ? (
                  filteredStores.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        handleStoreChange(item);
                        setSearchTerm(item);
                        setStoreDrop(false);
                      }}
                      className={`${styles.filter_option}`}
                    >
                      <p className="truncate">{item}</p>
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-gray-500">No stores found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DPFilterSub = ({
  handleFilterClick,
  statusValue,
  showFilterDropdown,
  setStatusValue,
  pendingTableData,
}) => {
  return (
    <div className="flex gap-2 items-center outline-none">
      <div className="relative">
        <div className={`${styles.filter_button}`} onClick={handleFilterClick}>
          <p className="truncate">
            {statusValue === "" ? "Select Status" : statusValue}
          </p>
          <FaAngleDown
            size={17}
            className={`${showFilterDropdown && RotateCss}`}
          />
        </div>
        {showFilterDropdown && (
          <div className={`${styles.filter_drop}`}>
            <div
              onClick={() => {
                setStatusValue(PickupAvail);
                handleFilterClick();
              }}
              className={`${styles.filter_option}`}
            >
              <p>Available for Pickup</p>
            </div>
            <div
              onClick={() => {
                setStatusValue("On Hold");
                handleFilterClick();
              }}
              className={`${styles.filter_option}`}
            >
              <p>On Hold</p>
            </div>
            <div
              onClick={() => {
                setStatusValue("Cancelled");
                handleFilterClick();
              }}
              className={`${styles.filter_option}`}
            >
              <p>Cancelled</p>
            </div>
            <div
              onClick={() => {
                setStatusValue("");
                handleFilterClick();
              }}
              className={`${styles.filter_option}`}
            >
              <p>Show All</p>
            </div>
          </div>
        )}
      </div>
      <button
        className={`${styles.bulkdown_button}`}
        onClick={() => downloadExcel(pendingTableData)}
      >
        <FaDownload /> Bulk Download
      </button>
    </div>
  );
};

const PDTable = ({
  pendingTableData,
  setSelectedData,
  setSelectedIds,
  setSelectedRows,
  selectedData,
  selectedRows,
  selectedStatus,
  selectedIds,
  setConfMod,
  setErrorMsg,
  setErrorMsg1,
  setErrorMsg2,
  setFailMode,
  setSelectedStatus,
  setIsTableLoaded,
  setSuccessMod,
  getData,
}) => {
  const token2 = sessionStorage.getItem("authToken");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);

  const handleStatusUpdate = (event) => {
    if (selectedIds.length === 0) {
      setErrorMsg("No device selected");
      setFailMode(true);
      return;
    }
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
    setIsTableLoaded(true);

    const LDIds = pendingTableData
      .filter((obj) => selectedIds.includes(obj._id))
      .map((obj) => obj._id.toString());

    let config;
    if (newStatus === PickupAvail) {
      config = {
        method: "post",
        url: `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pendingDevices/update`,
        headers: {
          Authorization: token2,
        },
        data: {
          deviceIDs: selectedIds,
          newStatus: newStatus,
        },
      };
    } else if (newStatus === "On Hold") {
      setShowHoldModal(true);
      return;
    } else if (newStatus === "Cancelled") {
      setShowCancelModal(true);
      return;
    } else {
      config = {
        method: "post",
        url: `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pendingDevices/updatereq`,
        headers: {
          Authorization: token2,
        },
        data: {
          deviceIDs: LDIds,
          newStatus: newStatus,
        },
      };
    }

    axios
      .request(config)
      .then((response) => {
        getData();
        setSelectedIds([]);
        setSelectedData([]);
        setSelectedRows([]);
        if (newStatus === PickupAvail) {
          setErrorMsg("Successfully updated status to " + newStatus);
        } else {
          setErrorMsg(`Successfully created ${newStatus} Lot`);
          setErrorMsg1(`Lot Id: ${response.data.data._id}`);
          setErrorMsg2(`Check it on Outstanding`);
        }
        setSuccessMod(true);
      })
      .catch((error) => {
        setIsTableLoaded(false);
        setErrorMsg(updateStatusError);
        setFailMode(true);
      });
    setSelectedStatus("");
  };

  const confHandler = () => {
    setIsTableLoaded(true);
    if (selectedIds.length === 0) {
      setIsTableLoaded(false);
      setErrorMsg("No device selected");
      setFailMode(true);
    } else {
      setConfMod(true);
    }
  };

  return (
    <React.Fragment>
      <PendingDevicesTable
        pendingTableData={pendingTableData}
        setSelectedIds={setSelectedIds}
        setSelectedData={setSelectedData}
        setSelectedRows={setSelectedRows}
        selectedData={selectedData}
        selectedRows={selectedRows}
      />
      <div className="mx-2 flex gap-2">
        <select
          className="border-2 w-1/2 outline-none border-[#EC2752] bg-[#EC2752] text-white text-[12px] px-4 py-2 rounded"
          value={selectedStatus}
          onChange={handleStatusUpdate}
        >
          <option value="">Status</option>
          <option value={PickupAvail}>Available For Pickup</option>
          <option value="On Hold">On Hold</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={confHandler}
          className="border-2 w-1/2 border-[#EC2752] bg-[#EC2752] text-white text-[12px] px-4 py-2 rounded"
        >
          Request For Pickup
        </button>
      </div>

      {showCancelModal && (
        <CancelModal
          setShowCancelModal={setShowCancelModal}
          setIsTableLoaded={setIsTableLoaded}
          token2={token2}
          selectedIds={selectedIds}
          getData={getData}
          setSelectedIds={setSelectedIds}
          setSelectedData={setSelectedData}
          setSelectedRows={setSelectedRows}
          setErrorMsg={setErrorMsg}
          setErrorMsg1={setErrorMsg1}
          setErrorMsg2={setErrorMsg2}
          setSuccessMod={setSuccessMod}
          setFailMode={setFailMode}
        />
      )}

      {showHoldModal && (
        <HoldModal
          setShowHoldModal={setShowHoldModal}
          setIsTableLoaded={setIsTableLoaded}
          token2={token2}
          selectedIds={selectedIds}
          getData={getData}
          setSelectedIds={setSelectedIds}
          setSelectedData={setSelectedData}
          setSelectedRows={setSelectedRows}
          setErrorMsg={setErrorMsg}
          setSuccessMod={setSuccessMod}
          setFailMode={setFailMode}
        />
      )}
    </React.Fragment>
  );
};

const CancelModal = ({
  setShowCancelModal,
  setIsTableLoaded,
  token2,
  selectedIds,
  getData,
  setSelectedIds,
  setSelectedData,
  setSelectedRows,
  setErrorMsg,
  setErrorMsg1,
  setErrorMsg2,
  setSuccessMod,
  setFailMode,
}) => {
  const [cancelReason, setCancelReason] = useState("");

  const handleCancelSubmit = () => {
    setIsTableLoaded(true);
    const config = {
      method: "post",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/pendingDevices/update`,
      headers: {
        Authorization: token2,
      },
      data: {
        deviceIDs: selectedIds,
        newStatus: "Cancelled",
        reason: cancelReason,
      },
    };
    axios
      .request(config)
      .then((response) => {
        getData();
        setSelectedIds([]);
        setSelectedData([]);
        setSelectedRows([]);
        setErrorMsg(`Successfully Updated status to Cancelled`);
        setErrorMsg1(`Lot No. not updated yet.`);
        setErrorMsg2(`Check it on Outstanding`);
        setSuccessMod(true);
      })
      .catch((error) => {
        setIsTableLoaded(false);
        setErrorMsg(updateStatusError);
        setFailMode(true);
      });
    setShowCancelModal(false);
    setCancelReason("");
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className={`${styles.err_mod_box} ${failTextColor}`}>
        <h6 className={failTextColor}>Cancellation Reason</h6>
        <input
          type="text"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          className="border-2 border-[#EC2752] rounded-md px-4 py-2 mb-4 w-full"
          placeholder="Enter Reason for Cancellation"
        />
        <div className="flex flex-row gap-2">
          <button onClick={handleCancelSubmit} className={buttonStyles}>
            Okay
          </button>
          <button
            onClick={() => {
              setShowCancelModal(false);
              setIsTableLoaded(false);
            }}
            className="bg-white text-[#EC2752]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const HoldModal = ({
  setShowHoldModal,
  setIsTableLoaded,
  token2,
  selectedIds,
  getData,
  setSelectedIds,
  setSelectedData,
  setSelectedRows,
  setErrorMsg,
  setSuccessMod,
  setFailMode,
}) => {
  const [holdReason, setHoldReason] = useState("");

  const handleHoldSubmit = () => {
    setIsTableLoaded(true);
    const config = {
      method: "post",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/pendingDevices/update`,
      headers: {
        Authorization: token2,
      },
      data: {
        deviceIDs: selectedIds,
        newStatus: "On Hold",
        reason: holdReason,
      },
    };
    axios
      .request(config)
      .then((response) => {
        getData();
        setSelectedIds([]);
        setSelectedData([]);
        setSelectedRows([]);
        setErrorMsg(`Successfully updated status to On Hold`);
        setSuccessMod(true);
      })
      .catch((error) => {
        setIsTableLoaded(false);
        setErrorMsg(updateStatusError);
        setFailMode(true);
      });
    setShowHoldModal(false);
    setHoldReason("");
  };
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className={`${styles.err_mod_box} ${failTextColor}`}>
        <h6 className={failTextColor}>Hold Reason</h6>
        <input
          type="text"
          value={holdReason}
          onChange={(e) => setHoldReason(e.target.value)}
          className="border-2 border-[#EC2752] rounded-md px-4 py-2 mb-4 w-full"
          placeholder="Enter Reason for Hold"
        />
        <div className="flex flex-row gap-2">
          <button onClick={handleHoldSubmit} className={buttonStyles}>
            Okay
          </button>
          <button
            onClick={() => {
              setShowHoldModal(false);
              setIsTableLoaded(false);
            }}
            className="bg-white text-[#EC2752]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
