import { For, Fragment, Show, useStore } from '@builder.io/mitosis';
import Badge from '../Badge/index.lite';
import type { TableCellProps, TableCol, TableProps } from '../types';
import IconButton from '../IconButton/index.lite';

export default function TableCell(props: TableCellProps) {
  const state = useStore({
    actionClick(action: TableProps['actions'][number], item: TableProps['data'][number]) {
      return () => action.handleClick(item);
    },
    get cellValue() {
      const _col = props.col;
      let value = '-';
      if (state.isStringColumn) {
        value = props.rowData[_col as string];
      } else if (state.isAdvancedColumnType) {
        value = props.rowData[(_col as TableCol).name];
      }
      return value;
    },
    get isStringColumn() {
      return typeof props.col === 'string';
    },
    get isAdvancedColumnType() {
      return typeof props.col === 'object' && 'name' in props.col;
    },
    get isActionsColumn() {
      return props.col === 'actions' || (typeof props.col === 'object' && props.col.name === 'actions');
    },
    get displayBadge() {
      const _col = props.col as TableCol;
      if (typeof _col.badge?.shouldDisplayBadge === 'function') {
        return _col.badge.shouldDisplayBadge(props.rowData);
      }
      return !!(_col.badge?.position || _col.badge?.badgeText);
    },
    get badgePosition() {
      const _col = props.col as TableCol;
      return _col.badge?.position;
    },
    get badgeText() {
      const _col = props.col as TableCol;
      return _col.badge?.badgeText || props.rowData[_col.name];
    },
    get badgeLabel() {
      const _col = props.col as TableCol;
      return _col.badge?.ariaLabel;
    },
    get badgeVariant() {
      const _col = props.col as TableCol;
      if (typeof _col.badge?.variantSelector === 'function') {
        return _col.badge.variantSelector(props.rowData);
      }
      return _col.badge?.variant;
    },
  });

  return (
    <Fragment>
      <Show when={state.isActionsColumn}>
        <For each={props.actions}>
          {(action, index) => (
            <span class={props.classNames?.iconSpan} key={index}>
              <IconButton
                label={action.label}
                handleClick={state.actionClick(action, props.rowData)}
                icon={action.icon}></IconButton>
            </span>
          )}
        </For>
      </Show>
      <Show when={state.isStringColumn}>{state.cellValue}</Show>
      <Show when={state.isAdvancedColumnType}>
        <Show
          when={!state.displayBadge}
          else={
            <Fragment>
              <Show when={state.badgePosition === 'surround'}>
                <Badge
                  badgeText={state.badgeText}
                  ariaLabel={state.badgeLabel}
                  variant={state.badgeVariant}></Badge>
              </Show>
              <Show when={state.badgePosition === 'left'}>
                <Fragment>
                  <Badge
                    badgeText={state.badgeText}
                    ariaLabel={state.badgeLabel}
                    variant={state.badgeVariant}></Badge>
                  {state.cellValue}
                </Fragment>
              </Show>
              <Show when={state.badgePosition === 'right'}>
                <Fragment>
                  {state.cellValue}
                  <Badge
                    badgeText={state.badgeText}
                    ariaLabel={state.badgeLabel}
                    variant={state.badgeVariant}></Badge>
                </Fragment>
              </Show>
            </Fragment>
          }>
          {state.cellValue}
        </Show>
      </Show>
    </Fragment>
  );
}
