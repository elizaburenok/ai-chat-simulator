/// <reference types="vite/client" />

import type { SVGProps, HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      svg: SVGProps<SVGSVGElement>;
      path: SVGProps<SVGPathElement>;
      div: HTMLAttributes<HTMLDivElement>;
      h1: HTMLAttributes<HTMLHeadingElement>;
    }
  }
}

export {};
