import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  useRemoteUsers,
  useRemoteVideoTracks,
  RemoteVideoTrack,
} from 'agora-rtc-react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '../ui/button';

const RemoteParticipants2 = () => {
  const remoteUsers = useRemoteUsers();
  const { videoTracks } = useRemoteVideoTracks(remoteUsers);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Find the screenshare user and video track
  const screenShareUser = remoteUsers.find((user) =>
    user.uid.toString().includes('Screenshare')
  );
  const screenShareTrack = screenShareUser
    ? videoTracks.find((track) => track.getUserId() === screenShareUser.uid)
    : null;
  const prevScreenShareTrackRef = useRef(screenShareTrack);

  useEffect(() => {
    if (!prevScreenShareTrackRef.current && screenShareTrack) {
      console.log('Screen Share Started');
    } else if (prevScreenShareTrackRef.current && !screenShareTrack) {
      console.log('Screen Share Ended');
    }
    prevScreenShareTrackRef.current = screenShareTrack;
  }, [screenShareTrack]);
  //   useEffect(() => {
  //     console.log('Screen Share Track started');
  //   }, [remoteUsers, videoTracks, screenShareUser, screenShareTrack]);

  const handleZoomIn = useCallback(() => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleResetPosition = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove as any);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, [handleMouseUp, handleMouseMove]);

  if (!screenShareUser || !screenShareTrack) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div>
          <img
            alt="logo"
            className="w-full h-full"
            src="https://verchool.com/wp-content/uploads/2024/02/NEW-LOGOS-07-1024x364.png"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black relative">
      <div
        className="w-full h-full overflow-hidden"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <RemoteVideoTrack
          track={screenShareTrack}
          play={true}
          className="w-full h-full object-contain"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        />
      </div>
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button size="icon" variant="secondary" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleResetPosition}>
          <Move className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RemoteParticipants2;
