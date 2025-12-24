/// <reference types="vite/client" />

declare module "*.png" {
  // Changing 'content' to 'src' to avoid conflict with client.d.ts
  const src: string;
  export default src;
}

declare module "*.jpg";
declare module "*.svg";