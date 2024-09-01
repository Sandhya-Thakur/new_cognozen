import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#0F52BA] text-white py-8">
      <div className="max-w-screen-lg mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <Image
            src="/logo_name.svg"
            alt="CognoZen Logo"
            width={120}
            height={40}
          />
          <p className="mt-2 text-sm text-[#87CEEB]">Empowering Minds, Transforming Futures</p>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end gap-4">
          <Link href="/about" className="hover:text-[#87CEEB] transition-colors">About Us</Link>
          <Link href="/privacy" className="hover:text-[#87CEEB] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#87CEEB] transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-[#87CEEB] transition-colors">Contact</Link>
        </nav>
      </div>
      <div className="mt-8 text-center text-sm">
        <p className="text-[#87CEEB]">© {new Date().getFullYear()} CognoZen. All rights reserved.</p>
      </div>
    </footer>
  );
};