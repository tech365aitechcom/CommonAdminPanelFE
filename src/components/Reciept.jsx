import React from "react";
import Grest_Logo from "../assets/Grest_pdf_Logo.png";

const PurchaseReceipt = ({
  imeiNumber,
  uniqueCode,
  phoneNumber,
  phoneName,
  storage,
  storeName,
  RAM,
  formattedDate,
  emailId,
  name,
  region,
  address,
}) => {
const maskPhoneNumber = (phoneNumber) => {
  console.log(phoneNumber + " phoneNumber")
  const visibleLength = Math.ceil(phoneNumber?.length * 0.25);
  const maskedSection = phoneNumber?.slice(
    0,
    phoneNumber.length - visibleLength
  );
  const visibleSection = phoneNumber?.slice(phoneNumber?.length - visibleLength);
  return `${maskedSection.replace(/./g, "x")}${visibleSection}`;
};

const maskEmail = (email) => {
  console.log(email + " email")

  const [name, domain] = email.split("@");
  const visibleLength = Math.ceil(name?.length * 0.25);
  const maskedName = name?.slice(0, name?.length - visibleLength);
  const visibleName = name?.slice(name?.length - visibleLength);
  return `${maskedName.replace(/./g, "x")}${visibleName}@${domain}`;
};

  return (
    <div className="p-4 px-12 bg-white border-2 text-sm">
      <div className="flex items-center justify-center bg-white p-[1vh] mx-[2vh] my-[1vh]">
        <img src={Grest_Logo} alt="ABC logo" className="w-80 h-24" />
      </div>
      <div className="flex flex-col items-center justify-between mb-2">
        <p className="text-sm text-[#1b0d6c]">
          Radical Aftermarket Services Pvt. Ltd. ,
          <span className="text-[#EC2752]"> GSTIN/UIN:</span>
          06AAJCR2110E1ZX
        </p>
        <p className="text-sm text-[#1b0d6c]">
          <span className="text-[#EC2752]"> Address:</span> Khasra No.
          34/22, 1st Floor, NK Tower, Kanhai Road, Sector-45, Gurugram,
          Haryana-122003
        </p>
        <p className="text-sm text-[#1b0d6c]">
          <span className="text-[#EC2752]"> Contact:</span> +91 9818
          925 900 ,<span className="text-[#EC2752]"> E-mail:</span>{" "}
          care@grest.in
        </p>
      </div>
      <div className="text-center">
        <p className="font-bold text-xl">PURCHASE RECEIPT</p>
      </div>
      <div className="flex items-center mt-4 justify-between mx-auto">
        <div className="w-[30%]">
          <p>
            <span className="font-bold"> Serial No.:</span> {uniqueCode}
          </p>
          <p>
            <span className="font-bold"> Date:</span> {formattedDate}
          </p>
        </div>
        <div className=" p-4 border-2 border-black w-[70%]">
          <p>
            <span className="font-bold"> Purchased From: {name}</span>
          </p>
          <p>
            <span> Contact: {maskPhoneNumber(phoneNumber)}</span>
          </p>
          <p>
            <span> Mail: {maskEmail(emailId)}</span>
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col items-center">
          <p className="font-bold">S.No.</p>
          <p>1</p>
        </div>
        <div>
          <p className="font-bold">Item</p>
          <p>
            {phoneName} ({storage}/{RAM})
          </p>
        </div>
      </div>
      <hr className="border-black mt-10 border-1" />
      <div className="flex flex-col items-center border-b-2 border-dashed border-black py-4 ">
        <p className="text-xl font-bold mt-4 mb-2">Via Retail Store Partner:</p>
        <p>
          {storeName}
        </p>
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
          <span className="font-bold underline">
            {storeName}
          </span>{" "}
          to sell his/her old Gadget, to the ABC Network herein after referred
          to as "Purchaser" which expression shall mean and include its
          representative, executors, nominee, partners, affiliates and assigns
          on day of <span className="font-bold">{formattedDate}</span>
        </p>
      </div>

      <div>
        <p className="mt-4">
          <span> IMEI No./ Serial Number: {imeiNumber}</span>
        </p>
        <p className="mt-4">
          <span> Scheme Title: Buyback</span>
        </p>
        <p className="font-bold mt-16">Seller Name and Sign</p>
      </div>
    </div>
  );
};

export default PurchaseReceipt;
