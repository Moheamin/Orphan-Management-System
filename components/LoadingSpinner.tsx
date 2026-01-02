function LoadingSpinner() {
  return (
    <div className="flex min-h-[57vh] w-full items-center justify-center">
      <div className=" h-24 w-24 border-8 border-var(--primeColor) border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default LoadingSpinner;
