import { SVGProps } from '../types';

export default function XMarkIcon(props: { svgAttrs?: SVGProps }) {
  return (
    <svg fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' {...props.svgAttrs}>
      <path stroke-linecap='round' stroke-linejoin='round' d='M6 18 18 6M6 6l12 12' />
    </svg>
  );
}
