import React from 'react';
import {
  useRemoteUsers,
  useRemoteVideoTracks,
  useRemoteAudioTracks,
  RemoteVideoTrack,
  RemoteAudioTrack,
} from 'agora-rtc-react';
import { Mic, MicOff } from 'lucide-react';
import LocalUserVideoTrack from './local-camera';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
interface RemoteParticipantsProps {
  cameraOn: boolean;
  micOn: boolean;
}
const RemoteParticipants = ({ cameraOn, micOn }: RemoteParticipantsProps) => {
  const remoteUsers = useRemoteUsers();
  const { videoTracks } = useRemoteVideoTracks(remoteUsers);
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  return (
    <div className="h-[100vh] p-4 bg-black overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Participants</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <LocalUserVideoTrack cameraOn={cameraOn} micOn={micOn} />
        {remoteUsers.map((user) => {
          const videoTrack = videoTracks.find(
            (track) => track.getUserId() === user.uid
          );
          const audioTrack = audioTracks.find(
            (track) => track.getUserId() === user.uid
          );
          const participantUid = user.uid as string;
          const initials = getInitials(participantUid);

          return (
            <div
              key={participantUid}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative w-full pb-[100%]">
                <div className="absolute border-2 border-green-500 inset-0">
                  {videoTrack ? (
                    <RemoteVideoTrack
                      muted
                      play
                      track={videoTrack}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black ">
                      <span className="text-3xl font-bold text-white">
                        {initials}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 text-white">
                    {audioTrack ? (
                      <Mic className="text-green-500" />
                    ) : (
                      <MicOff className="text-red-500" />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <p className="text-xs font-semibold truncate">
                      {participantUid}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        {audioTracks.map((audioTrack) => (
          <RemoteAudioTrack
            key={audioTrack.getUserId()}
            volume={100}
            play
            track={audioTrack}
          />
        ))}
      </div>
    </div>
  );
};

export default RemoteParticipants;
