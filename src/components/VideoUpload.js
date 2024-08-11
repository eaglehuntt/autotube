import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Button, Modal } from "antd";

const { Dragger } = Upload;

const VideoUpload = ({
  disabled,
  onChange = () => {},
  onRemove = () => {},
}) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const props = {
    name: "file",
    multiple: false, // Single file upload for video preview
    action: "", // No server action required
    beforeUpload(file) {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo) {
        message.error("You can only upload video files!");
        return Upload.LIST_IGNORE; // Ignore this file from being added to the upload list
      }
      return true;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          const url = URL.createObjectURL(file);
          setVideoUrl(url);
          onChange(file);
        }
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } /*
      FIX LATER
      else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      } */
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    showUploadList: false, // Disable showing the file list
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
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
      {videoUrl && (
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Preview Video
        </Button>
      )}
      <Button
        danger
        disabled={!videoUrl}
        onClick={() => {
          setVideoUrl(null);
          onRemove(undefined);
        }}
      >
        Remove
      </Button>
      <Modal
        title="Video Preview"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <video width="60%" height="60%" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Modal>
    </>
  );
};

export default VideoUpload;
