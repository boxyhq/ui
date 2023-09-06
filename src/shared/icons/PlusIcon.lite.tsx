import { useStore } from '@builder.io/mitosis';
import type { SVGProps } from '../types';

export default function PlusIcon(props: SVGProps) {
  const state = useStore({
    get svgAttrs() {
      return props;
    },
  });
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke-width='1.5'
      stroke='currentColor'
      class='w-6 h-6'
      {...state.svgAttrs}>
      <path stroke-linecap='round' stroke-linejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
    </svg>
  );
}
