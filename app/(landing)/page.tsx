import Image from "next/image";
import { Loader } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="text-center hero-bg text-white">
      <div className="max-w-7xl pt-52 md:pt-52 mx-auto">
        <h1 className="font-inter font-extrabold text-[32px] md:text-[48px] lg:text-[64px] leading-[40px] md:leading-[60px] lg:leading-[80px] text-center px-4 md:px-0">
          AI-Powered Learning <br /> Personalized for Every Student
        </h1>
        <img className="hidden md:block absolute top-[250px] md:top-[329px] right-[20px] md:right-[88px]" src="/spiral_line.png" alt="Hero" />
        <div className="max-w-5xl mx-auto">
          <p className="text-[16px] md:text-[18px] lg:text-[20px] leading-[26px] md:leading-[28px] lg:leading-[32px] font-normal text-center mt-5 mb-10 px-4 md:px-20 lg:px-28">
            Empower your institution with CognoZen’s AI-driven platform, delivering personalized cognitive and emotional learning experiences at scale.
          </p>
        </div>
        <div className="flex flex-row justify-center items-center">
          <form className="flex flex-col md:flex-row w-full md:w-auto space-y-4 md:space-y-0">
            <div className="flex w-full md:w-auto rounded-[8px] overflow-hidden">
              <input
                type="email"
                placeholder="Enter email address"
                className="px-4 py-[0.7rem] w-full md:w-72 focus:outline-none text-[#000]"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-inter text-[16px] font-normal py-[0.7rem] px-6">
                Request Demo
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-row justify-center items-center mt-[1rem] md:mt-12 px-4">
          <Image className="" src="/iPad.png" height={601} width={863} alt="Hero IPad" />
        </div>
      </div>
    </section>
  );
};

