declare module 'swiper/react' {
  import { SwiperOptions } from 'swiper/types';
  import React from 'react';

  export interface SwiperProps extends SwiperOptions {
    children?: React.ReactNode;
    ref?: React.RefObject<any>;
  }

  export const Swiper: React.ForwardRefExoticComponent<SwiperProps & React.RefAttributes<any>>;
  export const SwiperSlide: React.FC<{ children?: React.ReactNode }>;
  export type SwiperRef = any;
} 