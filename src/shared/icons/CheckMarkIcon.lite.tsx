import { useStore } from '@builder.io/mitosis';
import { SVGProps } from '../types';

export default function CheckMarkIcon(props: SVGProps) {
  const state = useStore({
    id: Math.random().toString(36).substring(2, 8),
    get svgAttrs() {
      return props;
    },
  });

  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' {...state.svgAttrs}>
      <g clip-path={`url(#clip${state.id})}`}>
        <path
          d='M10 1.25C5.16751 1.25 1.25 5.16751 1.25 10C1.25 14.8325 5.16751 18.75 10 18.75C14.8325 18.75 18.75 14.8325 18.75 10C18.75 7.67936 17.8281 5.45376 16.1872 3.81282C14.5462 2.17187 12.3206 1.25 10 1.25ZM8.75 13.4943L5.625 10.3693L6.61912 9.375L8.75 11.5057L13.3813 6.875L14.3786 7.86619L8.75 13.4943Z'
          fill='#24A148'
        />
      </g>
      <defs>
        <clipPath id={`clip${state.id}`}>
          <rect width='20' height='20' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}
