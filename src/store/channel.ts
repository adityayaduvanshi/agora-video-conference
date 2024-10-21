import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ChannelState {
  currentChannel: string;
  channels: string[];
  setCurrentChannel: (channel: string) => void;
  addChannel: (channel: string) => void;
}

export const useChannelStore = create<ChannelState>()(
  persist(
    (set) => ({
      currentChannel: process.env.REACT_APP_CHANNEL || 'SaketTest',
      channels: [
        process.env.REACT_APP_CHANNEL || 'SaketTest',
        'Podcast',
        'FOZ',
        'General',
        'Tech Talk',
      ],
      setCurrentChannel: (channel) => set({ currentChannel: channel }),
      addChannel: (channel) =>
        set((state) => ({
          channels: state.channels.includes(channel)
            ? state.channels
            : [...state.channels, channel],
        })),
    }),
    {
      name: 'channel-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
