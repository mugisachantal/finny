import { BrowserRouter, Routes, Route } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import UserOnboarding from "./pages/User_onboarding";
import LenderOnboarding from "./pages/LenderOnboarding";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
