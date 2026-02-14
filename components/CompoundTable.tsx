import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Search, X, Filter, Check, ChevronDown } from "lucide-react"; // Added Icons
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

// 1. Strict Context Interface
interface DataTableContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // New Filter State
  filterValue: string;
  setFilterValue: (value: string) => void;

  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  deleteConfirm: string | number | null;
  setDeleteConfirm: (id: string | number | null) => void;
  editItem: any | null;
  setEditItem: (item: any | null) => void;
}

const DataTableContext = createContext<DataTableContextType | undefined>(
  undefined,
);

const useDataTableContext = () => {
  const context = useContext(DataTableContext);
  if (!context)
    throw new Error("DataTable components must be used within DataTable.Root");
  return context;
};

// 2. Component Interfaces
interface RootProps {
  children: ReactNode;
  dir?: "rtl" | "ltr";
  className?: string;
}
interface HeaderProps {
  children: ReactNode;
  className?: string;
}
interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}
// NEW: Filter Interfaces
interface FilterOption {
  label: string;
  value: string;
}
interface FilterProps {
  label?: string; // e.g., "Filter by Status"
  options: FilterOption[];
  onChange?: (value: string) => void;
  className?: string;
}

interface AddButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}
interface TableProps {
  children: ReactNode;
  className?: string;
}
interface TableBodyProps<T> {
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
}
interface TableCellProps {
  children: ReactNode;
  className?: string;
}

// 3. Implementation
const Root = ({ children, dir = "rtl", className = "" }: RootProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all"); // Default filter state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(
    null,
  );
  const [editItem, setEditItem] = useState<any | null>(null);

  return (
    <DataTableContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filterValue,
        setFilterValue,
        isModalOpen,
        setIsModalOpen,
        deleteConfirm,
        setDeleteConfirm,
        editItem,
        setEditItem,
      }}
    >
      <div
        dir={dir}
        className={`w-full rounded-2xl md:rounded-3xl border border-[var(--borderColor)] bg-[var(--fillColor)]/30 p-3 md:p-6 ${className}`}
      >
        {children}
      </div>
    </DataTableContext.Provider>
  );
};

const Header = ({ children, className = "" }: HeaderProps) => (
  <div
    className={`mb-6 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between ${className}`}
  >
    {/* Helper div to group Search and Filter together on the left/right depending on dir */}
    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
      {children}
    </div>
  </div>
);

