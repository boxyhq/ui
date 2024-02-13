import type { TableProps } from '../types';
import { For, Show, useStore } from '@builder.io/mitosis';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../sso/utils/cssClassAssembler';
import TableCell from './TableCell.lite';

export default function Table(props: TableProps) {
  const state = useStore({
    get classes() {
      return {
        table: cssClassAssembler(props.classNames?.table, defaultClasses.table),
        caption: cssClassAssembler(props.classNames?.caption, defaultClasses.caption),
        thead: cssClassAssembler(props.classNames?.thead, defaultClasses.thead),
        tr: cssClassAssembler(props.classNames?.tr, defaultClasses.tr),
        th: cssClassAssembler(props.classNames?.th, defaultClasses.th),
        td: cssClassAssembler(props.classNames?.td, defaultClasses.td),
        iconSpan: cssClassAssembler(props.classNames?.iconSpan, defaultClasses.iconSpan),
      };
    },
    actionClick(action: TableProps['actions'][number], item: TableProps['data'][number]) {
      return () => action.handleClick(item);
    },
    columnName(col: TableProps['cols'][number]) {
      return typeof col === 'string' ? col : col.name;
    },
  });

  return (
    <table class={state.classes.table}>
      <Show when={props.tableCaption}>
        <caption class={state.classes.caption}>{props.tableCaption}</caption>
      </Show>
      <thead class={state.classes.thead}>
        <tr class={state.classes.tr}>
          <For each={props.cols}>
            {(col) => (
              <th key={state.columnName(col)} scope='col' class={state.classes.th}>
                {state.columnName(col)}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <Show when={props.noMoreResults}>
          <tr>
            <td colSpan={props.cols.length} class={defaultClasses.noMoreResults}>
              No more results found
            </td>
          </tr>
        </Show>
        <Show when={!props.noMoreResults}>
          <For each={props.data}>
            {(item, index) => (
              <tr class={state.classes.tr} key={index}>
                <For each={props.cols}>
                  {(col, index) => (
                    <td class={state.classes.td} key={index}>
                      <TableCell
                        col={col}
                        rowData={item}
                        actions={props.actions}
                        classNames={state.classes}
                      />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </Show>
      </tbody>
    </table>
  );
}
