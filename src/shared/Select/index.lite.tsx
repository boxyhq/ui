import { For, Fragment, useStore } from '@builder.io/mitosis';
import styles from './index.module.css';
import Spacer from '../Spacer/index.lite';
import cssClassAssembler from '../../sso/utils/cssClassAssembler';

interface SelectProps {
  label: string;
  id?: string;
  name: string;
  options: Array<{ value: string; text: string }>;
  classNames?: { select?: string; label?: string };
  disabled?: boolean;
  selectedValue: string;
  handleChange: (event: any) => void;
}
export default function Select(props: SelectProps) {
  const state = useStore({
    get id() {
      return props.id ? props.id : props.label.replace(/ /g, '');
    },
    get cssClass() {
      return {
        div: styles.div + (props.disabled ? ` ${styles['div--disabled']}` : ''),
        select: cssClassAssembler(props.classNames?.select, styles.select),
        label: cssClassAssembler(props.classNames?.label, styles.label),
      };
    },
  });

  return (
    <Fragment>
      <label htmlFor={state.id} class={state.cssClass.label}>
        {props.label}
      </label>
      <Spacer y={2} />
      <div class={state.cssClass.div}>
        <select
          id={state.id}
          name={props.name}
          class={state.cssClass.select}
          disabled={props.disabled ?? false}
          value={props.selectedValue}
          onChange={(event) => props.handleChange(event)}>
          <For each={props.options}>
            {(optionItem) => (
              <option value={optionItem.value} key={optionItem.value}>
                {optionItem.text}
              </option>
            )}
          </For>
        </select>
        <span></span>
      </div>
    </Fragment>
  );
}
