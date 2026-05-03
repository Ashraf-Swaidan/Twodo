const fromEnv = import.meta.env.VITE_BASE_API_URL?.trim();

export const BASE_API_URL =
  fromEnv || (import.meta.env.DEV ? 'http://localhost:5000' : '');

if (!BASE_API_URL) {
  throw new Error(
    'Missing VITE_BASE_API_URL. Set it in frontend/twodo/.env before building (e.g. https://your-api.example.com).'
  );
}

/** Origin + `/api` — Express mounts routes under `/api/...` */
export const API_ROOT = `${BASE_API_URL.replace(/\/$/, '')}/api`;
