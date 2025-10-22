import React, { useEffect, useState } from "react";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import FAQ from "../../components/FAQ";
import styles from "./SelectModel.module.css";
import { useNavigate } from "react-router";
// import ProfileBox from "../../components/ProfileBox/ProfileBox";
import store from "../../store/store";
import { useQuestionContext } from "../../components/QuestionContext";
import apple_watch from "../../assets/apple_watch.png";

const SelectModel = () => {
  const phoneImg = JSON.parse(sessionStorage.getItem("dataModel"));
  const phoneFrontPhoto =
    phoneImg?.models?.phonePhotos?.front ||
    phoneImg?.models?.phonePhotos?.upFront;
  const Device = sessionStorage.getItem("DeviceType");
  const DummyImg =
    Device === "Mobile"
      ? "https://grest-c2b-images.s3.ap-south-1.amazonaws.com/gresTest/1705473080031front.jpg"
      : apple_watch;
  const [modelData, setModelData] = useState();
  const { resetState } = useQuestionContext();
  const [selectedConfig, setSelectedConfig] = useState(() => {
    const modelConfigData = JSON.parse(
      sessionStorage.getItem("dataModelConfig")
    );
    return modelConfigData ? modelConfigData.config[0] : null;
  });
  const [configData, setConfigData] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("dataModel"));
    setModelData(data);
    const modelConfigData = JSON.parse(
      sessionStorage.getItem("dataModelConfig")
    );
    setConfigData(modelConfigData);

    setSelectedConfig(modelConfigData?.config[0]);
  }, []);

  const handleConfigClick = (configItem) => {
    setSelectedConfig(configItem);
  };

  const handleExactValue = () => {
    const data = JSON.parse(sessionStorage.getItem("dataModel"));
    const updatedData = {
      ...data,
      models: {
        ...data.models,
        config: selectedConfig,
      },
    };
    sessionStorage.setItem("dataModel", JSON.stringify(updatedData));

    store.dispatch({ type: "RESET_STATE" });
    resetState();

    if (Device === "Mobile") {
      navigate("/device/Qestions");
    } else {
      navigate("/watchQs");
    }
  };

  const handleQuickQuote = () => {
    const data = JSON.parse(sessionStorage.getItem("dataModel"));
    const updatedData = {
      ...data,
      models: {
        ...data.models,
        config: selectedConfig,
      },
    };
    sessionStorage.setItem("dataModel", JSON.stringify(updatedData));
    store.dispatch({ type: "RESET_STATE" });
    resetState();
    if (Device === "Mobile") {
      navigate("/quickquote");
    } else {
      console.log("watch");
    }
  };

  return (
    <div className={`bg-white min-h-screen`}>
      <div className="flex items-center w-screen h-16 py-4 bg-white border-b-2 HEADER ">
        <div className="flex items-center justify-between w-full pr-2">
          {/* <ProfileBox /> */}
          <img
            onClick={() => navigate("/selectdevicetype")}
            className="w-40"
            src={Grest_Logo}
            alt="app logo"
          />
        </div>
      </div>

      <div className={styles.select_model_wrap}>
        <div className={`flex flex-col ${styles.product_details_wrap}`}>
          <div className={` ${styles.modelCard}`}>
            <div className={` ${styles.mobile_img_wrap}`}>
              <img
                className="max-w-[128px] max-h-[130px]"
                src={phoneFrontPhoto ? phoneFrontPhoto : DummyImg}
                alt=""
              />
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <p className="text-xl font-medium">{modelData?.models?.name}</p>
              </div>

              <div>
                <p>Get Upto</p>
                <p className="font-bold text-2xl md:text-4xl text-[#EC2752]">
                  {selectedConfig?.price ? `₹${selectedConfig.price}` : "₹6000"}
                </p>
              </div>
              {Device !== "Watch" && (
                <div className="flex flex-wrap gap-2">
                  {configData?.config?.map((configItem, index) => (
                    <button
                      key={index}
                      className={
                        selectedConfig === configItem
                          ? styles.button_checked
                          : styles.button_unchecked
                      }
                      onClick={() => handleConfigClick(configItem)}
                    >
                      {configItem.RAM}/{configItem.storage}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* <div
            className={`px-2 gap-3 ${styles.button_wrap} ${
              Device === "Watch" && "justify-start"
            }`}
          >
            {Device === "Mobile" && (
              <button
                onClick={handleQuickQuote}
                className="border-2 border-[#EC2752] w-[48%] bg-white text-[#EC2752]  text-[12px]  px-4 py-2 rounded"
              >
                Quick Quote
              </button>
            )}
            <button
              onClick={handleExactValue}
              className={`border-2 border-[#EC2752] bg-[#EC2752] text-white text-[12px] px-4 py-2 rounded ${
                Device === "Watch" ? "w-full" : "w-[48%]"
              }`}
            >
              Get Exact Value
            </button>
          </div>
          <div className="bg-[#FBF3CD] mx-2 py-2 px-1 mt-1 rounded-lg text-[10px]">
            <p>
              This price stated above depends on the condition of your product
              and is not final. The final price offer will be quoted at the
              diagnosis by our experts.
            </p>
          </div> */}

          {/* <div className="mx-2 mt-2">
            <div className="text-[#EC2752] font-semibold text-2xl mb-2">
              FAQ's
            </div>
            <FAQ />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SelectModel;
