import React, { useRef, useEffect, type MutableRefObject } from "react";
import { Euler, Quaternion, Vector3, MathUtils, Group } from "three";
import { useFrame } from "@react-three/fiber";

interface GyroCameraControllerProps {
  cameraGroup: MutableRefObject<Group | null>;
  useOrientation: boolean;
}

interface DeviceOrientationType {
  alpha: number;
  beta: number;
  gamma: number;
}

interface MousePosition {
  x: number;
  y: number;
}

const GyroCameraController: React.FC<GyroCameraControllerProps> = ({
  cameraGroup,
  useOrientation,
}) => {
  const deviceOrientation = useRef<DeviceOrientationType>({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const screenOrientation = useRef<number>(
    window.screen.orientation?.angle || 0
  );

  const _zee = new Vector3(0, 0, 1);
  const _euler = new Euler();
  const _q0 = new Quaternion();
  const _q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
  const _orientationQuat = new Quaternion();
  const _targetPosition = new Vector3();
  const mouse = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    if (useOrientation) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        deviceOrientation.current = {
          alpha: e.alpha || 0,
          beta: e.beta || 0,
          gamma: e.gamma || 0,
        };
      };

      const handleScreenOrientation = () => {
        screenOrientation.current = window.screen.orientation?.angle || 0;
      };

      window.addEventListener("deviceorientation", handleOrientation, true);
      window.addEventListener("orientationchange", handleScreenOrientation);

      return () => {
        window.removeEventListener(
          "deviceorientation",
          handleOrientation,
          true
        );
        window.removeEventListener(
          "orientationchange",
          handleScreenOrientation
        );
      };
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.current.y = (e.clientY / window.innerHeight - 0.5) * -2;
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [useOrientation]);

  useFrame(() => {
    if (cameraGroup.current) {
      if (useOrientation) {
        const { alpha, beta, gamma } = deviceOrientation.current;
        const orient = MathUtils.degToRad(screenOrientation.current || 0);

        const a = alpha ? MathUtils.degToRad(alpha) : 0;
        const b = beta ? MathUtils.degToRad(beta) : 0;
        const g = gamma ? MathUtils.degToRad(gamma) : 0;

        _euler.set(b, a, -g, "YXZ");
        _orientationQuat.setFromEuler(_euler);
        _orientationQuat.multiply(_q1);
        _orientationQuat.multiply(_q0.setFromAxisAngle(_zee, -orient));

        const forward = new Vector3(0, 0, 1).applyQuaternion(_orientationQuat);
        _targetPosition.copy(forward).multiplyScalar(50);
      } else {
        _targetPosition.set(mouse.current.x * 10, mouse.current.y * 10, 50);
      }

      cameraGroup.current.position.lerp(_targetPosition, 0.1);

      // Safely access the first child if it exists and has a lookAt method
      const firstChild = cameraGroup.current.children[0];
      if (
        firstChild &&
        "lookAt" in firstChild &&
        typeof firstChild.lookAt === "function"
      ) {
        firstChild.lookAt(0, 0, 0);
      }
    }
  });

  return null;
};

export default GyroCameraController;
