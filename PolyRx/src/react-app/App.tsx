import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import ScanMedication from "@/react-app/pages/ScanMedication";
import Insights from "@/react-app/pages/Insights";
import BottomNav from "@/react-app/components/BottomNav";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanMedication />} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}
