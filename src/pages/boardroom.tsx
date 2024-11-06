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
import { useLocation, useNavigate } from 'react-router-dom';

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

  const { currentChannel, channels, setCurrentChannel, addChannel } =
    useChannelStore();

  // const [channels, setChannels] = useState([
  //   process.env.REACT_APP_CHANNEL!,
  //   'Podcast',
  //   'FOZ',
  //   'General',
  //   'Tech Talk',
  //   'Coffee Break',
  // ]);

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
      channel: currentChannel,
      token: null,
      uid: agoraUid,
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

  const [remoteParticipantsKey, setRemoteParticipantsKey] = useState(0);

  useClientEvent(client, 'user-left', (user) => {
    if (user.uid === 'Screenshare') {
      setScreenshareStarted(false);
    }
  });

  // const switchChannel = async (newChannel: string) => {
  //   try {
  //     if (client.connectionState === 'CONNECTED') {
  //       await client.leave();
  //     }
  //     setCurrentChannel(newChannel);
  //     await client.join(
  //       process.env.REACT_APP_AGORAID!,
  //       newChannel,
  //       null,
  //       agoraUid!
  //     );
  //   } catch (error) {
  //     console.error('Error switching channel:', error);
  //     // Handle the error appropriately (e.g., show an error message to the user)
  //   }
  // };
  // const switchChannel = async (newChannel: string) => {
  //   try {
  //     if (client.connectionState === 'CONNECTED') {
  //       await client.leave();
  //     }
  //     setCurrentChannel(newChannel);
  //     await client.join(
  //       process.env.REACT_APP_AGORAID!,
  //       newChannel,
  //       null,
  //       agoraUid!
  //     );
  //   } catch (error) {
  //     console.error('Error switching channel:', error);
  //     // Handle the error appropriately (e.g., show an error message to the user)
  //   }
  // };

  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const switchChannel = async (newChannel: string) => {
    try {
      if (client.connectionState === 'CONNECTED') {
        await client.leave();
      }
      setCurrentChannel(newChannel);
      setRefreshKey((prev) => prev + 1); // Force re-render of RemoteParticipants
      await client.join(
        process.env.REACT_APP_AGORAID!,
        newChannel,
        null,
        agoraUid!
      );
      navigate('/refresh', { replace: true });
    } catch (error) {
      console.error('Error switching channel:', error);
    }
  };
  AgoraRTC.on('playback-device-changed', (e) => {
    console.log(e, 'playback device changed');
  });
  useEffect(() => {
    if (location.pathname === '/refresh') {
      navigate(location.state?.from || '/', { replace: true });
    }
  }, [location, navigate]);
  // const addChannel = (channelName: string) => {
  //   if (channelName && !channels.includes(channelName)) {
  //     setChannels((prev) => [...prev, channelName]);
  //   }
  // };

  if (!username) {
    return <Login />;
  }

  return (
    <div className="h-[100vh] bg-black w-[100vw] overflow-hidden">
      <RemoteParticipants channel={currentChannel} />
    </div>
  );
};

export default Boardroom;
