export interface Maps {
  albedo: string;
  roughness?: string;
  normal: string;
}
export interface Textures {
  name: string;
  label: string;
  maps: Maps;
}

export interface Collection {
  collection: {
    name?: string;
    label?: string;
    textures: Textures[];
  };
}

export interface TexturesData {
  top: Collection;
  legs: Collection;
}

export const texturesData: TexturesData = {
  top: {
    collection: {
      name: "adore",
      label: "Adore",
      textures: [
        {
          name: "moss-59",
          label: "Adore Moss 59",
          maps: {
            albedo: "materials/top/adore59.webp",
            normal: "materials/top/velvet_normal.webp",
          },
        },
        {
          name: "niagara-158",
          label: "Adore Niagara 158",
          maps: {
            albedo: "materials/top/adore158.webp",
            normal: "materials/top/velvet_normal.webp",
          },
        },
        {
          name: "blossom-166",
          label: "Adore Blossom 166",
          maps: {
            albedo: "materials/top/adore166.webp",
            normal: "materials/top/velvet_normal.webp",
          },
        },
        {
          name: "ecru-102",
          label: "Adore Ecru 102",
          maps: {
            albedo: "materials/top/ecru102.webp",
            normal: "materials/top/velvet_normal.webp",
          },
        },
      ],
    },
  },
  legs: {
    collection: {
      textures: [
        {
          name: "walnut",
          label: "Walnut",
          maps: {
            albedo: "materials/legs/walnut_albedo.webp",
            roughness: "materials/legs/walnut_roughness.webp",
            normal: "materials/legs/walnut_normal.webp",
          },
        },
        {
          name: "elm",
          label: "Elm",
          maps: {
            albedo: "materials/legs/elm_albedo.webp",
            roughness: "materials/legs/elm_roughness.webp",
            normal: "materials/legs/elm_normal.webp",
          },
        },
      ],
    },
  },
};
