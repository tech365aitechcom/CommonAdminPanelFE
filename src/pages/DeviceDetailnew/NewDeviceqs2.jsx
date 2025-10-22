import React, { useEffect, useReducer, useState } from "react";
import "./newDeviceqs.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImArrowLeft } from "react-icons/im";
import store from "../../store/store";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import { useSelector } from "react-redux";
import banner from "../../assets/banner.jpg";
import { setGroupAnswers } from "../../store/slices/QNAslice";
import { setResponseData } from "../../store/slices/responseSlice";
import useUserProfile from "../../utils/useUserProfile";
import { CgSpinner } from "react-icons/cg";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { IoIosArrowBack } from "react-icons/io";
import styless from "../QuickQuote/QuickQuote.module.css";
import { toast } from "react-toastify";

function NewDeviceqs() {
  const userToken = sessionStorage.getItem("authToken");
  const [answers, setAnswers] = useState([]); // Proper state initialization
  const [visible, setVisible] = useState(1);
  const [newGroupanswers, setNewGroupAnswers] = useState();
  const profile = useUserProfile();
  const [showPopup, setShowPopup] = useState(true);
  const qna = useSelector((state) => state.qna);
  const [questions, setQuestions] = useState([]);
  const [maxPages, setMaxPage] = useState(0);

  const dataModel = JSON.parse(sessionStorage.getItem("dataModel"));

  const getData = async () => {
    const brandID = dataModel?.models?.brandId;
    if (!brandID) {
      return;
    } else {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_ENDPOINT
          }/api/questionnaires/getQNA?page=${
            visible - 1
          }&limit=10&brandId=${brandID}`,
          { headers: { Authorization: userToken } }
        );
        setQuestions(response.data.data);
        setMaxPage(Math.ceil(response.data.totalCounts / 10));
      } catch (error) {
        console.error("Failed to fetch data. Please try again.");
      }
    }
  };

  useEffect(() => {
    getData();
  }, [visible]);

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

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function handleADD() {
    // Check if all questions are answered
    if (
      questions.every((question) =>
        answers.some((answer) => answer.question === question.question)
      )
    ) {
      // All questions answered
      if (showPopup === false) {
        setVisible(visible + 1);
      }
    } else {
      // Show toast if not all questions are answered
      toast.warning("Please answer all the questions!!");
    }
  }

  function handleSubtract() {
    if (visible > 1) {
      setVisible(visible - 1);
    }
  }

  const handlesubmit = async () => {
    try {
      const dataModel = JSON.parse(sessionStorage.getItem("dataModel"));
      const userToken2 = sessionStorage.getItem("authToken");
      setIsLoading(true);
      const payload = {
        price: dataModel?.models?.config?.price,
        data: answers,
        phoneNumber: dataModel?.phoneNumber
          ? dataModel?.phoneNumber
          : "123456789",
        aadharNumber: dataModel?.aadharNumber
          ? dataModel?.aadharNumber
          : "123456789012",
        modelId: dataModel?.models?._id,
        storage: dataModel?.models?.config?.storage,
        ram: dataModel?.models?.config?.RAM,
        name: dataModel?.customerName ? dataModel?.customerName : profile?.name,
      };
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/questionnaires/calcuatleModelPrice`,
        payload,
        { headers: { Authorization: userToken2 } }
      );
      setIsLoading(false);
      toast.success(response?.data?.message);
      navigate("/devicequote");
      sessionStorage.setItem("calculatePrice", response.data.data.price);
      sessionStorage.setItem("ExactQuote", true);
      sessionStorage.setItem("LeadId", response.data.data.id);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Something went wrong!");
    }
  };

  const handleChange = (questionId, answer, per, questionText) => {
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (item) => item.question === questionText
      );

      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = {
          question: questionText,
          answer: {
            answer,
            per,
          },
        };
        return updatedAnswers;
      } else {
        return [
          ...prev,
          {
            question: questionText,
            answer: {
              answer,
              per,
            },
          },
        ];
      }
    });
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
            <div className="text-lg font-medium py-3 tracking-tight text-{1.325rem}">
              Tell us more about your device?
            </div>
            <p className="text-base text-gray-500 text-center font-semibold mb-4">
              Please answer a few questions about your device.
            </p>
            <div className="underline"></div>
            <div className="questionList">
              <div>
                <div className="flex flex-col gap-2 mt-4 p-4 md:flex-row justify-between space-y-4 md:space-y-0 h-full">
                  <div className="md:w-2/3 p-2 bg-white shadow-2xl h-full flex-grow">
                    {questions.map((item, index) => (
                      <div
                        key={item.question} // Use question text as key
                        className="mb-3 p-3 bg-gray-100 rounded-lg"
                      >
                        <h2 className="text-lg font-medium mb-2">
                          {index + 1}.{item.question}
                        </h2>
                        <div className="flex gap-4 flex-wrap">
                          {item?.options.map((option) => (
                            <label
                              key={option.answer}
                              className="flex items-center"
                            >
                              <input
                                type="radio"
                                name={item.question} // Use question text for name
                                value={option.answer}
                                checked={
                                  answers?.find(
                                    (ans) => ans.question === item.question
                                  )?.answer.answer === option.answer
                                }
                                onChange={() =>
                                  handleChange(
                                    item._id,
                                    option.answer,
                                    option.per,
                                    item.question
                                  )
                                }
                                className="mr-2"
                              />
                              <span>{option.answer}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden md:block md:w-1/3 p-4 bg-blue-50 rounded-lg shadow-md h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
                    <div className="flex gap-2 items-center justify-between px-6 border-b-2 pb-2">
                      <img
                        src={
                          dataModel?.models?.phonePhotos?.front !== ""
                            ? dataModel?.models?.phonePhotos?.front
                            : "https://grest-c2b-images.s3.ap-south-1.amazonaws.com/gresTest/1705473080031front.jpg"
                        }
                        alt=""
                        className="h-20 w-20"
                      />
                      <h2 className="text-2xl text-center font-semibold">
                        {dataModel?.models?.name}
                      </h2>
                    </div>
                    <div className="pt-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
                      {answers.map((answerData, index) => (
                        <div key={index} className="mb-4 text-sm">
                          <p>Q. {answerData?.question}</p>
                          <p>
                            A. {answerData?.answer.answer} (Percentage:{" "}
                            {answerData?.answer.per}%)
                          </p>
                          <hr className="my-4 border-gray-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <React.Fragment>
          {visible === maxPages ? (
            <div className="fixed bottom-0 flex justify-center w-full gap-2 p-3 bg-white border-t-2">
              <div
                onClick={handleSubtract}
                className={`bg-[#EC2752] w-[30%] px-6 py-2 rounded-lg flex items-center justify-center`}
              >
                <ImArrowLeft color="white" size={20} />
              </div>
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
              <div
                onClick={handleADD}
                className="bg-[#EC2752] w-[70%] py-1 px-2 text-center rounded-lg cursor-pointer flex justify-between text-white items-center"
              >
                <p className="w-full p-1 text-xl font-medium">Continue</p>
              </div>
            </div>
          )}
        </React.Fragment>
      </div>
    </>
  );
}

export default NewDeviceqs;
