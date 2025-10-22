import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { CiSearch, CiBarcode } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import AppFooter from "../../components/AppFooter";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import { useNavigate } from "react-router";
import styles from "./SelectDeviceType.module.css";
import apple from "../../assets/apple-logo.png";
import poco from "../../assets/POCO.png";
import real from "../../assets/real-logo.png";
import vivo from "../../assets/Vivo-Logo.png";
import onepluse from "../../assets/oneplus-logo.png";
import mi from "../../assets/mi-logo.jpg";
import smasung from "../../assets/samsung-logo.png";
import laptop from "../../assets/laptop-logo.png";
import mobile from "../../assets/mobile-logo.png";
import watch from "../../assets/watch_logo.png";
import appleWatch from "../../assets/apple_watch.png";
import searchImage from "../../assets/mobileSearch.png";
import Scanner from "../../components/Scanner";
import sellPhones from "../../assets/sell_phones.jpg";
import how1 from "../../assets/how1.png";
import how2 from "../../assets/how2.png";
import how3 from "../../assets/how3.png";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { Link } from "react-router-dom";
import { useQuestionContext } from "../../components/QuestionContext";
import FromDatecom from "../../components/fromdate_todate_Com/FromDatecom";
import { toast } from "react-hot-toast";
import { ImCancelCircle } from "react-icons/im";
import Oppo from "../../assets/Oppo.png";

export const OrderStatusBox = ({ title, figures, background }) => {
  return (
    <div
      style={{ backgroundColor: background }}
      className={`text-center rounded-lg border-none text-white text-[0.8rem] flex-col items-center justify-center border-2 ${styles.order_box}`}
    >
      <div
        className={`flex flex-col items-center h-full ${styles.order_box_con}`}
      >
        <p className="font-semibold text-[1.1rem]">
          {figures !== undefined ? figures : 0}
        </p>
        <p>{title}</p>
      </div>
    </div>
  );
};

export const DeviceTypeFilter = ({
  selectedBtn,
  setSelectedBtn,
  setDeviceType,
}) => {
  const categories = [
    { name: "Mobiles", image: mobile, apiType: "Mobile" },
    { name: "Laptops", image: laptop, apiType: "Laptop" },
    { name: "Watches", image: watch, apiType: "Watch" },
    { name: "More", image: null },
  ];

  const categoryContainerRef = useRef(null);

  const scrollCategory = (direction) => {
    const scrollAmount = 200;

    if (categoryContainerRef.current) {
      if (direction === "left") {
        categoryContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else if (direction === "right") {
        categoryContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };
  return (
    <div className={styles.select_button_wrap}>
      <button
        className={`translate-x-3 ${styles.scroll_button}`}
        onClick={() => scrollCategory("left")}
      >
        <IoIosArrowBack size={30} />
      </button>
      <div
        ref={categoryContainerRef}
        className={`flex flex-shrink-0 gap-4 px-1 overflow-x-auto scrollbar-hide scroll-smooth ${styles.select_button_box}`}
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className={
              selectedBtn === category.name
                ? styles.button_checked
                : styles.button_unchecked
            }
            onClick={() => {
              setSelectedBtn(category.name);
              setDeviceType(category.apiType);
            }}
          >
            {category.image && <img src={category.image} alt={category.name} />}
            <span>{category.name}</span>
          </div>
        ))}
      </div>
      <button
        className={`-translate-x-3 ${styles.scroll_button}`}
        onClick={() => scrollCategory("right")}
      >
        <IoIosArrowForward size={30} />
      </button>
    </div>
  );
};

const ImgSelectore = (ImgItem) => {
  if (ImgItem?.phonePhotos?.front) {
    return ImgItem?.phonePhotos?.front;
  } else if (ImgItem?.type === "Mobile") {
    return mobile;
  } else {
    return appleWatch;
  }
};

