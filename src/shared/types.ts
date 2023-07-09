import type { JSX } from '@builder.io/mitosis/jsx-runtime';

export interface IconButtonProps {
  Icon: (props: JSX.SvgSVGAttributes<SVGSVGElement>) => JSX.Element;
  label: string;
  onClick: () => void;
  iconClasses: string;
}