// --- NEW FILTER COMPONENT ---
const FilterSelect = ({
  label = "تصفية",
  options,
  onChange,
  className = "",
}: FilterProps) => {
  const { filterValue, setFilterValue } = useDataTableContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    setFilterValue(val);
    onChange?.(val);
    setIsOpen(false);
  };

  const currentLabel =
    options.find((o) => o.value === filterValue)?.label || label;

  return (
    <div ref={containerRef} className={`relative min-w-[150px] ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] px-4 py-3 md:py-2 text-sm text-[var(--textColor)] hover:border-[var(--primeColor)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--textMuted)]" />
          <span>{filterValue === "all" ? label : currentLabel}</span>
        </div>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 z-50 w-full min-w-[180px] origin-top-right rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] shadow-lg p-1 animate-in fade-in zoom-in-95 duration-200">
          {/* Option to clear filter */}
          <button
            onClick={() => handleSelect("all")}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
              filterValue === "all"
                ? "bg-[var(--primeColor)]/10 text-[var(--primeColor)]"
                : "hover:bg-[var(--fillColor)]/50 text-[var(--textColor)]"
            }`}
          >
            <span>الكل</span>
            {filterValue === "all" && <Check size={14} />}
          </button>

          <div className="my-1 h-px bg-[var(--borderColor)]/50" />

          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                filterValue === option.value
                  ? "bg-[var(--primeColor)]/10 text-[var(--primeColor)]"
                  : "hover:bg-[var(--fillColor)]/50 text-[var(--textColor)]"
              }`}
            >
              <span>{option.label}</span>
              {filterValue === option.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
// ----------------------------

const SearchInput = ({
  placeholder = "البحث...",
  onSearch,
  className = "",
}: SearchProps) => {
  const { searchQuery, setSearchQuery } = useDataTableContext();
  const handleX = () => {
    setSearchQuery("");
    onSearch?.("");
  };

  return (
    <div className={`relative w-full md:max-w-md ${className}`}>
      <Search
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--iconColor)]"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] px-10 py-3 md:py-2 text-sm text-[var(--textColor)] outline-none focus:ring-2 focus:ring-[var(--primeColor)] transition-all"
      />
      {searchQuery && (
        <button
          onClick={handleX}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--textMuted)] hover:text-red-500"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

const AddButton = ({ label, onClick, className = "" }: AddButtonProps) => {
  const { setIsModalOpen, setEditItem } = useDataTableContext();
  return (
    // Moved ml-auto to Header logic or allow prop to override
    <Button
      adj={`md:mr-auto inline-flex items-center gap-2 rounded-xl bg-[var(--primeColor)] px-6 py-3 md:py-2 text-white shadow-md hover:brightness-110 transition whitespace-nowrap ${className}`}
      onClick={() => {
        setEditItem(null);
        setIsModalOpen(true);
        onClick?.();
      }}
    >
      <span className="font-bold text-sm">إضافة {label}</span>
    </Button>
  );
};

const Table = ({ children, className = "" }: TableProps) => (
  <div className="w-full overflow-x-auto rounded-xl border border-[var(--borderColor)]/30 bg-[var(--backgroundColor)]/50 custom-scrollbar">
    <table className={`min-w-full text-sm text-right ${className}`}>
      {children}
    </table>
  </div>
);

const ResultsCount = ({ count, total }: { count: number; total: number }) => (
  <div className="text-sm text-[var(--textMuted)]">
    عرض <span className="font-semibold text-[var(--textColor)]">{count}</span>{" "}
    من <span className="font-semibold text-[var(--textColor)]">{total}</span>
  </div>
);

const Loading = () => (
  <div className="flex justify-center items-center py-12">
    <LoadingSpinner />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center py-12">
    <div className="text-center">
      <p className="text-red-500 font-semibold">{message}</p>
    </div>
  </div>
);

function TableBody<T>({ data, renderRow, emptyMessage }: TableBodyProps<T>) {
  const { searchQuery } = useDataTableContext();
  return (
    <tbody className="divide-y divide-[var(--borderColor)]/20">
      {data.length === 0 ? (
        <tr>
          <td
            colSpan={100}
            className="px-4 py-12 text-center text-[var(--textMuted2)]"
          >
            {searchQuery
              ? "لا توجد نتائج مطابقة لبحثك"
              : emptyMessage || "لا توجد بيانات متاحة"}
          </td>
        </tr>
      ) : (
        data.map((item, index) => renderRow(item, index))
      )}
    </tbody>
  );
}

// 4. Export Compound Object
export const DataTable = {
  Root,
  Header,
  SearchInput,
  Filter: FilterSelect, // Exporting the new component
  AddButton,
  Table,
  TableHead: ({ children, className = "" }: HeaderProps) => (
    <thead className={`bg-[var(--fillColor)]/50 ${className}`}>
      {children}
    </thead>
  ),
  TableBody,
  TableHeaderCell: ({ children, className = "" }: HeaderProps) => (
    <th
      className={`px-4 py-4 text-xs font-bold text-[var(--iconColor)] whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  ),
  TableRow: ({ children, className = "" }: HeaderProps) => (
    <tr
      className={`hover:bg-[var(--fillColor)]/20 transition-colors ${className}`}
    >
      {children}
    </tr>
  ),
  TableCell: ({ children, className = "" }: TableCellProps) => (
    <td
      className={`px-4 py-4 whitespace-nowrap text-[var(--textColor)] ${className}`}
    >
      {children}
    </td>
  ),
  ModalWrapper: ({ children }: { children: ReactNode }) => {
    const { isModalOpen } = useDataTableContext();
    return isModalOpen ? <>{children}</> : null;
  },
  ResultsCount,
  Loading,
  Error: ErrorMessage,
  useContext: useDataTableContext,
};
