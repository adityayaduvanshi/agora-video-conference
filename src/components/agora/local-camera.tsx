import React, { useEffect } from 'react';
import {
  useLocalCameraTrack,
  usePublish,
  LocalVideoTrack,
  useCurrentUID,
} from 'agora-rtc-react';
import { Mic, MicOff } from 'lucide-react';
import { useCameraStore } from '../../store/camera-store';

interface LocalUserVideoTrackProps {
  cameraOn: boolean;
  micOn: boolean;
}

const LocalUserVideoTrack = ({ cameraOn, micOn }: LocalUserVideoTrackProps) => {
  const { localCameraTrack, error } = useLocalCameraTrack(cameraOn);
  const uid = useCurrentUID();

  useCameraStore.setState({ localCameraTrack });
  usePublish([localCameraTrack]);

  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(cameraOn);
    }
  }, [cameraOn, localCameraTrack]);

  const initials = uid ? uid.toString().slice(0, 2).toUpperCase() : 'ME';

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative w-full pb-[100%]">
        <div className="absolute border-2 border-green-500 inset-0">
          {cameraOn && localCameraTrack ? (
            <LocalVideoTrack
              play
              track={localCameraTrack}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <span className="text-3xl font-bold text-white">{initials}</span>
            </div>
          )}
          <div className="absolute top-2 right-2 text-white">
            {micOn ? (
              <Mic className="text-green-500" />
            ) : (
              <MicOff className="text-red-500" />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
            <p className="text-xs font-semibold truncate">You</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalUserVideoTrack;
