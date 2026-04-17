// @ts-ignore - GLB imports require a declaration file for TypeScript
import iphone11 from '~/assets/iphone-11.glb';
// @ts-ignore
import macbookPro from '~/assets/macbook-pro.glb';

export const ModelAnimationType = {
  SpringUp: 'spring-up',
  LaptopOpen: 'laptop-open',
} as const;

// Define the type for animation values
export type AnimationType = (typeof ModelAnimationType)[keyof typeof ModelAnimationType];

export interface DeviceModel {
  url: string;
  width: number;
  height: number;
  position: { x: number; y: number; z: number };
  animation: AnimationType;
}

export const deviceModels: Record<'phone' | 'laptop', DeviceModel> = {
  phone: {
    url: iphone11,
    width: 374,
    height: 512,
    position: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.SpringUp,
  },
  laptop: {
    url: macbookPro,
    width: 1280,
    height: 800,
    position: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.LaptopOpen,
  },
};