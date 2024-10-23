import {
  VideoIcon,
  VideoOff,
  MicIcon,
  MicOff,
  ScreenShare,
  RefreshCcw,
  MessageCircle,
  List,
  AlertCircleIcon,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import {
  useAutoPlayVideoTrack,
  useRTCClient,
  UID,
  useCurrentUID,
} from 'agora-rtc-react';
import { Button } from './ui/button';
import { useUserStore } from '../store/auth-user';

interface MediaControlProps {
  calling?: boolean;
  micOn?: boolean;
  cameraOn?: boolean;
  setMic?: () => void;
  setCamera?: () => void;
  setCalling?: () => void;
}
/* Camera and Microphone Controls */
export const MediaControl = ({
  calling,
  micOn,
  cameraOn,
  setMic,
  setCamera,
  setCalling,
}: MediaControlProps) => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const logout = useUserStore((state) => state.logout); // Assuming you have a logout function in your user store

  const rtcClient = useRTCClient();

  const [disableMic, setDisableMic] = useState<boolean>(false);
  const [disableCamera, setDisableCamera] = useState<boolean>(false);

  const currentUser = useCurrentUID();

  const toggleCamera = async () => {
    try {
      if (!cameraOn) {
        // Ask for permission if not already granted
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        stream.getTracks().forEach((track) => track.stop());
        setCameraPermission(true);
      }
      if (setCamera) {
        setCamera();
      }
    } catch (error) {
      console.error('Error accessing camerassssssssssssssss:', error);
    }
  };

  const toggleMic = async () => {
    try {
      if (!cameraOn) {
        // Ask for permission if not already granted
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        stream.getTracks().forEach((track) => track.stop());
        setCameraPermission(true);
      }
      if (setMic) {
        setMic();
      }
    } catch (error) {
      console.error('Error accessing camerassssssssssssssss:', error);
    }
  };
  const handleLogout = async () => {
    try {
      await rtcClient.leave();

      // Turn off camera and microphone
      if (setCamera) setCamera();
      if (setMic) setMic();

      // Set calling to false
      if (setCalling) setCalling();

      // Call the logout function
      logout();

      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <div className="absolute hidden lg:flex w-full z-50 items-center  justify-center  left-0 gap-4 md:z-[99] ">
        {/* <div className="flex gap-4  "> */}
        {/* {setMic && (
            <Button
              variant="roundedbtn"
              className={`step-1 ${
                micOn
                  ? ' bg-green-700 hover:bg-green-600'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
              size="round"
              disabled={disableMic}
              // onClick={() => setMic()}
              // onClick={toggleMic}
            >
              {micOn ? (
                <MicIcon className=" h-5 w-5 " />
              ) : (
                <MicOff className=" h-5 w-5 " />
              )}
            </Button>
          )} */}

        {/* {setCamera && (
            <Button
              variant="roundedbtn"
              className={` step-2  focus:outline-none ${
                cameraOn
                  ? 'bg-green-700 hover:bg-green-600'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
              size="round"
              onClick={toggleCamera}
              disabled={disableCamera}
            >
              {cameraOn ? (
                <VideoIcon className=" h-5 w-5 " />
              ) : (
                <VideoOff className="h-5 w-5" />
              )}
            </Button>
          )} */}
        {/* </div> */}

        {setCalling && (
          <div>
            {calling ? (
              // <Button
              //   className=" rounded-xl text-slate-200"
              //   onClick={handleLogout}
              //   variant="destructive"
              // >
              //   Leave
              // </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className=" rounded-xl text-slate-200"
              >
                Leave
              </Button>
            ) : (
              <Button>Leave</Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};
