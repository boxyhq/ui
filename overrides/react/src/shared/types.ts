import type { SVGAttributes, JSX } from 'react';

export type SVGProps = SVGAttributes<SVGSVGElement>;

export interface IconButtonProps {
  Icon: (props: { svgElmtProps: SVGProps; classNames: string }) => JSX.Element;
  label?: string;
  handleClick: (event: any) => void;
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
  badgeText: string;
  ariaLabel?: string;
  variant?: 'success' | 'info' | 'warning';
}

export interface ModalProps {
  visible: boolean;
  title: string;
  description?: string;
  children?: any;
}

export interface ButtonProps {
  name: string;
  handleClick?: (event: any) => void;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
}

export interface SecretInputFormControlProps {
  label: string;
  value: string;
  id: string;
  placeholder?: string;
  required: boolean;
  maxLength?: string;
  readOnly: boolean;
  copyDoneCallback: () => void;
  handleChange: (event: Event) => void;
}

export interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  handleChange: (event: Event) => void;
}

export interface CardProps {
  arrangement?: 'horizontal' | 'vertical';
  children?: any;
  title: string;
  variant: 'info' | 'success';
}

export interface LinkProps {
  href: string;
  linkText: string;
  cssClass?: string;
  variant?: 'primary' | 'button';
}

export interface LoadingContainerProps {
  children?: any;
  isBusy: boolean;
}
