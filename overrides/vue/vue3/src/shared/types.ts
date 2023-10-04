import type { SVGAttributes } from 'vue';

export type SVGProps = SVGAttributes;

export interface IconButtonProps {
  label?: string;
  handleClick: (event: any) => void;
  icon:
    | 'PencilIcon'
    | 'CopytoClipboardIcon'
    | 'EyeIcon'
    | 'EyeSlashIcon'
    | 'InfoIcon'
    | 'LinkIcon'
    | 'PlusIcon'
    | 'CheckMarkIcon';
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
  buttonRef?: any;
  name: string;
  handleClick?: (event: any) => void;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
  classNames?: string;
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

export interface TableProps {
  cols: string[];
  data: Record<string, any>[];
  actions: { icon: IconButtonProps['icon']; handleClick: (item: any) => void; label?: string }[];
  tableCaption?: string;
  classNames?: {
    table?: string;
    caption?: string;
    thead?: string;
    tr?: string;
    th?: string;
    td?: string;
    icon?: string;
    iconSpan?: string;
  };
}

export interface ConfirmationPromptProps {
  buttonNames?: { ctoa?: string; cancel?: string };
  classNames?: { button?: { ctoa?: string; cancel?: string } };
  ctoaVariant: ButtonProps['variant'];
  promptMessage: string;
  confirmationCallback: (event: Event) => void;
  cancelCallback: (event: Event) => void;
}
