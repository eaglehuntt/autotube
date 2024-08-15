import React from "react";
import { Button } from "antd";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { sliderValueToVideoTime } from "../utils/utils";

function VideoConversionButton({
  videoPlayerState,
  sliderValues,
  videoFile,
  audioFile,
  ffmpeg,
  onConversionStart = () => {},
  onConversionEnd = () => {},
  onVideoCreated = () => {},
}) {
  const convertVideo = async () => {
    onConversionStart(true);

    const videoInputFileName = "input.mp4";
    const audioInputFileName = "input.mp3";
    const outputFileName = "output.mp4";

    ffmpeg.FS("writeFile", videoInputFileName, await fetchFile(videoFile));
    ffmpeg.FS("writeFile", audioInputFileName, await fetchFile(audioFile));

    const [min, max] = sliderValues;
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

    const cutVideoFileName = "cut.mp4";

    // Cut the video based on slider values
    await ffmpeg.run(
      "-i",
      videoInputFileName,
      "-ss",
      `${minTime}`,
      "-to",
      `${maxTime}`,
      "-c",
      "copy",
      cutVideoFileName
    );

    // Loop the cut video for the duration of the audio file and combine them
    await ffmpeg.run(
      "-stream_loop",
      "-1",
      "-i",
      cutVideoFileName,
      "-i",
      audioInputFileName,
      "-shortest",
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-y",
      outputFileName
    );

    const data = ffmpeg.FS("readFile", outputFileName);
    const videoUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    onVideoCreated(videoUrl);

    onConversionEnd(false);
  };

  return (
    <Button onClick={convertVideo} disabled={!videoFile || !audioFile}>
      Convert to Video
    </Button>
  );
}

export default VideoConversionButton;
