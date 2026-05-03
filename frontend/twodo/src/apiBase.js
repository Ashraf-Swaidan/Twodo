// Not a secret — every API call exposes this origin. Change here if your Render URL changes.
const PRODUCTION_API_ORIGIN = 'https://twodo-6i5i.onrender.com';

const fromEnv = import.meta.env.VITE_BASE_API_URL?.trim();

export const BASE_API_URL =
  fromEnv ||
  (import.meta.env.DEV ? 'http://localhost:5000' : PRODUCTION_API_ORIGIN);

/** Origin + `/api` — Express mounts routes under `/api/...` */
export const API_ROOT = `${BASE_API_URL.replace(/\/$/, '')}/api`;
