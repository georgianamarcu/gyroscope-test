import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

interface BallProps {
  gyroEnabled: boolean;
  orientation: {
    alpha: number;
    beta: number;
    gamma: number;
  };
  keyControls: {
    leftUp: boolean;
    rightUp: boolean;
  };
}

const Ball: React.FC<BallProps> = ({
  gyroEnabled,
  orientation,
  keyControls,
}) => {
  const ballRef = useRef<Mesh>(null);
  const velocity = useRef(new Vector3(0, 0, 0));
  const position = useRef(new Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!ballRef.current) return;

    // Movement speed
    const speed = 5;
    const friction = 0.95;
    const maxSpeed = 3;

    if (gyroEnabled) {
      // Normalize gamma (-90 to 90) to (-1 to 1)
      const leftRight = Math.max(-1, Math.min(1, orientation.gamma / 45));

      // Normalize beta for forward/backward (use a smaller range for better control)
      // When phone is tilted forward (negative beta), move forward (positive z)
      const forwardBack = Math.max(-1, Math.min(1, -orientation.beta / 30));

      velocity.current.x += leftRight * speed * delta;
      velocity.current.z += forwardBack * speed * delta;
    } else {
      // Use keyboard controls as fallback
      if (keyControls.leftUp) {
        velocity.current.x -= speed * delta;
      }
      if (keyControls.rightUp) {
        velocity.current.x += speed * delta;
      }
    }

    // Apply friction
    velocity.current.multiplyScalar(friction);

    // Limit maximum speed
    if (velocity.current.length() > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed);
    }

    // Update position
    position.current.add(velocity.current.clone().multiplyScalar(delta));

    // Keep ball within bounds (optional)
    const bounds = 8;
    position.current.x = Math.max(
      -bounds,
      Math.min(bounds, position.current.x)
    );
    position.current.z = Math.max(
      -bounds,
      Math.min(bounds, position.current.z)
    );

    // Apply position to mesh
    ballRef.current.position.copy(position.current);
  });

  return (
    <mesh ref={ballRef} position={[0, 0.5, 0]} castShadow>
      <sphereGeometry args={[0.5, 32, 16]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

export default Ball;
