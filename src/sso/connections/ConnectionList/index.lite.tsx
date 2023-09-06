import { useStore, onUpdate, Show } from '@builder.io/mitosis';
import type { ConnectionData, ConnectionListProps, OIDCSSORecord, SAMLSSORecord } from '../types';
import LoadingContainer from '../../../shared/LoadingContainer/index.lite';
import EmptyState from '../../../shared/EmptyState/index.lite';
import cssClassAssembler from '../../utils/cssClassAssembler';
import defaultClasses from './index.module.css';
import Table from '../../../shared/Table/index.lite';
import { TableProps } from '../../../shared/types';

const DEFAULT_VALUES = {
  isSettingsView: false,
  connectionListData: [] as ConnectionData<any>[],
};

export default function ConnectionList(props: ConnectionListProps) {
  const state = useStore({
    connectionListData: DEFAULT_VALUES.connectionListData,
    connectionListError: '',
    isConnectionListLoading: true,
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        formControl: cssClassAssembler(props.classNames?.formControl, defaultClasses.formControl),
        tableContainer: cssClassAssembler(props.classNames?.tableContainer, defaultClasses.tableContainer),
        table: cssClassAssembler(props.classNames?.table, defaultClasses.table),
        tableCaption: cssClassAssembler(props.classNames?.tableCaption, defaultClasses.tableCaption),
        thead: cssClassAssembler(props.classNames?.thead, defaultClasses.thead),
        tr: cssClassAssembler(props.classNames?.tr, defaultClasses.tr),
        th: cssClassAssembler(props.classNames?.th, defaultClasses.th),
        connectionListContainer: cssClassAssembler(
          props.classNames?.connectionListContainer,
          defaultClasses.connectionListContainer
        ),
        td: cssClassAssembler(props.classNames?.td, defaultClasses.td),
        badgeClass: cssClassAssembler(props.classNames?.badgeClass, defaultClasses.badgeClass),
        spanIcon: cssClassAssembler(props.classNames?.spanIcon, defaultClasses.spanIcon),
        icon: cssClassAssembler(props.classNames?.icon, defaultClasses.icon),
      };
    },
    get colsToDisplay() {
      return props.cols || ["provider", "tenant", "product", "type", "status", "actions"]
    },

    connectionDisplayName(connection: SAMLSSORecord | OIDCSSORecord) {
      if (connection.name) {
        return connection.name;
      }

      if ('idpMetadata' in connection) {
        return connection.idpMetadata.friendlyProviderName || connection.idpMetadata.provider;
      }

      if ('oidcProvider' in connection) {
        return connection.oidcProvider.provider;
      }

      return 'Unknown';
    },
    get actions(): TableProps["actions"] {
      return [{ icon: "PencilIcon", label: "Edit", handleClick: (connection: ConnectionData<any>) => props.handleActionClick("edit", connection) }]
    }
  });

  async function getFieldsData(url: string) {
    const response = await fetch(url);
    const { data, error } = await response.json();

    const _connectionsListData = data.map((connection: ConnectionData<any>) => {
      return {
        ...connection,
        provider: state.connectionDisplayName(connection),
        type: 'oidcProvider' in connection ? 'OIDC' : 'SAML',
        status: connection.deactivated ? 'Inactive' : 'Active',
        isSystemSSO: connection.isSystemSSO
      };
    });

    state.isConnectionListLoading = false;
    if (error) {
      state.connectionListError = error;
    } else {
      state.connectionListData = _connectionsListData;
      typeof props.handleListFetchComplete === 'function' && props.handleListFetchComplete(data);
    }
  }

  onUpdate(() => {
    getFieldsData(props.getConnectionsUrl);
  }, [props.getConnectionsUrl]);

  return (
    <LoadingContainer isBusy={state.isConnectionListLoading}>
      <div>
        <Show
          when={state.connectionListData?.length > 0}
          else={
            <Show when={props.children} else={<EmptyState title='No connections found.' />}>
              {props.children}
            </Show>
          }>
          <div class={state.classes.tableContainer}>
            <Table cols={state.colsToDisplay} data={state.connectionListData} actions={state.actions} />
          </div>
        </Show>
      </div>
    </LoadingContainer>
  );
}
