import "../src/index.css";
import Header from "../ui/Header";
import Navbar from "../ui/Navbar";
import Cards from "../ui/Cards";
import Table from "../ui/Table";
import { useState } from "react";
function Orphans() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="mx-8 mb-8">
        <div className="mt-8 mr-2 mb-8 flex flex-col items-end">
          <h1 className="mb-8 text-xl font-semibold ">إدارة الأيتام</h1>
          <p className="mb-4 text-[var(--subTextColor)] ">
            إضافة وإدارة بيانات الأيتام والمعايير التفضيلية
          </p>
        </div>
        <Table />
      </div>
    </>
  );
}

export default Orphans;
