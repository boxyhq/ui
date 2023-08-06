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

export interface SecretInputFormControlProps {
  label: string;
  value: string;
  id: string;
  placeholder?: string;
  required: boolean;
  maxLength?: string;
  readOnly: boolean;
  successCallback: () => void;
  cb: (event: Event) => void;
}

export interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (event: Event) => void;
}
