import { useStore, Show } from '@builder.io/mitosis';
import type { ToggleDirectoryStatusProps, ApiResponse } from '../types';
import ToggleSwitch from '../../shared/ToggleSwitch/index.lite';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../sso/utils/cssClassAssembler';
import ConfirmationPrompt from '../../shared/ConfirmationPrompt/index.lite';

export default function ToggleConnectionStatus(props: ToggleDirectoryStatusProps) {
  const state = useStore({
    displayPrompt: false,
    get connectionStatus() {
      return props.connection?.deactivated ? 'Inactive' : 'Active';
    },
    get connectionAction() {
      return props.connection?.deactivated ? 'activate' : 'deactivate';
    },
    askForConfirmation() {
      state.displayPrompt = true;
    },
    onCancel() {
      state.displayPrompt = false;
    },
    onConfirm() {
      state.updateConnectionStatus(!props.connection?.deactivated);
    },
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
      };
    },
    updateConnectionStatus(status: boolean) {
      async function sendHTTPrequest() {
        const body = {
          directoryId: props.connection?.id,
          deactivated: status,
        };

        const res = await fetch(props.urls.patch, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const response: ApiResponse = await res.json();

        state.displayPrompt = false;

        if ('error' in response) {
          typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
          return;
        }

        typeof props.successCallback === 'function' && props.successCallback({ operation: 'UPDATE' });
      }
      sendHTTPrequest();
    },
  });

  return (
    <Show when={props.connection !== undefined || props.connection !== null}>
      <div class={state.classes.container}>
        <Show when={state.displayPrompt}>
          <ConfirmationPrompt
            ctoaVariant={props.connection?.deactivated ? 'primary' : 'destructive'}
            classNames={props.classNames?.confirmationPrompt}
            cancelCallback={state.onCancel}
            confirmationCallback={state.onConfirm}
            promptMessage={`Do you want to ${state.connectionAction} the connection?`}
          />
        </Show>
        <Show when={!state.displayPrompt}>
          <ToggleSwitch
            label={state.connectionStatus}
            disabled={state.displayPrompt}
            checked={!props.connection?.deactivated}
            handleChange={state.askForConfirmation}
          />
        </Show>
      </div>
    </Show>
  );
}
