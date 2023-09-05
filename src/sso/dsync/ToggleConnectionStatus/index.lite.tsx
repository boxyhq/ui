import { useStore, Show } from '@builder.io/mitosis';
import type { ToggleDirectoryStatusProps, ApiResponse } from '../types';
import ToggleSwitch from '../../../shared/ToggleSwitch/index.lite';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';

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
        heading: cssClassAssembler(props.classNames?.heading, defaultClasses.heading),
        confirmBtn: cssClassAssembler(props.classNames?.confirmBtn, defaultClasses.confirmBtn),
        cancelBtn: cssClassAssembler(props.classNames?.cancelBtn, defaultClasses.cancelBtn),
        toggle: cssClassAssembler(props.classNames?.toggle, defaultClasses.toggle),
        displayMessage: cssClassAssembler(props.classNames?.displayMessage, defaultClasses.displayMessage),
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

        if ('error' in response) {
          props.errorCallback(response.error.message);
          return;
        }

        if (body.deactivated) {
          props.successCallback('Connection deactivated successfully');
        } else {
          props.successCallback('Connection activated successfully');
        }
      }
      sendHTTPrequest();
    },
  });

  return (
    <Show when={props.connection !== undefined || props.connection !== null}>
      <div class={state.classes.container}>
        <Show when={state.displayPrompt}>
          <div class={state.classes.displayMessage}>
            <span>Do you want to {` ${state.connectionAction} `} connection?</span>
            <button class={state.classes.confirmBtn} onClick={() => state.onConfirm()}>
              Confirm
            </button>
            <button class={state.classes.cancelBtn} onClick={() => state.onCancel()}>
              Cancel
            </button>
          </div>
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
