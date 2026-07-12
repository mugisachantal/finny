import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import LenderOnboarding from "./pages/LenderOnboarding";
import LendersDashboard from "./pages/lenders/LendersDashboard";
import Login from "./pages/Login";
import UserOnboarding from "./pages/User_onboarding";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Signup />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <UserOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lender-onboarding"
            element={
              <ProtectedRoute>
                <LenderOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lenders/dashboard"
            element={
              <ProtectedRoute>
                <LendersDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
