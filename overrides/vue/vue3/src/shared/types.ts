import type { SVGAttributes, ButtonHTMLAttributes } from 'vue';

export type SVGProps = SVGAttributes;

export interface IconButtonProps {
  classNames?: { button?: string };
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
  /** Decides which icon to show
   * @default info
   */
  variant?: 'error' | 'info';
}

export interface BadgeProps {
  badgeText: string;
  // badgeText will be the label if ariaLabel is not set
  ariaLabel?: string;
  variant?: 'success' | 'info' | 'warning';
}

export interface ModalProps {
  visible: boolean;
  title: string;
  description?: string;
  children?: any;
}

export type ButtonProps = {
  buttonRef?: any;
  name: string;
  type?: 'submit' | 'reset' | 'button';
  handleClick?: (event: any) => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
  classNames?: string;
  isLoading?: boolean;
} & ButtonHTMLAttributes;

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
// Used for advanced customisation of Table column cells such as displaying a badge
export interface TableCol {
  name: string;
  badge?: {
    position?: 'left' | 'right' | 'surround';
    variantSelector?: (rowData: TableCellProps['rowData']) => BadgeProps['variant'];
    shouldDisplayBadge?: (rowData: TableCellProps['rowData']) => boolean;
  } & BadgeProps;
}

export interface TableCellProps {
  col: TableProps['cols'][number];
  rowData: TableProps['data'][number];
  actions: TableProps['actions'];
  classNames: TableProps['classNames'];
}

export interface TableProps {
  cols: (string | 'actions' | TableCol)[];
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

export interface PaginateProps {
  handlePreviousClick: (event: Event) => void;
  handleNextClick: (event: Event) => void;
  itemsPerPage: number;
}
