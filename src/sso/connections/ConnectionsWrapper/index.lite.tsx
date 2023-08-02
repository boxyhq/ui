import { Show, useStore } from '@builder.io/mitosis';
import ConnectionList from '../ConnectionList/index.lite';
import CreateSSOConnection from '../CreateConnection/index.lite';
import type { ConnectionListData, ConnectionsWrapperProp } from '../types';

const DEFAULT_VALUES = {
  connectionListData: [] as ConnectionListData,
  view: 'LIST' as 'LIST' | 'EDIT' | 'CREATE',
};

export default function ConnectionsWrapper(props: ConnectionsWrapperProp) {
  const state = useStore({
    connections: DEFAULT_VALUES.connectionListData,
    view: DEFAULT_VALUES.view,
    get connectionsAdded() {
      return state.connections.length > 0;
    },
  });

  return (
    <div>
      <div className='flex flex-col'>
        <Show when={state.view === 'LIST'}>
          <Show when={state.connectionsAdded}>
            <button type='button' onClick={(event) => (state.view = 'CREATE')}>
              Add Connection
            </button>
          </Show>
          <ConnectionList
            hideCols={props.componentProps?.connectionList?.hideCols}
            getConnectionsUrl={props.urls.get}
            onActionClick={() => console.log(`switch view to edit`)}
            onListFetchComplete={(connectionsList) => (state.connections = connectionsList)}
          />
        </Show>
        <Show when={state.view === 'CREATE'}>
          <CreateSSOConnection
            componentProps={{
              saml: {
                errorCallback: function (errMessage: string): void {
                  throw new Error('Function not implemented.');
                },
                successCallback: function (): void {
                  state.view = 'LIST';
                },
                variant: 'advanced',
                urls: {
                  save: '',
                },
              },
              oidc: {
                errorCallback: function (errMessage: string): void {
                  throw new Error('Function not implemented.');
                },
                successCallback: function (): void {
                  state.view = 'LIST';
                },
                variant: 'advanced',
                urls: {
                  save: '',
                },
              },
            }}
          />
        </Show>
      </div>
    </div>
  );
}
