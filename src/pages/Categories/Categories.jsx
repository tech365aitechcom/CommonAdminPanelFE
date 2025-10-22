import React, { useEffect, useRef, useState } from "react";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import AppFooter from "../../components/AppFooter";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import styles from "../SelectDevice/SelectDevice.module.css";
import { useNavigate } from "react-router";
import axios from "axios";
import laptop from "../../assets/laptop-logo.png";
import mobile from "../../assets/mobile-logo.png";
import watch from "../../assets/watch_logo.png";
import { ImCancelCircle } from "react-icons/im";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const DeviceTypeFilter = ({
  setSelectedBtn,
  setDeviceType,
  selectedBtn,
}) => {
  const categories = [
    { name: "Watches", image: watch, apiType: "Watch" },
    { name: "Mobiles", image: mobile, apiType: "Mobile" },
    { name: "Laptops", image: laptop, apiType: "Laptop" },
    { name: "More", image: null },
  ];

  const categoryContainerRef = useRef(null);

  const scrollDirection = (directive) => {
    const scrollAmount = 200;

    if (categoryContainerRef.current) {
      if (directive === "left") {
        categoryContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else if (directive === "right") {
        categoryContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };
  return (
    <div className={`${styles.select_button_wrap}`}>
      <button
        className={`translate-x-3 ${styles.scroll_button}`}
        onClick={() => scrollDirection("left")}
      >
        <IoIosArrowBack size={30} />
      </button>
      <div
        className={`flex flex-shrink-0 gap-4 overflow-x-auto px-1 scrollbar-hide scroll-smooth ${styles.select_button_box}`}
        ref={categoryContainerRef}
      >
        {categories.map((category, index) => (
          <div
            onClick={() => {
              setSelectedBtn(category.name);
              setDeviceType(category.apiType);
            }}
            key={index}
            className={
              selectedBtn === category.name
                ? styles.button_checked
                : styles.button_unchecked
            }
          >
            {category.image && <img src={category.image} alt={category.name} />}
            <span>{category.name}</span>
          </div>
        ))}
      </div>
      <button
        className={`-translate-x-3 ${styles.scroll_button}`}
        onClick={() => scrollDirection("right")}
      >
        <IoIosArrowForward size={30} />
      </button>
    </div>
  );
};

function deviceSetter(DevType) {
  if (DevType === "Mobile") {
    return "Mobiles";
  } else if (DevType === "Laptop") {
    return "Laptops";
  } else if (DevType === "Watch") {
    return "Watches";
  }
  return "More";
}

function Categories() {
  const Device = sessionStorage.getItem("DeviceType");
  const selBtn = deviceSetter(Device);
  const [brandList, setBrandList] = useState([]);
  const [popout, setPopout] = useState(false);
  const userToken = sessionStorage.getItem("authToken");
  const [selectedBtn, setSelectedBtn] = useState(selBtn);
  const [deviceType, setDeviceType] = useState(Device);

  useEffect(() => {
    console.log(deviceType);
    sessionStorage.setItem("DeviceType", deviceType);
  }, [deviceType]);

  const navigate = useNavigate();

  const handleBrandClick = (brandItem) => {
    console.log("morere", deviceType);
    if (deviceType === "Laptop" || deviceType === undefined) {
      handleDeviceClick();
    } else if (deviceType === "Watch" && brandItem.name !== "Apple") {
      handleDeviceClick();
    } else {
      const detail = { brand: brandItem, models: {}, _id: brandItem._id };
      sessionStorage.setItem("dataModel", JSON.stringify(detail));
      navigate(`/selectdevice/${detail.brand?._id}`);
    }
  };

  const handleDeviceClick = () => {
    setPopout(true);
  };
  const hanldeclose = () => {
    setPopout(false);
  };

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/brands/getBrands?deviceType=${deviceType}`,
        {
          headers: {
            authorization: `${userToken}`,
          },
        }
      )
      .then((res) => {
        setBrandList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deviceType]);

  console.log(brandList);

  return (
    <>
      {popout && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-[270px]  w-[270px] bg-white rounded-md ease-in-out duration-300">
          <div className="text h-[270px]   w-[270px] flex items-center justify-center flex-col relative">
            <ImCancelCircle
              className="absolute top-[7px] right-3"
              size={25}
              onClick={hanldeclose}
            />
            <div className="text-4xl font-bold text-[#EC2752] p text-center">
              Coming
            </div>
            <div className="text-4xl font-bold text-[#EC2752] p text-center">
              Soon !
            </div>
          </div>
        </div>
      )}
      <div
        className={
          popout
            ? `flex flex-col pb-16 bg-[#0e0e0d4d] min-h-[100vh] `
            : `flex flex-col pb-16 min-h-[100vh]`
        }
      >
        <div className="flex items-center w-screen h-16 py-4 bg-white border-b-2 HEADER ">
          <div className="flex items-center justify-between w-full ">
            <ProfileBox />

            <img
              onClick={() => navigate("/selectdevicetype")}
              className="w-40"
              src={Grest_Logo}
              alt="app logo"
            />
          </div>
        </div>
        <DeviceTypeFilter
          selectedBtn={selectedBtn}
          setSelectedBtn={setSelectedBtn}
          setDeviceType={setDeviceType}
        />
        <div
          className={` ${styles.cardsContainer} m-4 flex flex-wrap justify-center gap-2 md:gap-8 rounded-md`}
        >
          {brandList &&
            brandList.map((model) => (
              <div
                key={model._id}
                className={`${styles.card} bg-white w-[30%] md:w-[20%] lg:w-[15%] xl:w-[16%] rounded-lg gap-2 flex flex-col items-center px-2 pt-4 pb-2 text-center`}
                onClick={() => handleBrandClick(model)}
              >
                <div className="imagecont h-[60px] w-[80px] flex items-center justify-center">
                  <img
                    className="w-[60px] mb-2"
                    src={model?.logo}
                    alt={model.name}
                  />
                </div>
                <p className="text-[14px] font-medium">{model.name}</p>
              </div>
            ))}
        </div>

        <AppFooter />
      </div>
    </>
  );
}

export default Categories;
