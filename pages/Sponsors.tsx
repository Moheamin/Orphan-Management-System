import "../src/index.css";
import Header from "../ui/Header";
import Navbar from "../ui/Navbar";
import Cards from "../ui/Cards";
import Table from "../ui/SponserTable";
import { useState } from "react";
function Sponsors() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="mx-8">
        <div className="mt-8 mr-2 flex flex-col items-end -m-8">
          <h1 className="mb-8 text-xl font-semibold ">إدارة الكفلاء</h1>
          <p className=" text-[var(--subTextColor)]  ">
            اضافة وادارة بيانات الكفلاء والمتبرعين
          </p>
        </div>
        <Cards />
        <Table />
      </div>
    </>
  );
}

export default Sponsors;
