import type { SVGAttributes, JSX } from 'react';

export type SVGProps = SVGAttributes<SVGSVGElement>;

export interface IconButtonProps {
  Icon: (props: { svgElmtProps: SVGProps }) => JSX.Element;
  label?: string;
  onClick: (event: any) => void;
  iconClasses: string;
  tooltip?: string;
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

export interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  actionButtonText?: string;
  overrideDeleteButton?: boolean;
  dataTestId?: string;
  translation?: any;
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
  color?: string;
  onClick: () => void;
  dataTestId?: string;
  classNames?: string;
}

export interface ConnectionToggleProps {
  onChange: (active: boolean) => void;
  connection: {
    active: boolean;
    type: 'sso' | 'dsync';
  };
  translation?: any;
}
