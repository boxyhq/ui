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
        tableData: cssClassAssembler(props.classNames?.tableData, defaultClasses.tableHead),
        icon: cssClassAssembler(props.classNames?.icon, defaultClasses.icon),
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
      <tbody>
        <For each={props.data}>
          {(item: any) => (
            <tr class={defaultClasses.tableRow}>
              <For each={props.cols}>
                {(col) => (
                  <td class={state.classes.tableData}>
                    <Show
                      when={col !== 'actions'}
                      else={
                        <For each={item.actions}>
                          {(action: any, i: number) => (
                            <button key={i} type='button' onClick={() => action.handleClick()}>
                              <span class={state.classes.icon}>{action.icon}</span>
                              {action.children}
                            </button>
                          )}
                        </For>
                      }>
                      {item[col]}
                    </Show>
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}
