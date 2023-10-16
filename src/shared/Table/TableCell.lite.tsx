import { For, Fragment, Show, useStore } from '@builder.io/mitosis';
import Badge from '../Badge/index.lite';
import { TableCol, TableProps } from '../types';
import IconButton from '../IconButton/index.lite';

interface TableCellProps {
  col: TableProps['cols'][number];
  rowData: TableProps['data'][number];
  actions: TableProps['actions'];
  classNames: TableProps['classNames'];
}

export default function TableCell(props: TableCellProps) {
  const state = useStore({
    actionClick(action: TableProps['actions'][number], item: TableProps['data'][number]) {
      return () => action.handleClick(item);
    },
    get cellValue() {
      const _col = props.col;
      if (this.isStringColumn) {
        return props.rowData[_col as string];
      } else if (this.isAdvancedColumnType) {
        return props.rowData[(_col as TableCol).name];
      }
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
      return _col.badge?.variant;
    },
  });

  return (
    <Fragment>
      <Show when={state.isActionsColumn}>
        <For each={props.actions}>
          {(action) => (
            <span class={props.classNames?.iconSpan}>
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
        <Show when={!state.displayBadge}>{state.cellValue}</Show>
        <Show when={state.badgePosition === 'surround' || state.displayBadge}>
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
      </Show>
    </Fragment>
  );
}
