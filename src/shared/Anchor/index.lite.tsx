import { useStore } from '@builder.io/mitosis';
import { LinkProps } from '../types';
import styles from './index.module.css';

export default function Anchor(props: LinkProps) {
  const state = useStore({
    get className() {
      return styles.a +
        (props.variant ? ` ${styles[props.variant]}` : '') +
        (props.cssClass ? ` ${props.cssClass}` : '')
    }
  });

  return (
    <a href={props.href} target='_blank' class={state.className}>
      {props.linkText}
    </a >
  );
}
