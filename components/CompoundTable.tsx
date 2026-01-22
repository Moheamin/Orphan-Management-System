import { type ReactNode, createContext, useContext, useState } from "react";
import { Search, X } from "lucide-react";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

// Context Types
interface DataTableContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  if (!context) {
    throw new Error("DataTable components must be used within DataTable.Root");
  }
  return context;
};

// Root Component
interface RootProps {
  children: ReactNode;
  dir?: "rtl" | "ltr";
  className?: string;
}

function Root({ children, dir = "rtl", className = "" }: RootProps) {
  const [searchQuery, setSearchQuery] = useState("");
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
        className={`w-full rounded-3xl border border-[var(--borderColor)] bg-[var(--fillColor)]/30 p-4 md:p-6 ${className}`}
      >
        {children}
      </div>
    </DataTableContext.Provider>
  );
}

// Header Component
interface HeaderProps {
  children: ReactNode;
  className?: string;
}

function Header({ children, className = "" }: HeaderProps) {
  return (
    <div
      className={`mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${className}`}
    >
      {children}
    </div>
  );
}

// Search Component
interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

function SearchInput({
  placeholder = "البحث...",
  onSearch,
  className = "",
}: SearchProps) {
  const { searchQuery, setSearchQuery } = useDataTableContext();

  const handleChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={`relative w-full md:max-w-md ${className}`}>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--borderColor)]">
        <Search size={16} color="var(--iconColor)" />
      </span>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[var(--borderColor)] bg-[var(--fillColor)] px-10 py-2 text-sm text-[var(--textColor)] placeholder:text-[var(--cellTextColor)] focus:border-[var(--primeColor)] focus:bg-[var(--backgroundColor)] focus:outline-none focus:ring-2 focus:ring-[var(--primeColor)]"
      />
      {searchQuery && (
        <button
          onClick={() => handleChange("")}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--subtextColor)] hover:text-[var(--cellTextColor)]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

// Add Button Component
interface AddButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

function AddButton({ label, onClick, className = "" }: AddButtonProps) {
  const { setIsModalOpen, setEditItem } = useDataTableContext();

  const handleClick = () => {
    setEditItem(null); // Clear edit item when adding new
    setIsModalOpen(true);
    onClick?.();
  };

  return (
    <Button
      adj={`inline-flex items-center gap-2 rounded-full border border-[var(--primeColor)/40] bg-white px-4 py-2 text-sm text-[var(--primeColor)] shadow-sm hover:bg-[var(--fillColor)] transition whitespace-nowrap ${className}`}
      onClick={handleClick}
    >
      <span className="text-md font-semibold">اضافة</span>
      <span className="text-md font-semibold">{label}</span>
    </Button>
  );
}

// Loading Component
function Loading() {
  return <LoadingSpinner />;
}

// Error Component
interface ErrorMessageProps {
  message?: string;
}

function ErrorMessage({
  message = "حدث خطأ في تحميل البيانات",
}: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <span className="text-red-600">{message}</span>
    </div>
  );
}

// Table Component
interface TableProps {
  children: ReactNode;
  className?: string;
}

function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full rounded-2xl border border-[var(--backgroundColor)] bg-[var(--backgroundColor)]/40 text-sm ${className}`}
      >
        {children}
      </table>
    </div>
  );
}

// Table Head Component
interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

function TableHead({ children, className = "" }: TableHeadProps) {
  return <thead className={`bg-emerald-50 ${className}`}>{children}</thead>;
}

// Table Body Component
interface TableBodyProps<T> {
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
  searchQuery?: string;
}

function TableBody<T>({
  data,
  renderRow,
  emptyMessage,
  searchQuery,
}: TableBodyProps<T>) {
  const { searchQuery: contextSearchQuery } = useDataTableContext();
  const query = searchQuery ?? contextSearchQuery;

  return (
    <tbody className="divide-y divide-[var(--fillColor)]">
      {data.length === 0 ? (
        <tr>
          <td colSpan={100} className="px-4 py-8 text-center text-gray-500">
            {query ? "لا توجد نتائج للبحث" : emptyMessage || "لا توجد بيانات"}
          </td>
        </tr>
      ) : (
        data.map(renderRow)
      )}
    </tbody>
  );
}

// Table Header Cell Component
interface TableHeaderCellProps {
  children: ReactNode;
  className?: string;
}

function TableHeaderCell({ children, className = "" }: TableHeaderCellProps) {
  return (
    <th
      className={`px-4 py-3 text-right text-xs font-semibold text-[var(--iconColor)] ${className}`}
    >
      {children}
    </th>
  );
}

// Table Row Component
interface TableRowProps {
  children: ReactNode;
  className?: string;
}

function TableRow({ children, className = "" }: TableRowProps) {
  return (
    <tr
      className={`hover:bg-[var(--fillColor)]/40 transition-colors ${className}`}
    >
      {children}
    </tr>
  );
}

// Table Cell Component
interface TableCellProps {
  children: ReactNode;
  className?: string;
}

function TableCell({ children, className = "" }: TableCellProps) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

// Results Count Component
interface ResultsCountProps {
  filteredCount: number;
  totalCount: number;
  label?: string;
}

function ResultsCount({
  filteredCount,
  totalCount,
  label = "عنصر",
}: ResultsCountProps) {
  const { searchQuery } = useDataTableContext();

  if (!searchQuery) return null;

  return (
    <div className="mt-3 text-center text-xs text-[var(--cellTextColor)]">
      عرض {filteredCount} من {totalCount} {label}
    </div>
  );
}

// Modal Wrapper Component - Renders modal when isModalOpen is true
interface ModalWrapperProps {
  children: ReactNode;
}

function ModalWrapper({ children }: ModalWrapperProps) {
  const { isModalOpen } = useDataTableContext();

  if (!isModalOpen) return null;

  return <>{children}</>;
}

// Export compound component
export const DataTable = {
  Root,
  Header,
  SearchInput,
  AddButton,
  Loading,
  Error: ErrorMessage,
  Table,
  TableHead,
  TableBody,
  TableHeaderCell,
  TableRow,
  TableCell,
  ResultsCount,
  ModalWrapper,
  useContext: useDataTableContext,
};
