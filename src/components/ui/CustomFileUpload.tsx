import { FileInput } from "@mantine/core";
import React from "react";
import { uploadFile } from "../../api";

export default function CustomFileUpload({
  onFilesUpload, type
}: {
  onFilesUpload: (files: string[]) => void;
  type: string;
}) {
  const handleFilesUpload = async (files) => {
    const results = await Promise.all(
      files.map(async (value) => {
        const res = await uploadFile(value);
        return res?.data?.message?.file_url; // Collect the result
      })
    );
    //make api call to upload files that will give use img urls and pass it to onFilesUpload function
    onFilesUpload(results);
  };
  return (
    <div>
      <p className="mb-1.5 ml-1 text-[18px] text-[#7C8DB5]">
        <label>Attachments (if Any)</label>
      </p>
      <FileInput
        onChange={handleFilesUpload}
        accept={type}
        placeholder="Upload files"
        multiple
      />
    </div>
  );
}
