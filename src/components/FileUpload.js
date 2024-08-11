import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
const { Dragger } = Upload;

function FileUpload({ disabled, onChange = () => {}, onRemove = () => {} }) {
  const props = {
    name: "file",
    multiple: true, // Allow only one file upload at a time
    beforeUpload: () => {
      // Prevent automatic upload
      return false;
    },

    showUploadList: true, // Do not show upload list
    onChange(info) {
      if (info.fileList && info.fileList.length > 0) {
        onChange(info.fileList[0].originFileObj);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <>
      <Dragger {...props} disabled={disabled}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single video upload. Strictly prohibited from uploading
          company data or other banned files.
        </p>
      </Dragger>
      <Button
        danger
        disabled={!disabled}
        onClick={() => {
          onRemove(); // Call onRemove to clear the video
        }}
      >
        Remove
      </Button>
    </>
  );
}

export default FileUpload;
