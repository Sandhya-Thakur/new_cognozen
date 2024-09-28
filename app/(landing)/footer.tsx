import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-[#000066] text-white pt-[14rem] py-8 mt-[14rem]">
      <div className="relative max-w-7xl mx-auto px-4 items-center justify-between">
        <div className="absolute inset-x-0 w-[60%] md:w-[988px] bottom-[75px] mx-auto p-6 md:p-4 bg-[#0D39FF] rounded-lg">
          <h2 className="font-inter font-bold text-[20px] md:text-[40px] leading-[34px] md:leading-[48px] text-center pt-[3rem] md:pt-[4rem]">Ready to Transform Your <br />University&apos;s Learning Experience?</h2>
          <div className="flex flex-row justify-center items-center mt-[2rem] mb-[4rem]">
            <Button size="lg" className="font-inter text-[12px] md:text-[16px] bg-[#FFD30D] text-[#1A1A1E] px-6 hover:bg-[#E3F2FD] border-1 hover:border-[#87CEEB]">
              Request Demo
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-[#FFFFFF] nav-buttom-font">© {new Date().getFullYear()} CognoZen. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link href="/about" className="hover:text-[#87CEEB] transition-colors nav-buttom-font">contact@cognozen.ai</Link>
            <Link href="/terms" className="hover:text-[#87CEEB] transition-colors nav-buttom-font">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#87CEEB] transition-colors nav-buttom-font">Privacy Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};