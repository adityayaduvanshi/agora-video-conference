import React, { useState, useEffect, useMemo, useRef } from 'react';

import { Button } from '../ui/button';
import {
  IAgoraRTCRemoteUser,
  RemoteAudioTrack,
  useRTCClient,
} from 'agora-rtc-react';
import { useCameraStore } from '../../store/camera-store';
import { RemoteVideoTrack } from 'agora-rtc-react';

import { ChevronLeft, ChevronRight, Mic, MicOff } from 'lucide-react'; // Import icons for pagination buttons
import { useChannelStore } from '../../store/channel';
import RemoteParticipantsssss from './remote-audio-track';

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};
// const VideoTile = ({
//   user,
//   size,
//   isLocal,
// }: {
//   user: any;
//   size: any;
//   isLocal: any;
// }) => {
//   const initials = getInitials(user.uid);
//   const gradientClass = 'bg-gradient-to-r from-green-400 to-blue-500';
//   // console.log(user);
//   return (
//     <div className={`relative ${size} bg-black rounded-lg overflow-hidden`}>
//       {user.videoTrack ? (
//         <div
//           ref={(ref) => {
//             if (ref) user.videoTrack.play(ref);
//           }}
//           className={`absolute inset-0 h-full w-full object-cover ${
//             !isLocal ? 'scale-x-[-1]' : ''
//           }`}
//         />
//       ) : (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div
//             className={`w-16 sm:w-24  h-16 sm:h-24 rounded-full flex items-center justify-center   bg-transparent border-2 border-green-500 text-white text-2xl sm:text-4xl  font-bold`}
//           >
//             {isLocal ? 'You' : initials}
//           </div>
//         </div>
//       )}
//       <div className="absolute  w-full flex justify-center bottom-0 sm:bottom-2 left-2 bg-transparent bg-opacity-50 px-2 py-1 rounded text-white text-xs sm:text-sm">
//         {isLocal ? 'You' : user.uid}
//       </div>
//       <div className=" absolute top-1 right-1">
//         {user.audioTrack ? (
//           <Mic className="h-5 w-5 text-green-500" />
//         ) : (
//           <MicOff className="h-5 w-5 text-red-500" />
//         )}
//       </div>
//     </div>
//   );
// };

