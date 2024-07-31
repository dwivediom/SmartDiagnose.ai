// src/ModelViewer.js
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

function Model({ url }) {
  const { scene } = useGLTF("/untitled.glb");
  return <primitive object={scene} />;
}

function ModelViewer({ url }) {
  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

export default ModelViewer;
