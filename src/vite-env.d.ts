/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_API: string;
  readonly VITE_DASHBOARD_API: string; // Add more variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
