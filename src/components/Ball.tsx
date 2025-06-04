import React, {
  useRef,
  type MutableRefObject,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3, Group } from "three";

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

export interface BallHandle {
  getPosition: () => Vector3;
}

const Ball = forwardRef<BallHandle, BallProps>(
  ({ gyroEnabled, orientation, leftUpRef, rightUpRef, forwardRef }, ref) => {
    const ballRef = useRef<Mesh>(null);
    const groupRef = useRef<Group>(null);
    const velocity = useRef(new Vector3(0, 0, 0));

    useImperativeHandle(ref, () => ({
      getPosition: () => ballRef.current?.position || new Vector3(0, 0.5, 0),
    }));

    useFrame((state, delta) => {
      if (!ballRef.current) return;

      // Movement speed
      const speed = 25;
      const maxSpeed = 35;
      const friction = 0.95;

      let moved = false;

      if (gyroEnabled) {
        // Use gyroscope for movement - based on working watertoy example
        // gamma: left/right tilt (-90 to 90 degrees)
        // beta: forward/back tilt (-180 to 180 degrees)

        // Normalize and apply movement
        const sensitivity = 0.7;
        const deadzone = 2; // degrees

        // Left/Right movement from gamma
        if (Math.abs(orientation.gamma) > deadzone) {
          const normalizedGamma = Math.max(
            -1,
            Math.min(1, orientation.gamma / 45)
          );
          velocity.current.x += normalizedGamma * speed * sensitivity * delta;
          moved = true;
        }

        // Forward/Back movement from beta
        if (Math.abs(orientation.beta) > deadzone) {
          const normalizedBeta = Math.max(
            -1,
            Math.min(1, orientation.beta / 45)
          );
          velocity.current.z += normalizedBeta * speed * sensitivity * delta;
          moved = true;
        }

        if (moved) {
          console.log("Gyro movement:", {
            gamma: orientation.gamma.toFixed(1),
            beta: orientation.beta.toFixed(1),
            velX: velocity.current.x.toFixed(3),
            velZ: velocity.current.z.toFixed(3),
          });
        }
      }

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

      // Keep ball within bounds, maybe if we make some pre-set game level
      //   const bounds = 8;
      //   ballRef.current.position.x = Math.max(
      //     -bounds,
      //     Math.min(bounds, ballRef.current.position.x)
      //   );
      //   ballRef.current.position.z = Math.max(
      //     -bounds,
      //     Math.min(bounds, ballRef.current.position.z)
      //   );
      ballRef.current.position.y = 0.5; // Keep ball above ground

      if (moved && velocity.current.length() > 0.01) {
        console.log(
          "Ball moving to:",
          ballRef.current.position.toArray().map((n) => n.toFixed(2))
        );
      }
    });

    return (
      <group ref={groupRef}>
        <mesh ref={ballRef} position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.5, 32, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    );
  }
);

Ball.displayName = "Ball";

export default Ball;
