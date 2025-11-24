import {
  Baby,
  DollarSign,
  FileText,
  Heart,
  House,
  Settings,
  Users,
} from "lucide-react";
import MyIcon from "../components/Icon";
import Button from "../components/Button";

export default function Navbar() {
  return (
    <aside className="h-full w-64 bg-white border-2 border-(--borderColor) flex flex-col justify-between absolute px-2">
      <div>
        <div className="text-right flex flex-row gap-8 items-end justify-end mx-5 my-[19px] border-b-2 border-[var(--borderColor)] pb-4">
          <div className="flex flex-col items-end justify-end mr-2">
            <h1 className="text-xl font-semibold">إدارة الأيتام</h1>
            <p className="text-gray-400 text-sm">مؤسسة خيرية</p>
          </div>
          <MyIcon size={48} shape="rounded" color="#4a7c59">
            <Heart size={24} color="white" />
          </MyIcon>
        </div>

        <div className="flex flex-col items-end justify-end mt-10 gap-4 mr-5">
          <Button adj="w-full pl-20 pr-5 py-4 bg-[var(--primeColor)] flex items-center justify-end gap-2 text-white rounded-[20px] cursor-pointer hover:bg-green-900 transition duration-300 delay-150">
            <span className="text-sm">لوحة التحكم</span>
            <House size={16} color="white" />
          </Button>

          <Button adj="pl-20 pr-5 py-4 bg-[var(--primeColor)] w-full flex items-center justify-end gap-2 text-white rounded-[20px] cursor-pointer hover:bg-green-900 transition duration-300 delay-150">
            <span className="text-sm">الأيتام</span>
            <Users size={16} color="white" />
          </Button>

          <Button adj="pl-20 pr-5 py-4 bg-[var(--primeColor)] w-full flex items-center justify-end gap-2 text-white rounded-[20px] cursor-pointer hover:bg-green-900 transition duration-300 delay-150">
            <span className="text-sm">الكفلاء</span>
            <Baby size={16} color="white" />
          </Button>

          <Button adj="pl-20 pr-5 py-4 bg-[var(--primeColor)] w-full flex items-center justify-end gap-2 text-white rounded-[20px] cursor-pointer hover:bg-green-900 transition duration-300 delay-150">
            <span className="text-sm">الكفالات</span>
            <Heart size={16} color="white" />
          </Button>

          <Button adj="pl-20 pr-5 py-4 bg-[var(--primeColor)] w-full flex items-center justify-end gap-2 text-white rounded-[20px] cursor-pointer hover:bg-green-900 transition duration-300 delay-150">
            <span className="text-sm">الرواتب الشهرية</span>
            <DollarSign size={16} color="white" />
          </Button>

          <Button adj="pl-20 pr-5 py-4 bg-[var(--primeColor)] w-full flex items-center justify-end gap-2 text-white rounded-[20px] cursor-pointer hover:bg-green-900 transition duration-300 delay-150">
            <span className="text-sm">التقارير</span>
            <FileText size={16} color="white" />
          </Button>

          <Button adj="pl-20 pr-5 py-4 bg-[var(--primeColor)] w-full flex items-center justify-end gap-2 text-white rounded-[20px] cursor-pointer hover:bg-green-900 transition duration-300 delay-150">
            <span className="text-sm">الإعدادات</span>
            <Settings size={16} color="white" />
          </Button>
        </div>
      </div>

      <footer className="w-full bg-white border-2 border-[var(--borderColor)] p-2 flex flex-col items-center justify-center">
        <span className="text-stone-400 w-full flex items-center justify-center mt-4 text-md">
          مهيمن رائد حميد
        </span>
      </footer>
    </aside>
  );
}
