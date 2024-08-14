import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
const { Dragger } = Upload;

function FileUpload({ disabled, onChange = () => {}, onRemove = () => {} }) {
  const [fileList, setFileList] = React.useState([]);

  const props = {
    name: "file",
    multiple: true, // Allow multiple file uploads
    beforeUpload: () => {
      // Prevent automatic upload (this is a client side app)
      return false;
    },

    showUploadList: false, // Do not show upload list
    fileList: fileList,
    onChange(info) {
      console.log("File list:", info.fileList); // Log the file list to understand its structure
      setFileList(info.fileList); // Update internal file list state

      // Ensure fileList is an array and handle accordingly
      if (Array.isArray(info.fileList) && info.fileList.length > 0) {
        const file = info.fileList[0].originFileObj;
        console.log("Uploaded file:", file); // Log the file to console
        onChange(file);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  React.useEffect(() => {
    // Clear fileList when onRemove is triggered
    setFileList([]);
  }, [onRemove]);

  return (
    <>
      <Dragger {...props} disabled={false} className="upload-container">
        {" "}
        {/* Always enabled */}
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag to upload</p>
        <p className="ant-upload-hint">Support for single or bulk files.</p>
      </Dragger>
      <Button
        danger
        disabled={disabled}
        onClick={() => {
          onRemove(); // Call onRemove to clear the file
        }}
      >
        Remove
      </Button>
    </>
  );
}

export default FileUpload;
