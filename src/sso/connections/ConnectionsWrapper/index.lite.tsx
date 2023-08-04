import { Show, useStore } from '@builder.io/mitosis';
import ConnectionList from '../ConnectionList/index.lite';
import CreateSSOConnection from '../CreateConnection/index.lite';
import type { ConnectionListData, ConnectionsWrapperProp } from '../types';
import cssClassAssembler from '../../utils/cssClassAssembler';
import defaultClasses from './index.module.css';
import Card from '../../../shared/Card/index.lite';

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
            onActionClick={(event) => console.log(`switch view to edit`)}
            onListFetchComplete={(connectionsList) => (state.connections = connectionsList)}
            {...props.componentProps.connectionList}
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
              successCallback: () => (state.view = 'LIST'),
              //TODO: Bring inline error message display for SAML/OIDC forms */
              errorCallback: () => {},
              variant: 'basic',
              urls: { save: '' },
              ...props.componentProps.createSSOConnection?.componentProps?.saml,
            },
            oidc: {
              successCallback: () => (state.view = 'LIST'),
              errorCallback: () => {},
              variant: 'basic',
              urls: { save: '' },
              ...props.componentProps.createSSOConnection?.componentProps?.oidc,
            },
          }}
        />
      </Show>
      <Card title='Single Sign-On'>
        <Show when={!state.connectionsAdded}>
          <div class={defaultClasses.status}>
            <p>Allow team members to login using an Identity Provider.</p>
            <button onClick={(event) => (state.view = 'CREATE')}>Configure</button>
          </div>
        </Show>
        <Show when={state.connectionsAdded}>
          <p class={defaultClasses.ssoAdded}>Single Sign-On connection is enabled for your team.</p>
          Please find the SP metadata for Identity Provider configuration at
          {/* TODO: Slot for link to well known path */}
          link.
        </Show>
      </Card>
    </div>
  );
}
