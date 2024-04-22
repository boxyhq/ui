import { useStore, onUpdate, Show } from '@builder.io/mitosis';
import type { ConnectionData, ConnectionListProps, OIDCSSORecord, SAMLSSORecord } from '../types';
import LoadingContainer from '../../../shared/LoadingContainer/index.lite';
import { BadgeProps, PageToken, PaginatePayload, TableProps } from '../../../shared/types';
import { sendHTTPRequest } from '../../../shared/http';
import Paginate from '../../../shared/Paginate/index.lite';
import PaginatedTable from '../../../shared/Table/paginated.lite';
import NonPaginatedTable from '../../../shared/Table/non-paginated.lite';

const DEFAULT_VALUES = {
  isSettingsView: false,
  connectionListData: [] as ConnectionData<any>[],
};

export default function ConnectionList(props: ConnectionListProps) {
  const state = useStore({
    connectionListData: DEFAULT_VALUES.connectionListData,
    isConnectionListLoading: true,
    pageTokenMap: {} as Record<number, PageToken>,
    showErrorComponent: false,
    errorMessage: '',
    get getUrl() {
      return props.urls.get;
    },
    get isPaginated() {
      return props.paginate?.itemsPerPage !== undefined;
    },
    get colsToDisplay() {
      return (props.cols || ['name', 'provider', 'tenant', 'product', 'type', 'status', 'actions']).map(
        (_col) => {
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
          } else if (_col === 'name') {
            return {
              name: 'name',
              badge: {
                position: 'right',
                badgeText: 'System',
                variant: 'info',
                shouldDisplayBadge(rowData) {
                  return rowData.isSystemSSO;
                },
              },
            };
          } else {
            return _col;
          }
        }
      ) as TableProps['cols'];
    },

    connectionProviderName(connection: SAMLSSORecord | OIDCSSORecord) {
      if ('idpMetadata' in connection) {
        return connection.idpMetadata.friendlyProviderName || connection.idpMetadata.provider;
      }

      if ('oidcProvider' in connection) {
        return connection.oidcProvider.friendlyProviderName || connection.oidcProvider.provider;
      }

      return 'Unknown';
    },
    get actions(): TableProps['actions'] {
      return [
        {
          icon: 'PencilIcon',
          label: 'Edit',
          handleClick: (connection: ConnectionData<any>) => props.handleActionClick('edit', connection),
        },
      ];
    },
    listFetchUrl(
      params: Partial<PaginatePayload> &
        Pick<ConnectionListProps, 'tenant' | 'product' | 'displaySorted'> & { getUrl: string }
    ) {
      let _url = params.getUrl;
      const [urlPath, qs] = _url.split('?');
      const urlParams = new URLSearchParams(qs);
      if (params.tenant) {
        if (Array.isArray(params.tenant)) {
          for (const _tenant of params.tenant) {
            urlParams.append('tenant', _tenant);
          }
        } else {
          urlParams.set('tenant', params.tenant);
        }
      }

      if (params.product) {
        urlParams.set('product', params.product);
      }

      if (params.pageToken) {
        urlParams.set('pageToken', params.pageToken);
      }

      if (params.displaySorted) {
        urlParams.set('sort', 'true');
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
        displaySorted: props.displaySorted,
      });
    },
  });

  function updateTokenMap(offset: number, token: PageToken) {
    return { ...state.pageTokenMap, [offset]: token };
  }

  async function getFieldsData(url: string) {
    state.isConnectionListLoading = true;
    type ConnectionList = ConnectionData<SAMLSSORecord | OIDCSSORecord>[];
    const response = await sendHTTPRequest<ConnectionList | { data: ConnectionList; pageToken: PageToken }>(
      url
    );

    state.isConnectionListLoading = false;
    if (response && typeof response === 'object') {
      if ('error' in response && response.error) {
        state.showErrorComponent = true;
        state.errorMessage = response.error.message;
        typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
      } else {
        const isTokenizedPagination = typeof response === 'object' && 'pageToken' in response;
        const _data = isTokenizedPagination ? response.data : response;
        if (Array.isArray(_data)) {
          const _connectionsListData = _data.map((connection: ConnectionData<any>) => {
            return {
              ...connection,
              provider: state.connectionProviderName(connection),
              type: 'oidcProvider' in connection ? 'OIDC' : 'SAML',
              status: connection.deactivated ? 'Inactive' : 'Active',
              isSystemSSO: connection.isSystemSSO,
            };
          });

          state.connectionListData = _connectionsListData;

          typeof props.handleListFetchComplete === 'function' &&
            props.handleListFetchComplete(_connectionsListData);
        }

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
    <LoadingContainer isBusy={state.isConnectionListLoading}>
      <Show when={state.isPaginated}>
        <Paginate
          itemsPerPage={props.paginate!.itemsPerPage}
          currentPageItemsCount={state.connectionListData.length}
          handlePageChange={props.paginate?.handlePageChange}
          reFetch={reFetch}
          pageTokenMap={state.pageTokenMap}>
          <PaginatedTable
            cols={state.colsToDisplay}
            data={state.connectionListData}
            actions={state.actions}
            showErrorComponent={state.showErrorComponent}
            errorMessage={state.errorMessage}
            emptyStateMessage='No connections found.'
            tableProps={props.tableProps}
          />
        </Paginate>
      </Show>
      <Show when={!state.isPaginated}>
        <NonPaginatedTable
          cols={state.colsToDisplay}
          data={state.connectionListData}
          actions={state.actions}
          showErrorComponent={state.showErrorComponent}
          errorMessage={state.errorMessage}
          emptyStateMessage='No connections found.'
          tableProps={props.tableProps}
        />
      </Show>
    </LoadingContainer>
  );
}
