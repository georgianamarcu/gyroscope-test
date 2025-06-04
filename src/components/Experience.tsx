import { Canvas } from "@react-three/fiber";
// import { Perf } from "r3f-perf";
import { Leva } from "leva";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { PerformanceMonitor } from "@react-three/drei";

const Experience = () => {
  const [dpr, setDpr] = useState(1.5);
  const [hideLeva, setHideLeva] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "l") {
        setHideLeva((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <MainContainer>
      <CanvasContainer>
        <Canvas
          shadows
          dpr={dpr}
          camera={{
            fov: 45,
            near: 0.1,
            far: 1000,
            position: [-2.4, 1.4, 1.9],
          }}
        >
          <PerformanceMonitor
            onIncline={() => setDpr(2)}
            onDecline={() => setDpr(1)}
          />
          <color attach="background" args={["#ffffff"]} />
          {/* <Perf position="top-left" /> */}
        </Canvas>
      </CanvasContainer>
      <Leva hidden={hideLeva} />
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
  height: 100vh;
`;
const CanvasContainer = styled.div`
  display: flex;
  width: 75vw;
  height: 100%;
  @media only screen and (max-width: 600px) {
    width: 100vw;
  }
`;

export default Experience;
