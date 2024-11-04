import React, { useState, ChangeEvent } from "react";
import axios from "axios";

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);

      if (file) {
        await uploadFile(file);
      }
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://propms.erpnext.syscort.com/api/method/upload_file",
        formData,
        {
          auth: {
            username: "9e39f91ee7e1286",
            password: "40e194b556a74b7",
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImgUrl(response.data?.message?.file_url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  console.log("Upload : ", imgUrl);
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedFile && <p>Uploading: {selectedFile.name}</p>}
    </div>
  );
};

export default ImageUpload;
