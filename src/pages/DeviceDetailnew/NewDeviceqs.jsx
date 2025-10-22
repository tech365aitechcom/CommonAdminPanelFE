import React, { useEffect, useReducer, useState } from "react";
import "./newDeviceqs.scss";
import { useQuestionContext } from "../../components/QuestionContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImArrowLeft } from "react-icons/im";
import store from "../../store/store";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import { useSelector } from "react-redux";
import banner from "../../assets/banner.jpg";
import { GoDotFill } from "react-icons/go";

import quesImg1 from "../../assets/5.jpg";
import quesImg2 from "../../assets/20.jpg";
import quesImg3 from "../../assets/8.jpg";
import quesImg4 from "../../assets/6.jpg";
import quesImg5 from "../../assets/7.jpg";
import quesImg6 from "../../assets/39.jpg";
import quesImg7 from "../../assets/41.jpg";
import quesImg8 from "../../assets/42.jpg";
import quesImg9 from "../../assets/40.jpg";
import quesImg10 from "../../assets/44.jpg";
import quesImg11 from "../../assets/37.jpg";
import quesImg12 from "../../assets/38.jpg";
import quesImg13 from "../../assets/43.jpg";
import quesImg14 from "../../assets/45.jpg";
import quesImg15 from "../../assets/35.jpg";
import quesImg16 from "../../assets/36.jpg";
import quesImg17 from "../../assets/10.jpg";
import quesImg18 from "../../assets/11.jpg";
import quesImg19 from "../../assets/9.jpg";
import quesImg20 from "../../assets/12.jpg";
import quesImg21 from "../../assets/13.jpg";
import quesImg22 from "../../assets/14.jpg";
import quesImg23 from "../../assets/17.jpg";
import quesImg24 from "../../assets/47.png";
import quesImg25 from "../../assets/46.png";
import quesImg26 from "../../assets/18.jpg";
import quesImg27 from "../../assets/19.jpg";
import quesImg29 from "../../assets/21.jpg";
import quesImg30 from "../../assets/22.jpg";
import quesImg31 from "../../assets/24.jpg";
import quesImg32 from "../../assets/23.jpg";
import quesImg33 from "../../assets/25.jpg";
import quesImg34 from "../../assets/26.jpg";
import quesImg35 from "../../assets/27.jpg";
import quesImg36 from "../../assets/29.jpg";
import quesImg39 from "../../assets/28.jpg";
import quesImg42 from "../../assets/30.jpg";
import quesImg43 from "../../assets/32.jpg";
import quesImg44 from "../../assets/31.jpg";
import quesImg45 from "../../assets/33.jpg";
import quesImg46 from "../../assets/34.jpg";
import quesImg47 from "../../assets/1.jpg";
import quesImg48 from "../../assets/2.jpg";
import quesImg49 from "../../assets/3.jpg";
import quesImg50 from "../../assets/4.jpg";
import quesImg51 from "../../assets/quesImg0.png";
import quesImg53 from "../../assets/48.jpg";
import quesImg54 from "../../assets/49.jpg";
import quesImg55 from "../../assets/major.jpeg";
import quesImg56 from "../../assets/minor.jpeg";

const imageMap = {
  quesImg1,
  quesImg2,
  quesImg3,
  quesImg4,
  quesImg5,
  quesImg6,
  quesImg7,
  quesImg8,
  quesImg9,
  quesImg10,
  quesImg11,
  quesImg12,
  quesImg13,
  quesImg14,
  quesImg15,
  quesImg16,
  quesImg17,
  quesImg18,
  quesImg19,
  quesImg20,
  quesImg21,
  quesImg22,
  quesImg23,
  quesImg24,
  quesImg25,
  quesImg26,
  quesImg27,
  quesImg28: quesImg2,
  quesImg29,
  quesImg30,
  quesImg31,
  quesImg32,
  quesImg33,
  quesImg34,
  quesImg35,
  quesImg36,
  quesImg37: quesImg31,
  quesImg38: quesImg19,
  quesImg39,
  quesImg40: quesImg36,
  quesImg41: quesImg35,
  quesImg42,
  quesImg43,
  quesImg44,
  quesImg45,
  quesImg46,
  quesImg47,
  quesImg48,
  quesImg49,
  quesImg50,
  quesImg51,
  quesImg52: quesImg51,
  quesImg53,
  quesImg54,
  quesImg55,
  quesImg56,
};

