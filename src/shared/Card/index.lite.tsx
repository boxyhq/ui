import { Show, useStore } from '@builder.io/mitosis';
import { CardProps } from '../types';
import styles from './index.module.css';
import CheckMarkIcon from '../icons/CheckMarkIcon.lite';
import InfoIcon from '../icons/InfoIcon.lite';

export default function Card(props: CardProps) {
  const state = useStore({
    variantCss: props.variant ? ' ' + styles[props.variant] : '',
  });

  return (
    <article class={`${styles.container}${state.variantCss}`}>
      <h3 class={styles.title}>
        <Show when={props.variant === 'success'}>
          <CheckMarkIcon />
        </Show>
        <Show when={props.variant === 'info'}>
          <InfoIcon />
        </Show>
        {props.title}
      </h3>
      <div class={styles.body}>{props.children}</div>
    </article>
  );
}
