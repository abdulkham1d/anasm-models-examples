// src/data/partNames.js
// Per-model Uzbek name mappings built from actual GLB mesh analysis.
// Three.js child.name values are used as keys (case-sensitive exact match first).

// ===== SKELETON (full_bones.glb) — 5 meshes =====
// Node names from the GLB: "Frontal bone", "Incus.l", "Lower canine.l",
// "Lower first molar tooth.l", "Anterior cells of ethmoid bone.l"
// Multi-primitive meshes get _1 suffix in Three.js.

// ===== MUSCLES (male_full_body_ecorche.glb) — 16 meshes =====
// Node names: Object_3 .. Object_33 (odd numbers).
// Positions determined via gltf-transform Draco decode.

// ===== HUMAN BODY (human_body_-_male.glb) — 1 mesh =====
// Node name: "defaultMaterial" — entire body is one mesh.

const EXACT_NAMES = {
  // --- Skeleton ---
  "Frontal bone":                           "Peshona suyagi",
  "Incus.l":                                "Sandonsuyak (Quloq suyakchasi)",
  "Incus.l_1":                              "Sandonsuyak (Quloq suyakchasi)",
  "Lower canine.l":                         "Pastki qoziq tish",
  "Lower canine.l_1":                       "Pastki qoziq tish",
  "Lower first molar tooth.l":              "Pastki birinchi oziq tish",
  "Lower first molar tooth.l_1":            "Pastki birinchi oziq tish",
  "Anterior cells of ethmoid bone.l":       "G'alvirsimon suyak oldingi hujayralari",
  "Anterior cells of ethmoid bone.l_1":     "G'alvirsimon suyak oldingi hujayralari",

  // --- Muscles (mapped by bounding-box position analysis) ---
  "Object_3":   "Tana asosiy muskulari",
  "Object_5":   "Ko'krak muskulari",
  "Object_7":   "Bosh va bo'yin muskulari",
  "Object_9":   "Orqa yuqori muskulari",
  "Object_11":  "Tashqi muskul qatlami",
  "Object_13":  "Qorin muskulari",
  "Object_15":  "Umurtqa muskulari",
  "Object_17":  "Chanoq muskulari",
  "Object_19":  "Ichki tana muskulari",
  "Object_21":  "Bilak muskulari",
  "Object_23":  "Son muskulari",
  "Object_25":  "Oyoq muskulari",
  "Object_27":  "Bel muskulari",
  "Object_29":  "Tizza va boldir muskulari",
  "Object_31":  "Qo'l muskulari",
  "Object_33":  "Yelka muskulari",

  // --- Human body (single mesh) ---
  "defaultMaterial":  "Inson tanasi",
};

// Generic anatomical keyword mapping (fallback for unknown mesh names)
const KEYWORD_MAP = {
  skull: "Bosh suyagi",
  cranium: "Bosh suyagi",
  mandible: "Pastki jag' suyagi",
  maxilla: "Yuqori jag' suyagi",
  frontal: "Peshona suyagi",
  parietal: "Tepa suyagi",
  temporal: "Chakka suyagi",
  occipital: "Ensa suyagi",
  cervical: "Bo'yin umurtqalari",
  thoracic: "Ko'krak umurtqalari",
  lumbar: "Bel umurtqalari",
  sacrum: "Dumg'aza suyagi",
  coccyx: "Dum suyagi",
  spine: "Umurtqa pog'onasi",
  vertebra: "Umurtqa",
  sternum: "To'sh suyagi",
  clavicle: "O'mrov suyagi",
  scapula: "Kurak suyagi",
  humerus: "Yelka suyagi",
  radius: "Bilak suyagi",
  ulna: "Tirsak suyagi",
  pelvis: "Chanoq suyagi",
  femur: "Son suyagi",
  patella: "Tizza qopqog'i",
  tibia: "Katta boldir suyagi",
  fibula: "Kichik boldir suyagi",
  rib: "Qovurg'a",
  incus: "Sandonsuyak",
  malleus: "Bolg'asuyak",
  stapes: "Uzangisuyak",
  ethmoid: "G'alvirsimon suyak",
  sphenoid: "Ponasimon suyak",
  nasal: "Burun suyagi",
  lacrimal: "Ko'zyosh suyagi",
  zygomatic: "Yonoq suyagi",
  hyoid: "Til osti suyagi",
  canine: "Qoziq tish",
  molar: "Oziq tish",
  incisor: "Kesuvchi tish",
  premolar: "Kichik oziq tish",
  tooth: "Tish",
  teeth: "Tishlar",
  heart: "Yurak",
  lung: "O'pka",
  liver: "Jigar",
  kidney: "Buyrak",
  stomach: "Oshqozon",
  brain: "Miya",
  spleen: "Taloq",
  pancreas: "Oshqozon osti bezi",
  bladder: "Siydik pufagi",
  intestine: "Ichak",
  muscle: "Muskul",
  biceps: "Biseps muskuli",
  triceps: "Triseps muskuli",
  deltoid: "Delta muskuli",
  pectoral: "Ko'krak muskuli",
  trapezius: "Trapetsiya muskuli",
  gluteus: "Dumba muskuli",
  quadriceps: "To'rt boshli son muskuli",
  hamstring: "Son orqa muskuli",
  head: "Bosh",
  neck: "Bo'yin",
  chest: "Ko'krak",
  shoulder: "Yelka",
  arm: "Qo'l",
  hand: "Qo'l kaftasi",
  leg: "Oyoq",
  foot: "Oyoq panjasi",
  knee: "Tizza",
  hip: "Yonbosh",
  bone: "Suyak",
};

/**
 * Resolve a GLB mesh name to its Uzbek display name.
 *
 * Priority:
 *  1. Exact match in EXACT_NAMES (covers all known meshes from our models)
 *  2. Keyword match from KEYWORD_MAP
 *  3. Cleaned-up original name (no "Object_XX" or "Mesh_XX" shown)
 */
export function resolvePartName(meshName) {
  if (!meshName) return "Noma'lum qism";

  // 1. Exact match (handles Object_3, Frontal bone, defaultMaterial, etc.)
  if (EXACT_NAMES[meshName]) return EXACT_NAMES[meshName];

  // 2. Try without _N suffix (Three.js multi-primitive suffix)
  const baseName = meshName.replace(/_\d+$/, "");
  if (baseName !== meshName && EXACT_NAMES[baseName]) return EXACT_NAMES[baseName];

  // 3. Keyword matching for any other mesh names
  const lower = meshName.toLowerCase().replace(/[_.\-]+/g, " ").trim();
  for (const [key, label] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(key) && key.length >= 3) return label;
  }

  // 4. Check individual words
  const words = lower.split(/\s+/);
  for (const word of words) {
    if (word.length < 3) continue;
    if (KEYWORD_MAP[word]) return KEYWORD_MAP[word];
  }

  // 5. Hide technical names completely
  if (/^(Object|Mesh|Group|Scene|Node|Bone|Armature|default|material|Cylinder|Cube|Sphere|Plane|geometry|Icosphere)/i.test(meshName)) {
    return "Tana qismi";
  }

  // 6. Return cleaned version of original
  return meshName.replace(/[_.\-]/g, " ").trim();
}

export default EXACT_NAMES;
