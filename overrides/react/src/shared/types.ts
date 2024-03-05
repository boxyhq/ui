import type {
  SVGAttributes,
  ComponentPropsWithRef,
  ReactElement,
  ReactNode,
  ButtonHTMLAttributes,
} from 'react';

export type SVGProps = SVGAttributes<SVGSVGElement>;

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

export interface ButtonProps
  extends ComponentPropsWithRef<'button'>,
    ButtonHTMLAttributes<HTMLButtonElement> {
  buttonRef?: HTMLButtonElement;
  name: string;
  type?: 'submit' | 'reset' | 'button';
  handleClick?: (event: any) => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
  classNames?: string;
  isLoading?: boolean;
  icon?: 'LeftArrowIcon' | 'RightArrowIcon';
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
  displayIcon?: boolean;
  variant: 'info' | 'success';
}

export interface LinkProps {
  href: string;
  linkText: string;
  cssClass?: string;
  variant?: 'primary' | 'button';
}

export interface RadioGroupProps {
  label: string;
  children: ReactElement<RadioProps> | ReactElement<RadioProps>[];
  /** The arrangement of radio buttons
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
}

export interface RadioProps {
  name: string;
  checked: boolean;
  handleInputChange: (e: any) => void;
  /**
   * The value of the radio button, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string;
  /**
   * The label for the radio.
   */
  children: ReactNode;
  /**
   * Displays the radio button but can be disabled for selection.
   */
  isDisabled?: boolean;
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
  noMoreResults?: boolean;
}

export interface ConfirmationPromptProps {
  buttonNames?: { ctoa?: string; cancel?: string };
  classNames?: { button?: { ctoa?: string; cancel?: string } };
  ctoaVariant: ButtonProps['variant'];
  promptMessage: string;
  confirmationCallback: (event: Event) => void;
  cancelCallback: (event: Event) => void;
}

export type PageToken = string | null;

export type PaginatePayload = { offset: number; limit: number; pageToken?: PageToken };

export interface PaginateProps {
  handlePageChange?: (payload: Partial<PaginatePayload>) => void;
  reFetch: (payload: PaginatePayload) => any;
  pageTokenMap: Record<number, PageToken>;
  itemsPerPage: number;
  currentPageItemsCount: number;
  children?: any;
}
