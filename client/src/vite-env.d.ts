/// <reference types="vite/client" />

// Declares the env vars this app expects on import.meta.env, so a typo like
// import.meta.env.VITE_API_ULR is a compile error instead of `undefined`.
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
