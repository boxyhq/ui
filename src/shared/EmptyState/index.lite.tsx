import { Show, useStore } from '@builder.io/mitosis';
import type { EmptyStateProps } from '../types';
import defaultStyles from './index.module.css';
import ExclamationTriangle from '../icons/ExclamationTriangle.lite';
import InfoIcon from '../icons/InfoIcon.lite';

export default function EmptyState(props: EmptyStateProps) {
  const state = useStore({
    get classes() {
      return {
        container: defaultStyles.container + (props.className ? ` ${props.className}` : ''),
      };
    },
    get variantValue() {
      return props.variant || 'info';
    },
  });

  return (
    <div class={state.classes.container}>
      <Show
        when={state.variantValue === 'info'}
        else={<ExclamationTriangle svgAttrs={{ class: defaultStyles.svg }} />}>
        <InfoIcon svgAttrs={{ class: defaultStyles.svg }} />
      </Show>
      <h4>{props.title}</h4>
      {props.description && <p class={defaultStyles.description}>{props.description}</p>}
      {/* TODO: Add slot for LinkPrimary */}
    </div>
  );
}
