import { Show, useStore } from '@builder.io/mitosis';
import ConnectionList from '../ConnectionList/index.lite';
import CreateSSOConnection from '../CreateConnection/index.lite';
import type { ConnectionListData, ConnectionsWrapperProp } from '../types';
import cssClassAssembler from '../../utils/cssClassAssembler';
import defaultClasses from './index.module.css';

const DEFAULT_VALUES = {
  connectionListData: [] as ConnectionListData,
  view: 'LIST' as 'LIST' | 'EDIT' | 'CREATE',
};

export default function ConnectionsWrapper(props: ConnectionsWrapperProp) {
  const state = useStore({
    connections: DEFAULT_VALUES.connectionListData,
    view: DEFAULT_VALUES.view,
    get connectionsAdded(): boolean {
      return state.connections.length > 0;
    },
    classes: {
      button: cssClassAssembler(props.classNames?.button, defaultClasses.button),
    },
  });

  return (
    <div>
      <div className='flex flex-col'>
        <Show when={state.view === 'LIST'}>
          <Show when={state.connectionsAdded}>
            <button type='button' class={state.classes.button} onClick={(event) => (state.view = 'CREATE')}>
              {/* TODO: bring translation support */}
              Add Connection
            </button>
          </Show>
          <ConnectionList
            {...props.componentProps.connectionList}
            onActionClick={(event) => console.log(`switch view to edit`)}
            onListFetchComplete={(connectionsList) => (state.connections = connectionsList)}
          />
        </Show>
      </div>
      <Show when={state.view === 'CREATE'}>
        <button type='button' onClick={(event) => (state.view = 'LIST')}>
          Back
        </button>
        <CreateSSOConnection
          {...props.componentProps.createSSOConnection}
          componentProps={{
            saml: {
              ...props.componentProps.createSSOConnection.componentProps.saml,
            },
            oidc: {
              ...props.componentProps.createSSOConnection.componentProps.oidc,
            },
          }}
        />
      </Show>
    </div>
  );
}
