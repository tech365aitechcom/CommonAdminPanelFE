import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grest_Logo from "../assets/Grest_Logo.jpg";
import axios from "axios";
import User_Logo from "../assets/User_Logo.jpg";
import { FaCamera, FaInfoCircle } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
const Price = () => {
  const userName = "";
  const leadsubmitDATA = JSON.parse(sessionStorage.getItem("responsedatadata"));
  const savedOtpData = JSON.parse(localStorage.getItem("otpData"));
  const token = sessionStorage.getItem("authToken");
  const [file, setFile] = useState(null);
  const [idProofBack, setIdProofBack] = useState(null);
  const [phoneBill, setPhoneBill] = useState(null);
  const [phoneFront, setPhoneFront] = useState(null);
  const [phoneBack, setPhoneBack] = useState(null);
  const [phoneLeft, setPhoneLeft] = useState(null);
  const [phoneRight, setPhoneRight] = useState(null);
  const [phoneTop, setPhoneTop] = useState(null);
  const [phoneBottom, setPhoneBottom] = useState(null);
  const [aadharNumber, setAadharNumber] = useState("");
  const [imeinumber, setImeiNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const idproofBackRef = useRef(null);
  const phoneBillRef = useRef(null);
  const phoneFrontRef = useRef(null);
  const phoneBackRef = useRef(null);
  const phoneLeftRef = useRef(null);
  const phoneRightRef = useRef(null);
  const phoneTopRef = useRef(null);
  const phoneBottomRef = useRef(null);
  const [isBillRequired, setIsBillRequired] = useState(false);
  useEffect(() => {
    const billData = JSON.parse(sessionStorage.getItem("billData"));
    if (billData && billData?.selected[0] === false) {
      setIsBillRequired(true);
    }
  }, []);
  const handleCameraButtonClick = (ref) => {
    if (!ref.current) {
      return;
    }
    ref.current.click();
  };
  const handleChange = (setMEthod, e) => {
    const doc = e.target.files[0];
    setMEthod(doc);
  };
  const uploadAllImages = async () => {
    setIsLoading(true);
    if (
      !imeinumber ||
      !phoneFront ||
      !aadharNumber ||
      !phoneBack ||
      !phoneLeft ||
      !phoneRight ||
      !phoneTop ||
      !phoneBottom ||
      (isBillRequired && !phoneBill)
    ) {
      alert(
        "Please fill in all mandatory fields (IMEI/Serial number and device images)."
      );
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    if (file) {
      formData.append("adharFront", file);
    }
    if (idProofBack) {
      formData.append("adharBack", idProofBack);
    }
    if (phoneBill) {
      formData.append("phoneBill", phoneBill);
    }
    if (phoneFront) {
      formData.append("phoneFront", phoneFront);
    }
    if (phoneBack) {
      formData.append("phoneBack", phoneBack);
    }
    if (phoneTop) {
      formData.append("phoneUp", phoneTop);
    }
    if (phoneLeft) {
      formData.append("phoneLeft", phoneLeft);
    }
    if (phoneRight) {
      formData.append("phoneRight", phoneRight);
    }
    if (phoneBottom) {
      formData.append("phoneDown", phoneBottom);
    }
    formData.append("signature", phoneBottom);
    formData.append("IMEI", imeinumber);
    formData.append("leadId", leadsubmitDATA?.id);
    formData.append("emailId", savedOtpData?.email);
    formData.append("name", savedOtpData?.name);
    formData.append("phoneNumber", savedOtpData?.phone);
    formData.append("aadharNumber", aadharNumber);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/questionnaires/upload-documents`,
        formData,
        { headers: { Authorization: token } }
      );
      setIsLoading(false);
      navigate("/specialoffers");
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-[100vh] max-h-[200vh] overflow-y-auto bg-white ">
      <div className="flex items-center w-screen h-16 py-4 bg-white border-b-2 HEADER header">
        <div className="flex items-center justify-between w-full ">
          <div className="flex flex-row-reverse items-center gap-2 ml-4">
            <p className="mr-4 text-base md:text-xl">{userName}</p>
            <img className="w-[30px]" src={User_Logo} alt="" />
          </div>
          <img
            onClick={() => navigate("/selectdevicetype")}
            className="w-40"
            src={Grest_Logo}
            alt="app logo"
          />
        </div>
      </div>
      <div className="w-[90%] md:w-[90%] mx-auto h-[auto] mb-[93px]">
        <div className="mt-3 text-center relative">
          <h1 className="text-2xl font-semibold">Upload Documents</h1>
          <p className="mt-4 text-gray-600">
            Regulations require you to upload a national identity card. Don't
            worry, your data will stay safe and private.
          </p>
        </div>
        <div className="flex flex-col">
          <ImeiField setImeiNumber={setImeiNumber} imeinumber={imeinumber} />
          <AadharNumberField
            setAadharNumber={setAadharNumber}
            aadharNumber={aadharNumber}
          />
          <AdharField
            handleChange={handleChange}
            setFile={setFile}
            fileInputRef={fileInputRef}
            handleCameraButtonClick={handleCameraButtonClick}
            file={file}
            setIdProofBack={setIdProofBack}
            idProofBack={idProofBack}
            idproofBackRef={idproofBackRef}
          />
          <PhoneBill
            handleChange={handleChange}
            setPhoneBill={setPhoneBill}
            phoneBackRef={phoneBackRef}
            handleCameraButtonClick={handleCameraButtonClick}
            phoneBillRef={phoneBillRef}
            phoneBill={phoneBill}
            isBillRequired={isBillRequired}
          />
          <PhonePhotos1
            handleCameraButtonClick={handleCameraButtonClick}
            handleChange={handleChange}
            phoneFront={phoneFront}
            setPhoneFront={setPhoneFront}
            phoneFrontRef={phoneFrontRef}
            setPhoneBottom={setPhoneBottom}
            phoneBackRef={phoneBackRef}
            phoneBack={phoneBack}
            phoneBottom={phoneBottom}
            phoneTop={phoneTop}
            phoneBottomRef={phoneBottomRef}
            setPhoneLeft={setPhoneLeft}
            setPhoneBack={setPhoneBack}
            setPhoneTop={setPhoneTop}
            phoneLeft={phoneLeft}
            phoneRight={phoneRight}
            phoneTopRef={phoneTopRef}
            phoneRightRef={phoneRightRef}
            setPhoneRight={setPhoneRight}
            phoneLeftRef={phoneLeftRef}
          />
        </div>
      </div>
      <div className="fixed bottom-0 flex flex-col w-full gap-2 p-4 bg-white border-t-2 ">
        <div
          onClick={() => uploadAllImages()}
          className={` relative text-center py-1 px-2 rounded-lg cursor-pointer flex justify-between text-white items-center ${
            !imeinumber ||
            !phoneFront ||
            !phoneBack ||
            !phoneLeft ||
            !phoneRight ||
            !phoneTop ||
            !phoneBottom
              ? "cursor-not-allowed bg-gray-400"
              : " bg-[#EC2752] "
          }`}
        >
          {isLoading && (
            <CgSpinner
              size={20}
              className="absolute left-[28%] top-[8px] mt-1 animate-spin"
            />
          )}
          <p className="w-full p-1 text-xl font-medium">
            {isLoading ? "Submitting" : "Submit"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Price;

const ImeiField = ({ imeinumber, setImeiNumber }) => {
  const [error, setError] = useState(true);
  const Device = sessionStorage.getItem("DeviceType");

  const validateImeiNumber = (value) => {
    if (Device === "Mobile") {
      if (value.length !== 15) {
        setError("IMEI number must be exactly 15 digits.");
        return false;
      } else if (!/^\d{15}$/.test(value)) {
        setError("IMEI number must only contain digits.");
        return false;
      }
    } else if (Device === "Watch") {
      if (value.length < 6) {
        setError("IMEI number must be between 6 to 15 digits.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setImeiNumber(value);
    validateImeiNumber(value);
  };

  const handleVerify = () => {
    if (validateImeiNumber(imeinumber)) {
      // Handle the verify logic here
      console.log("IMEI number is valid.");
    }
  };

  return (
    <div className="flex flex-col eminumber mt-[4px]">
      <div className="flex gap-1 two">
        <p className="text-base font-medium">1.</p>
        <p className="text-base font-medium three">
          Enter your{" "}
          {Device === "Mobile" ? "phone's IMEI No." : "smartwatch's serial no."}{" "}
          <span className="text-red-500">*</span>
        </p>
      </div>

      <div className="flex items-center gap-4 mt-2 ml-[19px]">
        <input
          type="text"
          className="w-auto p-2 border-2 border-gray-300 rounded"
          value={imeinumber}
          placeholder={Device === "Mobile" ? "IMEI no." : "Serial no."}
          onChange={handleChange}
          maxLength={15}
        />
        <button
          className={`px-4 py-2 font-bold text-white rounded ${
            !error ? "bg-[#EC2752]" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleVerify}
          disabled={!!error}
        >
          Verify
        </button>
      </div>
      {error && <p className="text-[#ec275271] mt-2 text-sm">{error}</p>}
    </div>
  );
};
const AadharNumberField = ({ aadharNumber, setAadharNumber }) => {
  const [error, setError] = useState(true);
  const Device = sessionStorage.getItem("DeviceType");

  const validateAadharNumber = (value) => {
    if (value.length !== 12) {
      setError("Aadhar Number number must be exactly 12 digits.");
      return false;
    } else if (!/^\d{12}$/.test(value)) {
      setError("Aadhar Number must only contain digits.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setAadharNumber(value);
    validateAadharNumber(value);
  };

  const handleVerify = () => {
    if (validateAadharNumber(aadharNumber)) {
      // Handle the verify logic here
      console.log("Aadhar Number is valid.");
    }
  };

  return (
    <div className="flex flex-col eminumber mt-[4px]">
      <div className="flex gap-1 two">
        <p className="text-base font-medium">2.</p>
        <p className="text-base font-medium three">
          Enter your Aadhar Number
          <span className="text-red-500">*</span>
        </p>
      </div>

      <div className="flex items-center gap-4 mt-2 ml-[19px]">
        <input
          type="text"
          className="w-auto p-2 border-2 border-gray-300 rounded"
          value={aadharNumber}
          placeholder="Aadhar no."
          onChange={handleChange}
          maxLength={12}
        />
        <button
          className={`px-4 py-2 font-bold text-white rounded ${
            !error ? "bg-[#EC2752]" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleVerify}
          disabled={!!error}
        >
          Verify
        </button>
      </div>
      {error && <p className="text-[#ec275271] mt-2 text-sm">{error}</p>}
    </div>
  );
};
const AdharField = ({
  handleChange,
  setFile,
  fileInputRef,
  handleCameraButtonClick,
  file,
  setIdProofBack,
  idProofBack,
  idproofBackRef,
}) => {
  return (
    <div className="flex flex-col adharcard mt-[10px]">
      <div className="flex gap-1 two">
        <p className="text-base font-medium">3.</p>
        <div className="flex items-center">
          <p className="text-base font-medium three">
            {"Upload your Aadhar Card"} <span className="text-red-500">*</span>
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-[#ec275271]">
        Note: Image size should not exceed 2MB
      </p>
      <div className="flex inputAADHAR justify-evenly">
        <div className="p-1 mt-4 text-center border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-[#EC2752] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="font-semibold text-center">Adhaar(Front)</p>
          <input
            type="file"
            onChange={(e) => handleChange(setFile, e)}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <button onClick={() => handleCameraButtonClick(fileInputRef)}>
            {!file ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                className="w-full h-[60px]"
                src={URL.createObjectURL(file)}
                alt="Uploaded file"
              />
            )}
          </button>
        </div>
        <div className="p-1 mt-4 text-center border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-[#EC2752] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="font-semibold text-center">Adhaar(Back)</p>
          <input
            type="file"
            onChange={(e) => handleChange(setIdProofBack, e)}
            style={{ display: "none" }}
            ref={idproofBackRef}
          />
          <button onClick={() => handleCameraButtonClick(idproofBackRef)}>
            {!idProofBack ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                className="w-full h-[60px]"
                src={URL.createObjectURL(idProofBack)}
                alt="Uploaded file"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PhoneBill = ({
  handleChange,
  setPhoneBill,
  phoneBackRef,
  handleCameraButtonClick,
  phoneBillRef,
  phoneBill,
  isBillRequired,
}) => {
  const Device = sessionStorage.getItem("DeviceType");
  return (
    <div className="flex flex-col adharcard mt-[10px]">
      <div className="flex gap-1 two">
        <p className="text-base font-medium">4.</p>
        <div className="flex items-center">
          <p className="text-base font-medium three">
            Upload your {Device === "Mobile" && "phone's"}
            {Device === "Watch" && "smartwatch's"} bill
            {isBillRequired && <span className="text-red-500">*</span>}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-[#ec275271]">
        Note: Image size should not exceed 2MB
      </p>
      <div className="flex justify-start ml-3 inputAADHAR">
        {/* 1 */}
        <div className="p-1 mt-4 text-center border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-[#EC2752] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="font-semibold text-center">
            {Device === "Mobile" && "Phone"}
            {Device === "Watch" && "Smartwatch"} Bill
          </p>
          <input
            type="file"
            onChange={(e) => handleChange(setPhoneBill, e)}
            style={{ display: "none" }}
            ref={phoneBillRef}
          />
          <button onClick={() => handleCameraButtonClick(phoneBillRef)}>
            {!phoneBill ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                className="w-full h-[60px]"
                src={URL.createObjectURL(phoneBill)}
                alt="Uploaded file"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PhonePhotos1 = ({
  handleChange,
  handleCameraButtonClick,
  setPhoneFront,
  phoneFront,
  phoneFrontRef,
  phoneBack,
  phoneBackRef,
  setPhoneBack,
  phoneBottom,
  phoneBottomRef,
  setPhoneBottom,
  phoneTop,
  phoneTopRef,
  setPhoneTop,
  phoneLeft,
  phoneLeftRef,
  setPhoneLeft,
  phoneRight,
  phoneRightRef,
  setPhoneRight,
}) => {
  const Device = sessionStorage.getItem("DeviceType");
  const [showHoldModal, setShowHoldModal] = useState(false);

  return (
    <div className="flex flex-col adharcard mt-[10px] ">
      <div className="flex gap-1 two">
        <p className="text-base font-medium">5.</p>
        <div className="flex items-center">
          <p className="text-base font-medium three">
            {`Upload Your ${Device}'s Images`}{" "}
            <span className="text-red-500">*</span>
          </p>
          <FaInfoCircle
            className="ml-2 cursor-pointer"
            onClick={() => setShowHoldModal(true)}
          />
        </div>
      </div>
      <p className="mt-2 text-sm text-[#ec275271]">
        Note: Image size should not exceed 2MB
      </p>
      <div className="flex flex-wrap inputAADHAR justify-evenly">
        <div className="mt-4 p-1 text-center border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-[#EC2752] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="text-center font-semibold">{`${Device} Front`}</p>
          <input
            onChange={(e) => handleChange(setPhoneFront, e)}
            type="file"
            ref={phoneFrontRef}
            style={{ display: "none" }}
          />
          <button onClick={() => handleCameraButtonClick(phoneFrontRef)}>
            {!phoneFront ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                src={URL.createObjectURL(phoneFront)}
                className="h-[60px] w-full"
                alt="Uploaded file"
              />
            )}
          </button>
        </div>
        <div className="p-1 text-center mt-4 border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-[#EC2752] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="text-center font-semibold">{`${Device} Back`}</p>
          <input
            ref={phoneBackRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleChange(setPhoneBack, e)}
          />
          <button onClick={() => handleCameraButtonClick(phoneBackRef)}>
            {!phoneBack ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                className="w-full h-[60px]"
                alt="Uploaded file"
                src={URL.createObjectURL(phoneBack)}
              />
            )}
          </button>
        </div>

        {/* 3 */}

        <div className="text-center p-1 mt-4 border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-[#EC2752] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] ">
          <p className="text-center font-semibold tracking-tighter">
            {`${Device} Left Side`}
          </p>
          <input
            onChange={(e) => handleChange(setPhoneLeft, e)}
            type="file"
            style={{ display: "none" }}
            ref={phoneLeftRef}
          />
          <button onClick={() => handleCameraButtonClick(phoneLeftRef)}>
            {!phoneLeft ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                className="h-[60px] w-full"
                alt="Uploaded file"
                src={URL.createObjectURL(phoneLeft)}
              />
            )}
          </button>
        </div>

        {/* 4 */}
        <div className="p-1 mt-4 text-center border-2 justify-between rounded-lg w-[40vw] h-[15vh] relative border-[#EC2752] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="text-center font-semibold tracking-tighter">
            {`${Device} Right Side`}
          </p>
          <input
            onChange={(e) => handleChange(setPhoneRight, e)}
            type="file"
            style={{ display: "none" }}
            ref={phoneRightRef}
          />
          <button onClick={() => handleCameraButtonClick(phoneRightRef)}>
            {!phoneRight ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                src={URL.createObjectURL(phoneRight)}
                className="w-full h-[60px]"
                alt="Uploaded file"
              />
            )}
          </button>
        </div>

        {/* 5 */}
        <div className="border-2 p-1 mt-4 text-center justify-between rounded-lg h-[15vh] w-[40vw] relative border-[#EC2752] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="font-semibold text-center tracking-tighter">
            {`${Device} Top Side`}
          </p>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleChange(setPhoneTop, e)}
            ref={phoneTopRef}
          />
          <button onClick={() => handleCameraButtonClick(phoneTopRef)}>
            {!phoneTop ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                src={URL.createObjectURL(phoneTop)}
                className="w-full h-[60px]"
                alt="Uploaded file"
              />
            )}
          </button>
        </div>

        {/* 6 */}
        <div className="mt-4 p-1 text-center border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-[#EC2752] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="font-semibold text-center tracking-tighter">
            {`${Device} Bottom Side`}
          </p>
          <input
            onChange={(e) => handleChange(setPhoneBottom, e)}
            type="file"
            style={{ display: "none" }}
            ref={phoneBottomRef}
          />
          <button onClick={() => handleCameraButtonClick(phoneBottomRef)}>
            {!phoneBottom ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                src={URL.createObjectURL(phoneBottom)}
                alt="Uploaded file"
                className="w-full h-[60px]"
              />
            )}
          </button>
        </div>
      </div>
      {showHoldModal && Device === "Mobile" && (
        <MobileMoldModel setShowHoldModal={setShowHoldModal} />
      )}
      {showHoldModal && Device === "Watch" && (
        <WatchMoldModel setShowHoldModal={setShowHoldModal} />
      )}
    </div>
  );
};

