import type { SVGAttributes, JSX } from 'react';

export type SVGProps = SVGAttributes<SVGSVGElement>;

export interface IconButtonProps {
  Icon: (props: { svgElmtProps: SVGProps }) => JSX.Element;
  label: string;
  onClick: (event: any) => void;
  iconClasses: string;
}
