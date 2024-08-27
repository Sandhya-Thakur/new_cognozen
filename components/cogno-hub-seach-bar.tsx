
import { Search } from "lucide-react";
export const CognoSearchBar = () => {
  return (
    <div className="flex gap-3 text-[14px] items-center border p-2 rounded-full bg-slate-50 w-full">
      <Search />
      <input
        type="text"
        placeholder="Search"
        className="bg-transparent outline-none"
      />
    </div>
  );
};
