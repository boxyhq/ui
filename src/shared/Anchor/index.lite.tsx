import { useStore } from '@builder.io/mitosis';
import { LinkProps } from '../types';
import styles from './index.module.css';

export default function Anchor(props: LinkProps) {
  const state = useStore({
    variantCss: props.variant ? ' ' + styles[props.variant] : '',
  });

  return (
    <a href={props.href} target='_blank' class={`${styles.a}${state.variantCss}`}>
      {props.linkText}
    </a>
  );
}
