import React from "react";
import { Button } from "antd";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { sliderValueToVideoTime } from "../utils/utils";

function VideoConversionButton({
  videoPlayerState,
  sliderValues,
  videoFile,
  ffmpeg,
  onConversionStart = () => {},
  onConversionEnd = () => {},
  onGifCreated = () => {},
}) {
  const convertToGif = async () => {
    onConversionStart(true);

    const inputFileName = "gif.mp4";
    const outputFileName = "output.gif";

    ffmpeg.FS("writeFile", inputFileName, await fetchFile(videoFile));

    const [min, max] = sliderValues;
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

    await ffmpeg.run(
      "-i",
      inputFileName,
      "-ss",
      `${minTime}`,
      "-to",
      `${maxTime}`,
      "-f",
      "gif",
      outputFileName
    );

    const data = ffmpeg.FS("readFile", outputFileName);
    const gifUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    onGifCreated(gifUrl);

    onConversionEnd(false);
  };

  return <Button onClick={convertToGif}>Convert to GIF</Button>;
}

export default VideoConversionButton;
