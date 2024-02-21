import { SVGProps } from '../types';

export default function RightArrowIcon(props: { svgAttrs?: SVGProps }) {
  return (
    <svg fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' {...props.svgAttrs}>
      <path stroke-linecap='round' stroke-linejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'></path>
    </svg>
  );
}
