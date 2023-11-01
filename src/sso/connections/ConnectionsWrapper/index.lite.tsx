import { Show, useStore } from '@builder.io/mitosis';
import ConnectionList from '../ConnectionList/index.lite';
import type { ConnectionData, ConnectionsWrapperProp, OIDCSSOConnection, SAMLSSOConnection } from '../types';
import defaultClasses from './index.module.css';
import EditOIDCConnection from '../EditConnection/oidc/index.lite';
import EditSAMLConnection from '../EditConnection/saml/index.lite';
import CreateSAMLConnection from '../CreateConnection/saml/index.lite';
import Button from '../../../shared/Button/index.lite';
import Spacer from '../../../shared/Spacer/index.lite';
import Card from '../../../shared/Card/index.lite';
import Anchor from '../../../shared/Anchor/index.lite';

const DEFAULT_VALUES = {
  connectionListData: [] as ConnectionData<any>[],
  view: 'LIST' as 'LIST' | 'EDIT' | 'CREATE',
};

export default function ConnectionsWrapper(props: ConnectionsWrapperProp) {
  const state = useStore({
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
    createSuccessCallback(info: { operation: 'CREATE'; connection?: SAMLSSOConnection | OIDCSSOConnection }) {
      const { operation, connection } = info;
      const connectionIsSAML = !!(
        connection &&
        'idpMetadata' in connection &&
        typeof connection.idpMetadata === 'object'
      );
      const connectionIsOIDC = !!(
        connection &&
        'oidcProvider' in connection &&
        typeof connection.oidcProvider === 'object'
      );
      // TODO handle oidc creation
      if (connectionIsSAML) {
        if (
          typeof props.componentProps.createSSOConnection.componentProps?.saml.successCallback === 'function'
        ) {
          props.componentProps.createSSOConnection.componentProps.saml.successCallback(info);
        } else if (typeof props.successCallback === 'function') {
          props.successCallback({
            operation,
            connection: { ...connection, connectionIsOIDC, connectionIsSAML },
          });
        }
      }
      if (connectionIsOIDC) {
        if (
          typeof props.componentProps.createSSOConnection.componentProps?.saml.successCallback === 'function'
        ) {
          props.componentProps.createSSOConnection.componentProps.saml.successCallback(info);
        } else if (typeof props.successCallback === 'function') {
          props.successCallback({
            operation,
            connection: {
              ...connection,
              connectionIsOIDC,
              connectionIsSAML,
            },
          });
        }
      }
      state.switchToListView();
    },
    updateSuccessCallback(info: { connection: any; operation: any }) {
      const { connection, operation } = info;
      const connectionIsSAML = !!(connection && connection.connectionIsSAML);
      const connectionIsOIDC = !!(connection && connection.connectionIsOIDC);

      console.log(connection, operation);

      if (connectionIsSAML) {
        if (typeof props.componentProps.editSAMLConnection.successCallback === 'function') {
          props.componentProps.editSAMLConnection.successCallback(info);
        } else if (typeof props.successCallback === 'function') {
          props.successCallback({
            operation,
            connection: { ...connection, connectionIsSAML },
          });
        }
      }
      if (connectionIsOIDC) {
        if (typeof props.componentProps.editOIDCConnection.successCallback === 'function') {
          props.componentProps.editOIDCConnection.successCallback(info);
        } else if (typeof props.successCallback === 'function') {
          props.successCallback({
            operation,
            connection: { ...connection, connectionIsOIDC },
          });
        }
      }
      state.switchToListView();
    },
  });

  return (
    <div>
      <div class={defaultClasses.listView}>
        <Show when={state.view === 'LIST'}>
          <Show when={state.connectionsAdded}>
            <Card
              title={state.ssoEnabled ? 'SSO Enabled' : 'SSO Disabled'}
              variant={state.ssoEnabled ? 'success' : 'info'}>
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
            {...props.componentProps.editOIDCConnection}
            cancelCallback={state.switchToListView}
            variant='basic'
            errorCallback={props.errorCallback}
            // @ts-ignore
            successCallback={state.updateSuccessCallback}
            // TODO: replace with SDK level toast
            copyDoneCallback={props.copyDoneCallback}
            urls={{
              delete: props.componentProps.editOIDCConnection.urls?.delete || '',
              patch: props.componentProps.editOIDCConnection.urls?.patch || '',
              get: props.componentProps.editOIDCConnection.urls?.get || '',
            }}
          />
        </Show>
        <Show when={state.connectionToEdit && 'idpMetadata' in state.connectionToEdit}>
          <EditSAMLConnection
            {...props.componentProps.editSAMLConnection}
            cancelCallback={state.switchToListView}
            variant='basic'
            errorCallback={props.errorCallback}
            // @ts-ignore
            successCallback={state.updateSuccessCallback}
            // TODO: replace with SDK level toast
            copyDoneCallback={props.copyDoneCallback}
            urls={{
              delete: props.componentProps.editSAMLConnection.urls?.delete || '',
              patch: props.componentProps.editSAMLConnection.urls?.patch || '',
              get: props.componentProps.editSAMLConnection.urls?.get || '',
            }}
          />
        </Show>
      </Show>
      <Show when={state.view === 'CREATE'}>
        <Spacer y={5} />
        <CreateSAMLConnection
          {...props.componentProps.createSSOConnection.componentProps?.saml}
          cancelCallback={state.switchToListView}
          variant='basic'
          successCallback={state.createSuccessCallback}
          //TODO: Bring inline error message display for SAML/OIDC forms */
          errorCallback={props.errorCallback}
          urls={{ save: props.componentProps.createSSOConnection.componentProps?.saml.urls?.save || '' }}
        />
      </Show>
    </div>
  );
}
