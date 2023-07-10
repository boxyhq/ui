import type { JSX } from '@builder.io/mitosis/jsx-runtime';

export type SVGProps = JSX.SvgSVGAttributes<SVGSVGElement>;

export interface IconButtonProps {
  Icon: (props: { svgElmtProps: SVGProps }) => JSX.Element;
  label: string;
  onClick: (event: any) => void;
  iconClasses: string;
}

export interface EmptyStateProps {
  title: string;
  href?: string;
  className?: string;
  description?: string;
  slotLinkPrimary?: any;
}
