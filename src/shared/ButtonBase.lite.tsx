import { useStore } from '@builder.io/mitosis';

export interface ButtonBaseProps {
  Icon?: any;
  loading?: any;
  children?: any;
  buttonName?: string;
  color?: string;
}

export default function ButtonBase({ Icon, children, color, buttonName }: ButtonBaseProps) {
  const state = useStore({
    get classNames() {
      return `btn h-4 w-4 ${children ? 'mr-1' : ''} ${color}`;
    },
  });

  return (
    <button className={state.classNames}>
      {Icon}
      {buttonName}
      {children}
    </button>
  );
}
