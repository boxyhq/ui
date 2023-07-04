import { ButtonBase, type ButtonBaseProps } from './ButtonBase.lite';

export default function ButtonPrimary({ children }: ButtonBaseProps) {
  return <ButtonBase color='primary'>{children}</ButtonBase>;
}
