import axios from "axios";
import * as XLSX from "xlsx";

const uploadImagesAndGenerateExcel = async (files) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    // Upload images to the backend
    const response = await axios.post("/api/upload-images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { data } = response.data;

    // Prepare data for Excel
    const excelData = data.map((item) => ({
      "File Name": item.name,
      URL: item.url,
    }));

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Uploaded Images");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "uploaded_images.xlsx";
    link.click();

    console.log("Excel generated successfully.");
  } catch (error) {
    console.error("Error uploading images or generating Excel:", error);
  }
};

export default uploadImagesAndGenerateExcel;
