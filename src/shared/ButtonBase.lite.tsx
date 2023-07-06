export interface ButtonBaseProps {
  Icon?: any;
  loading?: any;
  children?: any;
  buttonName?: string;
  color?: string;
}

export default function ButtonBase({ Icon, children, color, buttonName }: ButtonBaseProps) {
  return (
    <button className={`btn h-4 w-4 ${children ? 'mr-1' : ''} ${color}`}>
      {Icon}
      {buttonName}
      {children}
    </button>
  );
}
