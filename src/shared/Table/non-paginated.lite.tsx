import { Show } from '@builder.io/mitosis';
import EmptyState from '../EmptyState/index.lite';
import Table from './index.lite';
import { TableProps } from '../types';
import styles from './index.module.css';

type NonPaginatedTableProps = {
  cols: TableProps['cols'];
  data: TableProps['data'];
  actions: TableProps['actions'];
  tableProps?: Pick<TableProps, 'tableCaption' | 'classNames'>;
  showErrorComponent: boolean;
  errorMessage: string;
  emptyStateMessage: string;
};

export default function NonPaginatedTable(props: NonPaginatedTableProps) {
  return (
    <Show
      when={props.data?.length > 0}
      else={
        <>
          {props.showErrorComponent && <EmptyState title={props.errorMessage} variant='error' />}
          {!props.showErrorComponent && <EmptyState title={props.emptyStateMessage} />}
        </>
      }>
      <div class={styles.tableContainer}>
        <Table cols={props.cols} data={props.data} actions={props.actions} {...props.tableProps} />
      </div>
    </Show>
  );
}
