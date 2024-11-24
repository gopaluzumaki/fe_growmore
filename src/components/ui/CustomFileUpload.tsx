import { FileInput } from "@mantine/core";
import React from "react";

export default function CustomFileUpload({
  onFilesUpload,
}: {
  onFilesUpload: (files: string[]) => void;
}) {
  const handleFilesUpload = async (files) => {
    console.log("files", files);
    //make api call to upload files that will give use img urls and pass it to onFilesUpload function
    onFilesUpload(["file 1", "file 2"]);
  };
  return (
    <div>
      <p className="mb-1.5 ml-1 font-medium text-gray-700">
        <label>Image Attachment</label>
      </p>
      <FileInput
        onChange={handleFilesUpload}
        accept="image/*"
        placeholder="Upload files"
        multiple
      />
    </div>
  );
}
