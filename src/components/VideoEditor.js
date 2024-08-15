import React, { useEffect, useState } from "react";
import { Slider, Spin } from "antd";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import VideoPlayer from "./VideoPlayer";
import FileUpload from "./FileUpload";
import VideoConversionButton from "./VideoConversionButton";
import { sliderValueToVideoTime } from "../utils/utils";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const ffmpeg = createFFmpeg({ log: true });

function VideoEditor() {
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoPlayerState, setVideoPlayerState] = useState(null);
  const [videoPlayer, setVideoPlayer] = useState(null);
  const [gifUrl, setGifUrl] = useState(null);
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    ffmpeg.load().then(() => {
      setFFmpegLoaded(true);
    });
  }, []);

  useEffect(() => {
    const min = sliderValues[0];
    const max = sliderValues[1];
    if (videoPlayer && videoPlayerState) {
      const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
      const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

      if (videoPlayerState.currentTime < minTime) {
        videoPlayer.seek(minTime);
      }
      if (videoPlayerState.currentTime > maxTime) {
        videoPlayer.seek(minTime);
      }
    }
  }, [sliderValues, videoPlayer, videoPlayerState]);

  useEffect(() => {
    if (!videoFile) {
      setVideoPlayerState(null);
      setSliderValues([0, 100]);
      setGifUrl(null);
    }
  }, [videoFile]);

  const handleFileChange = (file) => {
    console.log("Received file:", file);
    if (file.type.startsWith("video/")) {
      setVideoFile(file);
    } else if (file.type.startsWith("audio/")) {
      setAudioFile(file);
    }
  };

  const handleFileRemove = () => {
    setVideoFile(null);
    setAudioFile(null);
  };

  const isProcessingDisabled = !(videoFile && audioFile);

  return (
    <div>
      <Spin
        spinning={processing || !ffmpegLoaded}
        tip={!ffmpegLoaded ? "Waiting for FFmpeg to load..." : "Processing..."}
      >
        <div>
          <h1>Upload a video and an audio file</h1>
        </div>
        <div className="upload-div">
          <FileUpload
            disabled={false}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
          />
        </div>
        <div className="file-status">
          <h3>File Status:</h3>
          <p>
            <span>
              {videoFile ? (
                <CheckCircleOutlined
                  style={{ color: "green", marginLeft: 8 }}
                />
              ) : (
                <CloseCircleOutlined style={{ color: "red", marginLeft: 8 }} />
              )}{" "}
              Video: {videoFile ? videoFile.name : "No video file uploaded"}
            </span>
          </p>
          <p>
            <span>
              {audioFile ? (
                <CheckCircleOutlined
                  style={{ color: "green", marginLeft: 8 }}
                />
              ) : (
                <CloseCircleOutlined style={{ color: "red", marginLeft: 8 }} />
              )}{" "}
              Audio: {audioFile ? audioFile.name : "No audio file uploaded"}
            </span>
          </p>
        </div>
        {videoFile && (
          <div className="video-player-div">
            <VideoPlayer
              src={URL.createObjectURL(videoFile)}
              onPlayerChange={(videoPlayer) => setVideoPlayer(videoPlayer)}
              onChange={(videoPlayerState) =>
                setVideoPlayerState(videoPlayerState)
              }
            />
          </div>
        )}
        <div className="slider-div">
          <h3>Cut Video</h3>
          <Slider
            disabled={!videoPlayerState}
            value={sliderValues}
            range
            onChange={(values) => setSliderValues(values)}
            tooltip={{ formatter: null }}
          />
        </div>
        <div className="conversion-div">
          <VideoConversionButton
            onConversionStart={() => setProcessing(true)}
            onConversionEnd={() => setProcessing(false)}
            ffmpeg={ffmpeg}
            videoPlayerState={videoPlayerState}
            sliderValues={sliderValues}
            videoFile={videoFile}
            audioFile={audioFile} // Ensure audioFile is passed as a prop
            onVideoCreated={(videoUrl) => setGifUrl(videoUrl)} // Update the callback to handle video URL
            disabled={isProcessingDisabled}
          />
        </div>
        {gifUrl && (
          <div className="gif-div">
            <h3>Resulting Video</h3>
            <video controls src={gifUrl} className="video-result" />
            <a
              href={gifUrl}
              download="output.mp4"
              className="ant-btn ant-btn-default"
            >
              Download
            </a>
          </div>
        )}
      </Spin>
    </div>
  );
}

export default VideoEditor;
