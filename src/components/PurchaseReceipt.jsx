import React from "react";
import Grest_Logo from "../assets/Grest_pdf_Logo.png";

const PurchaseReceipt = ({
  imeiNumber,
  uniqueCode,
  phoneNumber,
  aadharNumber,
  phoneName,
  type,
  storage,
  storeName,
  RAM,
  formattedDate,
  emailId,
  name,
  region,
  address,
  price,
}) => {
  const maskPhoneNumber = (phNumber) => {
    const visibleLength = Math.ceil(phNumber?.length * 0.25);
    const maskedSection = phNumber?.slice(
      0,
      phNumber.length - visibleLength
    );
    const visibleSection = phNumber?.slice(
      phNumber?.length - visibleLength
    );
    return `${maskedSection.replace(/./g, "x")}${visibleSection}`;
  };

  const maskEmail = (email) => {
    const [namee, domain] = email.split("@");
    const visibleLength = Math.ceil(namee?.length * 0.25);
    const maskedName = namee?.slice(0, namee?.length - visibleLength);
    const visibleName = namee?.slice(namee?.length - visibleLength);
    return `${maskedName.replace(/./g, "x")}${visibleName}@${domain}`;
  };

  return (
    <div className="p-4 px-12 bg-white border-2 text-sm">
      <div className="flex items-center justify-center bg-white p-[1vh] mx-[2vh] my-[1vh]">
        <img src={Grest_Logo} alt="App logo" className="w-80 h-24" />
      </div>
      <div className="flex flex-col items-center justify-between mb-2">
        <p className="text-sm text-[#1b0d6c]">
          {import.meta.env.VITE_COMPANY_NAME} ,
          <span className="text-primary"> GSTIN/UIN:</span>
          {import.meta.env.VITE_COMPANY_GSTIN}
        </p>
        <p className="text-sm text-[#1b0d6c]">
          <span className="text-primary"> Address:</span>{" "}
          {import.meta.env.VITE_COMPANY_ADDRESS}
        </p>
        <p className="text-sm text-[#1b0d6c]">
          <span className="text-primary"> Contact:</span>{" "}
          {import.meta.env.VITE_COMPANY_CONTACT} ,
          <span className="text-primary"> E-mail:</span>{" "}
          {import.meta.env.VITE_COMPANY_EMAIL}
        </p>
      </div>
      <div className="text-center">
        <p className="font-bold text-xl">PURCHASE RECEIPT</p>
      </div>
      <div className="flex items-center mt-4 justify-between mx-auto">
        <div className="w-[30%]">
          <p>
            <span className="font-bold"> Transaction ID:</span> {uniqueCode}
          </p>
          <p>
            <span className="font-bold"> Date:</span> {formattedDate}
          </p>
        </div>
        <div className=" p-4 border-2 border-black w-[70%]">
          <p>
            <span className="font-bold"> Purchased From: {name}</span>
          </p>
          <p></p>
          <span> Contact: {maskPhoneNumber(phoneNumber)}</span>
          <p>
            <span> Mail: {maskEmail(emailId)}</span>
          </p>
          <p>
            <span> Aadhar No.: {aadharNumber}</span>
          </p>
        </div>
      </div>
      <div className="flex gap-8 flex-row justify-start">
        <div className="flex flex-col items-start">
          <p className="font-bold">S.No.</p>
          <p>1</p>
        </div>
        <div>
          <p className="font-bold flex flex-col items-start">ITEM</p>
          <p>
            {phoneName}
            {RAM && storage
              ? ` (${RAM}/${storage})`
              : RAM
              ? ` (${RAM}/${storage})`
              : storage
              ? ` (${RAM}/${storage})`
              : ""}
          </p>
        </div>
        <div>
          <p className="font-bold flex flex-col items-start">PRICE</p>
          <p>{"₹ " + Math.floor(price) + "/-"}</p>
        </div>
      </div>
      <div className="flex gap-8 flex-row justify-start">
        <div className="flex flex-col items-start">
          <p className="mt-4">IMEI No.:</p>
          <p className="mt-4">Serial Number(if Laptop):</p>
        </div>
        <div className="flex flex-col items-start">
          <p className="mt-4">{type === "Mobile" ? imeiNumber : ""}</p>
          <p className="mt-4">{type === "Laptop" ? imeiNumber : ""}</p>
        </div>
      </div>
      
      <hr className="border-black mt-10 border-1" />
      <div className="flex flex-col items-center border-b-2 border-dashed border-black py-4 ">
        <p className="text-xl font-bold mt-4 mb-2">Via Retail Store Partner:</p>
        <p>{storeName}</p>
        <p className="uppercase text-center">{address}</p>
        <p className="text-sm">
          This is a Computer Generated Purchase Receipt and does not require
          signature or stamp
        </p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xl font-bold my-4">IDEMNITY BOND</p>
        <p className="text-center">
          This bond of idemnity is made and executed by :{" "}
          <span className="font-bold underline">{name}</span> Herein after
          referred to as "Seller" who has come in Retail store of{" "}
          <span className="font-bold underline">{storeName}</span> to sell
          his/her old Gadget, to the {import.meta.env.VITE_WEBSITE_SHORT_NAME} Network herein after referred to as
          "Purchaser" which expression shall mean and include its
          representative, executors, nominee, partners, affiliates and assigns
          on day of <span className="font-bold">{formattedDate}</span>
        </p>
      </div>

      <div>
        <p className="mt-4">
          <span> Scheme Title: Buyback</span>
        </p>
        <p className="font-bold mt-16">Seller Name and Sign</p>
      </div>
    </div>
  );
};

export default PurchaseReceipt;
