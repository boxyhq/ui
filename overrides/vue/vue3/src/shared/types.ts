import type { SVGAttributes, Component } from 'vue';

export type SVGProps = SVGAttributes;

export interface IconButtonProps {
  Icon: Component<{ svgElmtProps: SVGProps }>;
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

export interface BadgeProps {
  children?: any;
  className?: string;
  color?: string;
  size?: string;
  ariaLabel?: string;
}
