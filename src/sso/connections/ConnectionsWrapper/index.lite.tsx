import { Show, useStore } from '@builder.io/mitosis';
import ConnectionList from '../ConnectionList/index.lite';
import type {
  ConnectionData,
  ConnectionsWrapperProp,
  OIDCSSOConnection,
  OIDCSSORecord,
  SAMLSSOConnection,
  SAMLSSORecord,
} from '../types';
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
    createSuccessCallback(info: {
      operation: 'CREATE';
      connection?: SAMLSSOConnection | OIDCSSOConnection | undefined;
    }) {
      // TODO handle oidc creation
      props.componentProps.createSSOConnection.componentProps?.saml.successCallback?.(info);
      state.switchToListView();
    },
    updateSuccessCallback(info: {
      operation: 'UPDATE' | 'DELETE';
      connection?: SAMLSSOConnection | undefined;
    }) {
      // TODO handle oidc updation
      props.componentProps.editSAMLConnection.successCallback?.(info);
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
            connection={state.connectionToEdit as ConnectionData<OIDCSSORecord>}
            cancelCallback={state.switchToListView}
            variant='basic'
            errorCallback={props.componentProps.editOIDCConnection.errorCallback}
            successCallback={state.updateSuccessCallback}
            // TODO: replace with SDK level toast
            copyDoneCallback={props.copyDoneCallback}
            urls={{
              delete: props.componentProps.editOIDCConnection.urls?.delete || '',
              patch: props.componentProps.editOIDCConnection.urls?.patch || '',
            }}
          />
        </Show>
        <Show when={state.connectionToEdit && 'idpMetadata' in state.connectionToEdit}>
          <EditSAMLConnection
            {...props.componentProps.editSAMLConnection}
            connection={state.connectionToEdit as ConnectionData<SAMLSSORecord>}
            cancelCallback={state.switchToListView}
            variant='basic'
            errorCallback={props.componentProps.editSAMLConnection.errorCallback}
            successCallback={state.updateSuccessCallback}
            // TODO: replace with SDK level toast
            copyDoneCallback={props.copyDoneCallback}
            urls={{
              delete: props.componentProps.editSAMLConnection.urls?.delete || '',
              patch: props.componentProps.editSAMLConnection.urls?.patch || '',
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
          errorCallback={props.componentProps.createSSOConnection.componentProps?.saml.errorCallback}
          urls={{ save: props.componentProps.createSSOConnection.componentProps?.saml.urls?.save || '' }}
        />
      </Show>
    </div>
  );
}
