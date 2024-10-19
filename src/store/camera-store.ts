import { ICameraVideoTrack } from 'agora-rtc-react';
import { create } from 'zustand';

interface CameraStore {
  localCameraTrack: ICameraVideoTrack | null;
  setLocalCameraTrack: (track: ICameraVideoTrack) => void;
}

export const useCameraStore = create<CameraStore>((set) => ({
  localCameraTrack: null,
  setLocalCameraTrack: (track) => set({ localCameraTrack: track }),
}));
