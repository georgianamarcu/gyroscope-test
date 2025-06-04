import React, { useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { type BallHandle } from "./Ball";

interface CameraFollowerProps {
  ballRef: MutableRefObject<BallHandle | null>;
  enabled: boolean;
}

const CameraFollower: React.FC<CameraFollowerProps> = ({
  ballRef,
  enabled,
}) => {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());

  useFrame(() => {
    if (!enabled || !ballRef.current) return;

    const ballPosition = ballRef.current.getPosition();

    // Set camera to follow ball from behind and above
    const offset = new Vector3(0, 5, 8);
    targetPosition.current.copy(ballPosition).add(offset);

    // Look at the ball
    targetLookAt.current.copy(ballPosition);

    // Smooth camera movement
    camera.position.lerp(targetPosition.current, 0.05);
    camera.lookAt(targetLookAt.current);
  });

  return null;
};

export default CameraFollower;
