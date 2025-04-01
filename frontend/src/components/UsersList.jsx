export const UsersList = ({ children }) => {
  return (
    <div className="p-3 flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl">
        {children}
      </div>
    </div>
  );
};
