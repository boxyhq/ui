import { errorToast, successToast } from '@components/Toaster';
import { ToggleConnectionStatusProps, ApiResponse } from './types';
import { ConnectionToggle } from '@components/ConnectionToggle';
import { useStore, onMount, onUpdate } from '@builder.io/mitosis';

export default function ToggleConnectionStatus(props: ToggleConnectionStatusProps) {
  const state = useStore({
    active: !this._connection.deactivated,
    get _connection() {
      return props.connection;
    },
    get t() {
      return props.translation;
    },
    get _setupLinkToken() {
      return props.setupLinkToken;
    },

    // Update connection status on every onChange
    updateConnectionStatus: (event: Event) => {
      void (async function (e) {
        e.preventDefault();
        state.active = state.active;

        const body = {
          clientID: state._connection?.clientID,
          clientSecret: state._connection?.clientSecret,
          tenant: state._connection?.tenant,
          product: state._connection?.product,
          deactivated: !state.active,
        };

        if ('idpMetadata' in state._connection) {
          body['isSAML'] = true;
        } else {
          body['isOIDC'] = true;
        }

        const res = await fetch(
          state._setupLinkToken
            ? `/api/setup/${state._setupLinkToken}/sso-connection`
            : '/api/admin/connections',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        const response: ApiResponse = await res.json();

        if ('error' in response) {
          errorToast(response.error.message);
          return;
        }

        if (body.deactivated) {
          successToast(state.t('connection_deactivated'));
        } else {
          successToast(state.t('connection_activated'));
        }
      })(event);
    },
  });

  onMount(() => {
    state.active = !state._connection.deactivated;
  });

  onUpdate(() => {
    state.active = !state._connection.deactivated;
  }, [state._connection]);

  return (
    <div>
      <ConnectionToggle
        connection={{ active: state.active, type: 'sso' }}
        onChange={(event: Event) => state.updateConnectionStatus(event)}></ConnectionToggle>
    </div>
  );
}
