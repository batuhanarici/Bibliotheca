import { Api } from '../../electron/preload';

declare global {
  interface Window {
    api: Api;
  }
}

declare module '*?url' {
  const src: string;
  export default src;
}
