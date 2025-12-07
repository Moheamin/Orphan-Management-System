export default function card({ children }: { children?: React.ReactNode }) {
  return (
    <li className=" w-full h-full bg-white border-2 border-(--borderColor) rounded-[20px] p-5 flex flex-row items-center justify-end gap-24 ">
      {children}
    </li>
  );
}
