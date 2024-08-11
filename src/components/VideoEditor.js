import React, { useEffect, useState } from "react";
import { Slider, Spin } from "antd";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import VideoPlayer from "./VideoPlayer";
import FileUpload from "./FileUpload";
import VideoConversionButton from "./VideoConversionButton";
import { sliderValueToVideoTime } from "../utils/utils";

const ffmpeg = createFFmpeg({ log: true });

function VideoEditor() {
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
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
    if (min !== undefined && videoPlayerState && videoPlayer) {
      videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min));
    }
  }, [sliderValues]);

  useEffect(() => {
    if (videoPlayer && videoPlayerState) {
      const [min, max] = sliderValues;
      const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
      const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

      if (videoPlayerState.currentTime < minTime) {
        videoPlayer.seek(minTime);
      }
      if (videoPlayerState.currentTime > maxTime) {
        videoPlayer.seek(minTime);
      }
    }
  }, [videoPlayerState]);

  useEffect(() => {
    if (!videoFile) {
      setVideoPlayerState(null);
      setSliderValues([0, 100]);
      setGifUrl(null);
    }
  }, [videoFile]);

  return (
    <div>
      <Spin
        spinning={processing || !ffmpegLoaded}
        tip={!ffmpegLoaded ? "Waiting for FFmpeg to load..." : "Processing..."}
      >
        <div>
          <h1>Upload a video</h1>
        </div>
        <div className="upload-div">
          <FileUpload
            disabled={!!videoFile}
            onChange={(videoFile) => setVideoFile(videoFile)}
            onRemove={() => setVideoFile(null)}
          />
        </div>
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
            onGifCreated={(gifUrl) => setGifUrl(gifUrl)}
          />
        </div>
        {gifUrl && (
          <div className="gif-div">
            <h3>Resulting GIF</h3>
            <img
              src={gifUrl}
              className="gif"
              alt="GIF file generated in the client side"
            />
            <a
              href={gifUrl}
              download="test.gif"
              className="ant-btn ant-btn-default"
            >
              Download
            </a>
          </div>
        )}
      </Spin>
      {videoFile ? (
        <VideoPlayer
          src={URL.createObjectURL(videoFile)}
          onPlayerChange={(videoPlayer) => setVideoPlayer(videoPlayer)}
          onChange={(videoPlayerState) => setVideoPlayerState(videoPlayerState)}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default VideoEditor;
