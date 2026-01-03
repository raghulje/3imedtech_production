/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_ADMIN_API_URL?: string; // Optional, falls back to VITE_API_URL
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
