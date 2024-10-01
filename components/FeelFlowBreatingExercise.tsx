import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Music } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type Phase = "inhale" | "exhale";

const FeelFlowBreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/yogamusic.mp3");
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      startBreathingSession();
    } else {
      stopBreathingSession();
    }
    return () => stopBreathingSession();
  }, [isActive]);

  const startBreathingSession = (): void => {
    setPhase("inhale");
    setTimeLeft(60);

    intervalRef.current = window.setInterval(() => {
      setPhase((prevPhase) => (prevPhase === "inhale" ? "exhale" : "inhale"));
    }, 5000);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          stopBreathingSession();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopBreathingSession = (): void => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleToggle = (): void => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  const toggleMusic = (): void => {
    if (audioRef.current) {
      try {
        if (isMusicPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsMusicPlaying(!isMusicPlaying);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  return (
    <Card className="bg-gradient-to-b from-blue-200 to-green-100 rounded-xl overflow-hidden shadow-2xl w-[250px] h-[400px]">
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="flex flex-col items-center text-center mt-4">
          <div className="mb-4 relative w-28 h-28">
            <Image
              src="/yoga.png"
              alt="Yoga pose"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">
            BreatheEase
          </h2>
          <p className="text-base text-indigo-800 mb-2">1-minute mind ease</p>
          <p className="text-base text-indigo-700">
            {isActive
              ? `${phase.charAt(0).toUpperCase() + phase.slice(1)}... (${timeLeft}s)`
              : "Reconnect with your breath"}
          </p>
        </div>
        <div className="flex justify-center space-x-6 mt-10">
          <button
            onClick={handleToggle}
            className="bg-orange-400 hover:bg-orange-500 text-white rounded-full p-5 transition-colors duration-200"
          >
            {isActive ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button
            onClick={toggleMusic}
            className={`${isMusicPlaying ? "bg-green-400" : "bg-gray-300"} hover:opacity-80 text-white rounded-full p-5 transition-colors duration-200`}
          >
            <Music size={28} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeelFlowBreathingExercise;