import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LinkPlatform from "./pages/LinkPlatform";
import LeetCodeDetails from "./pages/LeetCodeDetails";
import CodeforcesDetails from "./pages/CodeforcesDetails";
import GitHubDetails from "./pages/GitHubDetails";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/link" element={<PrivateRoute><LinkPlatform /></PrivateRoute>} />
        <Route path="/leetcode" element={<PrivateRoute><LeetCodeDetails /></PrivateRoute>} />
        <Route path="/codeforces" element={<PrivateRoute><CodeforcesDetails /></PrivateRoute>} />
        <Route path="/github" element={<PrivateRoute><GitHubDetails /></PrivateRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
