const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center w-[100%]">
      <div className="sm:w-[1000px] w-full">
        <div className="w-full px-4 sm:px-0">{children}</div>
      </div>
    </div>
  );
};
export default Container;