const VideoTile = ({
  user,
  size,
  isLocal,
  isSpeaking,
}: {
  user: any;
  size: string;
  isLocal: boolean;
  isSpeaking: boolean;
}) => {
  const initials = getInitials(user.uid);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && user.videoTrack) {
      user.videoTrack.play(videoRef.current);
    }
    return () => {
      if (user.videoTrack) {
        user.videoTrack.stop();
      }
    };
  }, [user.videoTrack]);

  return (
    <div
      className={`relative ${size} bg-black rounded-lg overflow-hidden ${
        isSpeaking ? 'border-2 border-green-500' : ''
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {user.videoTrack ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full !object-contain scale-x-[-1]"
          />
        ) : (
          <div className="w-24 sm:w-24 h-24 sm:h-24 rounded-full flex items-center justify-center bg-transparent border-2 border-green-500 text-white text-2xl sm:text-4xl font-bold">
            {isLocal ? 'You' : initials}
          </div>
        )}
      </div>
      <div className="absolute w-full flex justify-center items-center bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-2 py-1">
        <span className="text-white text-xs sm:text-lg font-semibold">
          {isLocal ? 'You' : user.uid}
        </span>
      </div>
      <div className="  absolute top-1 right-2">
        <div className="">
          {user.audioTrack ? (
            <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
          ) : (
            <MicOff className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
};
const RemoteParticipants = ({ channel }: { channel: any }) => {
  const client = useRTCClient();
  const [speakingUsers, setSpeakingUsers] = useState<any>({});

  const [isLoading, setIsLoading] = useState(true);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;
  const audioContextRef = useRef<AudioContext | null>(null);
  // useEffect(() => {
  //   client.enableAudioVolumeIndicator();

  //   const handleVolumeIndicator = (volumes: any) => {
  //     const newSpeakingUsers: any = {};
  //     console.log(volumes);
  //     volumes.forEach((volume: any) => {
  //       newSpeakingUsers[volume.uid] = volume.level > 5; // Adjust this threshold as needed
  //     });
  //     setSpeakingUsers(newSpeakingUsers);
  //   };
  //   console.log(speakingUsers, 'SPEAKING USER');
  //   client.on('volume-indicator', handleVolumeIndicator);

  //   return () => {
  //     client.off('volume-indicator', handleVolumeIndicator);
  //   };
  // }, [client, speakingUsers]);

  useEffect(() => {
    // Create AudioContext in suspended state
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    audioContextRef.current.suspend();

    const resumeAudioContext = () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state === 'suspended'
      ) {
        audioContextRef.current
          .resume()
          .then(() => {
            console.log('AudioContext resumed successfully');
          })
          .catch((error) => {
            console.error('Failed to resume AudioContext:', error);
          });
      }
    };
    document.addEventListener('click', resumeAudioContext);
    document.addEventListener('touchstart', resumeAudioContext);

    return () => {
      // Remove event listeners on cleanup
      document.removeEventListener('click', resumeAudioContext);
      document.removeEventListener('touchstart', resumeAudioContext);
      // Close AudioContext on cleanup
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  useEffect(() => {
    client.enableAudioVolumeIndicator();

    const handleVolumeIndicator = (volumes: any) => {
      const newSpeakingUsers: any = {};
      volumes.forEach((volume: any) => {
        const isSpeaking = volume.level > 20; // Adjust this threshold as needed
        newSpeakingUsers[volume.uid] = isSpeaking;

        // Log when a user starts speaking
        if (isSpeaking) {
          console.log(`${volume.uid} is speaking`);
        } else {
          console.log(`${volume.uid} is not speaking`);
        }
      });
      setSpeakingUsers(newSpeakingUsers);
    };

    client.on('volume-indicator', handleVolumeIndicator);

    return () => {
      client.off('volume-indicator', handleVolumeIndicator);
    };
  }, [client]);
  useEffect(() => {
    // setRemoteUsers([]);
    const handleUserJoined = (user: any) => {
      if (
        !user.uid.toLowerCase().includes('screenshare') &&
        !user.uid.toLowerCase().includes('vzone') &&
        !user.uid.toLowerCase().includes('screendev')
      ) {
        console.log(`${user.uid} joined the conference`);

        setRemoteUsers((prevUsers: any) => {
          const userExists = prevUsers.some((u: any) => u.uid === user.uid);
          if (!userExists) {
            return [
              ...prevUsers,
              { uid: user.uid, videoTrack: null, audioTrack: null },
            ];
          }
          return prevUsers;
        });
      }
    };
    const handleUserPublished = async (user: any, mediaType: any) => {
      if (
        !user.uid.toLowerCase().includes('screenshare') &&
        !user.uid.toLowerCase().includes('vzone') &&
        !user.uid.toLowerCase().includes('screendev')
      ) {
        await client.subscribe(user, mediaType);
        console.log(
          `${user.uid} turned on ${
            mediaType === 'video' ? 'camera' : 'microphone'
          }`
        );
        setRemoteUsers((prevUsers: any) => {
          const updatedUser = prevUsers.find(
            (u: any) => u.uid === user.uid
          ) || { uid: user.uid };
          if (mediaType === 'video') {
            updatedUser.videoTrack = user.videoTrack;
          } else if (mediaType === 'audio') {
            updatedUser.audioTrack = user.audioTrack;
          }
          return prevUsers.map((u: any) =>
            u.uid === user.uid ? updatedUser : u
          );
        });
      }
    };

    const handleUserUnpublished = (user: any, mediaType: any) => {
      if (
        !user.uid.toLowerCase().includes('screenshare') &&
        !user.uid.toLowerCase().includes('vzone') &&
        !user.uid.toLowerCase().includes('screendev')
      ) {
        console.log(
          `${user.uid} turned off ${
            mediaType === 'video' ? 'camera' : 'microphone'
          }`
        );

        setRemoteUsers((prevUsers: any) =>
          prevUsers.map((u: any) =>
            u.uid === user.uid
              ? {
                  ...u,
                  [mediaType === 'video' ? 'videoTrack' : 'audioTrack']: null,
                }
              : u
          )
        );
      }
    };

    const handleUserLeft = (user: any) => {
      console.log(`${user.uid} left the conference`);
      setRemoteUsers((prevUsers: any) =>
        prevUsers.filter((u: any) => u.uid !== user.uid)
      );
    };

    client.on('user-joined', handleUserJoined);
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-joined', handleUserJoined);
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);

  // const allUsers = useMemo(() => {
  //   const localUser = { uid: 'You', videoTrack: localCameraTrack };
  //   return [localUser, ...remoteUsers];
  // }, [localCameraTrack, remoteUsers]);
  // const allUsers = useMemo(() => {
  //   // Remove the local user, just return remoteUsers
  //   return remoteUsers;
  // }, [remoteUsers]);
  const allUsers = useMemo(() => {
    // const localUser = { uid: 'You', videoTrack: localCameraTrack };
    const dummyUsers = Array.from({ length: 13 }, (_, i) => ({
      uid: `User ${i + 1}`,
      videoTrack: null,
    }));
    return [...dummyUsers];
  }, []);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return allUsers.slice(startIndex, startIndex + usersPerPage);
  }, [allUsers, currentPage]);
  const totalPages = Math.ceil(allUsers.length / usersPerPage);

  const getLayoutConfig = (userCount: number) => {
    const baseClass = 'aspect-video'; // This ensures 16:9 aspect ratio
    if (userCount === 1)
      return {
        containerClass: 'flex items-center justify-center',
        tileSize: `${baseClass} w-full max-w-[70rem]`,
      };
    if (userCount === 2)
      return {
        containerClass:
          'grid grid-cols-1 justify-center sm:grid-cols-2 gap-2 h-full content-center',
        tileSize: `${baseClass} w-full`,
      };
    if (userCount === 3)
      return {
        containerClass:
          'grid grid-cols-2 gap-[0.1rem] max-w-[80rem] mx-auto h-full content-center  ',
        tileSize: `${baseClass} w-full`,
      };
    if (userCount <= 4)
      return {
        containerClass:
          'grid grid-cols-2 gap-[.1rem] max-w-5xl mx-auto h-full content-center  ',
        tileSize: `${baseClass} w-full`,
      };
    if (userCount <= 9)
      return {
        containerClass:
          'grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-6xl mx-auto h-full content-center',
        tileSize: `${baseClass} w-full`,
      };
    return {
      containerClass: 'grid grid-cols-2 sm:grid-cols-4 gap-2',
      tileSize: `${baseClass} w-full`,
    };
  };

  const { containerClass, tileSize } = getLayoutConfig(allUsers.length);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="w-full h-full  p-2 overflow-hidden">
      <div className={`${containerClass} h-full`}>
        {paginatedUsers.map((user: any, index: any) => (
          <VideoTile
            key={user.uid}
            user={user}
            size={tileSize}
            isLocal={false}
            isSpeaking={speakingUsers[user.uid] || false}
          />
        ))}
      </div>
      {allUsers.length > usersPerPage && (
        <div className="flex justify-center items-center mt-4 space-x-2 absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors duration-200"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-white text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors duration-200"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RemoteParticipants;