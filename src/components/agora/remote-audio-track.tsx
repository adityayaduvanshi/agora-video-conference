import React from 'react';
import {
  useRemoteUsers,
  useRemoteVideoTracks,
  useRemoteAudioTracks,
  RemoteVideoTrack,
  RemoteAudioTrack,
} from 'agora-rtc-react';

const RemoteParticipantsssss = () => {
  const remoteUsers = useRemoteUsers();

  const { videoTracks } = useRemoteVideoTracks(remoteUsers);
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  return (
    <div>
      {audioTracks.map((audioTrack, index) => {
        return (
          <div key={audioTrack.getUserId()}>
            <RemoteAudioTrack volume={100} play track={audioTrack} />
          </div>
        );
      })}
    </div>
  );
};

export default RemoteParticipantsssss;
