// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import AgoraRTC, {
//   RemoteVideoTrack,
//   useClientEvent,
//   useJoin,
//   useRemoteUsers,
//   useRTCClient,
// } from 'agora-rtc-react';

import { useRemoteUsers, useRemoteVideoTracks } from 'agora-rtc-react';

// import { ZoomIn, ZoomOut, Move } from 'lucide-react';
// import { Button } from '../components/ui/button';
// import { useUserStore } from '../store/auth-user';
// import Login from './login';

// // import useScreenVideoStore from '../../store/screen-video-store';

// // import { getZoneLogo } from '../../lib/zone';

// const RemoteScreenshare = () => {
//   const remoteUsers = useRemoteUsers();
//   //   const [loading, setLoading] = useState(true);
//   //   const [agoraUid, setAgoraUid] = useState<string | null>(null);
//   //   const [calling, setCalling] = useState(false);
//   const [scale, setScale] = useState(1);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [screenShareUser, setScreenShareUser] = useState<any>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const username = useUserStore((state) => state.username);
//   const [calling, setCalling] = useState(false);
//   const [micOn, setMic] = useState(false);
//   const [cameraOn, setCamera] = useState(false);
//   const [agoraUid, setAgoraUid] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [screenshareStarted, setScreenshareStarted] = useState(false);

//   const handleCallingChange = (newValue: boolean) => {
//     setCalling(newValue);
//   };
//   // console.log(rtmClient);
//   useEffect(() => {
//     console.log(username);
//     if (username) {
//       setAgoraUid(username);
//       console.log(username);
//       setCalling(true);

//       setTimeout(() => setLoading(false), 500);

//       // remove this in prod
//       setLoading(false);
//     }
//   }, [username]);

//   useJoin(
//     {
//       appid: process.env.REACT_APP_AGORAID!,
//       channel: process.env.REACT_APP_CHANNEL!,
//       token: null,
//       uid: agoraUid,
//     },

//     calling
//   );

//   const client = useRTCClient();

//   useClientEvent(client, 'connection-state-change', (e) => {
//     console.log(e, 'etst');
//     if (e === 'DISCONNECTING') {
//       localStorage.removeItem('active');
//     }
//   });

//   // console.log(client);

//   AgoraRTC.on('playback-device-changed', (e) => {
//     console.log(e, 'playback device changed');
//   });
//   useClientEvent(client, 'stream-fallback', () => {
//     console.log('stream fallback');
//   });

//   const updateScreenShareUser = useCallback(() => {
//     const user = remoteUsers.find((user) =>
//       user.uid.toString().includes('ScreenShare')
//     );
//     setScreenShareUser(user);
//   }, [remoteUsers]);

//   useEffect(() => {
//     updateScreenShareUser();

//     const handleUserPublished = (user: any, mediaType: any) => {
//       if (
//         mediaType === 'video' &&
//         user.uid.toString().includes('ScreenShare')
//       ) {
//         updateScreenShareUser();
//       }
//     };

//     const handleUserUnpublished = (user: any, mediaType: any) => {
//       if (
//         mediaType === 'video' &&
//         user.uid.toString().includes('ScreenShare')
//       ) {
//         updateScreenShareUser();
//       }
//     };

//     client.on('user-published', handleUserPublished);
//     client.on('user-unpublished', handleUserUnpublished);

//     return () => {
//       client.off('user-published', handleUserPublished);
//       client.off('user-unpublished', handleUserUnpublished);
//     };
//   }, [client, updateScreenShareUser]);

//   const handleZoomIn = () => {
//     setScale((prevScale) => Math.min(prevScale + 0.1, 3));
//   };

//   const handleZoomOut = () => {
//     setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
//   };

//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     setIsDragging(true);
//     setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isDragging) return;

//     const newX = e.clientX - dragStart.x;
//     const newY = e.clientY - dragStart.y;

//     setPosition({ x: newX, y: newY });
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   //   const handleOpenChange = (open: boolean) => {
//   //     if (!open) {
//   //       toggleScreen();
//   //     }
//   //   };

//   useEffect(() => {
//     document.addEventListener('mouseup', handleMouseUp);
//     document.addEventListener('mousemove', handleMouseMove as any);

//     return () => {
//       document.removeEventListener('mouseup', handleMouseUp);
//       document.removeEventListener('mousemove', handleMouseMove as any);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isDragging, dragStart]);
//   //   if (!username) {
//   //     return <Login />;
//   //   }

//   return (
//     <div>
//       <div
//         className="relative w-full rounded-2xl h-[100vh] overflow-hidden"
//         ref={containerRef}
//       >
//         <div
//           className="w-full sm:w-full mb-10 pb-14 sm:h-full flex items-center justify-center bg-black"
//           onMouseDown={handleMouseDown}
//           style={{
//             cursor: isDragging ? 'grabbing' : 'grab',
//           }}
//         >
//           {screenShareUser?.hasVideo ? (
//             <RemoteVideoTrack
//               track={screenShareUser?.videoTrack}
//               play={true}
//               className="mt-[50%] sm:mt-0 aspect-video"
//               style={{
//                 transformOrigin: 'center',
//                 transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
//                 transition: isDragging ? 'none' : 'transform 0.3s ease-out',
//               }}
//             />
//           ) : (
//             <div>
//               <img
//                 alt="logo"
//                 className="w-full h-full"
//                 // src={logoUrl}
//                 src="https://verchool.com/wp-content/uploads/2024/02/NEW-LOGOS-07-1024x364.png"
//               />
//               {/*                   <img
//                     alt="logo"
//                     src="https://verchool.com/wp-content/uploads/2023/12/FAMILY-OFFICE-ZONE_Transparent-1-768x138.png"
//                   /> */}
//             </div>
//           )}
//         </div>
//         <div className="absolute bottom-2 right-2 transform -translate-x-1/2 flex space-x-2">
//           <Button size="icon" variant="ghost" onClick={handleZoomIn}>
//             <ZoomIn className="h-4 w-4" />
//           </Button>
//           <Button size="icon" variant="ghost" onClick={handleZoomOut}>
//             <ZoomOut className="h-4 w-4" />
//           </Button>
//           <Button
//             size="icon"
//             variant="ghost"
//             onClick={() => setPosition({ x: 0, y: 0 })}
//           >
//             <Move className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RemoteScreenshare;

const RemoteScreenShare = () => {
  const remoteUsers = useRemoteUsers();
  const { videoTracks } = useRemoteVideoTracks(remoteUsers);
  return <div></div>;
};