const TechSection = () => {
  return(
    <section className="text-center tech-bg text-[#1A1A1E]">
      <div className="max-w-7xl pt-[4rem] md:pt-[6rem] pb-[3rem] md:pb-[4rem] mx-auto">
        <h2 className="font-inter font-bold text-[32px] md:text-[48px] leading-[40px] md:leading-[58px] text-center px-4">Unlock the Future of Learning<br /> – where technology meets empathy</h2>
      </div>
      <div className="max-w-6xl pt-[2rem] md:pt-[2.5rem] pb-[3rem] md:pb-[4rem] mx-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap md:-mx-4">
            <div className="w-full md:w-5/12 md:px-4 p-4">
              <div className="w-full">
                <h3 className="font-inter font-bold text-[20px] md:text-[24px] leading-[26px] md:leading-[29px] text-left">Personalized Analytics Dashboard</h3>
                <p className="font-inter font-normal text-[14px] md:text-[16px] leading-[24px] md:leading-[28px] text-left pt-[1rem]">Monitors your students’ progress in real-time, tracking key metrics such as attention level, emotional response, hours of study, problem-solving skills, etc., to make informed, data-driven decisions to better support your student’s learning and growth.</p>
              </div>
              <div className="w-full pt-[2rem]">
                <h3 className="font-inter font-bold text-[20px] md:text-[24px] leading-[26px] md:leading-[29px] text-left">CognoHub</h3>
                <p className="font-inter font-normal text-[14px] md:text-[16px] leading-[24px] md:leading-[28px] text-left pt-[1rem]">A centralized library for students to upload and customize their course materials, create assignments, read books, organize notes, and generate summaries or quizzes. While they focus on learning, CognoZen quietly tracks emotions, attention, and problem-solving in the background, offering real-time insights to tailor and enhance each student's unique learning journey.</p>
              </div>
            </div>
            <div className="relative w-full md:w-7/12 md:px-4 p-4 flex justify-center md:justify-end">
              <div className="relative w-full md:h-[428px] h-auto">
                <img className="absolute z-10 overlay-image-one w-[371px] h-[210px] top-[-14px] right-[278px]" src="/Bar_Chart.png" alt="Technology" />
                <Image className="absolute pt-[1rem] pl-[1rem]" src="/faded_screen.png" height={428} width={634} alt="Technology" />
                <img className="absolute z-20 overlay-image-two w-[200px] h-[232px] top-[152px] right-[-88px]" src="/data_visuals.png" alt="Technology" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#0F52BA]">
//       <div className="text-3xl mb-4 text-[#0F52BA]">{icon}</div>
//       <h3 className="text-xl font-semibold mb-2 text-[#0F52BA]">{title}</h3>
//       <p className="text-[#2C3E50]">{description}</p>
//     </div>
//   );
// };




const FeatureSection = () => {
  return (
    <section className="text-center feature-bg bg-[#6E88FF] py-20 mt-[3rem]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap md:-mx-4">
            <div className="w-full md:w-6/12 md:px-4 p-4 mt-[-100px] md:mt-[-155px]">
              <div className="w-[560px] h-[288px] texh-mob md:w-auto pt-[1rem] pb-[1rem] bg-[#E7EBFF] rounded-[8px] p-px-[40px] my-[25px]">
                <div className="w-full flex items-center md:pl-[27px] pl-[10px]">
                  <div className="icon rounded-[25px] bg-[#ffff]">
                    <img src="/Mindful.png" alt="Icon" />
                  </div>
                  <h3 className="font-inter font-bold text-[20px] md:text-[24px] leading-[26px] md:leading-[29px] text-left ml-[10px] md:ml-[15px]">CognoBuddy</h3>
                </div>
                <p className="font-inter font-normal text-[14px] md:text-[16px] text-[#767678] leading-[24px] md:leading-[28px] text-left pt-[1rem] px-[15px] md:px-[30px]">An AI-powered learning companion that instantly answers questions and offers real-time support to students. It adapts to each student’s unique learning style and needs, clarifies concepts, solves problems, and ensures continuous progress –anytime, anywhere.</p>
              </div>
              <div className="w-[560px] h-[288px] texh-mob md:w-auto pt-[1rem] pb-[1rem] bg-[#0000B2] text-[#FFFFFF] rounded-[8px] p-px-[40px] my-[25px]">
                <div className="w-full flex items-center md:pl-[27px] pl-[10px]">
                  <div className="icon rounded-[25px]">
                    <img src="/Icon.png" alt="Icon" />
                  </div>
                  <h3 className="font-inter font-bold text-[20px] md:text-[24px] leading-[26px] md:leading-[29px] text-left ml-[10px] md:ml-[15px]">FeelFlow</h3>
                </div>
                <p className="font-inter font-normal text-[14px] md:text-[16px] leading-[24px] md:leading-[28px] text-left pt-[1rem] px-[15px] md:px-[30px]">FeelFlow empowers students to log and track their emotional states, providing real-time feedback that adapts learning paths to their emotional well-being. This module enhances self-awareness and emotional resilience, ensuring students remain engaged and supported throughout their educational journey.</p>
              </div>
              <div className="w-[560px] h-[288px] texh-mob md:w-auto pt-[1rem] pb-[1rem] bg-[#E7EBFF] rounded-[8px] p-px-[40px] my-[25px]">
                <div className="w-full flex items-center md:pl-[27px] pl-[10px]">
                  <div className="icon rounded-[25px]">
                    <img src="/habits.png" alt="Icon" />
                  </div>
                  <h3 className="font-inter font-bold text-[20px] md:text-[24px] leading-[26px] md:leading-[29px] text-left ml-[10px] md:ml-[15px]">HabitBuilder</h3>
                </div>
                <p className="font-inter font-normal text-[14px] md:text-[16px] leading-[24px] md:leading-[28px] text-left pt-[1rem] px-[15px] md:px-[30px]">The HabitBuilder monitors study habits, offering insights into productivity and areas for improvement. Integrated with CognoZen’s AI, it adjusts learning paths based on these behaviors to optimize learning efficiency.</p>
              </div>
            </div>
            <div className="relative w-full md:w-6/12 pl-[2rem] md:pl-[5rem] p-4 text-[#FFFFFF]">
              <h2 className="font-inter font-bold text-[32px] md:text-[48px] leading-[40px] md:leading-[58px] text-left pt-[1rem] md:pt-[1.5rem]">Mindfulness <br />& Well-being <br />Features</h2>
              <p className="font-inter font-normal text-[14px] md:text-[16px] leading-[24px] md:leading-[28px] text-left pt-[1.5rem] md:pt-[2rem]">The HabitBuilder monitors study habits, offering insights into productivity and areas for improvement. Integrated with CognoZen’s AI, it adjusts learning paths based on these behaviors to optimize learning efficiency.</p>
              <div className="img mt-[6rem] md:mt-[6rem]">
                <img className="absolute z-10 feature-overlay-img-one w-[150px] md:w-[225px] h-[250px] md:h-[353px] top-[320px] md:top-[414px] right-[-20px] md:right-[-31px]" src="/Phone.png" alt="Technology" />
                <img className="relative mt-4 md:mt-0" src="/data.png" alt="Technology" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return(
<section className="text-center tech-bg text-[#1A1A1E]">
      <div className="max-w-7xl pt-[7rem] md:pt-[7rem] pb-[2rem] mx-auto">
        <h2 className="font-inter font-bold text-[28px] md:text-[48px] leading-[40px] md:leading-[58px] text-center">Explore CognoZen with an<br /> Exclusive FREE Trial for Universities</h2>
      </div>
      <div className="max-w-6xl pt-[2.5rem] pb-[4rem] mx-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap md:-mx-4">
            <div className="w-full flex flex-col lg:flex-row items-center justify-center text-[#FFFFFF] md:px-4 p-4">
              <div className="relative w-full flex justify-center mb-8 lg:mb-0 lg:mr-8">
                <div className="absolute contact-img top-[-18.5rem] right-[-102px]">
                  <img className="z-10" src="/classroom_landing.png" alt="Contact" />
                </div>
              </div>
              <div className="w-[350px] h-[547px] mob-contact-content bg-[#000099] md:w-auto rounded-[10px]">
                <div className="w-[296px] h-[391px] justify-center p-[40px]">
                  <p className="font-inter font-bold text-[10px] md:text-[12px] leading-[14px] md:leading-[14.52px] bg-[#0D39FF] tracking-[1.5px] md:tracking-[1.63px] uppercase rounded-[25px] px-3 py-2 mx-auto w-max">Exclusive Offer</p>
                  <h4 className="font-inter text-[24px] md:text-[32px] leading-[32px] md:leading-[39px] font-bold text-center mt-[2rem] mb-[2rem]">Early Access Special</h4>
                  <p className="font-inter text-[14px] md:text-[16px] leading-[24px] md:leading-[28px] text-center mb-[2rem]">Try CognoZen FREE with our Basic University Trial, designed to introduce your faculty and students to the future of personalized learning.</p>
                  <Button size="lg" className="font-inter text-[14px] md:text-[16px] bg-[#B2FF0D] text-[#1A1A1E] px-6 py-3 hover:bg-[#E3F2FD] hover:border-[#87CEEB] transition duration-300">
                    Request Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <TechSection />
      <FeatureSection />
      <ContactSection />
      {/* <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2 bg-[#E3F2FD]">
        <div className="flex flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
            <ClerkLoading>
              <Loader className="h-5 w-5 text-[#0F52BA] animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedOut>
                <SignUpButton
                  mode="modal"
                  afterSignInUrl="/dashboard"
                  afterSignUpUrl="/dashboard"
                >
                  <Button size="lg" className="w-full bg-[#0F52BA] hover:bg-[#0D47A1] text-white">
                    Get Started
                  </Button>
                </SignUpButton>
                <SignInButton
                  mode="modal"
                  afterSignInUrl="/dashboard"
                  afterSignUpUrl="/dashboard"
                >
                  <Button size="lg" className="w-full bg-white border-2 border-[#0F52BA] text-[#0F52BA] hover:bg-[#E3F2FD]">
                    I already have an account
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" className="w-full bg-[#0F52BA] hover:bg-[#0D47A1] text-white" asChild>
                  <Link href="/dashboard">Continue Learning</Link>
                </Button>
                <SignOutButton>
                  <Button size="lg" className="w-full bg-white border-2 border-[#0F52BA] text-[#0F52BA] hover:bg-[#E3F2FD] mt-2">
                    Logout
                  </Button>
                </SignOutButton>
              </SignedIn>
            </ClerkLoaded>
          </div>
        </div>
      </div> */}
    </main>
  );
}