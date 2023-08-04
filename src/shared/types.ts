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

export interface ButtonBaseProps {
  children?: any;
  color?: string;
  iconClasses?: string;
  label?: string;
  onClick: (event: any) => void;
}

export interface ButtonProps {
  children?: string;
  label?: string;
  onClick: () => void;
}

export interface SecretInputFormControlProps {
  label: string;
  value: string;
  isHiddenClassName?: string;
  id: string;
  placeholder?: string;
  required: boolean;
  maxLength?: string;
  readOnly: boolean;
  successCallback: () => void;
  cb: (event: Event) => void;
}
