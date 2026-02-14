import { Book } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import Button from "../components/Button";
import "../src/index.css";

export default function Header({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--fillColor)] w-full">
      <div className="flex items-center justify-between border-b px-4 md:px-8 py-2 border-[var(--borderColor)]">
        <ThemeToggle />
        <div className="flex items-center gap-2 md:gap-4">
          <p className="text-xg text-[var(--textColor)] md:text-xl font-medium text-[var(--cellTextColor)]">
            <strong>نظام إدارة الأيتام</strong>
          </p>
          <Button
            adj="rounded-lg text-[var(--primeColor)] transition-all duration-300 ease-out hover:bg-[var(--primeColor)]/10 hover:scale-105 active:scale-95 hover:shadow-sm hover:shadow-[var(--primeColor)]/60"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Book
              className="w-5 rounded h-5 md:w-7 md:h-7 m-2 text-[var(--primeColor)]"
              color="currentColor"
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
