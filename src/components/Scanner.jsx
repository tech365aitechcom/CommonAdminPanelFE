import React, { useState, useEffect } from "react";
import Quagga from "quagga";
import { IoMdArrowRoundBack } from "react-icons/io";
import styles from "../styles/Scanner.module.css";

const Scanner = (props) => {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("steady");

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#interactive"),
        },
        decoder: {
          readers: ["code_128_reader"],
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );

    Quagga.onDetected(onDetected);
    Quagga.onProcessed(onProcessed);
    Quagga.stop();

    return () => {
      Quagga.offProcessed(onProcessed);
      Quagga.offDetected(onDetected);
      Quagga.stop();
    };
  }, []);

  const onDetected = (res) => {
    console.log(res);
    setResult(res.codeResult.code);
    setStatus("success");
    props.setImei(res.codeResult.code);
    Quagga.stop();
    props.scanBoxSwitch();
  };

  const onProcessed = (result1) => {
    if (result1) {
      setStatus("error");
    }
  };

  return (
    <React.Fragment>
      <div className={`my-auto ${styles.scan_page_wrap}`}>
        <div
          className={"flex flex-row gap-4 w-full items-center justify-center"}
        >
          <button className="mb-2" onClick={props.scanBoxSwitch}>
            <IoMdArrowRoundBack size={20} className="mr-1" />
            Back
          </button>
        </div>
        <div
          id="interactive"
          className={`border-2 ${status === "steady" && "border-primary"} ${
            status === "success" && "border-green-300"
          } ${status === "error" && "border-red-500"}`}
        ></div>
        <p className={"mx-5"}>
          <span className={"text-xs font-medium"}>Last result: {result}</span>
        </p>
      </div>
    </React.Fragment>
  );
};

export default Scanner;
