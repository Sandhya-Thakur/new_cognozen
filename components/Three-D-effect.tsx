"use client";
import {
  CameraControls,
  Environment,
  Float,
  Gltf,
  Html,
  Loader,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { Box, OrbitControls, useTexture } from "@react-three/drei";

export const ThreeDEffect = () => {
  return (
    <>
      <Canvas>
        <Environment preset="sunset" />
        <ambientLight intensity={0.8} color="pink" />
        <Gltf src="models/classroom.glb" />
      </Canvas>
    </>
  );
};
