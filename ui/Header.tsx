import { Book, Moon } from "lucide-react";
import Button from "../components/Button";
import "../src/index.css";

function Header() {
  return (
    <header>
      <div className="flex items-center justify-between border-b p-0.5 border-(--borderColor) ">
        <Button
          adj="p-2 rounded-full m-8 transition duration-300 delay-15 hover:bg-green-200 "
          onClick={() => console.log("clicked!")}
        >
          <Moon
            className="w-8 h-8 hover:text-white-500"
            size={16}
            color="black"
          />
        </Button>

        <div className="flex items-center justify-center text-center gap-0.5 ">
          <p className="text-xl">نظام ادارة الايتام </p>
          <Book
            className="w-8 h-8 text-(--textColor) ml-5 mr-5"
            size={16}
            color="black"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
