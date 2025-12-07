import Card from "../components/Card";
import { Heart } from "lucide-react";
import MyIcon from "../components/MyIcon";
export default function Cards() {
  return (
    <ul className=" mt-20 grid grid-cols-3 gap-8 mr-2">
      <Card>
        <div>
          <h2 className="text-gray-400">لكفالة العامة</h2>
          <span className="text-lg"> 165 كفالة </span>
          <p className="text-gray-400"> 145,000 دينار عراقي</p>
        </div>
      </Card>
      <Card>
        <div>
          <h2 className="text-gray-400">الكفالة العامة</h2>
          <span className="text-lg"> 165 كفالة </span>
          <p className="text-gray-400"> 145,000 دينار عراقي</p>
        </div>
      </Card>
      <Card>
        <div>
          <h2 className="text-gray-400">الكفالة العامة</h2>
          <span className="text-lg"> 165 كفالة </span>
          <p className="text-gray-400"> 145,000 دينار عراقي</p>
        </div>
      </Card>
    </ul>
  );
}
