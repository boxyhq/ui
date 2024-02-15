import { useStore, Show, onUpdate } from '@builder.io/mitosis';
import { DirectorySyncProviders, type Directory } from '../types';
import LoadingContainer from '../../shared/LoadingContainer/index.lite';
import type { DirectoryListProps, DirectoryType } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../sso/utils/cssClassAssembler';
import Table from '../../shared/Table/index.lite';
import { BadgeProps, TableProps } from '../../shared/types';
import EmptyState from '../../shared/EmptyState/index.lite';
import { sendHTTPRequest } from '../../shared/http';

const DEFAULT_VALUES = {
  directoryListData: [] as Directory[],
};

export default function DirectoryList(props: DirectoryListProps) {
  const state = useStore({
    directoryListData: DEFAULT_VALUES.directoryListData,
    get providers() {
      return Object.entries<string>(DirectorySyncProviders)?.map(([value, text]) => ({
        value,
        text,
      }));
    },
    isDirectoryListLoading: true,
    showErrorComponent: false,
    errorMessage: '',
    get classes() {
      return {
        tableContainer: cssClassAssembler(props.classNames?.tableContainer, defaultClasses.tableContainer),
      };
    },
    get displayTenantProduct() {
      return props.setupLinkToken ? false : true;
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
    get colsToDisplay() {
      return (props.cols || ['name', 'tenant', 'product', 'type', 'status', 'actions']).map((_col) => {
        if (_col === 'status') {
          return {
            name: 'status',
            badge: {
              position: 'surround',
              variantSelector(rowData) {
                let _variant: BadgeProps['variant'];
                if (rowData.deactivated) {
                  _variant = 'warning';
                }
                if (!rowData.deactivated) {
                  _variant = 'success';
                }
                return _variant;
              },
            },
          };
        } else {
          return _col;
        }
      }) as TableProps['cols'];
    },
    get listFetchUrl() {
      let _url = props.urls.get;
      const [urlPath, qs] = _url.split('?');
      const urlParams = new URLSearchParams(qs);
      if (props.tenant) {
        urlParams.set('tenant', props.tenant);
      }
      if (props.product) {
        urlParams.set('product', props.product);
      }
      if (urlParams.toString()) {
        return `${urlPath}?${urlParams}`;
      }
      return _url;
    },
  });

  onUpdate(() => {
    async function getFieldsData(directoryListUrl: string) {
      // fetch request for obtaining directory lists data
      const response = await sendHTTPRequest<{ data: Directory[] }>(directoryListUrl);
      state.isDirectoryListLoading = false;
      if (response) {
        if ('error' in response && response.error) {
          state.showErrorComponent = true;
          state.errorMessage = response.error.message;
          typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
        } else if ('data' in response) {
          const directoriesListData = response.data.map((directory: Directory) => {
            return {
              ...directory,
              id: directory.id,
              name: directory.name,
              tenant: directory.tenant,
              product: directory.product,
              type: state.providers.find(({ value }) => value === directory.type)?.text as DirectoryType,
              status: directory.deactivated ? 'Inactive' : 'Active',
            };
          });
          state.directoryListData = directoriesListData;
          typeof props.handleListFetchComplete === 'function' && props.handleListFetchComplete(response.data);
        }
      }
    }
    getFieldsData(state.listFetchUrl);
  }, [state.listFetchUrl]);

  return (
    <LoadingContainer isBusy={state.isDirectoryListLoading}>
      <Show
        when={state.directoryListData.length > 0}
        else={
          <Show
            when={state.showErrorComponent}
            else={
              <Show when={props.children} else={<EmptyState title='No directories found.' />}>
                {props.children}
              </Show>
            }>
            <EmptyState title={state.errorMessage} variant='error' />
          </Show>
        }>
        <div class={state.classes.tableContainer}>
          <Table
            cols={state.colsToDisplay}
            data={state.directoryListData}
            actions={state.actions}
            classNames={{ iconSpan: defaultClasses.iconSpan }}
          />
        </div>
      </Show>
    </LoadingContainer>
  );
}