export const TopSelling = ({ topModels }) => {
  const carContainerRef = useRef(null);
  const navigate = useNavigate();
  const scrollCars = (direction) => {
    const scrollAmount = 200; // Adjust the scroll amount as needed

    if (carContainerRef.current) {
      if (direction === "left") {
        carContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else if (direction === "right") {
        carContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const handleTopDeviceClick = (item) => {
    const detail = { models: item };
    sessionStorage.setItem("dataModel", JSON.stringify(detail));
    sessionStorage.setItem("dataModelConfig", JSON.stringify(item));
    navigate("/selectmodel");
  };

  return (
    <div className={styles.topSell_wrap}>
      <button
        className={`translate-x-3 ${styles.scroll_button}`}
        onClick={() => scrollCars("left")}
      >
        <IoIosArrowBack size={30} />
      </button>
      <div
        ref={carContainerRef}
        className={`flex flex-shrink-0 gap-4 px-1 overflow-x-auto scrollbar-hide scroll-smooth ${styles.topSell_box}`}
      >
        {topModels.map((item) => (
          <div
            onClick={() => handleTopDeviceClick(item)}
            key={item._id}
            className={styles.topSell_card}
          >
            <img src={item?.imgSrc} />
            <p>{item?.name}</p>
          </div>
        ))}
      </div>
      <button
        className={`-translate-x-3 ${styles.scroll_button}`}
        onClick={() => scrollCars("right")}
      >
        <IoIosArrowForward size={30} />
      </button>
    </div>
  );
};

const BrandImgSetter = ({ brandItem }) => {
  return (
    <React.Fragment>
      {brandItem.name === "Apple" && (
        <img className="mx-auto" src={apple} alt={brandItem.name} />
      )}
      {brandItem.name === "OnePlus" && (
        <img className="mx-auto" src={onepluse} alt={brandItem.name} />
      )}
      {brandItem.name === "POCO" && (
        <img className="mx-auto" src={poco} alt={brandItem.name} />
      )}{" "}
      {brandItem.name === "Realme" && (
        <img className="mx-auto" src={real} alt={brandItem.name} />
      )}
      {brandItem.name === "Xiaomi" && (
        <img className="mx-auto" src={mi} alt={brandItem.name} />
      )}
      {brandItem.name === "Samsung" && (
        <img className="mx-auto" src={smasung} alt={brandItem.name} />
      )}
      {brandItem.name === "Vivo" && (
        <img className="mx-auto" src={vivo} alt={brandItem.name} />
      )}
      {brandItem.name === "OPPO" && (
        <img className="mx-auto" src={Oppo} alt={brandItem.name} />
      )}
      {brandItem.name === "More" && <p>{brandItem.name}</p>}
    </React.Fragment>
  );
};

export const BrandList = ({ deviceType }) => {
  const userToken1 = sessionStorage.getItem("authToken");
  const [brandList, setBrandList] = useState([]);
  const [popout, setPopout] = useState(false);
  const navigate = useNavigate();
  const brandContainerRef = useRef(null);

  const scrollBrand = (direction) => {
    const scrollAmount = 200;
    if (brandContainerRef.current) {
      if (direction === "left") {
        brandContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else if (direction === "right") {
        brandContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/brands/getBrands?deviceType=${deviceType}`,
        {
          headers: { authorization: `${userToken1}` },
        }
      )
      .then((res) => {
        setBrandList(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deviceType]);

  const handleDeviceClick = () => {
    setPopout(true);
  };
  const hanldeclose = () => {
    setPopout(false);
  };

  const handleBrandClick = (brandItem) => {
    console.log("adasdasasfdafadf", deviceType);
    if (deviceType === "Laptop" || deviceType === undefined) {
      handleDeviceClick();
    } else if (deviceType === "Watch" && brandItem.name !== "Apple") {
      handleDeviceClick();
    } else if (
      brandItem.name === "Apple" ||
      brandItem.name === "OnePlus" ||
      brandItem.name === "POCO" ||
      brandItem.name === "Realme" ||
      brandItem.name === "Xiaomi" ||
      brandItem.name === "Samsung" ||
      brandItem.name === "Vivo" ||
      brandItem.name === "iQOO" ||
      brandItem.name === "Infinix" ||
      brandItem.name === "Tecno" ||
      brandItem.name === "Google" ||
      brandItem.name === "Nothing" ||
      brandItem.name === "Honor" ||
      brandItem.name === "Motorola" ||
      brandItem.name === "Nokia" ||
      brandItem.name === "OPPO"||
      brandItem.name === "Lenovo"
    ) {
      const detail = { brand: brandItem, models: {}, _id: brandItem._id };
      sessionStorage.setItem("dataModel", JSON.stringify(detail));
      navigate(`/selectdevice/${detail.brand?._id}`);
    } else {
      handleDeviceClick();
    }
  };

  const isArray = Array.isArray(brandList);
  const sortedModels = isArray
    ? [...brandList].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      })
    : [];

  return (
    <>
      {popout && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-full bg-[#0e0e0d4d] z-10"
            onClick={hanldeclose}
          ></div>
          <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-[270px]  w-[270px] bg-white rounded-md ease-in-out duration-300 z-20">
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
        </>
      )}
      <div className={styles.topSell_wrap}>
        <button
          className={`translate-x-3 ${styles.scroll_button}`}
          onClick={() => scrollBrand("left")}
        >
          <IoIosArrowBack size={30} />
        </button>
        <div
          ref={brandContainerRef}
          className={`flex flex-shrink-0 gap-4 px-1 overflow-x-auto  scroll-smooth scrollbar-hide ${styles.topSell_box}`}
        >
          {brandList &&
            brandList.length > 0 &&
            brandList.map((brandItem, index) => (
              <div
                key={index}
                onClick={() => handleBrandClick(brandItem)}
                className={`flex-shrink-0  ${styles.brand_card} px-[20px] py-[10px]`}
              >
                <img
                  className=" w-[50px]"
                  src={brandItem.logo}
                  alt={brandItem.name}
                />
              </div>
            ))}
        </div>
        <button
          className={`-translate-x-3 ${styles.scroll_button}`}
          onClick={() => scrollBrand("right")}
        >
          <IoIosArrowForward size={30} />
        </button>
      </div>
    </>
  );
};

const selBtn = (Device) => {
  if (Device === "Mobile") {
    return "Mobiles";
  } else if (Device === "Laptop") {
    return "Laptops";
  } else if (Device === "Watch") {
    return "Watches";
  } else {
    return "More";
  }
};

const searchDeviceAPI = async (val) => {
  let brand = "";
  let model = "";
  await axios
    .get(
      `https://alpha.imeicheck.com/api/modelBrandName?imei=${val}&format=json`
    )
    .then((response) => {
      console.log(response);
      brand = response?.data?.object?.brand;
      model = response?.data?.object?.name;
    })
    .catch((error) => {
      console.error(`Error fetching data: ${error}`);
    });
  return { brand: brand, model: model };
};

const searchPhoneAPI = async (Sdata, deviceType) => {
  const userToken = sessionStorage.getItem("authToken");
  let response = {};
  await axios
    .post(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/user/Dashboard/search/phones`,
      { name: Sdata, deviceType: deviceType },
      { headers: { authorization: `${userToken}` } }
    )
    .then((res) => {
      const updatedData = res.data.map((item) => ({
        ...item,
        imgSrc: ImgSelectore(item),
      }));
      response = updatedData;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const fetchDataAPI = async (days, fromDateDup, toDateDup, deviceType) => {
  const userToken = sessionStorage.getItem("authToken");
  let response1;
  let response2;
  try {
    response2 = await axios.get(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/user/Dashboard/order/saled?time=${days}&fromdate=${fromDateDup}&todate=${toDateDup}&datareq=${deviceType}`,
      { headers: { authorization: `${userToken}` } }
    );
    response1 = await axios.get(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/leadSet/getCount?time=${days}&fromdate=${fromDateDup}&todate=${toDateDup}&datareq=${deviceType}`,
      { headers: { authorization: `${userToken}` } }
    );
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
  return { response2: response2, response1: response1 };
};

const SelectDeviceType = () => {
  const Device = sessionStorage.getItem("DeviceType");
  const token = sessionStorage.getItem("authToken");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { fromDateDup, setFromDateDup, toDateDup, setToDateDup } =
    useQuestionContext();
  const [showFromdate, setshowFromdate] = useState(false);
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [days, setDays] = useState("today");
  const [orderSaled, setOrderSaled] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [deviceType, setDeviceType] = useState(Device);
  const [cutomSearch, setCustomSearch] = useState(false);
  const [topModels, setTopmodels] = useState([]);
  const [imei, setImei] = useState("");
  const [data, setData] = useState(null);
  const [modelsL, setModel] = useState([]);

  const searchBoxSwitch = () => {
    setModel([]);
    setIsSearchBoxOpen(!isSearchBoxOpen);
  };

  function searchCustom() {
    if (fromDateDup !== "" && toDateDup !== "") {
      setCustomSearch(!cutomSearch);
    } else {
      toast.error("Enter both date field");
    }
  }

  const handleFromDateChange = (date, e) => {
    if (date === null) {
      setFromDate("");
    } else {
      setFromDate(date);
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      setFromDateDup(formattedDate);
    }
  };

  const handleToDateChange = (date) => {
    if (date === null) {
      setToDate("");
    } else {
      setToDate(date);
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      setToDateDup(formattedDate);
    }
  };

  const searchDevice = async (val) => {
    const temp = await searchDeviceAPI(val);
    setData(`${temp?.brand} ${temp?.model}`);
  };

  const searchPhone = async (tempData, typeDevice) => {
    const tempRes = await searchPhoneAPI(tempData, typeDevice);
    setModel(tempRes || []);
  };

  useEffect(() => {
    if (data) {
      searchPhone(data, "Mobile");
    }
  }, [data]);

  useEffect(() => {
    if (imei.length >= 15) {
      searchDevice(imei);
    } else if (imei.length >= 3 && !/^\d+$/.test(imei.slice(0, 3))) {
      searchPhone(imei, deviceType);
    }
  }, [imei]);

  useEffect(() => {
    sessionStorage.setItem("DeviceType", deviceType);
  }, [deviceType]);

  const fetchData = async () => {
    const temp = await fetchDataAPI(days, fromDateDup, toDateDup, deviceType);
    setOrderSaled(temp?.response2?.data?.count);
    setQuoteCount(temp?.response1?.data?.data?.quoteData?.count);
    setOrderCount(temp?.response1?.data?.data?.orderData?.count);
  };

  useEffect(() => {
    fetchData();
  }, [days, cutomSearch, deviceType]);

  useEffect(() => {
    const fetchtop = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_ENDPOINT
          }/api/user/Dashboard/get/top/sellingModels?time=${days}&deviceType=${deviceType}`,
          { headers: { authorization: `${token}` } }
        );
        const updatedData = await response.data.map((item) => ({
          ...item,
          imgSrc: ImgSelectore(item),
        }));
        console.log(updatedData);
        setTopmodels(updatedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchtop();
  }, [days, deviceType]);

  const handlepick = (e) => {
    if (e.target.value === "Custom") {
      console.log("customr daba h ");
      setshowFromdate(true);
    } else {
      console.log("days", e.target.value);
      setDays(e.target.value);
      setshowFromdate(false);
    }
  };

  return (
    <div className={`bg-[#f9f9f9d8] bg-white ${styles.home_page_wrap}`}>
      <SearchBox
        isSearchBoxOpen={isSearchBoxOpen}
        searchBoxSwitch={searchBoxSwitch}
        setImei={setImei}
        imei={imei}
        modelsL={modelsL}
        days
      />
      <MiddlePart
        searchBoxSwitch={searchBoxSwitch}
        setDeviceType={setDeviceType}
        deviceType={deviceType}
        handlepick={handlepick}
        days={days}
        orderCount={orderCount}
        quoteCount={quoteCount}
        orderSaled={orderSaled}
        topModels={topModels}
      />
      {!isSearchBoxOpen && <AppFooter days={days} />}
      <FromDatecom
        showFromdate={showFromdate}
        toDate={toDate}
        handleToDateChange={handleToDateChange}
        fromDate={fromDate}
        handleFromDateChange={handleFromDateChange}
        setshowFromdate={setshowFromdate}
        searchCustom={searchCustom}
      ></FromDatecom>
    </div>
  );
};

export default SelectDeviceType;

const SearchBox = ({
  isSearchBoxOpen,
  searchBoxSwitch,
  setImei,
  imei,
  modelsL,
  days,
}) => {
  const [isScanOpen, setIsScanOpen] = useState(false);
  const navigate = useNavigate();

  const addPhoneView = async (modelId) => {
    const authToken = sessionStorage.getItem("authToken");
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/user/Dashboard/add/PhoneView?time=${days}`,
        {
          modelId: modelId,
        },
        {
          headers: {
            authorization: `${authToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding phone view: ", error);
    }
  };

  const handleDeviceClick = (model) => {
    const detail = { models: model };
    sessionStorage.setItem("dataModel", JSON.stringify(detail));
    sessionStorage.setItem("DeviceType", model.type);
    sessionStorage.setItem("dataModelConfig", JSON.stringify(model));
    navigate("/selectmodel");
    addPhoneView(model._id);
  };
  const isArray = Array.isArray(modelsL);
  const sortedModels = isArray
    ? [...modelsL].sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/), 10);
        const numB = parseInt(b.name.match(/\d+/), 10);
        return numA - numB;
      })
    : [];
  return (
    <React.Fragment>
      <div className="flex items-center w-screen h-16 py-4 bg-white border-b-2 HEADER ">
        <div className="flex items-center justify-between w-full pr-2">
          <ProfileBox />
          <img className="w-40" src={Grest_Logo} alt="app logo" />
        </div>
      </div>
      {isSearchBoxOpen && (
        <div className={`${styles.search_page} min-h-screen  `}>
          <div className={styles.search_box_wrap}>
            <div className={`flex items-center p-2 mb-1 ${styles.search_box}`}>
              <div className="flex items-center" onClick={searchBoxSwitch}>
                <IoClose size={20} className="inline ml-1" />
              </div>
              <input
                placeholder="Search Product with Name/IMEI"
                className="inline w-full mx-2 outline-none"
                type="text"
                onChange={(e) => setImei(e.target.value)}
                value={imei}
                autoFocus={true}
              />
              <div
                className="flex items-center"
                onClick={() => setIsScanOpen(!isScanOpen)}
              >
                <CiBarcode size={20} className={"inline mr-1 text-[#EC2752]"} />
              </div>
            </div>
          </div>
          {imei.length > 0 && sortedModels.length > 0 ? (
            <div
              className={`   mx-auto mt-4 justify-center  w-full  flex flex-wrap gap-2  max-h-screen overflow-y-scroll pb-[15vh] `}
            >
              {sortedModels &&
                sortedModels.map((model) => (
                  <div
                    key={model._id}
                    className={` ${
                      sortedModels.length < 3
                        ? "min-w-[30%] max-w-[30%]"
                        : "w-[30%]"
                    }  h-auto  gap-2 flex flex-col items-center px-2 py-4  text-center`}
                    style={{ boxShadow: "0 0 10px 0 rgb(0 0 0 / 0.1)" }}
                    onClick={() => handleDeviceClick(model)}
                  >
                    <img className="w-[50px] mb-2" src={model.imgSrc} alt="" />
                    <p className="text-[11px] font-medium">{model.name}</p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col my-auto text-sm font-medium text-gray-500">
              <img className="w-[250px] mx-auto" src={searchImage} />
              <div>
                Dial <span className="text-[#EC2752]">*#06#</span> on customer's
                old device and
              </div>
              <div>
                Scan the IMEI using the{" "}
                <CiBarcode className="inline text-[#EC2752]" size={20} /> on top
                right.
              </div>
            </div>
          )}
        </div>
      )}
      {isScanOpen && (
        <div className={styles.search_page}>
          <Scanner
            scanBoxSwitch={() => setIsScanOpen(!isScanOpen)}
            setImei={setImei}
          />
        </div>
      )}
    </React.Fragment>
  );
};

const MiddlePart = ({
  searchBoxSwitch,
  setDeviceType,
  deviceType,
  handlepick,
  days,
  orderCount,
  quoteCount,
  orderSaled,
  topModels,
}) => {
  const Device1 = sessionStorage.getItem("DeviceType");
  const [selectedBtn, setSelectedBtn] = useState(() => selBtn(Device1));

  return (
    <div className={styles.des_main_wrap}>
      <div className={styles.des_lr_wrap}>
        <div className={styles.des_left_wrap}>
          <div className={styles.search_box_wrap} onClick={searchBoxSwitch}>
            <div
              className={`flex items-center p-2 mb-1 w-[100%] ${styles.search_box}`}
            >
              <div className="flex items-center">
                <CiSearch size={20} className="inline ml-1" />
              </div>
              <input
                placeholder="Search Products"
                className="inline w-full mx-2 outline-none"
                type="text"
              />
              <div className="flex items-center">
                <CiBarcode size={20} className="inline mr-1 text-[#EC2752]" />
              </div>
            </div>
          </div>
          <DeviceTypeFilter
            selectedBtn={selectedBtn}
            setSelectedBtn={setSelectedBtn}
            setDeviceType={setDeviceType}
          />
          <BrandList deviceType={deviceType} />
          <div className="ml-3">
            <select
              name=""
              id=""
              onChange={(e) => {
                handlepick(e);
              }}
              className="p-2 border-2 rounded-lg shadow-md outline-none bg-[#EC275271] text-white"
              style={{ backgroundColor: "#ec275271", color: "white" }}
            >
              <option
                value="today"
                style={{ backgroundColor: "white", color: "black" }}
              >
                Today
              </option>
              <option
                value="yesterday"
                style={{ backgroundColor: "white", color: "black" }}
              >
                Yesterday
              </option>
              <option
                value="7days"
                style={{ backgroundColor: "white", color: "black" }}
              >
                7 Days
              </option>
              <option
                value="thismonth"
                style={{ backgroundColor: "white", color: "black" }}
              >
                This Month
              </option>
              <option
                value="lastmonth"
                style={{ backgroundColor: "white", color: "black" }}
              >
                Last Month
              </option>
              <option
                value="Custom"
                style={{ backgroundColor: "white", color: "black" }}
              >
                Custom
              </option>
            </select>
          </div>

          <div className={`flex gap-2 justify-between ${styles.info_wrap}`}>
            <Link className="w-[33%]" to={`/orderscreated/${days}`}>
              <OrderStatusBox
                figures={orderCount}
                title="Order Created"
                background="rgb(2, 117, 242)"
              />
            </Link>
            <Link className="w-[33%]" to={`/orderscompleted/${days}`}>
              <OrderStatusBox
                figures={orderSaled}
                title="Order Completed"
                background="#E94A4E"
              />
            </Link>
            <Link className="w-[33%]" to={`/quotescreated/${days}`}>
              <OrderStatusBox
                figures={quoteCount}
                title="Quotes Created"
                background="#FF963E"
              />
            </Link>
          </div>
          <p
            className={`${styles.topSell_head} text-lg font-bold text-[#EC2752]`}
          >
            Top Selling Models
          </p>
          <TopSelling topModels={topModels} />
        </div>
        <div className={styles.des_right_wrap}>
          <div className={styles.sellPhones_head}>
            <p className="font-black text-9xl">SELL</p>
            <span className="text-2xl font-medium">Used Products to Us</span>
          </div>
          <img className="w-[100%]" src={sellPhones} />
        </div>
      </div>
      <p
        className={`${styles.topSell_head} text-lg font-bold mt-2 text-[#EC2752]`}
      >
        How Unicorn Works?
      </p>
      <div className="flex gap-2 mt-4 mb-[px] pb-[80px] justify-between mx-2">
        <div className="flex flex-col min-w-[30%]  items-center  ">
          <img className={`w-[50px] mb-2`} src={how1} />
          <p className="-mb-1 text-base font-bold">Add</p>
          <p className="text-sm font-medium opacity-60">Product Details</p>
        </div>
        <div className="flex flex-col min-w-[30%] items-center  ">
          <img className={`w-[50px] mb-2`} src={how2} />
          <p className="-mb-1 text-base font-bold">Exchange</p>
          <p className="text-sm font-medium opacity-60">Your Device</p>
        </div>
        <div className="flex flex-col min-w-[30%] items-center  ">
          <img className={`w-[50px] mb-2`} src={how3} />
          <p className="-mb-1 text-base font-bold">Get Paid</p>
          <p className="text-sm font-medium opacity-60">Instantly</p>
        </div>
      </div>
    </div>
  );
};
