import { useEffect, useState } from 'react';
import {
  LocalAudioTrack,
  useLocalMicrophoneTrack,
  usePublish,
} from 'agora-rtc-react';
import { useMicrophoneStore } from '../../store/mic-store';

interface LocalUserAudioTrackProps {
  micOn: boolean;
}

const LocalUserAudioTrack = ({ micOn }: LocalUserAudioTrackProps) => {
  const { localMicrophoneTrack, isLoading, error } = useLocalMicrophoneTrack(
    micOn,
    {}
  );

  useMicrophoneStore.setState({ localMicrophoneTrack });
  if (error) {
    console.log(error);
  }

  usePublish([localMicrophoneTrack]);

  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setMuted(!micOn);
      localMicrophoneTrack.stop();
    }
  }, [micOn, localMicrophoneTrack]);

  return (
    <div>
      {/* {audioTrackState && (
        <>
          <p>{`muted: ${audioTrackState.muted}`}</p>
          <p>{`isPlaying: ${audioTrackState.isPlaying}`}</p>
          <p>{`enabled: ${audioTrackState.enabled}`}</p>
          <p>{audioTrackState.device}</p>
        </>
      )} */}
      {/* <LocalAudioTrack play disabled={!micOn} track={localMicrophoneTrack} /> */}
    </div>
  );
};

export default LocalUserAudioTrack;
