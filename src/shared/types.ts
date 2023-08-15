import type { JSX } from '@builder.io/mitosis/jsx-runtime';

export type SVGProps = JSX.SvgSVGAttributes<SVGSVGElement>;

export interface IconButtonProps {
  Icon: (props: { svgElmtProps: SVGProps; classNames: string }) => JSX.Element;
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

export interface ModalProps {
  visible: boolean;
  title: string;
  description?: string;
  children?: any;
}

export interface ButtonProps {
  name: string;
  onClick?: (event: any) => void;
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
  onCopyCallback: () => void;
  handleChange: (event: Event) => void;
}

export interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (event: Event) => void;
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
  variant?: 'primary' | 'button';
}

export interface LoadingContainerProps {
  children?: any;
  isBusy: boolean;
}
