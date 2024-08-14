import {
  BigPlayButton,
  ControlBar,
  LoadingSpinner,
  Player,
  PlayToggle,
} from "video-react";
import "video-react/dist/video-react.css";
import { useEffect, useState } from "react";

export function VideoPlayer({
  src,
  onPlayerChange = () => {},
  onChange = () => {},
  startTime = undefined,
}) {
  const [player, setPlayer] = useState(null);
  const [playerState, setPlayerState] = useState(null);

  useEffect(() => {
    if (player) {
      player.subscribeToStateChange(setPlayerState);
      onPlayerChange(player);
    }
  }, [player]);

  useEffect(() => {
    onChange(playerState);
  }, [playerState]);

  return (
    <div className={"video-player"}>
      <Player
        ref={(player) => {
          setPlayer(player);
        }}
        startTime={startTime}
      >
        <source src={src} />
        <BigPlayButton position="center" />
        <LoadingSpinner />
        <ControlBar autoHide={false} disableDefaultControls={true}>
          <PlayToggle />
        </ControlBar>
      </Player>
    </div>
  );
}

export default VideoPlayer;
