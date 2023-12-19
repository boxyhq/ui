import { useStore, Show } from '@builder.io/mitosis';
import type { ToggleConnectionStatusProps } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';
import ToggleSwitch from '../../../shared/ToggleSwitch/index.lite';
import ConfirmationPrompt from '../../../shared/ConfirmationPrompt/index.lite';
import { sendHTTPRequest } from '../../../shared/http';

export default function ToggleConnectionStatus(props: ToggleConnectionStatusProps) {
  const state: any = useStore({
    displayPrompt: false,
    get connectionStatus() {
      return props.connection.deactivated ? 'Inactive' : 'Active';
    },
    get connectionAction() {
      return props.connection.deactivated ? 'activate' : 'deactivate';
    },
    askForConfirmation() {
      state.displayPrompt = true;
    },
    onCancel() {
      state.displayPrompt = false;
    },
    onConfirm() {
      state.updateConnectionStatus(!props.connection.deactivated);
    },
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
      };
    },
    updateConnectionStatus(status: boolean) {
      async function updateConnection() {
        type payload = { [key: string]: string | boolean };
        const body: payload = {
          clientID: props.connection.clientID,
          clientSecret: props.connection.clientSecret,
          tenant: props.connection.tenant,
          product: props.connection.product,
          deactivated: status,
        };

        const connectionIsSAML = 'idpMetadata' in props.connection ? true : false;
        const connectionIsOIDC = 'oidcProvider' in props.connection ? true : false;

        if (connectionIsSAML) {
          body['isSAML'] = true;
        } else if (connectionIsOIDC) {
          body['isOIDC'] = true;
        }

        const data = await sendHTTPRequest<undefined>(props.urls.patch, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        state.displayPrompt = false;

        if (data?.error) {
          typeof props.errorCallback === 'function' && props.errorCallback(data.error.message);
        } else {
          typeof props.successCallback === 'function' &&
            props.successCallback({ operation: 'UPDATE', connectionIsSAML, connectionIsOIDC });
        }
      }
      updateConnection();
    },
  });

  return (
    <Show when={props.connection !== undefined || props.connection !== null}>
      <div class={state.classes.container}>
        <Show when={state.displayPrompt}>
          <ConfirmationPrompt
            ctoaVariant={props.connection.deactivated ? 'primary' : 'destructive'}
            classNames={props.classNames?.confirmationPrompt}
            cancelCallback={state.onCancel}
            confirmationCallback={state.onConfirm}
            promptMessage={`Do you want to ${state.connectionAction} the connection?`}
          />
        </Show>
        <Show when={!state.displayPrompt}>
          <ToggleSwitch
            label={state.connectionStatus}
            handleChange={state.askForConfirmation}
            checked={!props.connection.deactivated}
            disabled={state.displayPrompt}
          />
        </Show>
      </div>
    </Show>
  );
}
