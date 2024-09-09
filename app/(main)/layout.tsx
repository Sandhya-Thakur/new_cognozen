
import { MobileHeader } from "@/components/mobile-header";
import { SignOut } from "@/components/signout";
import { PermanentSideBar } from "@/components/PermanentSideBar";
type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <MobileHeader />
      <div className="flex flex-row-reverse gap-[42px] px-4">
        {/* Add margin-top to this div to shift SignOut button downwards */}
        {/* Adjust mt-[value] to control the distance it shifts down */}
        <div className="hidden lg:flex items-center mt-8 mr-8">
          {" "}
          {/* Example: mt-4 */}
          <SignOut />
        </div>
        {/* Other content of your page */}
      </div>
      <PermanentSideBar className="hidden lg:flex" />
      <main className="pl-16 h-full lg:pt-0">
        <div className="mx-auto pt-6 lg:pt-0 h-full">
          {children}
        </div>
      </main>
    </>
  );
};

export default MainLayout;
