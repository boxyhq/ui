import { TableProps } from '../types';
import { For, Show, useStore } from '@builder.io/mitosis';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../sso/utils/cssClassAssembler';

export default function Table(props: TableProps) {
  const state = useStore({
    get classes() {
      return {
        table: cssClassAssembler(props.classNames?.table, defaultClasses.table),
        tableHead: cssClassAssembler(props.classNames?.tableHead, defaultClasses.tableHead),
      };
    },
  });

  return (
    <table class={state.classes.table}>
      <Show when={props.tableCaption}>
        <caption class={defaultClasses.caption}>{props.tableCaption}</caption>
      </Show>
      <thead class={defaultClasses.tableHeadContainer}>
        <tr>
          <For each={props.cols}>
            {(item) => (
              <th key={item} scope='col' class={state.classes.tableHead}>
                {item}
              </th>
            )}
          </For>
        </tr>
      </thead>
    </table>
  );
}
