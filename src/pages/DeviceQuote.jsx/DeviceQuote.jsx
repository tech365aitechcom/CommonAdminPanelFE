import React, { useEffect, useState } from "react";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import styles from "./DeviceQuote.module.css";
import QuoteModal from "../../components/QuoteModal/QuoteModal";
import ContOTP from "../../components/ContOTP/ContOTP";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DeviceReport from "../../components/DeviceReport/DeviceReport";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import apple_watch from "../../assets/apple_watch.png";
import { setResponseData } from "../../store/slices/responseSlice";
import { toast } from "react-hot-toast";

const calculateDisplayPrice = ({ quoteSaved, savedBonus, Price, bonus }) => {
  if (quoteSaved) {
    return savedBonus
      ? Number(Price) + Number(bonus) - Number(savedBonus)
      : Number(Price) + Number(bonus);
  } else {
    return savedBonus
      ? Number(Price) - Number(savedBonus)
      : Number(Price);
  }
};

const DeviceQuote = () => {
  const dispatch = useDispatch();
  const Device = sessionStorage.getItem("DeviceType");
  const DummyImg =
    Device === "Mobile"
      ? "https://grest-c2b-images.s3.ap-south-1.amazonaws.com/gresTest/1705473080031front.jpg"
      : apple_watch;
  const phoneImg = JSON.parse(sessionStorage.getItem("dataModel"));
  const phoneFrontPhoto =
    phoneImg?.models?.phonePhotos?.front ||
    phoneImg?.models?.phonePhotos?.upFront;
  const exactQuoteValue = sessionStorage.getItem("ExactQuote");
  const dataModel = JSON.parse(sessionStorage.getItem("dataModel"));
  const deviceModalInfo = dataModel;
  const [showModal, setShowModal] = useState(false);
  const [continueOTPOpen, setContinueOTPOpen] = useState(false);
  const [showDeviceReport, setShowDeviceReport] = useState(false);
  const [quoteSaved, setQuoteSaved] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const savedBonus = useSelector((state) => state.responseData?.bonus) || null;
  const [bonus, setBonus] = useState(savedBonus || null);
  const [termsChecked, setTermsChecked] = useState(false);
  const ResponseData = useSelector((state) => state.responseData);
  const Price = useSelector((state) => state.responseData.price);
  const uniqueCode = useSelector((state) => state.responseData.uniqueCode);
  console.log(savedBonus, Price);
  useEffect(() => {
    setQuoteId(uniqueCode);
  }, [uniqueCode]);
  const deviceTypePage = "/selectdevicetype";
  const displayPrice = calculateDisplayPrice({
    quoteSaved,
    savedBonus,
    Price,
    bonus
  });

  const continueOTPHandler = () => {
    const resData = {
      grade: ResponseData.grade,
      price: 0,
      bonus: 0,
      uniqueCode: ResponseData.uniqueCode,
      id: ResponseData.id,
    };
    resData.price = Number(ResponseData.price);
    resData.bonus = Number(bonus);
    console.log(resData);
    sessionStorage.setItem("responsedatadata", JSON.stringify(resData));
    dispatch(setResponseData(resData));
    setContinueOTPOpen(!continueOTPOpen);
  };

  const showDeviceReportHandler = () => {
    setShowDeviceReport(!showDeviceReport);
  };

  const navigate = useNavigate();
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if(quoteSaved === false &&
      exactQuoteValue === "true") {  
        toast.error("Bonus Must Be Less Than ₹2000.");
      }
  }, []);

  return (
    <div className={`bg-white min-h-screen ${styles.page_wrap}`}>
      {continueOTPOpen && <ContOTP setContinueOTPOpen={setContinueOTPOpen} />}
      {showDeviceReport && (
        <DeviceReport
          setShowDeviceReport={setShowDeviceReport}
          quoteSaved={quoteSaved}
        />
      )}
      <div
        className={` flex items-center border-b-2 w-screen h-16 py-4 bg-white HEADER `}
      >
        <div className="flex items-center justify-between w-full pr-2">
          <ProfileBox />
          <img
            onClick={() => navigate({ deviceTypePage })}
            className="w-40"
            src={Grest_Logo}
            alt="app logo"
          />
        </div>
      </div>

      <div className="max-w-[900px]  md:mx-auto">
        <p className="mx-2 my-4 text-xl font-medium">Device Quote Details</p>
        <div className={` ${styles.QuoteCardShadow} rounded-md p-2 mx-2`}>
          <div className="flex items-center gap-4">
            <div>
              <img
                className="w-[50px]"
                src={phoneFrontPhoto ? phoneFrontPhoto : DummyImg}
                alt=""
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="font-medium text-gray-700">
                {`${deviceModalInfo.models?.name}${
                  deviceModalInfo.models?.type === "Mobile"
                    ? `(${deviceModalInfo.models?.config?.RAM}/${deviceModalInfo.models?.config?.storage})`
                    : ""
                }`}
              </p>
              <p className="text-[#EC2752] font-semibold">₹{displayPrice}</p>
            </div>
          </div>
          <QuoteModal
            show={showModal}
            handleClose={toggleModal}
            setQuoteSaved={setQuoteSaved}
            quoteId={quoteId}
            bonusPrice={bonus}
          ></QuoteModal>
          {quoteSaved === false && exactQuoteValue === "true" && (
            <div className="flex flex-row items-center justify-between px-2 my-2">
              <div className="w-[40%] font-medium text-gray-700">
                Bonus Amount :
              </div>
              <div className="rounded-md bg-[#f6f6f6] py-2 w-[55%] border-2 border-[#EC2752] flex flex-col items-center justify-center">
                <input
                  className="bg-transparent outline-none my-auto text-center font-medium text-[#EC2752]"
                  name="bonus"
                  id="bonus"
                  type="number"
                  placeholder="Enter Bonus Amount"
                  value={bonus}
                  maxLength={6}
                  onKeyDown={(e) => {
                    if (
                      e.key === "-" ||
                      e.key === "+" ||
                      e.key === "e" ||
                      e.key === "." ||
                      e.key === "E"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    if (
                      Number(e.target.value) >= 0 &&
                      Number(e.target.value) <= 2000
                    ) {
                      setBonus(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          )}
          <div className="mx-1 my-4 border-b-2 border-gray-400 border-dashed "></div>
          <div className="flex items-center justify-between">
            <p
              className="text-gray-700 text-[17px] underline font-medium"
              onClick={showDeviceReportHandler}
            >
              Device Report
            </p>
            {quoteSaved === false && (
              <button
                className="text-[#EC2752] border-2 border-[#EC2752] text-sm font-medium p-2 rounded-md "
                onClick={toggleModal}
              >
                Save Quote
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 flex flex-col w-full gap-2 p-4 border-t-2">
        {quoteSaved === false && exactQuoteValue === "true" && (
          <div className="flex gap-1">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={() => setTermsChecked(!termsChecked)}
            />
            <p className="font-medium">
              I agree to the
              <span className="text-[#EC2752] cursor-pointer">
                {" "}
                Terms & Conditions
              </span>
            </p>
          </div>
        )}
        <SubDeviceQuote
          savedBonus={savedBonus}
          Price={Price}
          bonus={bonus}
          quoteSaved={quoteSaved}
          exactQuoteValue={exactQuoteValue}
          termsChecked={termsChecked}
          continueOTPHandler={continueOTPHandler}
          deviceTypePage={deviceTypePage}
        />
      </div>
    </div>
  );
};
export default DeviceQuote;
const SubDeviceQuote = ({
  savedBonus,
  Price,
  bonus,
  quoteSaved,
  exactQuoteValue,
  termsChecked,
  continueOTPHandler,
  deviceTypePage,
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10); // 10 seconds countdown
  useEffect(() => {
    let timer;
    if (quoteSaved && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          console.log("Countdown:", prevCount - 1); // Log the countdown
          return prevCount - 1;
        });
      }, 1000);
    } else if (quoteSaved && countdown === 0) {
      navigate(deviceTypePage);
    }
    return () => clearInterval(timer);
  }, [quoteSaved, countdown, navigate]);
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col w-1/2 text-xl font-medium">
        <p>
          ₹
          {savedBonus
            ? Number(Price) + Number(bonus) - Number(savedBonus)
            : Number(Price) + Number(bonus)}
        </p>
      </div>
      {quoteSaved === false && exactQuoteValue === "true" && (
        <div
          onClick={termsChecked ? continueOTPHandler : undefined}
          className={`${
            termsChecked ? "bg-[#EC2752]" : "bg-gray-400 cursor-not-allowed"
          } py-1 rounded-lg cursor-pointer w-1/2 sm:max-w-[200px]  flex justify-between px-2 text-white items-center`}
        >
          <p className="font-medium mx-auto text-xl p-[6px] ">Continue</p>
        </div>
      )}
      {quoteSaved === false && exactQuoteValue === "false" && (
        <div
          onClick={() => navigate("/device/Qestions")}
          className="bg-[#EC2752] rounded-lg cursor-pointer w-1/2 sm:max-w-[200px] flex justify-between px-2 text-white items-center"
        >
          <p className="p-2 mx-auto text-lg font-medium ">Get Exact Value</p>
        </div>
      )}
      {quoteSaved === true && (
        <div
          onClick={() => navigate(deviceTypePage)}
          className="bg-[#EC2752] rounded-lg cursor-pointer w-1/2 sm:max-w-[200px] flex justify-between px-2 text-white items-center"
        >
          <p className="p-2 mx-auto text-lg font-medium ">
            Return To Home ({countdown}s){" "}
          </p>
        </div>
      )}
    </div>
  );
};
