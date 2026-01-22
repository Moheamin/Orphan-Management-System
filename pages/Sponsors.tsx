import "../src/index.css";
import Cards from "../ui/Cards";
import Table from "../ui/Sponsor/SponsorTable";

function Sponsors() {
  return (
    <>
      <div className="mx-8">
        <div className="mt-8 mr-2 flex flex-col items-end m-8">
          <h1 className="mb-8 text-2xl font-semibold ">إدارة الكفلاء</h1>
          <p className="mb-4 text-[var(--subTextColor)] text-lg">
            اضافة وادارة بيانات الكفلاء والمتبرعين
          </p>
        </div>
        <Cards />
        <br />
        <Table />
      </div>
    </>
  );
}

export default Sponsors;
