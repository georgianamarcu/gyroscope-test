import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
// import { Perf } from "r3f-perf";
import { Leva } from "leva";
import styled from "styled-components";
import { PerformanceMonitor } from "@react-three/drei";
import { Group } from "three";
import Lights from "./Lights";
import Ground from "./Grid";
import GyroCameraController from "./GyroCamera";
import Ball, { type BallHandle } from "./Ball";
import CameraFollower from "./CameraFollower";

const Experience: React.FC = () => {
  const [dpr, setDpr] = useState<number>(1.5);
  const [hideLeva, setHideLeva] = useState<boolean>(true);
  const [gyroEnabled, setGyroEnabled] = useState<boolean>(false);
  const [useGyroCamera, setUseGyroCamera] = useState<boolean>(false);
  const [, setGyroPermission] = useState<string>("prompt");

  const cameraGroupRef = useRef<Group>(null);
  const ballRef = useRef<BallHandle>(null);

  // Store orientation values in state for real-time updates
  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const leftUp = useRef<boolean>(false);
  const rightUp = useRef<boolean>(false);
  const forward = useRef<boolean>(false);

  const handleOrientationChange = (event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0,
    });
  };

  const requestGyroPermission = async (): Promise<void> => {
    try {
      // Check if we're on iOS and need permission
      // Yeah, I know any is lazy, I'll eventually type it properly
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        setGyroPermission(permission);

        if (permission === "granted") {
          window.addEventListener(
            "deviceorientation",
            handleOrientationChange,
            true
          );
          setGyroEnabled(true);
          console.log("Gyroscope permission granted and enabled");
        } else {
          console.log("Gyroscope permission denied");
          alert(
            "Gyroscope permission was denied. Please enable it in your browser settings."
          );
        }
      } else {
        // For Android or browsers that don't require permission
        window.addEventListener(
          "deviceorientation",
          handleOrientationChange,
          true
        );
        setGyroEnabled(true);
        setGyroPermission("granted");
        console.log("Gyroscope enabled (no permission required)");
      }
    } catch (error) {
      console.error("Error requesting gyroscope permission:", error);
      alert("Error requesting gyroscope permission. Please try again.");
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "d" || e.key === "D") rightUp.current = true;
    if (e.key === "q" || e.key === "Q") leftUp.current = true;
    if (e.key === "z" || e.key === "Z") forward.current = true;
    if (e.key === "c" || e.key === "C") setUseGyroCamera((prev) => !prev);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "d" || e.key === "D") rightUp.current = false;
    if (e.key === "q" || e.key === "Q") leftUp.current = false;
    if (e.key === "z" || e.key === "Z") forward.current = false;
  };

  const enableGyro = async (): Promise<void> => {
    await requestGyroPermission();
  };

  useEffect(() => {
    const handleLevaToggle = (event: KeyboardEvent) => {
      if (event.key === "l" || event.key === "L") {
        setHideLeva((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleLevaToggle);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleLevaToggle);
      window.removeEventListener(
        "deviceorientation",
        handleOrientationChange,
        true
      );
    };
  }, []);

  return (
    <MainContainer>
      <CanvasContainer>
        <Canvas shadows dpr={dpr} camera={{ position: [0, 5, 8], fov: 60 }}>
          <PerformanceMonitor
            onIncline={() => setDpr(2)}
            onDecline={() => setDpr(1)}
          />

          <CameraFollower ballRef={ballRef} enabled={!useGyroCamera} />

          <group ref={cameraGroupRef}>
            <perspectiveCamera />
          </group>

          <GyroCameraController
            cameraGroup={cameraGroupRef}
            useOrientation={gyroEnabled && useGyroCamera}
          />

          <group position-y={-0.5}>
            <Lights />

            <Ball
              ref={ballRef}
              gyroEnabled={gyroEnabled && !useGyroCamera}
              orientation={orientation}
              leftUpRef={leftUp}
              rightUpRef={rightUp}
              forwardRef={forward}
            />

            <Ground />
          </group>

          {/* <Perf position="top-left" /> */}
        </Canvas>
      </CanvasContainer>

      {!gyroEnabled && (
        <GyroButton onClick={enableGyro}>Enable Gyroscope Control</GyroButton>
      )}

      {gyroEnabled && (
        <DebugInfo>
          <p>
            Gyro: α:{orientation.alpha.toFixed(0)}° β:
            {orientation.beta.toFixed(0)}° γ:{orientation.gamma.toFixed(0)}°
          </p>
        </DebugInfo>
      )}

      {gyroEnabled && (
        <ModeButton onClick={() => setUseGyroCamera((prev) => !prev)}>
          {useGyroCamera
            ? "Switch to Ball Control"
            : "Switch to Camera Control"}
        </ModeButton>
      )}

      <ControlsInfo>
        {gyroEnabled ? (
          <div>
            <p>🎮 Gyroscope Control Active</p>
            {useGyroCamera ? (
              <div>
                <p>📷 Camera Control Mode</p>
                <p>Tilt device to move camera view</p>
              </div>
            ) : (
              <div>
                <p>⚽ Ball Control Mode</p>
                <p>Tilt device to move the ball</p>
              </div>
            )}
            <p>C - Toggle Camera/Ball Mode</p>
          </div>
        ) : (
          <div>
            <p>⌨️ Keyboard Controls:</p>
            <p>Q - Move Left | D - Move Right | Z - Move Forward</p>
            <p>L - Toggle Debug Panel</p>
            <p>C - Toggle Camera Mode</p>
          </div>
        )}
      </ControlsInfo>

      <Leva hidden={hideLeva} />
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const CanvasContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  @media only screen and (max-width: 600px) {
    width: 100vw;
  }
`;

const GyroButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 12px 24px;
  background: #9d4b4b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  z-index: 1000;

  &:hover {
    background: #8a4242;
  }
`;

const ModeButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  background: #4b9d4b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  z-index: 1000;

  &:hover {
    background: #428a42;
  }
`;

const DebugInfo = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  font-family: monospace;
  z-index: 1000;

  p {
    margin: 2px 0;
  }
`;

const ControlsInfo = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;

  p {
    margin: 4px 0;
  }
`;

export default Experience;
