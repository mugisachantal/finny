import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import LenderOnboarding from "./pages/LenderOnboarding";
import LendersDashboard from "./pages/lenders/LendersDashboard";
import Login from "./pages/Login";
import UserOnboarding from "./pages/User_onboarding";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/onboarding" element={<UserOnboarding />} />
        <Route path="/lender-onboarding" element={<LenderOnboarding />} />
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/lenders/dashboard" element={<LendersDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
