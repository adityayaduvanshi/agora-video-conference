import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Boardroom from './pages/boardroom';
import Login from './pages/login';
import Client from './providers/client';
import Loading from './components/loading';
import { useUserStore } from './store/auth-user';

function App() {
  const username = useUserStore((state) => state.username);

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

        <Route path="/:element" element={<Boardroom />} />
        <Route path="/loader/loader" element={<Loading />} />
      </Routes>
    </Client>
  );
}

export default App;
