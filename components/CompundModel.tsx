import { type ReactNode, createContext, useContext } from "react";
import {
  useForm,
  type UseFormReturn,
  type FieldValues,
  type DefaultValues,
} from "react-hook-form";

// 1. Strict Generic Interface
interface ModalContextType<T extends FieldValues = any> {
  form: UseFormReturn<T>;
  isPending: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  editId?: string | number | null;
}

const ModalContext = createContext<ModalContextType<any> | undefined>(
  undefined,
);

function useModalContext<T extends FieldValues>() {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("Modal components must be used within Modal.Root");
  return context as ModalContextType<T>;
}

// 2. Root Component Implementation
interface RootProps<T extends FieldValues> {
  children: ReactNode;
  onClose: () => void;
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  isPending?: boolean;
  mode?: "create" | "edit";
  editId?: string | number | null;
}

const Root = <T extends FieldValues>({
  children,
  onClose,
  onSubmit,
  defaultValues,
  isPending = false,
  mode = "create",
  editId = null,
}: RootProps<T>) => {
  const form = useForm<T>({ defaultValues, mode: "onChange" });

  return (
    <ModalContext.Provider value={{ form, isPending, onClose, mode, editId }}>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="bg-[var(--backgroundColor)] rounded-t-3xl md:rounded-2xl w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom md:slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            {children}
          </form>
        </div>
      </div>
    </ModalContext.Provider>
  );
};

// 3. Sub-Components
const Header = ({
  title,
  editTitle,
}: {
  title: string;
  editTitle?: string;
}) => {
  const { onClose, mode } = useModalContext();
  return (
    <div className="flex items-center justify-between p-5 md:p-6 border-b border-[var(--borderColor)] sticky top-0 bg-[var(--backgroundColor)] z-10">
      <h2 className="text-xl font-bold text-[var(--textColor)]">
        {mode === "edit" && editTitle ? editTitle : title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--fillColor)] text-[var(--iconColor)] transition-colors text-2xl"
      >
        ×
      </button>
    </div>
  );
};

const Body = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`p-5 md:p-6 ${className}`}>{children}</div>;

const Grid = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 ${className}`}
  >
    {children}
  </div>
);

const Input = <T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  validation,
  span = 1,
}: {
  name: keyof T;
  label: string;
  type?: string;
  placeholder?: string;
  validation?: object;
  span?: 1 | 2;
}) => {
  const { form } = useModalContext<T>();
  const error = form.formState.errors[name];

  return (
    <div
      className={`${span === 2 ? "col-span-1 md:col-span-2" : "col-span-1"}`}
    >
      <label className="block text-sm font-bold text-[var(--subTextColor)] mb-2 mr-1">
        {label}
      </label>
      <input
        type={type}
        {...form.register(name as any, validation)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-[var(--fillColor)] border ${
          error
            ? "border-red-500 ring-1 ring-red-500"
            : "border-[var(--borderColor)]"
        } rounded-xl focus:ring-2 focus:ring-[var(--primeColor)] outline-none transition-all text-[var(--textColor)]`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 mr-1">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

// ...existing code...

const Select = <T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  validation,
  span = 1,
}: {
  name: keyof T;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  validation?: object;
  span?: 1 | 2;
}) => {
  const { form } = useModalContext<T>();
  const error = form.formState.errors[name];

  return (
    <div
      className={`${span === 2 ? "col-span-1 md:col-span-2" : "col-span-1"}`}
    >
      <label className="block text-sm font-bold text-[var(--subTextColor)] mb-2 mr-1">
        {label}
      </label>
      <select
        {...form.register(name as any, validation)}
        className={`w-full px-4 py-3 bg-[var(--fillColor)] border ${
          error
            ? "border-red-500 ring-1 ring-red-500"
            : "border-[var(--borderColor)]"
        } rounded-xl focus:ring-2 focus:ring-[var(--primeColor)] outline-none transition-all text-[var(--textColor)]`}
      >
        <option value="">{placeholder || "اختر..."}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-xs mt-1 mr-1">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

const Footer = ({
  submitText = "حفظ",
  loadingText = "جاري الحفظ...",
}: {
  submitText?: string;
  loadingText?: string;
}) => {
  const { isPending, onClose, mode } = useModalContext();
  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 p-5 md:p-6 bg-[var(--fillColor)]/10 border-t border-[var(--borderColor)] mt-4">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 md:flex-none px-8 py-3 rounded-xl border border-[var(--borderColor)] text-[var(--textColor)] font-medium hover:bg-[var(--fillColor)] transition-colors"
        disabled={isPending}
      >
        إلغاء
      </button>
      <button
        type="submit"
        className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-[var(--primeColor)] text-white font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
        disabled={isPending}
      >
        {isPending ? loadingText : mode === "edit" ? "تحديث" : submitText}
      </button>
    </div>
  );
};

// 4. Export
export const Modal = {
  Root,
  Header,
  Body,
  Grid,
  Input,
  Footer,
  Select,
  useContext: useModalContext,
};
