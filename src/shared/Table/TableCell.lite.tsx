import { For, Fragment, useStore } from '@builder.io/mitosis';
import Badge from '../Badge/index.lite';
import { TableProps } from '../types';
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
  });

  if (props.col === 'actions' || (typeof props.col === 'object' && props.col.name === 'actions')) {
    return (
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
    );
  }
  if (typeof props.col === 'string') {
    return props.rowData[props.col];
  }
  if (typeof props.col === 'object' && 'name' in props.col) {
    if (props.col.badge?.position === 'surround') {
      return (
        <Badge
          badgeText={props.col.badge.badgeText || props.rowData[props.col.name]}
          ariaLabel={props.col.badge.ariaLabel}
          variant={props.col.badge.variant}></Badge>
      );
    } else if (props.col.badge?.position === 'left') {
      <Fragment>
        <Badge
          badgeText={props.col.badge.badgeText}
          ariaLabel={props.col.badge.ariaLabel}
          variant={props.col.badge.variant}></Badge>
        {props.rowData[props.col.name]}
      </Fragment>;
    } else if (props.col.badge?.position === 'right') {
      <Fragment>
        {props.rowData[props.col.name]}
        <Badge
          badgeText={props.col.badge.badgeText}
          ariaLabel={props.col.badge.ariaLabel}
          variant={props.col.badge.variant}></Badge>
      </Fragment>;
    } else {
      return props.rowData[props.col.name];
    }
  }
}
