import { create } from 'zustand';

interface UserState {
  username: string;
  setUsername: (username: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  username: '',
  setUsername: (username: string) => set({ username }),
  logout: () => {
    set({ username: '' });
    localStorage.removeItem('username');
    localStorage.removeItem('usernameExpiration');
  },
}));

export const storeUsername = (username: string) => {
  useUserStore.getState().setUsername(username);
  const expirationTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 hours from now
  localStorage.setItem('username', username);
  localStorage.setItem('usernameExpiration', expirationTime.toString());
};

export const loadUsername = () => {
  const username = localStorage.getItem('username');
  const expiration = localStorage.getItem('usernameExpiration');

  if (username && expiration) {
    const now = new Date().getTime();
    if (now < parseInt(expiration)) {
      useUserStore.getState().setUsername(username);
      return username;
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('usernameExpiration');
    }
  }
  return null;
};

export const logout = () => {
  useUserStore.getState().logout();
};
