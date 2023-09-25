import { TableProps } from '../types';
import { For, Show, useStore } from '@builder.io/mitosis';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../sso/utils/cssClassAssembler';
import IconButton from '../IconButton/index.lite';

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
        icon: cssClassAssembler(props.classNames?.icon, defaultClasses.icon),
        iconSpan: cssClassAssembler(props.classNames?.iconSpan, defaultClasses.iconSpan),
      };
    },
    actionClick(action: TableProps["actions"][number], item: TableProps["data"][number]) {
      return () => action.handleClick(item)
    }

  });

  return (
    <table class={state.classes.table}>
      <Show when={props.tableCaption}>
        <caption class={state.classes.caption}>{props.tableCaption}</caption>
      </Show>
      <thead class={state.classes.thead}>
        <tr class={state.classes.tr}>
          <For each={props.cols}>
            {(item) => (
              <th key={item} scope='col' class={state.classes.th}>
                {item}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={props.data}>
          {(item: TableProps["data"][number]) => (
            <tr class={state.classes.tr}>
              <For each={props.cols}>
                {(col) => (
                  <td class={state.classes.td}>
                    <Show when={col !== 'actions'}
                      else={
                        <For each={props.actions}>
                          {(action) => (
                            <span class={state.classes.iconSpan}>
                              <IconButton
                                label={action.label}
                                handleClick={state.actionClick(action, item)}
                                icon={action.icon}
                              ></IconButton>
                            </span>
                          )}</For>}>
                      {item[col]}
                    </Show>
                  </td>)}
              </For>
            </tr>)
          }
        </For >
      </tbody >
    </table >
  );
}
