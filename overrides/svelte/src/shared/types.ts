import type { SvelteComponent } from 'svelte';

export type SVGProps = SVGSVGElement;

export interface IconButtonProps {
  Icon: SvelteComponent<{ svgElmtProps: SVGProps; className: string }>;
  label?: string;
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
