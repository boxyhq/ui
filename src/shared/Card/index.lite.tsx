import { Show, useStore } from '@builder.io/mitosis';
import { CardProps } from '../types';
import styles from './index.module.css';
import CheckMarkIcon from '../icons/CheckMarkIcon.lite';
import InfoIcon from '../icons/InfoIcon.lite';

export default function Card(props: CardProps) {
  const state = useStore({
    get variantCss() {
      return props.variant ? ' ' + styles[props.variant] : '';
    },
    get flexCss() {
      return props.arrangement === 'vertical' ? ' ' + styles['vertical'] : '';
    },
    get shouldDisplayIcon() {
      return typeof props.displayIcon === 'boolean' ? props.displayIcon : true;
    },
  });

  return (
    <article class={`${styles.container}${state.variantCss}${state.flexCss}`}>
      <Show when={props.title}>
        <h3 class={styles.title}>
          <Show when={state.shouldDisplayIcon}>
            <Show when={props.variant === 'success'}>
              <CheckMarkIcon svgAttrs={{ class: styles.svg }} />
            </Show>
            <Show when={props.variant === 'info'}>
              <InfoIcon svgAttrs={{ class: styles.svg }} />
            </Show>
          </Show>
          {props.title}
        </h3>
      </Show>
      <div class={styles.body}>{props.children}</div>
    </article>
  );
}
