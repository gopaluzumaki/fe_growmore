import { FileInput } from "@mantine/core";
import React from "react";
import { uploadFile } from "../../api";

export default function CustomFileUpload({
  onFilesUpload, type,setLoading
}: {
  onFilesUpload: (files: string[]) => void;
  type: string;
  setLoading:any;
}) {
  const handleFilesUpload = async (files) => {
    setLoading(true)
    const results = await Promise.all(
      files.map(async (value) => {
        const res = await uploadFile(value);
        return {url:res?.data?.message?.file_url,name:res?.data?.message?.file_name}; // Collect the result
      })
    );
    //make api call to upload files that will give use img urls and pass it to onFilesUpload function
    onFilesUpload(results);
    setLoading(false)
  };
  return (
    <div>
      <p className="mb-1.5 ml-1 font-medium text-gray-700">
        <label>Attachments (if Any)</label>
      </p>
      <FileInput
        onChange={handleFilesUpload}
        accept={type}
        placeholder="Upload files"
        multiple
        styles={{
          label: {
            marginBottom: "7px",
            color: "black",
            fontSize: "16px",
          },
          input: {
            border: "1px solid #CCDAFF",
            borderRadius: "8px",
            padding: "9px",
            fontSize: "16px",
            color: "#1A202C",
          },
        }}
      />
    </div>
  );
}
