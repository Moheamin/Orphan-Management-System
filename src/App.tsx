import { Routes, Route } from "react-router-dom";
import Orphans from "../pages/Orphans";
import Sponsors from "../pages/Sponsors";

function App() {
  return (
    <Routes>
      <Route path="/sponsors" element={<Sponsors />} />
      <Route path="/" element={<Orphans />} />
    </Routes>
  );
}

export default App;
