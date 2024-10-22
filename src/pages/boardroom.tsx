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
import RemoteParticipants from '../components/agora/remote-participants';
import { useChannelStore } from '../store/channel';

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
    if (state === 'DISCONNECTED') {
      localStorage.removeItem('active');
    }
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
  const switchChannel = async (newChannel: string) => {
    try {
      if (client.connectionState === 'CONNECTED') {
        await client.leave();
      }
      setCurrentChannel(newChannel);
      await client.join(
        process.env.REACT_APP_AGORAID!,
        newChannel,
        null,
        agoraUid!
      );
    } catch (error) {
      console.error('Error switching channel:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };
  // const addChannel = (channelName: string) => {
  //   if (channelName && !channels.includes(channelName)) {
  //     setChannels((prev) => [...prev, channelName]);
  //   }
  // };

  if (!username) {
    return <Login />;
  }

  return (
    <div className="h-[100vh] w-[100vw] overflow-hidden">
      <div>
        {/* <div>
          <h2>Current Channel: {currentChannel}</h2>
          <select
            value={currentChannel}
            onChange={(e) => switchChannel(e.target.value)}
            className="p-2 border rounded"
          >
            {channels.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
        </div> */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gray-950 rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-semibold">
                Current Channel
              </p>
              <span className="text-green-400 text-sm font-medium">
                {currentChannel}
              </span>
            </div>
            <div className="relative">
              <select
                value={currentChannel}
                onChange={(e) => switchChannel(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-md py-1 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {channels.map((channel) => (
                  <option key={channel} value={channel} className="bg-gray-900">
                    {channel}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <RemoteParticipants />
        <LocalUserAudioTrack micOn={micOn} />
      </div>
      {calling && (
        <div className="pointer-events-auto md:relative md:z-[99]">
          <MediaControl
            calling={calling}
            cameraOn={cameraOn}
            micOn={micOn}
            setCalling={() => setCalling((prev) => !prev)}
            setCamera={() => setCamera((prev) => !prev)}
            setMic={() => setMic((prev) => !prev)}
          />
        </div>
      )}
    </div>
  );
};

export default Boardroom;
