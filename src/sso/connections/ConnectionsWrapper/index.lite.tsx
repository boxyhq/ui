import { Show, useStore } from '@builder.io/mitosis';
import ConnectionList from '../ConnectionList/index.lite';
import type { ConnectionData, ConnectionsWrapperProp, OIDCSSOConnection, SAMLSSOConnection } from '../types';
import defaultClasses from './index.module.css';
import EditOIDCConnection from '../EditConnection/oidc/index.lite';
import EditSAMLConnection from '../EditConnection/saml/index.lite';
import Button from '../../../shared/Button/index.lite';
import Spacer from '../../../shared/Spacer/index.lite';
import Card from '../../../shared/Card/index.lite';
import Anchor from '../../../shared/Anchor/index.lite';
import CreateSSOConnection from '../CreateConnection/index.lite';

const DEFAULT_VALUES = {
  connectionListData: [] as ConnectionData<any>[],
  view: 'LIST' as 'LIST' | 'EDIT' | 'CREATE',
};

export default function ConnectionsWrapper(props: ConnectionsWrapperProp) {
  const state = useStore({
    ssoType: 'saml',
    handleNewConnectionTypeChange: (event: any) => {
      state.ssoType = event.target.value;
    },
    connections: DEFAULT_VALUES.connectionListData,
    handleListFetchComplete: (connectionsList: ConnectionData<any>[]) => {
      state.connections = connectionsList;
    },
    view: DEFAULT_VALUES.view,
    connectionToEdit: {} as ConnectionData<any>,
    get connectionsAdded(): boolean {
      return state.connections.length > 0;
    },
    get ssoEnabled(): boolean {
      return (
        state.connectionsAdded && state.connections.some((connection) => connection.deactivated === false)
      );
    },
    switchToCreateView() {
      state.view = 'CREATE';
    },
    switchToEditView(action: 'edit', connection: ConnectionData<any>) {
      state.view = 'EDIT';
      state.connectionToEdit = connection;
    },
    switchToListView() {
      state.view = 'LIST';
    },
    createSuccessCallback(info: {
      operation: 'CREATE';
      connection?: SAMLSSOConnection | OIDCSSOConnection;
      connectionIsSAML?: boolean;
      connectionIsOIDC?: boolean;
    }) {
      const { operation, connection, connectionIsSAML, connectionIsOIDC } = info;

      if (typeof props.successCallback === 'function') {
        props.successCallback({
          operation,
          connection,
          connectionIsSAML,
          connectionIsOIDC,
        });
      }

      state.switchToListView();
    },
    updateSuccessCallback(info: {
      connection: any;
      operation: 'UPDATE' | 'DELETE' | 'COPY';
      connectionIsSAML?: boolean;
      connectionIsOIDC?: boolean;
    }) {
      const { connection, operation, connectionIsSAML = false, connectionIsOIDC = false } = info;

      if (typeof props.successCallback === 'function') {
        props.successCallback({
          operation,
          connection,
          connectionIsSAML,
          connectionIsOIDC,
        });
      }
      if (operation !== 'COPY') {
        state.switchToListView();
      }
    },
  });

  return (
    <div>
      <div class={defaultClasses.listView}>
        <Show when={state.view === 'LIST'}>
          <Show when={state.connectionsAdded}>
            <Card title='' variant={state.ssoEnabled ? 'success' : 'info'} displayIcon={false}>
              <div class={defaultClasses.ctoa}>
                <Show when={props.urls?.spMetadata}>
                  <Anchor
                    href={props.urls!.spMetadata!}
                    linkText='Access SP Metadata'
                    variant='button'></Anchor>
                </Show>
                <Button
                  name='Add Connection'
                  handleClick={state.switchToCreateView}
                  classNames={props.classNames?.button?.ctoa}
                />
              </div>
            </Card>
            <Spacer y={8} />
          </Show>
          <ConnectionList
            {...props.componentProps.connectionList}
            urls={{ get: props.urls?.get || '' }}
            handleActionClick={state.switchToEditView}
            handleListFetchComplete={state.handleListFetchComplete}>
            <Card variant='info' title='SSO not enabled'>
              <div class={defaultClasses.ctoa}>
                <Show when={props.urls?.spMetadata}>
                  <Anchor
                    href={props.urls!.spMetadata!}
                    linkText='Access SP Metadata'
                    variant='button'></Anchor>
                </Show>
                <Button
                  name='Add Connection'
                  handleClick={state.switchToCreateView}
                  classNames={props.classNames?.button?.ctoa}
                />
              </div>
            </Card>
          </ConnectionList>
        </Show>
      </div>
      <Show when={state.view === 'EDIT'}>
        <Show when={state.connectionToEdit && 'oidcProvider' in state.connectionToEdit}>
          <EditOIDCConnection
            classNames={props.classNames}
            cancelCallback={state.switchToListView}
            variant='basic'
            errorCallback={props.errorCallback}
            // @ts-ignore
            successCallback={state.updateSuccessCallback}
            urls={{
              delete: props.urls?.delete || '',
              patch: props.urls?.patch || '',
              get: `${props.urls?.get}?clientID=${state.connectionToEdit.clientID}` || '',
            }}
            {...props.componentProps.editOIDCConnection}
          />
        </Show>
        <Show when={state.connectionToEdit && 'idpMetadata' in state.connectionToEdit}>
          <EditSAMLConnection
            classNames={props.classNames}
            cancelCallback={state.switchToListView}
            variant='basic'
            errorCallback={props.errorCallback}
            // @ts-ignore
            successCallback={state.updateSuccessCallback}
            urls={{
              delete: props.urls?.delete || '',
              patch: props.urls?.patch || '',
              get: `${props.urls?.get}?clientID=${state.connectionToEdit.clientID}` || '',
            }}
            {...props.componentProps.editSAMLConnection}
          />
        </Show>
      </Show>
      <Show when={state.view === 'CREATE'}>
        <Spacer y={5} />
        <CreateSSOConnection
          classNames={props.classNames}
          cancelCallback={state.switchToListView}
          successCallback={state.createSuccessCallback}
          errorCallback={props.errorCallback}
          urls={{
            post: props.urls.post,
          }}
          {...props.componentProps.createSSOConnection}
        />
      </Show>
    </div>
  );
}
