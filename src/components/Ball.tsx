import React, { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

interface BallProps {
  gyroEnabled: boolean;
  orientation: {
    alpha: number;
    beta: number;
    gamma: number;
  };
  leftUpRef: MutableRefObject<boolean>;
  rightUpRef: MutableRefObject<boolean>;
  forwardRef: MutableRefObject<boolean>;
}

const Ball: React.FC<BallProps> = ({
  gyroEnabled,
  orientation,
  leftUpRef,
  rightUpRef,
  forwardRef,
}) => {
  const ballRef = useRef<Mesh>(null);
  const velocity = useRef(new Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!ballRef.current) return;

    // Movement speed
    const speed = 8;
    const friction = 0.92;
    const maxSpeed = 4;

    let moved = false;

    if (gyroEnabled) {
      // Use gyroscope for movement
      // gamma controls left/right movement (-90 to 90 degrees)
      // beta controls forward/backward movement (-180 to 180 degrees)

      // Normalize gamma (-90 to 90) to (-1 to 1)
      const leftRight = Math.max(-1, Math.min(1, orientation.gamma / 30));

      // Normalize beta for forward/backward (use a smaller range for better control)
      // When phone is tilted forward (negative beta), move forward (positive z)
      const forwardBack = Math.max(-1, Math.min(1, -orientation.beta / 20));

      if (Math.abs(leftRight) > 0.1) {
        velocity.current.x += leftRight * speed * delta;
        moved = true;
      }

      if (Math.abs(forwardBack) > 0.1) {
        velocity.current.z += forwardBack * speed * delta;
        moved = true;
      }

      console.log("Gyro values:", {
        gamma: orientation.gamma,
        beta: orientation.beta,
        leftRight,
        forwardBack,
        moving: moved,
      });
    }

    // Always check keyboard controls (for debugging and fallback)
    if (leftUpRef.current) {
      velocity.current.x -= speed * delta;
      moved = true;
      console.log("Moving left via keyboard");
    }
    if (rightUpRef.current) {
      velocity.current.x += speed * delta;
      moved = true;
      console.log("Moving right via keyboard");
    }
    if (forwardRef.current) {
      velocity.current.z -= speed * delta;
      moved = true;
      console.log("Moving forward via keyboard");
    }

    // Apply friction
    velocity.current.multiplyScalar(friction);

    // Limit maximum speed
    if (velocity.current.length() > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed);
    }

    // Update position
    ballRef.current.position.add(
      velocity.current.clone().multiplyScalar(delta)
    );

    // Keep ball within bounds
    const bounds = 8;
    ballRef.current.position.x = Math.max(
      -bounds,
      Math.min(bounds, ballRef.current.position.x)
    );
    ballRef.current.position.z = Math.max(
      -bounds,
      Math.min(bounds, ballRef.current.position.z)
    );
    ballRef.current.position.y = 0.5; // Keep ball above ground

    if (moved && velocity.current.length() > 0.01) {
      console.log("Ball moving to:", ballRef.current.position.toArray());
    }
  });

  return (
    <mesh ref={ballRef} position={[0, 0.5, 0]} castShadow>
      <sphereGeometry args={[0.5, 32, 16]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

export default Ball;
