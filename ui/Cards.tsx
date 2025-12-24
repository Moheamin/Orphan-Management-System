import Card from "../components/Card";
export default function Cards() {
  return (
    <ul className=" mt-20 grid grid-cols-3 gap-8 mr-2">
      <Card>
        <div className="p-1 flex flex-col items-end text-right gap-2">
          {" "}
          <h2 className="text-lg">اجمالي الكفلاء</h2>
          <p className="text-[var(--textMuted)]"> 189 كفيل نشط </p>
        </div>
      </Card>
      <Card>
        <div className="p-1 flex flex-col items-end text-right gap-2">
          {" "}
          <h2 className="text-lg">اجمالي الكفالات</h2>
          <p className="text-[var(--textMuted)]">312 كفالة فعالة</p>
        </div>
      </Card>
      <Card>
        <div className="p-1 flex flex-col items-end text-right gap-2">
          <h2 className="text-lg">اجمالي المساهمات</h2>
          <p className="text-[var(--textMuted)]"> 500,000,000 دينار</p>
        </div>
      </Card>
    </ul>
  );
}
