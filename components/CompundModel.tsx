import { ReactNode, createContext, useContext } from "react";
import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
} from "react-hook-form";

// Context Types
interface ModalContextType<T extends FieldValues> {
  form: UseFormReturn<T>;
  isPending: boolean;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType<any> | undefined>(
  undefined
);

function useModalContext<T extends FieldValues>() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within Modal.Root");
  }
  return context as ModalContextType<T>;
}

// Root Component
interface RootProps<T extends FieldValues> {
  children: ReactNode;
  onClose: () => void;
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  isPending?: boolean;
}

function Root<T extends FieldValues>({
  children,
  onClose,
  onSubmit,
  defaultValues,
  isPending = false,
}: RootProps<T>) {
  const form = useForm<T>({
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <ModalContext.Provider value={{ form, isPending, onClose }}>
      <div
        className="fixed inset-0 bg-black/50 z-30 cursor-pointer flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>{children}</form>
        </div>
      </div>
    </ModalContext.Provider>
  );
}

// Header Component
interface HeaderProps {
  title: string;
  onClose?: () => void;
}

function Header({ title, onClose }: HeaderProps) {
  const { onClose: contextOnClose } = useModalContext();
  const handleClose = onClose || contextOnClose;

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <button
        type="button"
        onClick={handleClose}
        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
      >
        ×
      </button>
    </div>
  );
}

// Body Component
interface BodyProps {
  children: ReactNode;
  className?: string;
}

function Body({ children, className = "" }: BodyProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

// Grid Component for form layout
interface GridProps {
  children: ReactNode;
  cols?: 1 | 2;
  className?: string;
}

function Grid({ children, cols = 2, className = "" }: GridProps) {
  return (
    <div className={`grid grid-cols-${cols} gap-6 ${className}`}>
      {children}
    </div>
  );
}

// Field Component
interface FieldProps {
  children: ReactNode;
  span?: 1 | 2;
  className?: string;
}

function Field({ children, span = 1, className = "" }: FieldProps) {
  return (
    <div className={`col-span-2 md:col-span-${span} ${className}`}>
      {children}
    </div>
  );
}

// Input Component
interface InputProps<T extends FieldValues> {
  name: keyof T;
  label: string;
  type?: "text" | "number" | "email" | "tel";
  placeholder?: string;
  validation?: object;
  span?: 1 | 2;
  className?: string;
}

function Input<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  validation,
  span = 1,
  className = "",
}: InputProps<T>) {
  const { form } = useModalContext<T>();
  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name];

  return (
    <Field span={span} className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        {...register(name as any, validation)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message as string}</p>
      )}
    </Field>
  );
}

// Select Component
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps<T extends FieldValues> {
  name: keyof T;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  validation?: object;
  span?: 1 | 2;
  defaultValue?: string;
  className?: string;
}

function Select<T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  validation,
  span = 1,
  defaultValue,
  className = "",
}: SelectProps<T>) {
  const { form } = useModalContext<T>();
  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name];

  return (
    <Field span={span} className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        {...register(name as any, validation)}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition appearance-none"
        defaultValue={defaultValue || ""}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message as string}</p>
      )}
    </Field>
  );
}

// Footer Component
interface FooterProps {
  children?: ReactNode;
  cancelText?: string;
  submitText?: string;
  loadingText?: string;
}

function Footer({
  children,
  cancelText = "إلغاء",
  submitText = "حفظ",
  loadingText = "جاري الحفظ...",
}: FooterProps) {
  const { isPending, onClose } = useModalContext();

  if (children) {
    return <div className="flex gap-3 mt-6 justify-end">{children}</div>;
  }

  return (
    <div className="flex gap-3 mt-6 justify-end">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
        disabled={isPending}
      >
        {cancelText}
      </button>
      <button
        type="submit"
        className="px-6 py-2.5 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isPending}
      >
        {isPending ? loadingText : submitText}
      </button>
    </div>
  );
}

// Custom Field Component for complex layouts
interface CustomFieldProps {
  children: (form: UseFormReturn<any>) => ReactNode;
}

function CustomField({ children }: CustomFieldProps) {
  const { form } = useModalContext();
  return <>{children(form)}</>;
}

// Export compound component
export const Modal = {
  Root,
  Header,
  Body,
  Grid,
  Field,
  Input,
  Select,
  Footer,
  CustomField,
  useContext: useModalContext,
};
