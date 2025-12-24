import { Routes, Route } from "react-router-dom";
import Orphans from "../pages/Orphans";
import Sponsors from "../pages/Sponsors";
import Header from "../ui/Header";
import Navbar from "../ui/Navbar";
import { useState } from "react";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <Routes>
        <Route path="/sponsors" element={<Sponsors />} />
        <Route index path="/Orphans" element={<Orphans />} />
      </Routes>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default App;
