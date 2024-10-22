import { useState, useEffect } from 'react';
import { IAgoraRTCRemoteUser, useRTCClient } from 'agora-rtc-react';

export const useRemoteUsers = (channel: string) => {
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = useRTCClient();

  useEffect(() => {
    setIsLoading(true);
    setRemoteUsers([]);

    const handleUserJoined = (user: any) => {
      if (!user.uid.toString().toLowerCase().includes('screenshare')) {
        setRemoteUsers((prevUsers) => [...prevUsers, user]);
      }
    };

    const handleUserPublished = async (user: any, mediaType: any) => {
      await client.subscribe(user, mediaType);
      setRemoteUsers((prevUsers: any) =>
        prevUsers.map((u: any) =>
          u.uid === user.uid ? { ...u, [mediaType]: user[mediaType] } : u
        )
      );
    };

    const handleUserUnpublished = (user: any, mediaType: any) => {
      setRemoteUsers((prevUsers: any) =>
        prevUsers.map((u: any) =>
          u.uid === user.uid ? { ...u, [mediaType]: null } : u
        )
      );
    };

    const handleUserLeft = (user: any) => {
      setRemoteUsers((prevUsers) =>
        prevUsers.filter((u: any) => u.uid !== user.uid)
      );
    };

    client.on('user-joined', handleUserJoined);
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-left', handleUserLeft);

    // Get existing users in the channel
    client.remoteUsers.forEach(handleUserJoined);

    setIsLoading(false);

    return () => {
      client.off('user-joined', handleUserJoined);
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-left', handleUserLeft);
    };
  }, [client, channel]);

  return { remoteUsers, isLoading };
};
