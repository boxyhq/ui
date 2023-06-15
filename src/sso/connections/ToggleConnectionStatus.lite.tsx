import type { OIDCSSORecord, SAMLSSORecord } from '@boxyhq/saml-jackson';
import { errorToast, successToast } from '@components/Toaster';
import type { ApiResponse } from 'types';
import { ConnectionToggle } from '@components/ConnectionToggle';
import { useStore, onMount, onUpdate } from '@builder.io/mitosis';

interface Props {
  connection: SAMLSSORecord | OIDCSSORecord;
  setupLinkToken?: string;
  translation: any;
}

export function ToggleConnectionStatus(props: Props) {
  const { connection, setupLinkToken } = props;

  const { t } = props.translation;

  const state = useStore({
    active: !connection.deactivated,

    // Update connection status on every onChange
    updateConnectionStatus: (event: Event) => {
      void (async function (e) {
        e.preventDefault();
        state.active = state.active;

        const body = {
          clientID: connection?.clientID,
          clientSecret: connection?.clientSecret,
          tenant: connection?.tenant,
          product: connection?.product,
          deactivated: !state.active,
        };

        if ('idpMetadata' in connection) {
          body['isSAML'] = true;
        } else {
          body['isOIDC'] = true;
        }

        const res = await fetch(
          setupLinkToken ? `/api/setup/${setupLinkToken}/sso-connection` : '/api/admin/connections',
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
          successToast(t('connection_deactivated'));
        } else {
          successToast(t('connection_activated'));
        }
      })(event);
    },
  });

  onMount(() => {
    state.active = !connection.deactivated;
  });

  onUpdate(() => {
    state.active = !connection.deactivated;
  }, [connection]);

  return (
    <>
      <ConnectionToggle
        connection={{ active: state.active, type: 'sso' }}
        onChange={(event: Event) => state.updateConnectionStatus(event)}></ConnectionToggle>
    </>
  );
}
