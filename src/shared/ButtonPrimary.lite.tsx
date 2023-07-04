import { ButtonBaseProps } from './ButtonBase.lite';
import ButtonBase from './ButtonBase.lite';

export default function ButtonPrimary({ children }: ButtonBaseProps) {
  return <ButtonBase color='primary'>{children}</ButtonBase>;
}
