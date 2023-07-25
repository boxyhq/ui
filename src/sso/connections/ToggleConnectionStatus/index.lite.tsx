import { useStore, onMount, onUpdate, Show } from '@builder.io/mitosis';
import type { ToggleConnectionStatusProps } from '../types';
import { ApiResponse } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';

export default function ToggleConnectionStatus(props: ToggleConnectionStatusProps) {
  const state: any = useStore({
    active: false,
    displayConnectionMessage: true,
    get ConnectionStatusMessage() {
      return state.active ? 'Active' : 'Inactive';
    },
    get connectActivate() {
      return state.active ? 'deactivate' : 'activate';
    },
    askForConfirmation() {
      state.displayConnectionMessage = false;
    },
    onCancel() {
      state.displayConnectionMessage = true;
    },
    onConfirm() {
      state.active = !state.active;
      state.updateConnectionStatus(!state.active);
      state.displayConnectionMessage = true;
    },
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        heading: cssClassAssembler(props.classNames?.heading, defaultClasses.heading),
        alohaa: cssClassAssembler(props.classNames?.alohaa, defaultClasses.alohaa),
        confirmBtn: cssClassAssembler(props.classNames?.confirmBtn, defaultClasses.confirmBtn),
        cancelBtn: cssClassAssembler(props.classNames?.cancelBtn, defaultClasses.cancelBtn),
        toggle: cssClassAssembler(props.classNames?.toggle, defaultClasses.toggle),
        displayMessage: cssClassAssembler(props.classNames?.displayMessage, defaultClasses.displayMessage),
        toggleTransition: cssClassAssembler(
          props.classNames?.toggleTransition,
          defaultClasses.toggleTransition
        ),
      };
    },
    updateConnectionStatus(isConnectionActive: boolean) {
      void (async function () {
        state.active = isConnectionActive;

        const body = {
          clientID: props.connection?.clientID,
          clientSecret: props.connection?.clientSecret,
          tenant: props.connection?.tenant,
          product: props.connection?.product,
          deactivated: !state.active,
          isSAML: false,
          isOIDC: false,
        };

        if ('idpMetadata' in props.connection) {
          body['isSAML'] = true;
        } else {
          body['isOIDC'] = true;
        }

        const res = await fetch(props.urls.save, {
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
          props.successCallback('Connection Deactivated');
        } else {
          props.successCallback('Connection Activated');
        }
      })();
    },
  });

  onMount(() => {
    state.active = !props.connection.deactivated;
  });

  onUpdate(() => {
    state.active = !props.connection.deactivated;
  }, [props.connection]);

  return (
    <div class={state.classes.container}>
      <Show when={!state.displayConnectionMessage}>
        <div class={state.classes.displayMessage}>
          <h1>
            Do you want to<span>{` ${state.connectActivate} `}</span>connection status?
          </h1>
          <button class={state.classes.confirmBtn} onClick={(event) => state.onConfirm()}>
            Confirm
          </button>
          <button class={state.classes.cancelBtn} onClick={(event) => state.onCancel()}>
            Cancel
          </button>
        </div>
      </Show>
      <Show when={state.displayConnectionMessage}>
        <label class='label'>
          <span class='label-text mr-2'>{state.ConnectionStatusMessage}</span>
        </label>
        <input
          type='checkbox'
          id='toggle-status'
          class={`toggle-success toggle`}
          onChange={(event) => state.askForConfirmation()}
          checked={state.active}
        />
      </Show>
    </div>
  );
}
