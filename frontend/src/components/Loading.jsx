import { Loader } from "lucide-react";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  );
};
