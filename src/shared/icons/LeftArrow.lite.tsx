import { SVGProps } from '../types';

export default function LeftArrowIcon(props: { svgAttrs?: SVGProps }) {
  return (
    <svg fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' {...props.svgAttrs}>
      <path stroke-linecap='round' stroke-linejoin='round' d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'></path>
    </svg>
  );
}
