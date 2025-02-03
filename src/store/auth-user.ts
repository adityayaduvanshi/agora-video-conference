import { create } from 'zustand';

interface UserState {
  username: string;
  setUsername: (username: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  username: sessionStorage.getItem('username') || '',
  setUsername: (username: string) => {
    sessionStorage.setItem('username', username);
    set({ username });
  },
  logout: () => {
    sessionStorage.removeItem('username');
    set({ username: '' });
  },
}));

export const storeUsername = (username: string) => {
  useUserStore.getState().setUsername(username);
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
