export default function Card({ children }: { children?: React.ReactNode }) {
  return (
    <li className="w-full h-full bg-[var(--backgroundColor)] border-2 border-[var(--borderColor)] rounded-[20px] p-4 md:p-6 flex flex-row items-center justify-between gap-4 md:gap-10 shadow-sm transition-shadow hover:shadow-md">
      {children}
    </li>
  );
}
