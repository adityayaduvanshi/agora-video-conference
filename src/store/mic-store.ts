import { IMicrophoneAudioTrack } from 'agora-rtc-react';
import { create } from 'zustand';

interface MicrophoneStore {
  localMicrophoneTrack: IMicrophoneAudioTrack | null;
  setLocalMicrophoneTrack: (track: IMicrophoneAudioTrack) => void;
}

export const useMicrophoneStore = create<MicrophoneStore>((set) => ({
  localMicrophoneTrack: null,
  setLocalMicrophoneTrack: (track) => set({ localMicrophoneTrack: track }),
}));