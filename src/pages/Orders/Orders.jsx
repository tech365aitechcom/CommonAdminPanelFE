import AppFooter from "../../components/AppFooter";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { useNavigate, useParams } from "react-router";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import styles from "../SelectDevice/SelectDevice.module.css";
import { useEffect, useState } from "react";
import OrdersCreated from "../OrdersCreated/OrdersCreated";
import OrdersCompleted from "../OrdersCompleted/OrdersCompleted";
import QuotesCreated from "../QuotesCreated/QuotesCreated";
const ordCreated = "Order Created";
function Orders() {
  const { daysfilter } = useParams();
  const navigate = useNavigate();
  const [selectedBtn, setselectedBtn] = useState(ordCreated);
  const [deviceTypeChanged, setDeviceTypeChanged] = useState(false);
  const buttonList = [ordCreated, "Order Completed", "Quotes Created"];
  const handleDeviceChange = (e) => {
    const val = e.target.value;
    sessionStorage.setItem("DeviceType", val);
    setDeviceTypeChanged((prev) => !prev);
  };
  useEffect(() => {
    console.log(deviceTypeChanged);
  }, [deviceTypeChanged]);
  return (
    <>
      <div className={`flex flex-col pb-16 bg-[#f9f9f84d] min-h-[100vh] `}>
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
        <div
          className={`flex flex-shrink-0 gap-4 px-1 ${styles.select_button_box} justify-evenly`}
        >
          {buttonList.map((val, index) => (
            <div
              key={index}
              onClick={() => {
                setselectedBtn(val);
              }}
              className={
                selectedBtn === val
                  ? `${styles.button_checked} text-center`
                  : `${styles.button_unchecked} text-center`
              }
            >
              {val}
            </div>
          ))}
        </div>
        <div>
          <select
            onChange={handleDeviceChange}
            name=""
            id=""
            className="shadow-lg p-2 rounded-lg m-4"
            defaultValue={sessionStorage.getItem("DeviceType")}
          >
            <option className="" value="Mobile">
              Mobile
            </option>
            <option value="Watch">Watch</option>
          </select>
        </div>
        {selectedBtn === ordCreated && (
          <OrdersCreated daysfilters={daysfilter} head={true} />
        )}
        {selectedBtn === "Order Completed" && (
          <OrdersCompleted daysfilters={daysfilter} head={true} />
        )}
        {selectedBtn === "Quotes Created" && (
          <QuotesCreated daysfilters={daysfilter} head={true} />
        )}
        <AppFooter />
      </div>
    </>
  );
}

export default Orders;
