import React, { useState, useEffect } from "react";
import styles from "../components/ContOTP/ContOTP.module.css";
import optImg from "../assets/otpLogo.svg";
import OtpInput from "otp-input-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOtpVerified } from "../store/slices/otpSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { MdEdit } from "react-icons/md";
import ProfileBox from "../components/ProfileBox/ProfileBox";
import Grest_Logo from "../assets/Grest_Logo.jpg";
import { setLeadOTPData } from "../store/slices/responseSlice";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function OTPpage({ setChange, change, setNumber }) {
  const initVal = useSelector( state => state.responseData);
  const navigate = useNavigate();
  const [ph, setPh] = useState(initVal.phone);
  const [otpBoxOpen, setOtpBoxOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(30);
  const [disableResend, setDisableResend] = useState(false);
  const [firstTime, setFirstIme] = useState(true);
  const [otpData, setOtpData] = useState({
    name: initVal.name,
    email: initVal.email,
    phone: initVal.phone,
  });
  const [errMsg, setErrMsg] = useState("");
  const handleChange = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value,
    });
  };
  const handleNumberEdit = () => {
    setLoading(false);
    setOtpBoxOpen(!otpBoxOpen);
  };
  const onSignupDup = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(otpData.name.length < 3){
      setErrMsg("Name: (Size Must Be >= 3)");
      return;
    }

    if (otpData.email.length < 5) {
      setErrMsg("Email: (Size Must Be >= 5)");
      return;
    } else if (!emailRegex.test(otpData.email)) {
      setErrMsg("Invalid Email Format");
      return;
    }

    if(otpData.phone.length !== 10){
      setErrMsg("Mobile: (Must have 10 Digits)");
      return;
    }
    setErrMsg("");
    setLoading(true);
    const formatPh = "+" + ph;
    console.log(formatPh);
    setLoading(false);
    setOtpBoxOpen(true);
    setDisableResend(true);
    setOtpData({
      ...otpData,
      phone: ph,
    });
  };
  const resendOTPDup = () => {
    setDisableResend(true);
  };
  const onOTPVerifyDup = () => {
    setLoading(true);
    if (otp === "123456") {
        console.log("ho gya");
        localStorage.setItem("otpData", JSON.stringify(otpData));
        dispatch(setOtpVerified(true));
        dispatch(setLeadOTPData(otpData));
    } else {
      setLoading(false);
    }
  };

  function onCaptchVerify() {
    console.log(auth);
    // For Firebase version 9 and above
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      },
    });
  }

  //on submit phone number
  function onSignup(event) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(otpData.name.length < 3){
      setErrMsg("Name: (Size Must Be >= 3)");
      return;
    }

    if (otpData.email.length < 5) {
      setErrMsg("Email: (Size Must Be >= 5)");
      return;
    } else if (!emailRegex.test(otpData.email)) {
      setErrMsg("Invalid Email Format");
      return;
    }

    if(otpData.phone.length !== 10){
      setErrMsg("Mobile: (Must have 10 Digits)");
      return;
    }
    setErrMsg("");
    setLoading(true);
    if (firstTime) {
      onCaptchVerify();
      setFirstIme(false);
    }

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+91" + ph;
    console.log(formatPh);
    //setNumber(formatPh);
    localStorage.setItem("otpData", JSON.stringify(otpData));
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setOtpBoxOpen(true);
        setDisableResend(true);
        // toast.success("OTP sended successfully!");
        console.log("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    setOtpData({
      ...otpData,
      phone: ph,
    });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        // setUser(res.user);
        // console.log("ho gya");
        //setChange(!change);
        console.log("ho gya");
        localStorage.setItem("otpData", JSON.stringify(otpData));
        dispatch(setOtpVerified(true));
        dispatch(setLeadOTPData(otpData));
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  //resend otp
  const resendOTP = () => {
    // Start the countdown timer
    setDisableResend(true);
    //onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+91" + ph;

    // Resend the OTP without changing the loading state
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("OTP resent successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let intrvl;
    if (disableResend && timer > 0) {
      intrvl = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setDisableResend(false);
    } else if (!disableResend) {
      setTimer(30);
    }
    return () => {
      clearInterval(intrvl);
    };
  }, [disableResend, timer]);

  useEffect(() => {
    localStorage.setItem("otpData", JSON.stringify(otpData));
  }, [otpData]);

  return (
    <div className={`${styles.contopt_page}`} style={{ zIndex: 9999 }}>
      <div className="absolute top-4 md:top-0 bg-white flex items-center justify-between w-full pr-2 py-2 rounded-md">
        <ProfileBox />
        <img
          onClick={() => navigate("/selectdevicetype")}
          className="w-40"
          src={Grest_Logo}
          alt="app logo"
        />
      </div>
      <div className={` ${styles.optbox_wrap}`}>
        <div className={`${styles.optimg_wrap}`}>
          <img src={optImg} />
        </div>
        <div className={`${styles.opt_heading} `}>
          <p className={`font-bold text-2xl`}>OTP Verificaiton</p>
          {otpBoxOpen ? (
            <div className={`flex ${styles.Editresponsive}`}>
              <span className="flex flex-col items-center justify-center text-sm font-medium opacity-60">
                OTP sent to
              </span>
              <span
                className="text-sm font-medium text-left ml-[2px] text-[#EC2752] flex items-center"
                onClick={handleNumberEdit}
              >
                <span className="text-sm font-medium opacity-60 text-[#000000]">
                  {" "}
                  +91-{ph}
                </span>
                <MdEdit /> Edit no.
              </span>
            </div>
          ) : (
            <span className={`flex flex-col items-center justify-center text-sm font-medium ${errMsg ? "text-red-500" : "opacity-60"} min-h-[40px]`}>
              {errMsg ? errMsg : "We will send you a one-time Password to this number."}
            </span>
          )}
        </div>
        <OTPComp
          otpBoxOpen={otpBoxOpen}
          otp={otp}
          errMsg={errMsg}
          setOtp={setOtp}
          otpData={otpData}
          handleChange={handleChange}
          ph={ph}
          setPh={setPh}
          setOtpData={setOtpData}
        />
        {otpBoxOpen && (
          <div className={styles.resend_otp_wrap}>
            <div className="flex flex-row gap-2  w-[300px] justify-center  text-sm font-medium">
              <span className="opacity-60 min-w-[132px] ">
                Didn't Receive OTP?
              </span>
              <button
                className=" text-left  min-w-[100px]"
                onClick={resendOTP}
                disabled={disableResend}
              >
                {disableResend ? `Resend in ${timer}` : "Resend OTP"}
              </button>
            </div>
          </div>
        )}

        <div className={`${styles.otp_button_wrap}`}>
          {otpBoxOpen ? (
            <>
              <button
                onClick={onOTPVerify}
                className={`${loading || !otp ? "opacity-[.8]" : ""}`}
                disabled={loading || !otp}
              >
                {loading && (
                  <div className={`${styles.spinner} -ml-4`}>
                    <LoadingSpinner />
                  </div>
                )}
                {loading ? (
                  <span className="-ml-4">Loading</span>
                ) : (
                  <span>Verify OTP</span>
                )}
              </button>

              <div id="recaptcha"></div>
            </>
          ) : (
            <>
              <button
                onClick={onSignup}
                className={`${loading ? "opacity-[.8]" : ""}`}
                disabled={loading}
              >
                {loading && (
                  <div className={`${styles.spinner} -ml-4`}>
                    <LoadingSpinner />
                  </div>
                )}
                {loading ? (
                  <span className="-ml-4">Loading</span>
                ) : (
                  <span>Get OTP</span>
                )}
              </button>
              <div id="recaptcha"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OTPpage;

const OTPComp = ({
  otpBoxOpen,
  otp,
  setOtp,
  otpData,
  handleChange,
  errMsg,
  ph,
  setPh,
  setOtpData,
}) => {
  return (
    <React.Fragment>
      {otpBoxOpen ? (
        <div className={`${styles.otp_field_wrap}`}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            OTPLength={6}
            otpType="number"
            disabled={false}
            autoFocus
            inputStyles={{
              border: "2px solid #EC2752",
              borderRadius: ".55rem",
              outline: "none",
              marginRight: "10px",
            }}
            className={styles.otp_field}
          />
        </div>
      ) : (
        <div className={`${styles.form_fields_wrap}`}>
          <div>
            <input
              id="name"
              name="name"
              placeholder="Enter Name *"
              value={otpData?.name}
              onChange={handleChange}
              className="border-2 border-[#EC2752] py-1 rounded-lg pl-[12px]"
            />
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email *"
              value={otpData?.email}
              onChange={handleChange}
              className="border-2 border-[#EC2752] py-1 rounded-lg pl-[12px]"
            />
          </div>
          <div className="w-[100%] flex flex-row">
            <div className="flex   border-[#EC2752] rounded-lg border-2  w-[85%] flex-row justify-start">
              <span className="px-3 py-1 text-gray-600 bg-gray-200 rounded-lg">
                +91
              </span>
              <input
                type="tel"
                id="phone"
                value={ph}
                maxLength="10"
                onChange={(e) => {
                  setPh(e.target.value);
                  setOtpData({
                    ...otpData,
                    ["phone"]: e.target.value,
                  });
                }}
                className=""
                placeholder="Enter your Mobile *"
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
