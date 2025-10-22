import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const StoreEdit = ({ storeData, setEditBoxOpen, setEditSuccess }) => {
    const [activeDB, setActiveDB] = useState(sessionStorage.getItem("activeDB") || "");

const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB);
};
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [formData, setFormData] = useState(storeData);
  const [response, setResponse] = useState("");

  const closeHandler = () => {
    setEditBoxOpen(false);
  };

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
    const token = sessionStorage.getItem("authToken");

    if (formData.email.length <= 5) {
      setResponse("Email size is too small, must be more than 5");
      setIsTableLoaded(false);
      return;
    }

    if (formData.contactNumber.length <= 5) {
      setResponse("Phone number is invalid, size must be more than 5");
      setIsTableLoaded(false);
      return;
    }

    const data = {
      id: formData._id,
      storeName: formData.storeName,
      uniqueId: formData.uniqueId,
      email: formData.email,
      contactNumber: formData.contactNumber,
      region: formData.region,
      address: formData.address,
    };

    console.log(data);

    const config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/store/edit`,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        activeDB: activeDB,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response1) => {
        console.log(response1);
        setIsTableLoaded(false);
        setResponse(response1.data.msg);
        setEditSuccess(true);
      })
      .catch((error) => {
        console.log(error);
        setIsTableLoaded(false);
        setResponse("Failed to update data");
      });
  };

  return (
    <div className="min-h-screen  pb-8 bg-[#F5F4F9]">
      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color="var(--primary-color)" loading={isTableLoaded} size={15} />
        </div>
      )}
      <div
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.3) 0px 0px 10px, rgba(0, 0, 0, 0.1) 0px 5px 12px",
        }}
        className="items-center bg-white max-w-[900px] flex py-8 mx-auto mt-4 justify-center flex-col"
      >
        <div className="flex flex-col w-[900px]">
          <div className="mb-6 flex flex-col gap-2 border-b-2 mr-10 pb-2 ml-10">
            <IoClose
              size={35}
              className="absolute right-[220px] text-primary transition ease hover:rotate-[360deg] duration-500"
              onClick={closeHandler}
            />
            <p className="text-4xl font-bold">Update Store Details</p>
            <p className="text-lg">All fields marked with * are required</p>
          </div>
          <form className="ml-10 flex flex-col gap-4" onSubmit={submitHandler}>
            <div className="flex flex-col w-[70%] gap-2">
              <span className="font-medium text-xl">Store Name*</span>
              <input
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="border-2 px-2 py-2 rounded-lg outline-none"
                type="text"
                required={true}
              />
            </div>
            <div className="flex flex-col w-[70%] gap-2">
              <span className="font-medium text-xl">Unique Id*</span>
              <input
                id="uniqueId"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                className="border-2 px-2 py-2 rounded-lg  outline-none "
                type="text"
                required={true}
              />
            </div>

            <div className="flex flex-col w-[70%] gap-2 ">
              <span className="font-medium text-xl">Email*</span>
              <input
                id="email"
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
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="border-2 px-2 py-2 rounded-lg  outline-none"
                type="number"
                required={true}
              />
            </div>
            <div className="flex flex-col w-[70%] gap-2">
              <span className="font-medium text-xl">Region*</span>
              <input
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="border-2 px-2 py-2 rounded-lg  outline-none"
                type="text"
                required={true}
              />
            </div>
            <div className="flex flex-col w-[70%] gap-2">
              <span className="font-medium text-xl">Adddress*</span>
              <input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border-2 px-2 py-2 rounded-lg  outline-none"
                type="text"
                required={true}
              />
            </div>
            <div className="mt-8 flex flex-row justify-start gap-4 items-center">
              <button
                type="submit"
                className="font-medium text-sm text-white p-3 rounded bg-primary"
              >
                Update Details
              </button>
              <p className="text-primary">{response}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StoreEdit;
