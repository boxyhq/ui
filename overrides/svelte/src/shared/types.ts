import type { ComponentType, SvelteComponent } from 'svelte';

export type SVGProps = SVGSVGElement;

export interface IconButtonProps {
  Icon: ComponentType<SvelteComponent<{ svgElmtProps: SVGProps; classNames: string }>>;
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
