import React from "react";
import { useSelector } from "react-redux";
const AdminFinalGradeTable = () => {
  const adminAnswer = useSelector((state) => state.adminGradePrice);
  const result = JSON.parse(sessionStorage.getItem("combinationOutput"));
  const adminModelName = sessionStorage.getItem("adminModelName");
  console.log(adminAnswer);
  const category = sessionStorage.getItem("admincategory");

  return (
    <div className="m-2  w-[90%] overflow-x-auto md:m-5 ">
      <table className="w-full border-2 border-primary  ">
        <thead className="text-white bg-primary">
          <tr>
            <th className="p-2 text-sm md:p-3 md:text-base">Groups</th>
            <th className="p-2 text-sm md:p-3 md:text-base">Values</th>
          </tr>
        </thead>
        {category === "Mobile" && (
          <tbody>
            <tr className="bg-gray-200 ">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Model Name
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminModelName}
              </td>
            </tr>
            <tr className="bg-gray-200 ">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Warranty
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminAnswer?.Warranty}
              </td>
            </tr>
            <tr>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Core
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminAnswer?.Core}
              </td>
            </tr>
            <tr className="bg-gray-200">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Display
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminAnswer?.Display}
              </td>
            </tr>
            <tr>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Major Functions
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminAnswer?.Functional_major}
              </td>
            </tr>
            <tr className="bg-gray-200">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Minor Functions
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminAnswer?.Functional_minor}
              </td>
            </tr>
            <tr>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Cosmetics
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminAnswer?.Cosmetics}
              </td>
            </tr>
            <tr className="bg-gray-200">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Final Grade
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {result?.grade}
              </td>
            </tr>
            <tr>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Pricing
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {result?.price}
              </td>
            </tr>
          </tbody>
        )}
        {category === "Watch" && (
          <tbody>
            <tr className="bg-gray-200 ">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Model Name
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminModelName}
              </td>
            </tr>
            <tr className="bg-gray-200 ">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Accessories
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminAnswer?.Accessories}
              </td>
            </tr>
            <tr className="">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Functional
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminAnswer?.Functional}
              </td>
            </tr>
            <tr className="bg-gray-200">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Physical
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminAnswer?.Physical}
              </td>
            </tr>
            <tr className="">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Warranty
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {adminAnswer?.Warranty}
              </td>
            </tr>
            <tr className="bg-gray-200">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Final Grade
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {result?.grade}
              </td>
            </tr>
            <tr className="">
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                Pricing
              </td>
              <td className="p-2 text-sm text-center md:p-3 md:text-base">
                {result?.price}
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default AdminFinalGradeTable;
