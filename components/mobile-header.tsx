import { MobileSidebar } from "@/components/mobile-sidebar";
import { SignOut } from "@/components/signout";

export const MobileHeader = () => {
  return (
    <nav
      className="lg:hidden px-6 h-[50px] flex items-center justify-between border-b fixed top-0 w-full z-50"
      style={{
        background: "rgb(63,94,251)",
        backgroundImage:
          "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,80,1) 100%)",
      }}
    >
      {/* MobileSidebar or other content can go here */}
      <MobileSidebar />
      {/* SignOut button aligned to the right */}
      <SignOut />
    </nav>
  );
};
