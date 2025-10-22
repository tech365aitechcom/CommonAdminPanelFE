import React, { useState } from "react";
import styles from "./LiquidatorListing.module.css";
import AdminNavbar from "../../components/Admin_Navbar";
import SideMenu from "../../components/SideMenu";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";

const succTextColor = "text-green-500";
const failTextColor = "text-[#EC2752]";

const initStoreForm = {
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  uniqueCode: "",
};

const LiquidatorListing = () => {
  const token = sessionStorage.getItem("authToken");
  const [sideMenu, setsideMenu] = useState(false);
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initStoreForm);
  const [errMsg, setErrMsg] = useState("");
  const [sucBox, setSucBox] = useState(false);
  const [failBox, setFailBox] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsTableLoaded(true);
    const data = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      uniqueCode: formData.uniqueCode,
    };
    const config = {
      method: "post",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/liquidators/create`,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        setErrMsg("Successfully added new liquidator");
        setSucBox(true);
        setIsTableLoaded(false);
        navigate("/liquidatorlistingtable");
      })
      .catch((error) => {
        setErrMsg("Failed to add liquidator");
        setIsTableLoaded(false);
        setFailBox(true);
      });
  };

  return (
    <div className="min-h-screen bg-[#F5F4F9] pb-8">
      <div className="navbar">
        <AdminNavbar sideMenu={sideMenu} setsideMenu={setsideMenu} />
        <SideMenu sideMenu={sideMenu} setsideMenu={setsideMenu} />
      </div>
      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full bg-black bg-opacity-50 h-full">
          <BeatLoader color={"#EC2752"} size={15} loading={isTableLoaded} />
        </div>
      )}
      {(sucBox || failBox) && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-50 w-full">
          <div
            className={`${styles.err_mod_box} ${
              sucBox ? succTextColor : failTextColor
            }`}
          >
            {sucBox ? (
              <IoIosCheckmarkCircle
                className={sucBox ? succTextColor : failTextColor}
                size={90}
              />
            ) : (
              <IoIosCloseCircle
                className={sucBox ? succTextColor : failTextColor}
                size={90}
              />
            )}
            <h6 className={sucBox ? succTextColor : failTextColor}>
              {sucBox ? "Success!" : "Error!"}
            </h6>
            <p className="text-slate-500">{errMsg}</p>
            <button
              onClick={() => {
                setSucBox(false);
                setFailBox(false);
              }}
              className={
                sucBox ? "bg-green-500 text-white" : "bg-[#EC2752] text-white"
              }
            >
              Okay
            </button>
          </div>
        </div>
      )}
      <div
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.3) 0px 0px 10px, rgba(0, 0, 0, 0.1) 0px 5px 12px",
        }}
        className="items-center bg-white max-w-[900px] flex py-8 mx-auto mt-4 justify-center flex-col"
      >
        <div className="flex flex-col  w-[900px]">
          <div className="mb-6 flex flex-col gap-2 border-b-2 mr-10 pb-2 ml-10">
            <p className="text-4xl font-bold">Liquidator Listing</p>
            <p className="text-lg">All fields marked with * are required</p>
          </div>
          <div className="flex flex-wrap gap-2 ml-10 mb-10">
            <button
              onClick={() => navigate("/liquidatorlistingtable")}
              className="font-medium text-sm text-white p-3 rounded bg-[#EC2752]"
            >
              View Detail
            </button>
          </div>
          <LiquidatorListingForm
            submitHandler={submitHandler}
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

const LiquidatorListingForm = ({ submitHandler, formData, handleChange }) => {
  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-4 ml-10">
      <div className="flex flex-col gap-2 w-[70%]">
        <span className="text-xl font-medium">Name*</span>
        <input
          id="name"
          value={formData.name}
          name="name"
          className="border-2 px-2 py-2 rounded-lg outline-none"
          onChange={handleChange}
          type="text"
          required={true}
        />
      </div>
      <div className="flex flex-col gap-2 w-[70%]">
        <span className="text-xl font-medium">Partner Code*</span>
        <input
          id="uniqueCode"
          value={formData.uniqueCode}
          name="uniqueCode"
          className="border-2 px-2 py-2 rounded-lg outline-none"
          onChange={handleChange}
          type="text"
          required={true}
        />
      </div>
      <div className="flex flex-col w-[70%] gap-2 ">
        <span className="text-xl font-medium">Email*</span>
        <input
          id="email"
          minLength={6}
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border-2 px-2 py-2 rounded-lg  outline-none"
          type="email"
          required={true}
        />
      </div>
      <div className="flex flex-col w-[70%] gap-2">
        <span className="font-medium text-xl">Contact Number*</span>
        <input
          id="phoneNumber"
          name="phoneNumber"
          minLength={10}
          className="border-2 px-2 py-2 rounded-lg  outline-none"
          onChange={handleChange}
          value={formData.phoneNumber}
          type="number"
          required={true}
        />
      </div>

      <div className="flex flex-col gap-2 w-[70%]">
        <span className="font-medium text-xl">Adddress*</span>
        <input
          id="address"
          name="address"
          className="border-2 px-2 py-2 rounded-lg  outline-none"
          onChange={handleChange}
          type="text"
          value={formData.address}
          required={true}
        />
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="font-medium text-sm text-white p-3 rounded bg-[#EC2752]"
        >
          Submit Form
        </button>
      </div>
    </form>
  );
};

export default LiquidatorListing;
