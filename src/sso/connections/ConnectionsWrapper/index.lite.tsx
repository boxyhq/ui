import { Show, useStore } from '@builder.io/mitosis';
import ConnectionList from '../ConnectionList/index.lite';
import CreateSSOConnection from '../CreateConnection/index.lite';
import type { ConnectionData, ConnectionsWrapperProp, OIDCSSORecord, SAMLSSORecord } from '../types';
import cssClassAssembler from '../../utils/cssClassAssembler';
import defaultClasses from './index.module.css';
import Card from '../../../shared/Card/index.lite';
import EditOIDCConnection from '../EditConnection/oidc/index.lite';
import EditSAMLConnection from '../EditConnection/saml/index.lite';

const DEFAULT_VALUES = {
  connectionListData: [] as ConnectionListData,
  view: 'LIST' as 'LIST' | 'EDIT' | 'CREATE',
};

export default function ConnectionsWrapper(props: ConnectionsWrapperProp) {
  const state = useStore({
    connections: DEFAULT_VALUES.connectionListData,
    view: DEFAULT_VALUES.view,
    connectionToEdit: {} as ConnectionData<any>,
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
            onActionClick={(connection) => {
              state.view = 'EDIT';
              state.connectionToEdit = connection;
            }}
            onListFetchComplete={(connectionsList) => (state.connections = connectionsList)}
            {...props.componentProps.connectionList}
          />
        </Show>
      </div>
      <Show when={state.view === 'EDIT'}>
        <Show when={state.connectionToEdit && 'oidcProvider' in state.connectionToEdit}>
          <EditOIDCConnection
            connection={state.connectionToEdit as ConnectionData<OIDCSSORecord>}
            variant='basic'
            errorCallback={}
            successCallback={}
            urls={}
          />
        </Show>
        <Show when={state.connectionToEdit && 'idpMetadata' in state.connectionToEdit}>
          <EditSAMLConnection
            connection={state.connectionToEdit as ConnectionData<SAMLSSORecord>}
            variant='basic'
            errorCallback={() => void 0}
            successCallback={() => void 0}
            urls={{ delete: '', patch: '' }}
          />
        </Show>
      </Show>
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
