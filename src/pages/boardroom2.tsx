/* eslint-disable jsx-a11y/alt-text */

import AgoraRTC, { useJoin } from 'agora-rtc-react';

import { useEffect, useRef, useState } from 'react';

import { useRTCClient, useClientEvent } from 'agora-rtc-react';
import Login from './login';
import { useUserStore } from '../store/auth-user';
import { MediaControl } from '../components/media-control';
import LocalUserVideoTrack from '../components/agora/local-camera';
import LocalUserAudioTrack from '../components/agora/local-audio';
import RemoteParticipants from '../components/agora/remote-participants';
import RemoteParticipants2 from '../components/agora/remote-participant2';

const Boardroom2 = () => {
  const username = useUserStore((state) => state.username);
  const [calling, setCalling] = useState(false);
  const [micOn, setMic] = useState(false);
  const [cameraOn, setCamera] = useState(false);
  const [agoraUid, setAgoraUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [screenshareStarted, setScreenshareStarted] = useState(false);

  const handleCallingChange = (newValue: boolean) => {
    setCalling(newValue);
  };
  // console.log(rtmClient);
  useEffect(() => {
    if (username) {
      setAgoraUid(username);
      setCalling(true);

      setTimeout(() => setLoading(false), 500);

      // remove this in prod
      setLoading(false);
    }
  }, [username]);

  useJoin(
    {
      appid: process.env.REACT_APP_AGORAID!,
      channel: process.env.REACT_APP_CHANNEL!,
      token: null,
      uid: `${agoraUid}-screenshare`,
    },

    calling
  );

  const client = useRTCClient();

  useClientEvent(client, 'connection-state-change', (e) => {
    console.log(e, 'etst');
    if (e === 'DISCONNECTING') {
      localStorage.removeItem('active');
    }
  });

  // console.log(client);

  useClientEvent(client, 'user-joined', (e) => {
    if (e.uid.toString().includes('ScreenShare')) {
      setScreenshareStarted(true);
      return;
    }
    if (e.uid.toString().includes('vZone')) {
      console.log('s');
    } else console.log(e);
  });
  useClientEvent(client, 'user-left', (e) => {
    if (e.uid === 'Screenshare') {
      // toast.success('Screenshare ended.');
      setScreenshareStarted(false);
    } else console.log(e.uid, 'user left');
  });

  AgoraRTC.on('playback-device-changed', (e) => {
    console.log(e, 'playback device changed');
  });
  useClientEvent(client, 'stream-fallback', () => {
    console.log('stream fallback');
  });
  //   if (!username) {
  //     return <Login />;
  //   }

  return (
    <div className="step-7 step-6 step-5   h-[100vh] w-[100vw] overflow-hidden  ">
      <div className="">
        <div>
          <RemoteParticipants2 />

          {/* <LocalUserVideoTrack cameraOn={cameraOn} /> */}
          {/* <LocalUserAudioTrack micOn={micOn} /> */}
        </div>
        {/* {calling && (
          <div className=" pointer-events-auto  md:relative md:z-[99]">
            <MediaControl
              calling={calling}
              cameraOn={cameraOn}
              micOn={micOn}
              setCalling={() => {
                setCalling((a) => !a);
              }}
              setCamera={() => {
                setCamera((a) => !a);
              }}
              setMic={() => {
                setMic((a) => !a);
              }}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Boardroom2;
