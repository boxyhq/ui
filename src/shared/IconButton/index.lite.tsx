import { Show } from '@builder.io/mitosis';
import styles from './index.module.css';
import PencilIcon from '../icons/PencilIcon.lite';
import CopytoClipboardIcon from '../icons/CopytoClipboardIcon.lite';
import EyeIcon from '../icons/EyeIcon.lite';
import EyeSlashIcon from '../icons/EyeSlashIcon.lite';
import InfoIcon from '../icons/InfoIcon.lite';
import LinkIcon from '../icons/LinkIcon.lite';
import PlusIcon from '../icons/PlusIcon.lite';
import CheckMarkIcon from '../icons/CheckMarkIcon.lite';
import { IconButtonProps } from '../types';

export default function IconButton(props: IconButtonProps) {
  // TODO: bring tooltip
  return (
    <button
      type='button'
      onClick={(event) => props.handleClick(event)}
      class={styles.btn}
      aria-label={props.label}>
      <Show when={props.icon === 'PencilIcon'}>
        <PencilIcon svgAttrs={{ 'aria-hidden': true, class: styles['svg'] }} />
      </Show>
      <Show when={props.icon === 'CopytoClipboardIcon'}>
        <CopytoClipboardIcon svgAttrs={{ 'aria-hidden': true, class: styles['svg'] }} />
      </Show>
      <Show when={props.icon === 'EyeIcon'}>
        <EyeIcon svgAttrs={{ 'aria-hidden': true, class: styles['svg'] }} />
      </Show>
      <Show when={props.icon === 'EyeSlashIcon'}>
        <EyeSlashIcon svgAttrs={{ 'aria-hidden': true, class: styles['svg'] }} />
      </Show>
      <Show when={props.icon === 'InfoIcon'}>
        <InfoIcon svgAttrs={{ 'aria-hidden': true, class: styles['svg'] }} />
      </Show>
      <Show when={props.icon === 'LinkIcon'}>
        <LinkIcon svgAttrs={{ 'aria-hidden': true, class: styles['svg'] }} />
      </Show>
      <Show when={props.icon === 'PlusIcon'}>
        <PlusIcon svgAttrs={{ 'aria-hidden': true, class: styles['svg'] }} />
      </Show>
      <Show when={props.icon === 'CheckMarkIcon'}>
        <CheckMarkIcon svgAttrs={{ 'aria-hidden': true, class: styles['svg'] }} />
      </Show>
    </button>
  );
}
