import { Show, useContext, useStore } from '@builder.io/mitosis';
import EmptyState from '../EmptyState/index.lite';
import Table from './index.lite';
import { TableProps } from '../types';
import PaginateContext from '../Paginate/paginate.context.lite';

type PaginatedTableProps = {
  cols: TableProps['cols'];
  data: TableProps['data'];
  actions: TableProps['actions'];
  tableProps?: TableProps;
  showErrorComponent: boolean;
  errorMessage: string;
};

export default function PaginatedTable(props: PaginatedTableProps) {
  const context = useContext(PaginateContext);

  const state = useStore({
    get showEmptyData() {
      return props.data.length === 0 && context.offset === 0;
    },
    get showNoMoreResults() {
      return props.data.length === 0 && context.offset > 0;
    },
  });

  return (
    <Show
      when={!state.showEmptyData}
      else={
        <Show when={props.showErrorComponent} else={<EmptyState title='No connections found.' />}>
          <EmptyState title={props.errorMessage} variant='error' />
        </Show>
      }>
      <Table
        cols={props.cols}
        data={props.data}
        actions={props.actions}
        noMoreResults={state.showNoMoreResults}
        {...props.tableProps}
      />
    </Show>
  );
}
