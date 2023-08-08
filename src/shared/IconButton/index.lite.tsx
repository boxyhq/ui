import type { IconButtonProps } from '../types';
import commonStyles from '../common.module.css';
import { Slot } from '@builder.io/mitosis';

export default function IconButton(props: IconButtonProps) {
  // TODO: bring tooltip
  return (
    <button
      type='button'
      onClick={(event) => props.onClick(event)}
      class={commonStyles.btnReset}
      aria-label={props.label}>
      <Slot name='icon' />
    </button>
  );
}