import {
  setGroupAnswers,
  updateCoreObject,
  updateCosmeticsObject,
  updateDisplayObject,
  updateFunctionalMajorObject,
  updateFunctionalMinorObject,
  updateWarrantyObject,
} from "../../store/slices/QNAslice";
import { setResponseData } from "../../store/slices/responseSlice";
import useUserProfile from "../../utils/useUserProfile";
import { CgSpinner } from "react-icons/cg";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { IoIosArrowBack } from "react-icons/io";
import styless from "../QuickQuote/QuickQuote.module.css";

const initialState = {
  Core: [],
  Cosmetics: [],
  Display: [],
  Functional_major: [],
  Functional_minor: [],
  Warranty: [],
};
const whiteText = "text-white";
const blackText = "text-black";
const pinkBg = "bg-[#EC2752]";
const whiteBg = "bg-white";

const handleSkip = (visible, updateAns) => {
  switch (visible) {
    case 1:
      updateAns("Core");
      break;
    case 2:
      updateAns("Cosmetics");
      break;
    case 3:
      updateAns("Display");
      break;
    case 4:
      updateAns("Functional_major");
      break;
    case 5:
      updateAns("Functional_minor");
      break;
  }
};

function NewDeviceqs() {
  const userToken = sessionStorage.getItem("authToken");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { answers, setAnswers } = useQuestionContext();
  const [visible, setVisible] = useState(1);
  const [newGroupanswers, setNewGroupAnswers] = useState();
  const profile = useUserProfile();
  const core = useSelector((state) => state.qna.Core);
  const Cosmetics = useSelector((state) => state.qna.Cosmetics);
  const Display = useSelector((state) => state.qna.Display);
  const FunctionalMajor = useSelector((state) => state.qna.Functional_major);
  const FunctionalMinor = useSelector((state) => state.qna.Functional_minor);
  const Warranty = useSelector((state) => state.qna.Warranty);
  const [showPopup, setShowPopup] = useState(true);
  const [NDstate, dispatch] = useReducer(reducer, initialState);
  const qna = useSelector((state) => state.qna);

  function reducer(state, action) {
    if (action.type === "SET_GROUP_ANSWERS") {
      return { ...state, [action.group]: action.answers };
    } else {
      throw new Error();
    }
  }
  const fetchData = async () => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/questionnaires/findAll?page=0&limit=31`;
      const response = await axios.get(apiUrl, {
        headers: {
          authorization: `${userToken}`,
        },
      });
      [
        "Core",
        "Cosmetics",
        "Display",
        "Functional_major",
        "Functional_minor",
        "Warranty",
      ].forEach((group) => {
        const answersTemp = response.data.data.filter(
          (question) => question.group === group
        );
        dispatch({ type: "SET_GROUP_ANSWERS", group, answers: answersTemp });
      });
      const newPopulateAnswers = response.data.data.map((ele) => ele.default);
      if (answers.length === 0) {
        const newAnswers = newPopulateAnswers.map((answer, index) => {
          if (
            response.data.data[index].yes === answer &&
            response.data.data[index].no === answer
          ) {
            return {
              quetion: response.data.data[index].quetion,
              answer,
              key: "no",
              group: response.data.data[index].group,
              selected: Array(response.data.data[index].options.length).fill(
                false
              ),
            };
          } else if (response.data.data[index].yes === answer) {
            return {
              quetion: response.data.data[index].quetion,
              answer,
              key: "yes",
              group: response.data.data[index].group,
              selected: Array(response.data.data[index].options.length).fill(
                true
              ),
            };
          } else {
            return {
              quetion: response.data.data[index].quetion,
              answer,
              group: response.data.data[index].group,
              key: "no",
              selected: Array(response.data.data[index].options.length).fill(
                false
              ),
            };
          }
        });
        setAnswers(newAnswers);
        setNewGroupAnswers(newAnswers);
        [
          "Core",
          "Cosmetics",
          "Display",
          "Functional_major",
          "Functional_minor",
          "Warranty",
        ].forEach((group) => {
          const answersTemp = newAnswers.filter(
            (question) => question.group === group
          );
          store.dispatch(setGroupAnswers({ group, answers: answersTemp }));
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [visible]);

  const updateAns = (group) => {
    const filteredAnswers = newGroupanswers.filter(
      (question) => question.group === group
    );
    store.dispatch(setGroupAnswers({ group, filteredAnswers }));
    if (showPopup === false) {
      setVisible(visible + 1);
    }
  };

  return (
    <>
      <div className={`popup ${showPopup ? "show" : ""}`}>
        <img src={banner} alt="banner" />
        <div className="text">
          Help us calculate your device value correctly by answering to the
          following questions
        </div>
        <button onClick={() => setShowPopup(false)}> Got it</button>
      </div>
      <MainQContainer
        NDstate={NDstate}
        setIsSearchOpen={setIsSearchOpen}
        isSearchOpen={isSearchOpen}
        dispatch={dispatch}
        visible={visible}
        core={core}
        Cosmetics={Cosmetics}
        Display={Display}
        FunctionalMajor={FunctionalMajor}
        FunctionalMinor={FunctionalMinor}
        Warranty={Warranty}
        setVisible={setVisible}
        updateAns={updateAns}
        showPopup={showPopup}
        qna={qna}
        profile={profile}
      />
    </>
  );
}

export default NewDeviceqs;

const MainQContainer = ({
  NDstate,
  setIsSearchOpen,
  isSearchOpen,
  dispatch,
  visible,
  core,
  Cosmetics,
  Display,
  FunctionalMajor,
  FunctionalMinor,
  Warranty,
  setVisible,
  updateAns,
  showPopup,
  qna,
  profile,
}) => {
  const navigate = useNavigate();
  return (
    <div className="mainQContainer">
      <div className="flex items-center w-screen h-16 py-4 bg-white border-b-2 HEADER header">
        <div className="flex items-center justify-between w-full pr-2">
          <ProfileBox />
          <img
            onClick={() => navigate("/selectdevicetype")}
            className="w-40"
            src={Grest_Logo}
            alt="app logo"
          />
        </div>
      </div>
      <div className={`${styless.quick_page_nav}`}>
        <IoIosArrowBack
          onClick={() => navigate("/selectmodel")}
          size={25}
          className="ml-2 text-[#EC2752]"
        />
        <p className="ml-2 text-xl font-medium">Device Details</p>
      </div>
      <div className="innerContainer">
        <div className={`maindata`}>
          <div className="text-lg font-medium tracking-tight text-{1.325rem}">
            Tell us more about your device?
          </div>
          <div className="underline"></div>
          <div className="questionList">
            {visible === 1 && <FirstPart NDstate={NDstate} core={core} />}
            {visible === 2 && (
              <SecondPart Cosmetics={Cosmetics} NDstate={NDstate} />
            )}
            {visible === 3 && <ThirdPart Display={Display} NDstate={NDstate} />}
            {visible === 4 && (
              <FourthPart FunctionalMajor={FunctionalMajor} NDstate={NDstate} />
            )}
            {visible === 5 && (
              <FifthPart FunctionalMinor={FunctionalMinor} NDstate={NDstate} />
            )}
            {visible === 6 && (
              <SixthPart Cosmetics={Cosmetics} NDstate={NDstate} />
            )}
            {visible === 7 && (
              <SeventhPart Warranty={Warranty} NDstate={NDstate} />
            )}
          </div>
        </div>
      </div>
      <AboveSix
        visible={visible}
        setVisible={setVisible}
        updateAns={updateAns}
        showPopup={showPopup}
        qna={qna}
        profile={profile}
      />
    </div>
  );
};

const FirstPart = ({ NDstate, core }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={15} />
        <h2>Basic Condition of the Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate.Core &&
          NDstate.Core.map((data, index) => (
            <React.Fragment key={data._id}>
              {data?.options.map((option, optionIndex) => (
                <React.Fragment key={optionIndex}>
                  <div
                    onClick={(e) => {
                      console.log(core);
                      console.log("assssaaaaa", option);
                      console.log("assssaaaaa", data);
                      console.log(optionIndex + "ok");
                      store.dispatch(
                        updateCoreObject({
                          index: index,
                          yesKey: data.yes,
                          noKey: data.no,
                          newKey: "yes",
                          selectedIndex: optionIndex,
                        })
                      );
                    }}
                    className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                      !core[index].selected[optionIndex] ? whiteBg : pinkBg
                    }`}
                  >
                    <div className="mt-3 mb-1 rounded-md overflow-hidden">
                      <img className="scale-[1.2]" src={imageMap[option.img]} />
                    </div>
                    <div className="border-t-[1.5px] w-full py-2">
                      <p
                        className={`text-xs font-medium text-center ${
                          !core[index].selected[optionIndex]
                            ? blackText
                            : whiteText
                        }`}
                      >
                        {option.caption}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </div>
      <div className="flex flex mt-4 bg-[#EC2752] text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const SecondPart = ({ NDstate, Cosmetics }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Physical Condition of the Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate.Cosmetics &&
          NDstate.Cosmetics.map((data, index) => {
            if (index < 9) {
              return (
                <React.Fragment key={data._id}>
                  {data?.options.map((option, optionIndex) => (
                    <React.Fragment key={optionIndex}>
                      <div
                        onClick={(e) => {
                          console.log(Cosmetics);
                          console.log("assssaaaaa", option);
                          console.log("assssaaaaa", data);
                          console.log(optionIndex + "ok");
                          store.dispatch(
                            updateCosmeticsObject({
                              index: index,
                              yesKey: data.yes,
                              noKey: data.no,
                              selectedIndex: optionIndex,
                              newKey: "yes",
                            })
                          );
                        }}
                        className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                          !Cosmetics[index].selected[optionIndex]
                            ? whiteBg
                            : pinkBg
                        }`}
                      >
                        <div className="mt-3 mb-1 rounded-md overflow-hidden">
                          <img
                            src={imageMap[option.img]}
                            className="scale-[1.2]"
                          />
                        </div>
                        <div className="w-full border-t-[1.5px] py-2">
                          <p
                            className={`text-xs font-medium text-center ${
                              !Cosmetics[index].selected[optionIndex]
                                ? blackText
                                : whiteText
                            }`}
                          >
                            {option.caption}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            } else {
              return null;
            }
          })}
      </div>
      <div className="flex flex mt-4 bg-[#EC2752] text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const ThirdPart = ({ NDstate, Display }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Display Condition of the Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate.Display &&
          NDstate.Display.map((data, index) => (
            <React.Fragment key={data._id}>
              {data?.options.map((option, optionIndex) => (
                <React.Fragment key={optionIndex}>
                  <div
                    onClick={(e) => {
                      console.log(Display);
                      console.log("assssaaaaa", option);
                      console.log("assssaaaaa", data);
                      console.log(optionIndex + "ok");
                      store.dispatch(
                        updateDisplayObject({
                          index: index,
                          yesKey: data.yes,
                          noKey: data.no,
                          newKey: "yes",
                          selectedIndex: optionIndex,
                        })
                      );
                    }}
                    className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                      !Display[index].selected[optionIndex] ? whiteBg : pinkBg
                    }`}
                  >
                    <div className="mt-3 mb-1 rounded-md overflow-hidden">
                      <img className="scale-[1.2]" src={imageMap[option.img]} />
                    </div>
                    <div className="border-t-[1.5px] w-full py-2">
                      <p
                        className={`text-xs font-medium text-center ${
                          !Display[index].selected[optionIndex]
                            ? blackText
                            : whiteText
                        }`}
                      >
                        {option.caption}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </div>
      <div className="flex flex mt-4 bg-[#EC2752] text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const FourthPart = ({ FunctionalMajor, NDstate }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Functional Condition of the Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate?.Functional_major &&
          NDstate?.Functional_major.map((data, index) => (
            <React.Fragment key={data._id}>
              {data?.options.map((option, optionIndex) => (
                <React.Fragment key={optionIndex}>
                  <div
                    onClick={(e) => {
                      console.log(FunctionalMajor);
                      console.log("assssaaaaa", option);
                      console.log("assssaaaaa", data);
                      console.log(optionIndex + "ok");
                      store.dispatch(
                        updateFunctionalMajorObject({
                          index: index,
                          yesKey: data.yes,
                          noKey: data.no,
                          newKey: "yes",
                          selectedIndex: optionIndex,
                        })
                      );
                    }}
                    className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                      !FunctionalMajor[index].selected[optionIndex]
                        ? whiteBg
                        : pinkBg
                    }`}
                  >
                    <div className="mt-3 mb-1 rounded-md overflow-hidden">
                      <img className="scale-[1.2]" src={imageMap[option.img]} />
                    </div>
                    <div className="border-t-[1.5px] w-full py-2">
                      <p
                        className={`text-xs font-medium text-center ${
                          !FunctionalMajor[index].selected[optionIndex]
                            ? blackText
                            : whiteText
                        }`}
                      >
                        {option.caption}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </div>
      <div className="flex flex mt-4 bg-[#EC2752] text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const FifthPart = ({ FunctionalMinor, NDstate }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Functional Condition of the Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate?.Functional_minor &&
          NDstate?.Functional_minor.map((data, index) => (
            <React.Fragment key={data._id}>
              {data?.options.map((option, optionIndex) => (
                <React.Fragment key={optionIndex}>
                  <div
                    onClick={(e) => {
                      console.log(FunctionalMinor);
                      console.log("assssaaaaa", option);
                      console.log("assssaaaaa", data);
                      console.log(optionIndex + "ok");
                      store.dispatch(
                        updateFunctionalMinorObject({
                          index: index,
                          yesKey: data.yes,
                          noKey: data.no,
                          newKey: "yes",
                          selectedIndex: optionIndex,
                        })
                      );
                    }}
                    className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                      !FunctionalMinor[index].selected[optionIndex]
                        ? whiteBg
                        : pinkBg
                    }`}
                  >
                    <div className="mt-3 mb-1 rounded-md overflow-hidden">
                      <img className="scale-[1.2]" src={imageMap[option.img]} />
                    </div>
                    <div className="border-t-[1.5px] w-full py-2">
                      <p
                        className={`text-xs font-medium text-center ${
                          !FunctionalMinor[index].selected[optionIndex]
                            ? blackText
                            : whiteText
                        }`}
                      >
                        {option.caption}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </div>
      <div className="flex flex mt-4 bg-[#EC2752] text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const SixthPart = ({ NDstate, Cosmetics }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Select Accessories Not Available with Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate.Cosmetics &&
          NDstate.Cosmetics.map((data, index) => {
            if (index >= 9) {
              return (
                <React.Fragment key={data._id}>
                  {data?.options.map((option, optionIndex) => (
                    <React.Fragment key={optionIndex}>
                      <div
                        className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                          !Cosmetics[index].selected[optionIndex]
                            ? whiteBg
                            : pinkBg
                        }`}
                        onClick={(e) => {
                          console.log(Cosmetics);
                          console.log("assssaaaaa", option);
                          console.log("assssaaaaa", data);
                          console.log(optionIndex + "ok");
                          store.dispatch(
                            updateCosmeticsObject({
                              noKey: data.no,
                              index: index,
                              yesKey: data.yes,
                              newKey: "yes",
                              selectedIndex: optionIndex,
                            })
                          );
                        }}
                      >
                        <div className="mt-3 mb-1 rounded-md overflow-hidden">
                          <img
                            className="scale-[1.2]"
                            src={imageMap[option.img]}
                          />
                        </div>
                        <div className="border-t-[1.5px] w-full py-2">
                          <p
                            className={`text-xs font-medium text-center ${
                              !Cosmetics[index].selected[optionIndex]
                                ? blackText
                                : whiteText
                            }`}
                          >
                            {option.caption}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            } else {
              return null;
            }
          })}
      </div>
      <div className="flex flex mt-4 bg-[#EC2752] text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const SeventhPart = ({ Warranty, NDstate }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Please Choose the Appropriate Warranty Period for Your Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate?.Warranty &&
          NDstate?.Warranty.map((data, index) => (
            <React.Fragment key={data._id}>
              {data?.options.map((option, optionIndex) => (
                <React.Fragment key={optionIndex}>
                  <div
                    onClick={(e) => {
                      console.log(Warranty);
                      console.log("assssaaaaa", option);
                      console.log("assssaaaaa", data);
                      console.log(optionIndex + "ok");
                      store.dispatch(
                        updateWarrantyObject({
                          index: index,
                          newAnswer: data.yes,
                          newKey: "yes",
                        })
                      );
                    }}
                    className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                      !Warranty[index].selected[optionIndex] ? whiteBg : pinkBg
                    }`}
                  >
                    <div className="mt-3 mb-1 rounded-md overflow-hidden">
                      <img className="scale-[1.2]" src={imageMap[option.img]} />
                    </div>
                    <div className="border-t-[1.5px] w-full py-2">
                      <p
                        className={`text-xs font-medium text-center ${
                          !Warranty[index].selected[optionIndex]
                            ? blackText
                            : whiteText
                        }`}
                      >
                        {option.caption}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

const AboveSix = ({
  visible,
  setVisible,
  updateAns,
  showPopup,
  qna,
  profile,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function handleADD() {
    if (showPopup === false) {
      setVisible(visible + 1);
    }
  }

  function handleSubtract() {
    if (visible > 1) {
      setVisible(visible - 1);
    }
  }
  const handlesubmit = async () => {
    const id = JSON.parse(sessionStorage.getItem("dataModel"));
    const userToken2 = sessionStorage.getItem("authToken");
    setIsLoading(true);
    console.log(id, profile);
    const finalPayload = {
      QNA: qna,
      phoneNumber: id?.phoneNumber ? id?.phoneNumber : "123456789",
      aadharNumber: id?.aadharNumber ? id?.aadharNumber : "123456789012",
      modelId: id?.models?._id,
      storage: id?.models?.config?.storage,
      ram: id?.models?.config?.RAM,
      name: id?.customerName ? id?.customerName : profile?.name,
    };
    console.log(finalPayload);
    sessionStorage.setItem(
      "billData",
      JSON.stringify(finalPayload.QNA.Cosmetics[10])
    );
    const response = await axios.post(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/questionnaires/calculatePrice`,
      finalPayload,
      { headers: { Authorization: userToken2 } }
    );
    sessionStorage.setItem("LeadId", response.data.data.id);
    sessionStorage.setItem(
      "responsedatadata",
      JSON.stringify({ ...response.data.data, bonus: 0 })
    );
    sessionStorage.setItem("ExactQuote", true);
    store.dispatch(setResponseData({ ...response.data.data, bonus: 0 }));
    setIsLoading(false);
    navigate("/devicequote");
  };

  return (
    <React.Fragment>
      {visible >= 7 ? (
        <div className="fixed bottom-0 flex justify-center w-full gap-2 p-3 bg-white border-t-2">
          <div
            onClick={handleSubtract}
            className={`bg-[#EC2752] w-[30%] px-6 py-2 rounded-lg flex items-center justify-center`}
          >
            <ImArrowLeft color="white" size={20} />
          </div>
          {/* <button
              onClick={() => handleSkip(visible, updateAns)}
              disabled
              className={` bg-slate-400  w-[30%] py-1 px-2 text-center rounded-lg cursor-not-allowed flex justify-between text-white items-center`}
            >
              <p className="w-full p-1 text-xl font-medium">Skip</p>
            </button> */}
          <div
            onClick={handlesubmit}
            className="bg-[#EC2752] w-[70%] relative text-center py-1 px-2 rounded-lg cursor-pointer flex justify-between text-white items-center"
          >
            {isLoading && (
              <CgSpinner
                size={20}
                className="absolute left-[18%] top-[8px] mt-1 animate-spin"
              />
            )}
            <p className="w-full p-1 text-xl font-medium">
              {isLoading ? "Submitting" : "Submit"}
            </p>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 justify-center flex w-full gap-2 p-3 bg-white border-t-2">
          {visible > 0 && visible <= 6 && (
            <button
              onClick={handleSubtract}
              className={`  ${
                visible < 2
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-[#EC2752] cursor-pointer"
              }  w-[30%] px-6 py-2 rounded-lg flex items-center justify-center`}
            >
              <ImArrowLeft color="white" size={20} />
            </button>
          )}
          {/* <div
            onClick={() => handleSkip(visible, updateAns)}
            className="bg-[#EC2752] w-[30%] py-1 px-2 text-center rounded-lg cursor-pointer flex justify-between text-white items-center"
          >
            <p className="w-full p-1 text-xl font-medium">Skip</p>
          </div> */}
          <div
            onClick={handleADD}
            className="bg-[#EC2752] w-[70%] py-1 px-2 text-center rounded-lg cursor-pointer flex justify-between text-white items-center"
          >
            <p className="w-full p-1 text-xl font-medium">Continue</p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
