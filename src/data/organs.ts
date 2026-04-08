// src/data/organs.ts

export type OrganType = 'glb' | 'sketchfab' | 'usdz' | 'gltf-remote' | 'video';

export interface OrganEntry {
  id: string;
  title: string;
  type: OrganType;
  group?: string;
  thumb?: string;

  sketchfab?: {
    uid: string;
    autospin?: boolean;
    autostart?: boolean;
    transparent?: boolean;
    uiTheme?: 'dark' | 'light';
  };

  glbSrc?: string;
  hasParts?: boolean;
  camera?: {
    position: [number, number, number];
    fov?: number;
  };
  usdzSrc?: string;
  videoSrc?: string;
  meta?: Record<string, any>;
}

export const ORGANS: OrganEntry[] = [
  {
    id: 'inson_tanasi',
    title: 'Inson tanasi',
    type: 'glb',
    glbSrc: '/model/human body/human_body_-_male.glb',
    camera: { position: [0, 1.0, 3.0], fov: 40 },
  },
  {
    id: 'muskullar',
    title: 'Muskullar',
    type: 'glb',
    glbSrc: '/model/muscules/male_full_body_ecorche.glb',
    camera: { position: [0, 1.0, 3.0], fov: 40 },
  },
  {
    id: 'ichki_organlar',
    title: 'Ichki organlar',
    type: 'sketchfab',
    sketchfab: {
      uid: 'bfe2c671298947f8bcf0f69c06e74ed8',
      autospin: true,
      autostart: true,
      transparent: true,
      uiTheme: 'dark',
    },
  },
  {
    id: 'skelet',
    title: 'Skelet',
    type: 'glb',
    glbSrc: '/model/full_bones/full_bones.glb',
    hasParts: true,
    camera: { position: [0, 0.8, 2.2], fov: 40 },
  },
];

export const findOrgan = (id: string): OrganEntry | undefined =>
  ORGANS.find((o) => o.id === id);