const MobileMoldModel = ({ setShowHoldModal }) => {
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div
        className="bg-white text-black text-sm rounded w-full py-6 px-4 shadow-lg"
        style={{ lineHeight: "1.5" }}
      >
        <p>
          Upload your device images, including close-up shots of any specific
          damage, dents, scratches, or wear and tear. Photos should be taken
          from approximately 30 cm away.
        </p>
        <p className="mt-2">
          <strong>Front Side:</strong> Ensure the entire front of the phone is
          visible with the display on and a black screen background. Include the
          full screen and bezels.
        </p>
        <p className="mt-2">
          <strong>Back Side:</strong> Capture the entire back side, including
          the camera, logo, and any scratches or dents.
        </p>
        <p className="mt-2">
          <strong>Left Side:</strong> Show the complete left side, including
          buttons and any ports.
        </p>
        <p className="mt-2">
          <strong>Right Side:</strong> Show the complete right side, including
          buttons and any ports.
        </p>
        <p className="mt-2">
          <strong>Top Side:</strong> Show the full top edge of the phone,
          including any ports or sensors.
        </p>
        <p className="mt-2">
          <strong>Bottom Side:</strong> Capture the full bottom edge, including
          any ports or speakers.
        </p>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowHoldModal(false)}
            className="bg-white text-[#4900AB] px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
const WatchMoldModel = ({ setShowHoldModal }) => {
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div
        className="bg-white text-black text-sm rounded w-full py-6 px-4 shadow-lg"
        style={{ lineHeight: "1.5" }}
      >
        <p>
          Upload Your device images which should include close-up shot of any
          specific damage, dent, scratches or wear and tear. Photos should be
          taken from an approx distance of 30 cms.
        </p>
        <p className="mt-2">
          <strong>Front Side:</strong> Ensure the entire front of the watch is
          visible in display On condition and black screen background. It should
          include the full screen and bezels.
        </p>
        <p className="mt-2">
          <strong>Back Side:</strong> Capture the entire back Side of the watch,
          including optical heart sensors and any scratches or dents.
        </p>
        <p className="mt-2">
          <strong>Left Side:</strong> : Show the complete left side, including
          buttons and any port.
        </p>
        <p className="mt-2">
          <strong>Right Side:</strong> Show the complete Right side, including
          buttons and any port.
        </p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowHoldModal(false)}
            className="bg-white text-[#4900AB] px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
