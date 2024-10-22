import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Boardroom from './pages/boardroom';
import Login from './pages/login';
import Client from './providers/client';
import Loading from './components/loading';
import { useUserStore } from './store/auth-user';
// import RemoteScreenshare from './pages/screenshare';
import { useEffect, useState } from 'react';
import { loadUsername } from './store/auth-user';
import Boardroom2 from './pages/boardroom2';

function App() {
  const username = useUserStore((state) => state.username);
  const setUsername = useUserStore((state) => state.setUsername);

  useEffect(() => {
    const storedUsername = loadUsername();
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [setUsername]);

  return (
    <Client>
      {/* <Routes>
        <Route
          path="/"
          element={username ? <Boardroom /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/:element"
          element={username ? <Boardroom /> : <Navigate to="/login" replace />}
        />
        <Route path="/loader/loader" element={<Loading />} />
      </Routes> */}
      <Routes>
        <Route path="/" element={<Boardroom />} />
        <Route path="/screenshare" element={<Boardroom2 />} />
        <Route path="/refresh" element={<Navigate to="/" replace />} />
        {/* <Route path="/:element" element={<Boardroom />} /> */}
        <Route path="/loader/loader" element={<Loading />} />
      </Routes>
    </Client>
  );
}

export default App;
