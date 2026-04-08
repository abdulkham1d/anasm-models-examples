// src/data/organs.ts

// Tiplar:
export type OrganType = 'glb' | 'sketchfab' | 'usdz' | 'gltf-remote' | 'video';

export interface OrganEntry {
  id: string;                // unique key, URL ?model= shu bilan ishlaydi
  title: string;             // UI-da ko‘rinadigan nom (Uzbek friendly nom)
  type: OrganType;

  // Ko‘rinish (preview):
  thumb?: string;            // preview img (lazy-loaded <img />/background-image)

  // === GLB / LOCAL ===
  // local GLB yoki remote GLB URL
  glbSrc?: string;           // e.g. '/model/right_arm/right_arm.glb' yoki 'https://cdn.../kidney.glb'
  // agar organ bo'linadigan bo'lsa (RightSidebar parts chiqarish uchun)
  hasParts?: boolean;

  // === USDZ / AR ===
  usdzSrc?: string;          // iOS AR QuickLook uchun .usdz
  ar?: {
    iosUSDZ?: string;
    androidWebXR?: boolean;
  };

  // === Sketchfab ===
  sketchfab?: {
    // faqat ID ni saqlaymiz, to‘liq iframe URL-ni runtime da quramiz
    uid: string;             // e.g. 'fb4587697ef048d5b4e1bf4f76f25f8c'
    autospin?: boolean;
    autostart?: boolean;
    transparent?: boolean;
    uiTheme?: 'dark' | 'light';
    // attribution (ko‘rsatish uchun, ixtiyoriy)
    author?: string;
    authorUrl?: string;
    modelUrl?: string;
    license?: string;
  };

  // === Video fallback ===
  videoSrc?: string;         // mp4 yoki hls

  // Qo'shimcha metadata (kelajak: description, tags, category, difficulty level, i18n...)
  meta?: Record<string, any>;
}

// --- 1) Skeletal group (misol sifatida bir nechta ko‘rsatamiz) ---
const GROUP_SKELETAL: OrganEntry[] = [
  {
    id: 'full_bones',
    title: 'Inson skeleti',
    type: 'glb',
    glbSrc: '/model/full_bones/full_bones.glb',
    hasParts: true,
    thumb: '/model/_thumbnails/right_arm.jpg',
  },
  {
    id: 'umurtqa',
    title: 'Umurtqa (Spine)',
    type: 'glb',
    glbSrc: '/model/umurtqa/umurtqa.glb',
    hasParts: true,
    thumb: '/model/_thumbnails/umurtqa.jpg',
  },
  {
    id: 'right_arm',
    title: 'O‘ng qo‘l skeleti',
    type: 'glb',
    glbSrc: '/model/right_arm/right_arm.glb',
    hasParts: true,
    thumb: '/model/_thumbnails/right_arm.jpg',
  },
  {
    id: 'sacrum',
    title: 'Sakrum (dumg‘aza)',
    type: 'glb',
    glbSrc: '/model/sacrum/sacrum.glb',
    hasParts: true,
    thumb: '/model/_thumbnails/sacrum.jpg',
  },
  {
    id: 'atlas',
    title: 'Atlas (1-bo‘yin umurtqasi)',
    type: 'glb',
    glbSrc: '/model/atlas/atlas.glb',
    hasParts: true,
    thumb: '/model/_thumbnails/atlas.jpg',
  },
  // ...yana qolgan 16 ta lokal GLB shu guruhda davom etadi
];

// --- 2) Internal organs group ---
const GROUP_INTERNAL: OrganEntry[] = [
  {
    id: 'heart_sf',
    title: 'Yurak (Sketchfab)',
    type: 'sketchfab',
    thumb: '/model/_thumbnails/heart_sf.jpg',
    sketchfab: {
      uid: 'fb4587697ef048d5b4e1bf4f76f25f8c', // <-- faqat ID
      autospin: true,
      autostart: true,
      transparent: true,
      uiTheme: 'dark',
      author: 'Terrie Simmons-Ehrhardt',
      authorUrl: 'https://sketchfab.com/terrielsimmons',
      modelUrl:
        'https://sketchfab.com/3d-models/human-skeleton-table-to-anatomical-fb4587697ef048d5b4e1bf4f76f25f8c',
      license: 'CC-BY',
    },
    meta: {
      source: 'sketchfab',
    },
  },
  {
    id: 'kidney_remote',
    title: 'Buyrak (remote glTF)',
    type: 'gltf-remote',
    glbSrc: 'https://cdn.example.com/models/kidney.glb',
    hasParts: false,
    thumb: '/model/_thumbnails/kidney.jpg',
  },
  {
    id: 'pelvis_ar',
    title: 'Oyoq-son halqasi (Pelvis, AR)',
    type: 'usdz',
    glbSrc: '/model/pelvis/pelvis.glb', // Android/WebXR uchun
    usdzSrc: '/model/pelvis/pelvis.usdz',
    ar: {
      iosUSDZ: '/model/pelvis/pelvis.usdz',
      androidWebXR: true,
    },
    thumb: '/model/_thumbnails/pelvis.jpg',
  },
  {
    id: 'larynx_video',
    title: 'Hiqildoq (video)',
    type: 'video',
    videoSrc: '/assets/videos/larynx.mp4',
    thumb: '/assets/videos/larynx.jpg',
  },
  // ...
];

// --- 3) Boshqa guruhlar (tomirlar, miya qismlari, nervlar va hok) ---
// const GROUP_VESSELS: OrganEntry[] = [ ... ];
// const GROUP_NERVOUS: OrganEntry[] = [ ... ];
// const GROUP_MISC: OrganEntry[] = [ ... ];

// --- Export qism ---
// katta massivga flatten qilamiz, Lab.jsx faqat shu massivni ko‘radi.
export const ORGANS: OrganEntry[] = [
  ...GROUP_SKELETAL,
  ...GROUP_INTERNAL,
  // ...GROUP_VESSELS,
  // ...GROUP_NERVOUS,
  // ...GROUP_MISC,
];

// Helper
export const findOrgan = (id: string): OrganEntry | undefined =>
  ORGANS.find((o) => o.id === id);
