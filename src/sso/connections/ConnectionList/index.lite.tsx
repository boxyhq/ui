import { useStore, onUpdate, Show } from '@builder.io/mitosis';
import type { ConnectionData, ConnectionListProps, OIDCSSORecord, SAMLSSORecord } from '../types';
import LoadingContainer from '../../../shared/LoadingContainer/index.lite';
import EmptyState from '../../../shared/EmptyState/index.lite';
import cssClassAssembler from '../../utils/cssClassAssembler';
import defaultClasses from './index.module.css';
import Table from '../../../shared/Table/index.lite';
import { BadgeProps, PaginatePayload, TableProps } from '../../../shared/types';
import { sendHTTPRequest } from '../../../shared/http';
import Paginate from '../../../shared/Paginate/index.lite';
import { ITEMS_PER_PAGE_DEFAULT } from '../../../shared/Paginate/utils';

import Test from './test.lite';

const DEFAULT_VALUES = {
  isSettingsView: false,
  connectionListData: [] as ConnectionData<any>[],
};

export default function ConnectionList(props: ConnectionListProps) {
  const state = useStore({
    connectionListData: DEFAULT_VALUES.connectionListData,
    isConnectionListLoading: true,
    showErrorComponent: false,
    errorMessage: '',
    get getUrl() {
      return props.urls.get;
    },
    get isPaginated() {
      return props.paginate !== undefined;
    },
    get itemsPerPage() {
      return props.paginate?.itemsPerPage ?? ITEMS_PER_PAGE_DEFAULT;
    },
    get classes() {
      return {
        tableContainer: cssClassAssembler(props.classNames?.tableContainer, defaultClasses.tableContainer),
      };
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
                badgeText: 'system',
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
  });

  async function getFieldsData(url: string) {
    state.isConnectionListLoading = true;
    const data = await sendHTTPRequest<ConnectionData<SAMLSSORecord | OIDCSSORecord>[]>(url);

    state.isConnectionListLoading = false;
    if (data) {
      if ('error' in data) {
        state.showErrorComponent = true;
        state.errorMessage = data.error.message;
        typeof props.errorCallback === 'function' && props.errorCallback(data.error.message);
      } else {
        const _connectionsListData = data.map((connection: ConnectionData<any>) => {
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
    }
  }

  function reFetch(payload: PaginatePayload) {
    getFieldsData(
      state.listFetchUrl({
        getUrl: state.getUrl,
        tenant: props.tenant,
        product: props.product,
        displaySorted: props.displaySorted,
        ...payload,
      })
    );
  }

  onUpdate(() => {
    getFieldsData(
      state.listFetchUrl({
        getUrl: state.getUrl,
        tenant: props.tenant,
        product: props.product,
        displaySorted: props.displaySorted,
        offset: state.isPaginated ? 0 : undefined,
        limit: state.isPaginated ? state.itemsPerPage : undefined,
      })
    );
  }, [state.getUrl, props.tenant, props.product, props.displaySorted, state.isPaginated, state.itemsPerPage]);

  return (
    <LoadingContainer isBusy={state.isConnectionListLoading}>
      <Show
        when={state.connectionListData?.length > 0}
        else={
          <Show
            when={state.showErrorComponent}
            else={
              <Show when={props.children} else={<EmptyState title='No connections found.' />}>
                {props.children}
              </Show>
            }>
            <EmptyState title={state.errorMessage} variant='error' />
          </Show>
        }>
        <div class={state.classes.tableContainer}>
          <Table
            cols={state.colsToDisplay}
            data={state.connectionListData}
            actions={state.actions}
            {...props.tableProps}
          />
        </div>
        <Show when={state.isPaginated}>
          <Paginate
            itemsPerPage={props.paginate?.itemsPerPage}
            currentPageItemsCount={state.connectionListData.length}
            handlePageChange={props.paginate?.handlePageChange}
            reFetch={reFetch}>
            <Test />
          </Paginate>
        </Show>
      </Show>
    </LoadingContainer>
  );
}
