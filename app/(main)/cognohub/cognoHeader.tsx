import { CognoSearchBar } from "@/components/cogno-hub-seach-bar";
import { CognoHubMenu } from "@/components/cognohub-menubar";

export const Header = () => {
  return (
    <div className="p-6 border-b flex flex-col md:flex-row">
      <div className="mb-4 md:mb-0 md:pr-8 flex flex-col-reverse md:flex-row w-full">
        <CognoHubMenu chatId={123} />
      </div>
      <CognoSearchBar />
    </div>
  );
};
