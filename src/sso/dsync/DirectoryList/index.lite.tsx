import { useStore, Show, onUpdate } from '@builder.io/mitosis';
import type { Directory } from '../types';
import LoadingContainer from '../../../shared/LoadingContainer/index.lite';
import type { DirectoryListProps } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';
import Table from '../../../shared/Table/index.lite';
import { TableProps } from '../../../shared/types';
import EmptyState from '../../../shared/EmptyState/index.lite';

const DEFAULT_VALUES = {
  directoryListData: [] as Directory[],
  providers: null,
};

export default function DirectoryList(props: DirectoryListProps) {
  const state = useStore({
    directoryListData: DEFAULT_VALUES.directoryListData,
    providers: DEFAULT_VALUES.providers,
    isDirectoryListLoading: true,
    directoryListError: '',
    directoryListIsLoading: true,
    get displayTenantProduct() {
      return props.setupLinkToken ? false : true;
    },
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        table: cssClassAssembler(props.classNames?.table, defaultClasses.table),
        tableHead: cssClassAssembler(props.classNames?.tableHead, defaultClasses.tableHead),
        tableData: cssClassAssembler(props.classNames?.tableData, defaultClasses.tableData),
      };
    },
    get actions(): TableProps['actions'] {
      return [
        {
          icon: 'EyeIcon',
          label: 'View',
          handleClick: (directory: Directory) => props.handleActionClick('view', directory),
        },
        {
          icon: 'PencilIcon',
          label: 'Edit',
          handleClick: (directory: Directory) => props.handleActionClick('edit', directory),
        },
      ];
    },
  });

  async function getFieldsData(directoryListUrl: string, directoryProviderUrl: string) {
    // fetch request for obtaining directory lists data
    const directoryListResponse = await fetch(directoryListUrl);
    const { data: listData, error } = await directoryListResponse.json();

    // fetch request for obtaining directory providers data
    const directoryProvidersResponse = await fetch(directoryProviderUrl);
    const { data: providersData } = await directoryProvidersResponse.json();

    const directoriesListData = listData.map((directory: Directory) => {
      return {
        name: directory.name,
        tenant: directory.tenant,
        product: directory.product,
        type: directory.type,
        status: directory.deactivated ? 'Inactive' : 'Active',
      };
    });

    state.directoryListIsLoading = false;

    if (error) {
      state.directoryListError = error;
    } else {
      state.directoryListData = directoriesListData;
      state.providers = providersData;
      typeof props.handleListFetchComplete === 'function' && props.handleListFetchComplete(listData);
    }
  }

  onUpdate(() => {
    getFieldsData(props.urls.directories, props.urls.providers);
  }, [props.urls.directories, props.urls.providers]);

  return (
    <Show
      when={state.directoryListIsLoading}
      else={
        <Show
          when={state.directoryListData.length > 0}
          else={
            <Show when={props.children} else={<EmptyState title='No directories found.' />}>
              {props.children}
            </Show>
          }>
          <div>
            <Table cols={props.cols} data={state.directoryListData} actions={state.actions} />
          </div>
        </Show>
      }>
      <LoadingContainer isBusy={state.isDirectoryListLoading} />
    </Show>
  );
}
