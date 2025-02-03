import AgoraRTC, {
  useJoin,
  useRTCClient,
  useClientEvent,
} from 'agora-rtc-react';
import { useEffect, useState } from 'react';
import Login from './login';
import { useUserStore } from '../store/auth-user';
import { MediaControl } from '../components/media-control';
import LocalUserAudioTrack from '../components/agora/local-audio';
import RemoteParticipants from '../components/agora/remote-participant22';
import { useChannelStore } from '../store/channel';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

const Boardroom = () => {
  const username = useUserStore((state) => state.username);
  const [calling, setCalling] = useState(false);
  const [micOn, setMic] = useState(false);
  const [cameraOn, setCamera] = useState(false);
  const [agoraUid, setAgoraUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [screenshareStarted, setScreenshareStarted] = useState(false);
  // const [currentChannel, setCurrentChannel] = useState(
  //   process.env.REACT_APP_CHANNEL!
  // );

  useEffect(() => {
    if (username) {
      setAgoraUid(username);
      setCalling(true);
      setLoading(false);
    }
  }, [username]);

  const { isLoading, isConnected } = useJoin(
    {
      appid: process.env.REACT_APP_AGORAID!,
      channel: process.env.REACT_APP_CHANNEL!,
      token: null,
      uid: `${agoraUid}-vZone`,
    },
    calling
  );

  const client = useRTCClient();

  useClientEvent(client, 'connection-state-change', (state) => {
    console.log('Connection state changed:', state);
  });

  useClientEvent(client, 'user-joined', (user) => {
    if (user.uid.toString().includes('ScreenShare')) {
      setScreenshareStarted(true);
    }
  });

  useClientEvent(client, 'user-left', (user) => {
    if (user.uid === 'Screenshare') {
      setScreenshareStarted(false);
    }
  });

  const navigate = useNavigate();
  const location = useLocation();

  AgoraRTC.on('playback-device-changed', (e) => {
    console.log(e, 'playback device changed');
  });
  useEffect(() => {
    if (location.pathname === '/refresh') {
      navigate(location.state?.from || '/', { replace: true });
    }
  }, [location, navigate]);

  if (!username) {
    return <Login />;
  }

  return (
    <div className="h-[100vh] bg-black w-[100vw] overflow-hidden">
      <RemoteParticipants channel={process.env.REACT_APP_CHANNEL!} />
    </div>
  );
};

export default Boardroom;
