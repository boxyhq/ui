import { classNames } from '../sso/connections/types';
import { Button, type ButtonProps } from 'daisyui';

export interface ButtonBaseProps extends ButtonProps {
  Icon?: any;
  loading?: any;
  children?: any;
  color?: string;
}

export default function ButtonBase({ Icon, children, color }: ButtonBaseProps) {
  return (
    <Button>
      {Icon && <Icon className={classNames('h-4 w-4', children ? 'mr-1' : '')} aria-hidden />}
      {children}
    </Button>
  );
}
