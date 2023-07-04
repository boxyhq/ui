import { ButtonBase, type ButtonBaseProps } from './ButtonBase';

export const ButtonPrimary = ({ children }: ButtonBaseProps) => {
  return <ButtonBase color='primary'>{children}</ButtonBase>;
};
