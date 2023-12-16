import { useStore } from '@builder.io/mitosis';
import type { BadgeProps } from '../types';
import styles from './index.module.css';

export default function Badge(props: BadgeProps) {
  const state = useStore({
    get variantCss() {
      return ' ' + (props.variant ? styles[props.variant] : styles.info);
    },
  });

  return (
    <span class={`${styles.badge}${state.variantCss}`} aria-label={props.ariaLabel || props.badgeText}>
      {props.badgeText}
    </span>
  );
}
