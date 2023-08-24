import { useStore, Show, For, onUpdate } from '@builder.io/mitosis';
import type { Directory } from '../types';
import LoadingContainer from '../../../shared/LoadingContainer/index.lite';
import EmptyState from '../../../shared/EmptyState/index.lite';
import type { DirectoryListProps } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';
import Table from '../../../shared/Table/index.lite';

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
  });

  onUpdate(() => {
    async function getFieldsData(directoryListUrl: string, directoryProvider: string) {
      // fetch request for obtaining directory lists data
      const directoryListResponse = await fetch(directoryListUrl);
      const { data: listData, error } = await directoryListResponse.json();

      // fetch request for obtaining directory providers data
      const directoryProvidersResponse = await fetch(directoryProvider);
      const { data: providersData } = await directoryProvidersResponse.json();

      state.isDirectoryListLoading = false;

      const directoriesListData = listData.map((directory: Directory) => {
        return {
          name: directory.name,
          tenant: directory.tenant,
          product: directory.product,
          type: directory.type,
          status: directory.deactivated ? 'Inactive' : 'Active',
          actions: props.actions,
        };
      });

      state.directoryListData = directoriesListData;
      state.providers = providersData;

      if (error) {
        state.directoryListError = error;
      }
      state.directoryListIsLoading = false;
    }

    getFieldsData(props.getDirectoriesUrl, props.useDirectoryProviderUrl);
  }, [props.getDirectoriesUrl, props.useDirectoryProviderUrl]);

  return (
    <Show
      when={state.directoryListIsLoading}
      else={
        <div>
          <Table cols={props.cols} data={state.directoryListData} />
        </div>
      }>
      <LoadingContainer isBusy={state.isDirectoryListLoading} />
    </Show>
  );
}
