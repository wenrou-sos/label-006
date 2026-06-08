import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TicketPage from "@/pages/TicketPage";
import DisplayPage from "@/pages/DisplayPage";
import CounterPage from "@/pages/CounterPage";
import ServicePage from "@/pages/ServicePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ticket" element={<TicketPage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/counter/:id" element={<CounterPage />} />
        <Route path="/service" element={<ServicePage />} />
      </Routes>
    </Router>
  );
}
