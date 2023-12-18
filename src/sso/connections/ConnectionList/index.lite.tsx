import { useStore, onUpdate, Show } from '@builder.io/mitosis';
import type { ConnectionData, ConnectionListProps, OIDCSSORecord, SAMLSSORecord } from '../types';
import LoadingContainer from '../../../shared/LoadingContainer/index.lite';
import EmptyState from '../../../shared/EmptyState/index.lite';
import cssClassAssembler from '../../utils/cssClassAssembler';
import defaultClasses from './index.module.css';
import Table from '../../../shared/Table/index.lite';
import { BadgeProps, TableProps } from '../../../shared/types';
import { fetchData } from '../../../shared/fetchData';

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
    get listFetchUrl() {
      return props.urls.get;
    },
  });

  async function getFieldsData(url: string) {
    const data = await fetchData(url);
    const { error } = data;

    state.isConnectionListLoading = false;
    if (error) {
      state.showErrorComponent = true;
      state.errorMessage = error.message;
      typeof props.errorCallback === 'function' && props.errorCallback(error.message);
    } else {
      const _connectionsListData = data?.map((connection: ConnectionData<any>) => {
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

  onUpdate(() => {
    state.isConnectionListLoading = true;
    getFieldsData(state.listFetchUrl);
  }, [state.listFetchUrl]);

  return (
    <LoadingContainer isBusy={state.isConnectionListLoading}>
      <div>
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
        </Show>
      </div>
    </LoadingContainer>
  );
}
