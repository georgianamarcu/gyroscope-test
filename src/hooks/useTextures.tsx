import { useTexture } from "@react-three/drei";
import {
  Texture,
  RepeatWrapping,
  LinearSRGBColorSpace,
  SRGBColorSpace,
  type Wrapping,
} from "three";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";

interface Collection {
  repeat: number;
  envMapIntensity: number;
  material: string;
}

interface TextureInfo {
  url: string;
  repeat: number | Collection;
}

type TexturesInput = {
  diffuse?: TextureInfo;
  roughness?: TextureInfo;
  normals?: TextureInfo;
} & {
  [key: string]: TextureInfo;
};

interface ProcessedTexture extends Texture {
  wrapS: Wrapping;
  wrapT: Wrapping;
}

export const useTextures = (textures: TexturesInput) => {
  const textureEntries = Object.entries(textures);
  const loadedTextures = useTexture(
    Object.fromEntries(textureEntries.map(([key, { url }]) => [key, url]))
  );
  const { gl } = useThree();
  return useMemo(() => {
    const processedTextures: Record<string, ProcessedTexture> = {};
    textureEntries.forEach(([key, { repeat }]) => {
      const texture = loadedTextures[key];
      if (texture) {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        //@ts-expect-error find another alternative
        texture.repeat.set(repeat, repeat);
        texture.colorSpace =
          key === "diffuse" ? SRGBColorSpace : LinearSRGBColorSpace;
        texture.anisotropy = gl.capabilities.getMaxAnisotropy();
        processedTextures[key] = texture as ProcessedTexture;
        texture.needsUpdate = true;
      }
    });
    return processedTextures;
  }, [gl.capabilities, loadedTextures, textureEntries]);
};
