import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import SettingsPage from "./pages/SettingsPage";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loading } from "./components/Loading";

// Routes that don't require authentication
const auth = ["/login", "/signup"];

function App() {
  const theme = useThemeStore((state) => state.theme);

  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const location = useLocation();

  // // Check if the user is authenticated on every route change
  useEffect(() => {
    if (!auth.includes(location.pathname)) {
      checkAuth();
    }
  }, [location.pathname]);

  if (isCheckingAuth && !authUser) return <Loading />;

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />

        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/friends"
          element={authUser ? <Friends /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
