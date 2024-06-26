"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const GetBackButton = () => {
  const router = useRouter();
  const handleClick = () => {
    router.back();
  };

  return (
    <div className="flex justify-center items-center">
      <Button onClick={handleClick} size="sm">
        Get Back
      </Button>
    </div>
  );
};

export default GetBackButton;
