"use client";

import { Header } from "./cognoHeader";
import { CognoHubLibrary } from "@/components/cognohub-library";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";



const CognoHub = () => {
  return (
    <div>
      <Header />
      <CognoHubLibrary />
    </div>
  );
  
};

export default CognoHub;

