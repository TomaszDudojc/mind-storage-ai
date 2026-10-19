import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../Login/Login';
import Preferences from '../Preferences/Preferences';
import useToken from './useToken';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Home from "../Home/Home";
import { Toaster } from 'react-hot-toast';

function App() {
  const { token, setToken } = useToken();
  // Pobieranie i parsowanie jednego wspólnego obiektu 'user'
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!token) {
    return (
      <div>
        <Toaster position="bottom-left" reverseOrder={false} />
        <Header />
        <Login setToken={setToken} />
        <Footer />
      </div>);
  }

  return (
    <div className="wrapper">
      <Toaster position="bottom-left" reverseOrder={false} />
      <Header isLogged="true" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Home
              token={token}
              currentUserFirstName={user?.firstName}
              currentUserId={user?.id}
              currentUserEmail={user?.email}
            />
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
