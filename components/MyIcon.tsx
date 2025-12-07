export default function MyIcon({
  size,
  shape,
  color,
  children,
}: {
  size: number;
  shape: string;
  color: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius:
          shape === "circle" ? "50%" : shape === "rounded" ? "20%" : "0%",
      }}
    >
      {children}
    </div>
  );
}
