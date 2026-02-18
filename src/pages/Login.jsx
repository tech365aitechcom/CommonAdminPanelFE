import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Grest_Logo from "../assets/Grest_Logo.jpg";
import { useDispatch } from "react-redux";
import { setUserProfile, setStoreFilter } from "../store/slices/userSlice";
import "../styles/login.scss";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMailLock } from "react-icons/md";
import LoadingSpinner from "../components/LoadingSpinner";
import { IoEye, IoEyeOffSharp } from "react-icons/io5";
import { toast } from "react-hot-toast";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('profile');
    sessionStorage.removeItem('DeviceType');
    localStorage.clear();
  }, []);

  const userLogin = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(userEmail)) {
      toast.error("Please enter a valid email address");
    } else {
      setIsLoading(true);
      setError(null);
      axios
        .post(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/users/login`, {
          email: userEmail,
          password: userPassword,
        })
        .then((response) => {
          toast.success("login successfully");
          const { profile, authToken } = response.data;
          sessionStorage.setItem("authToken", authToken);
          sessionStorage.setItem("profile", JSON.stringify(profile));
          sessionStorage.setItem("DeviceType", "Mobile");
          localStorage.removeItem("formData");
          dispatch(setUserProfile(profile));
          dispatch(
            setStoreFilter({
              selStore: profile?.storeName,
              selRegion: profile?.region,
            })
          );
          console.log(profile.role);
          navigate("/companies");
        })
        .catch((err) => {
          toast.error("Please enter correct login credentials");
          setIsLoading(false);
          setError(
            err.response?.data?.error ||
              "Please enter correct login credentials"
          );
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white Container">
      <div className="flex flex-col items-center justify-center px-10 pb-4 secondContainer">
        <img className="w-48 pt-4 mt-2 mb-4" src={Grest_Logo} alt="app logo" />
        <h1 className="font-sans text-[#EC2752] mt-2 text-3xl font-bold sm:text-4xl">
          Login
        </h1>
        {error && <p className="text-sm text-red-500 sm:text-base">{error}</p>}
        <div
          id="loginForm"
          className="flex flex-col border-b-2 pb-6 gap-4 w-[32vw] formOuter"
        >
          <div className="">
            <label htmlFor="userEmail">Email</label>
            <div className="input">
              <MdOutlineMailLock
                size={25}
                style={{ margin: "0px 10px", color: "#EC2752" }}
              />
              <input
                type="text"
                id="userEmail"
                name="userEmail"
                placeholder="Enter email address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                className="relative block w-[85%] px-2 py-1 rounded-none appearance-none rounded-b-md focus:outline-none focus:z-10 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <div className="relative input">
              <RiLockPasswordLine
                size={25}
                style={{ margin: "0px 10px", color: "#EC2752" }}
              />
              <input
                type={showUserPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                required
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="relative block w-[85%] px-2 py-1 rounded-none appearance-none rounded-b-md focus:outline-none focus:z-10 sm:text-sm"
              />
              <span
                onClick={() => setShowUserPassword(!showUserPassword)}
                className="absolute transform -translate-y-1/2 cursor-pointer right-2 top-6"
              >
                {!showUserPassword ? <IoEyeOffSharp /> : <IoEye />}
              </span>
            </div>
          </div>

          <Link to="/PasswordRecovery">
            <span className="text-right text-sm font-medium block text-[#EC2752] forgetpass">
              Forgot Password?
            </span>
          </Link>
          <Link to="/" className="login_button_holder">
            <button
              onClick={userLogin}
              type="button"
              className={`login_button ${isLoading && "opacity-[.9]"}`}
              disabled={isLoading}
            >
              {isLoading && (
                <div className="spinner">
                  <LoadingSpinner />
                </div>
              )}
              {isLoading ? (
                <span className="-ml-4">Loading</span>
              ) : (
                <span>Login</span>
              )}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
