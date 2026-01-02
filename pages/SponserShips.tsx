import "../src/index.css";
import SponserShipTabe from "../ui/SponserShips/SponserShipTable";

function SponserShips() {
  return (
    <>
      <div className="mx-8 mb-8">
        <div className="mt-8 mr-2 mb-8 flex flex-col items-end">
          <h1 className="mb-8 text-xl font-semibold ">إدارة البيانات</h1>
          <p className="mb-4 text-var(--subTextColor) ">
            عرض معلومات الأيتام و الكفلاء
          </p>
        </div>
        <SponserShipTabe />
      </div>
    </>
  );
}

export default SponserShips;
