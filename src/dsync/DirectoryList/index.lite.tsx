import { useStore, Show, onUpdate } from '@builder.io/mitosis';
import { DirectorySyncProviders, type Directory } from '../types';
import LoadingContainer from '../../shared/LoadingContainer/index.lite';
import type { DirectoryListProps, DirectoryType } from '../types';
import defaultClasses from './index.module.css';
import { BadgeProps, PageToken, PaginatePayload, TableProps } from '../../shared/types';
import { sendHTTPRequest } from '../../shared/http';
import Paginate from '../../shared/Paginate/index.lite';
import PaginatedTable from '../../shared/Table/paginated.lite';
import NonPaginatedTable from '../../shared/Table/non-paginated.lite';

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
    pageTokenMap: {} as Record<number, PageToken>,
    showErrorComponent: false,
    errorMessage: '',
    get getUrl() {
      return props.urls.get;
    },
    get isPaginated() {
      return props.paginate?.itemsPerPage !== undefined;
    },
    get actions(): TableProps['actions'] {
      if (props.hideViewAction) {
        return [
          {
            icon: 'PencilIcon',
            label: 'Edit',
            handleClick: (directory: Directory) => props.handleActionClick('edit', directory),
          },
        ];
      }
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
    listFetchUrl(
      params: Partial<PaginatePayload> & Pick<DirectoryListProps, 'tenant' | 'product'> & { getUrl: string }
    ) {
      let _url = params.getUrl;
      const [urlPath, qs] = _url.split('?');
      const urlParams = new URLSearchParams(qs);
      if (params.tenant) {
        urlParams.set('tenant', params.tenant);
      }
      if (params.product) {
        urlParams.set('product', params.product);
      }
      if (params.pageToken) {
        urlParams.set('pageToken', params.pageToken);
      }

      if (params?.offset !== undefined) {
        urlParams.set('pageOffset', `${params.offset}`);
        urlParams.set('pageLimit', `${params.limit}`);
      }
      if (urlParams.toString()) {
        return `${urlPath}?${urlParams}`;
      }
      return _url;
    },
    get baseFetchUrl(): string {
      return state.listFetchUrl({
        getUrl: state.getUrl,
        tenant: props.tenant,
        product: props.product,
      });
    },
    get tablePropsComputed() {
      return {
        ...props.tableProps,
        classNames: { ...props.tableProps?.classNames, iconSpan: defaultClasses.iconSpan },
      };
    },
  });

  function updateTokenMap(offset: number, token: PageToken) {
    return { ...state.pageTokenMap, [offset]: token };
  }

  async function getFieldsData(directoryListUrl: string) {
    // fetch request for obtaining directory lists data
    const response = await sendHTTPRequest<
      { data: Directory[] } | { data: { data: Directory[] }; pageToken: PageToken }
    >(directoryListUrl);
    state.isDirectoryListLoading = false;
    if (response) {
      if ('error' in response && response.error) {
        state.showErrorComponent = true;
        state.errorMessage = response.error.message;
        typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
      } else if ('data' in response) {
        const isTokenizedPagination = 'pageToken' in response;
        const _data = isTokenizedPagination ? response.data.data : response.data;
        const directoriesListData = _data.map((directory: Directory) => {
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
        typeof props.handleListFetchComplete === 'function' &&
          props.handleListFetchComplete(directoriesListData);

        if (isTokenizedPagination) {
          return response.pageToken;
        }
      }
    }
  }

  async function reFetch(payload: PaginatePayload) {
    const pageToken = await getFieldsData(
      state.listFetchUrl({
        getUrl: state.baseFetchUrl,
        ...payload,
      })
    );
    if (pageToken) {
      state.pageTokenMap = updateTokenMap(payload.offset, pageToken);
    }
  }

  onUpdate(() => {
    if (!state.isPaginated) {
      getFieldsData(state.baseFetchUrl);
    }
  }, [state.baseFetchUrl, state.isPaginated]);

  return (
    <LoadingContainer isBusy={state.isDirectoryListLoading}>
      <Show when={state.isPaginated}>
        <Paginate
          itemsPerPage={props.paginate!.itemsPerPage}
          currentPageItemsCount={state.directoryListData.length}
          handlePageChange={props.paginate?.handlePageChange}
          reFetch={reFetch}
          pageTokenMap={state.pageTokenMap}>
          <PaginatedTable
            cols={state.colsToDisplay}
            data={state.directoryListData}
            actions={state.actions}
            showErrorComponent={state.showErrorComponent}
            errorMessage={state.errorMessage}
            emptyStateMessage='No directories found.'
            tableProps={state.tablePropsComputed}
          />
        </Paginate>
      </Show>
      <Show when={!state.isPaginated}>
        <NonPaginatedTable
          cols={state.colsToDisplay}
          data={state.directoryListData}
          actions={state.actions}
          showErrorComponent={state.showErrorComponent}
          errorMessage={state.errorMessage}
          emptyStateMessage='No directories found.'
          tableProps={state.tablePropsComputed}
        />
      </Show>
    </LoadingContainer>
  );
}
