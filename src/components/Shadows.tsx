import { memo } from "react";
import { ContactShadows } from "@react-three/drei";

const Shadows = memo(() => (
  <>
    <ContactShadows
      frames={1}
      opacity={1}
      scale={10}
      blur={1}
      far={10}
      resolution={256}
      color="#000000"
    />
  </>
));

export default Shadows;
