import { useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import { IoIosArrowBack } from "react-icons/io";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { useQuestionContext } from "../../components/QuestionContext";
import axios from "axios";
import {
  setGroupAnswerss,
  updateCoreObjects,
  updateCosmeticsObjects,
  updateDisplayObjects,
  updateFunctionalMajorObjects,
  updateFunctionalMinorObjects,
  updateWarrantyObjects,
} from "../../store/slices/quickQNAslice";
import store from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import "../DeviceDetailnew/newDeviceqs.scss";
import styless from "./QuickQuote.module.css";
import { CgSpinner } from "react-icons/cg";
import useUserProfile from "../../utils/useUserProfile";
import { setResponseData } from "../../store/slices/responseSlice";

const PinkBgWhText = "bg-[#EC2752] text-white";

const initialState = {
  Core: [],
  Cosmetics: [],
  Display: [],
  Functional_major: [],
  Functional_minor: [],
  Warranty: [],
};

const QuickQuote = () => {
  const navigate = useNavigate();
  const { answersQuick, setAnswersQUICK } = useQuestionContext();
  const dispatch = useDispatch();
  const core = useSelector((state) => state.qnaQuick.Core);
  const Cosmetics = useSelector((state) => state.qnaQuick.Cosmetics);
  const Display = useSelector((state) => state.qnaQuick.Display);
  const FunctionalMajor = useSelector(
    (state) => state.qnaQuick.Functional_major
  );
  const FunctionalMinor = useSelector(
    (state) => state.qnaQuick.Functional_minor
  );
  const Warranty = useSelector((state) => state.qnaQuick.Warranty);
  const qnaQuick = useSelector((state) => state.qnaQuick);
  const [isLoading, setIsLoading] = useState(false);
  const profile = useUserProfile();

  const backHandler = () => {
    navigate("/selectmodel");
  };

  function reducer(state, action) {
    if (action.type === "SET_GROUP_ANSWERS") {
      return { ...state, [action.group]: action.answers };
    } else {
      throw new Error();
    }
  }

  const [QQState, Dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const userToken = sessionStorage.getItem("authToken");
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
          const answers = response.data.data
            .filter((question) => question.group === group)
            .slice(0, group !== "Warranty" ? 2 : undefined);

          Dispatch({ type: "SET_GROUP_ANSWERS", group, answers });
        });

        const newPopulateAnswers = response.data.data.map((ele) => ele.default);

        if (answersQuick.length === 0) {
          const newAnswers = newPopulateAnswers.map((answer, index) => {
            return {
              quetion: response.data.data[index].quetion,
              answer,
              key: response.data.data[index].yes === answer ? "yes" : "no",
              group: response.data.data[index].group,
            };
          });
          setAnswersQUICK(newAnswers);
          [
            "Core",
            "Cosmetics",
            "Display",
            "Functional_major",
            "Functional_minor",
            "Warranty",
          ].forEach((group) => {
            const answers = newAnswers.filter(
              (question) => question.group === group
            );

            dispatch(setGroupAnswerss({ group, answers }));
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/");
    }
  }, []);

  const handlesubmit = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem("authToken");
    let id = sessionStorage.getItem("dataModel");
    id = JSON.parse(id);

    const finalPayload = {
      QNA: qnaQuick,
      phoneNumber: "123456789",
      modelId: id?.models?._id,
      storage: id?.models?.config?.storage,
      ram: id?.models?.config?.RAM,
      aadharNumber: "1234567890",
      name: profile?.name,
    };
    const response = await axios.post(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/questionnaires/calculatePrice`,
      finalPayload,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    sessionStorage.setItem("LeadId", response.data.data.id);
    sessionStorage.setItem(
      "responsedatadata",
      JSON.stringify({ ...response.data.data, bonus: 0 })
    );
    sessionStorage.setItem("ExactQuote", false);
    dispatch(setResponseData({ ...response.data.data, bonus: 0 }));
    setIsLoading(false);
    navigate("/devicequote");
  };

  return (
    <div className="mainQContainer">
      <div className="flex items-center w-screen py-4 h-16 border-b-2  bg-white HEADER header">
        <div className="w-full flex items-center justify-between pr-2">
          <ProfileBox />
          <img
            className="w-40"
            onClick={() => navigate("/selectdevicetype")}
            alt="app logo"
            src={Grest_Logo}
          />
        </div>
      </div>
      <div className={`${styless.quick_page_nav}`}>
        <IoIosArrowBack
          className="ml-2 text-[#EC2752]"
          size={25}
          onClick={backHandler}
        />
        <p className="ml-2 font-medium text-xl">Device Details</p>
      </div>

      <div className="innerContainer">
        <div className="maindata">
          <div className="text-lg font-medium tracking-tight text-{1.325rem}">
            Tell us more about your device?
          </div>
          <div className="underline"></div>
          <QuestionList
            QQState={QQState}
            core={core}
            dispatch={dispatch}
            Cosmetics={Cosmetics}
            Display={Display}
            FunctionalMajor={FunctionalMajor}
            FunctionalMinor={FunctionalMinor}
            Warranty={Warranty}
          />
        </div>
      </div>

      <div className="fixed bottom-0 flex flex-col w-full gap-2 p-4 bg-white border-t-2">
        <div
          onClick={handlesubmit}
          className="bg-[#EC2752] text-center relative  py-1 px-2 rounded-lg cursor-pointer flex justify-between text-white items-center"
        >
          {isLoading && (
            <CgSpinner
              size={20}
              className="mt-1 absolute left-[28%] top-[8px] animate-spin"
            />
          )}
          <p className="w-full p-1 text-xl font-medium">
            {isLoading ? "Submitting" : "Submit"}
          </p>
        </div>
      </div>
    </div>
  );
};

const QuestionList = ({
  QQState,
  core,
  dispatch,
  Cosmetics,
  Display,
  FunctionalMajor,
  FunctionalMinor,
  Warranty,
}) => {
  return (
    <div className="questionList ">
      <QuestionsElement
        State={QQState.Core}
        Task={core}
        dispatch={dispatch}
        currentIndex={1}
        taskFun={updateCoreObjects}
      />

      {/* //for cosmetics */}
      <QuestionsElement
        State={QQState.Cosmetics}
        Task={Cosmetics}
        dispatch={dispatch}
        currentIndex={3}
        taskFun={updateCosmeticsObjects}
      />

      {/* //for display */}
      <QuestionsElement
        State={QQState.Display}
        Task={Display}
        dispatch={dispatch}
        currentIndex={5}
        taskFun={updateDisplayObjects}
      />

      {/* //Functional_major*/}
      <QuestionsElement
        State={QQState.Functional_major}
        Task={FunctionalMajor}
        dispatch={dispatch}
        currentIndex={7}
        taskFun={updateFunctionalMajorObjects}
      />

      {/* //for Functional_minor */}
      <QuestionsElement
        State={QQState.Functional_minor}
        Task={FunctionalMinor}
        dispatch={dispatch}
        currentIndex={9}
        taskFun={updateFunctionalMinorObjects}
      />

      {/* //fro Warranty */}

      <div className="containClass">
        <div className="flex flex-col gap-4 mb-4 one">
          <div className="flex gap-1 two">
            <p className="text-xl">11.</p>
            <p className="text-xl three">What is your phone's age?</p>
          </div>

          {QQState.Warranty &&
            QQState.Warranty.map((data, index) => (
              <div
                key={index}
                className="max-w-[500px] flex gap-4 ml-3 lableconatiner flex-col"
              >
                <label
                  className={`text-[#EC2752] font-medium w-full h-[40px] flex  gap-1 p-2 rounded-lg ${
                    Warranty[index].answer === data.yes ? PinkBgWhText : ""
                  }`}
                >
                  <input
                    type="radio"
                    value={data.yes}
                    onChange={(e) => {
                      store.dispatch(
                        updateWarrantyObjects({
                          index: index,
                          newAnswer: data.yes,
                          newKey: "yes",
                        })
                      );
                    }}
                    checked={Warranty[index].answer === data.yes}
                  />{" "}
                  {data.quetion}
                </label>
              </div>
            ))}
          <div className="border-b-2 opacity-10 border-[#595555] "></div>
        </div>
      </div>
    </div>
  );
};

const QuestionsElement = ({ State, Task, dispatch, currentIndex, taskFun }) => {
  console.log(currentIndex);
  return (
    <div className="containClass">
      {State &&
        State.map((data, index) => (
          <div className="flex flex-col gap-4 mb-4 one" key={data._id}>
            <div className="flex items-baseline gap-1 two">
              <p className="font-medium text-xl">{index + currentIndex}.</p>
              <p className="text-xl three">{data.quetion}</p>
            </div>
            <div className="max-w-[500px] flex gap-4 ml-3 lableconatiner">
              <label
                className={`text-[#EC2752] font-medium w-[150px] h-[40px] flex items-center gap-1 p-2 rounded-lg ${
                  Task[index].answer === data.yes ? PinkBgWhText : ""
                }`}
              >
                <input
                  name={data._id}
                  type="radio"
                  value={data.yes}
                  onChange={(e) => {
                    dispatch(
                      taskFun({
                        index: index,
                        newAnswer: data.yes,
                        newKey: "yes",
                      })
                    );
                  }}
                  checked={Task[index].answer === data.yes}
                />{" "}
                Yes
              </label>
              <label
                className={`text-[#EC2752] font-medium  w-[150px] h-[40px] flex items-center gap-1 p-2 rounded-lg ${
                  Task[index].answer === data.no ? PinkBgWhText : ""
                }`}
              >
                <input
                  name={data._id}
                  type="radio"
                  value={data.no}
                  onChange={(e) => {
                    dispatch(
                      taskFun({
                        index: index,
                        newAnswer: data.no,
                        newKey: "no",
                      })
                    );
                  }}
                  checked={Task[index].answer === data.no}
                />{" "}
                No
              </label>
            </div>
            <div className="border-b-2 opacity-10 border-[#595555]"></div>
          </div>
        ))}
    </div>
  );
};

export default QuickQuote;
