import CopyToClipboardButton from '../../../../shared/ClipboardButton/index.lite';
import { Show, useStore, onMount } from '@builder.io/mitosis';
import type {
  EditOIDCConnectionProps,
  FormObj,
  OIDCSSOConnection,
  ApiResponse,
  CreateConnectionProps,
} from '../../types';
import { saveConnection, deleteConnection } from '../../utils';

const DEFAULT_VALUES = {
  variant: 'basic',
} satisfies Partial<CreateConnectionProps>;

const INITIAL_VALUES = {
  oidcConnection: {
    name: '',
    description: '',
    redirectUrl: '',
    defaultRedirectUrl: '',
    oidcClientSecret: '',
    oidcClientId: '',
    oidcDiscoveryUrl: '',
    'oidcMetadata.issuer': '',
    'oidcMetadata.authorization_endpoint': '',
    'oidcMetadata.token_endpoint': '',
    'oidcMetadata.jwks_uri': '',
    'oidcMetadata.userinfo_endpoint': '',
  },
};

type Keys = keyof typeof INITIAL_VALUES.oidcConnection;
type Values = (typeof INITIAL_VALUES.oidcConnection)[Keys];

export default function EditOIDCConnection(props: EditOIDCConnectionProps) {
  const state = useStore({
    oidcConnection: INITIAL_VALUES.oidcConnection,
    hasDiscoveryUrl: true,
    displayDeletionConfirmation: false,
    get formVariant() {
      return props.variant || DEFAULT_VALUES.variant;
    },
    toggleHasDiscoveryUrl() {
      state.hasDiscoveryUrl = !state.hasDiscoveryUrl;
    },
    updateConnection(key: Keys, newValue: Values) {
      return { ...state.oidcConnection, [key]: newValue };
    },
    handleChange(event: Event) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      const name = target.name as Keys;
      const targetValue = (event.currentTarget as HTMLInputElement | HTMLTextAreaElement)?.value;

      state.oidcConnection = state.updateConnection(name, targetValue);
    },
    onCancel() {
      state.displayDeletionConfirmation = false;
    },
    askForConfirmation() {
      state.displayDeletionConfirmation = true;
    },
    saveSSOConnection(event: Event) {
      event.preventDefault();

      const formObj: Partial<OIDCSSOConnection> = {};
      Object.entries(state.oidcConnection).map(([key, val]) => {
        if (key.startsWith('oidcMetadata.')) {
          if (formObj.oidcMetadata === undefined) {
            formObj.oidcMetadata = {} as OIDCSSOConnection['oidcMetadata'];
          }
          formObj.oidcMetadata![key.replace('oidcMetadata.', '')] = val;
        } else {
          formObj[key as keyof Omit<OIDCSSOConnection, 'oidcMetadata'>] = val;
        }
      });

      saveConnection({
        url: props.urls.save,
        formObj: formObj as FormObj,
        connectionIsOIDC: true,
        callback: async (rawResponse: any) => {
          const response: ApiResponse = await rawResponse.json();

          if ('error' in response) {
            props.errorCallback(response.error.message);
            return;
          }

          if (rawResponse.ok) {
            props.successCallback();
          }
        },
      });
    },
    deleteSSOConnection(event: Event) {
      event.preventDefault();
      state.displayDeletionConfirmation = false;

      deleteConnection({
        url: props.urls.delete,
        clientId: props.connection.clientID,
        clientSecret: props.connection.clientSecret,
        callback: async (rawResponse: any) => {
          const response: ApiResponse = await rawResponse.json();

          if ('error' in response) {
            props.errorCallback(response.error.message);
            return;
          }

          if (rawResponse.ok) {
            props.successCallback();
          }
        },
      });
    },
  });

  onMount(() => {
    state.oidcConnection = {
      name: props.connection.name || '',
      description: props.connection.description || '',
      redirectUrl: props.connection.redirectUrl.join(`\r\n`),
      defaultRedirectUrl: props.connection.defaultRedirectUrl,
      oidcClientId: props.connection.oidcProvider.clientId || '',
      oidcClientSecret: props.connection.oidcProvider.clientSecret || '',
      oidcDiscoveryUrl: props.connection.oidcProvider.discoveryUrl || '',
      'oidcMetadata.issuer': props.connection.oidcProvider.metadata?.issuer || '',
      'oidcMetadata.authorization_endpoint':
        props.connection.oidcProvider.metadata?.authorization_endpoint || '',
      'oidcMetadata.token_endpoint': props.connection.oidcProvider.metadata?.token_endpoint || '',
      'oidcMetadata.jwks_uri': props.connection.oidcProvider.metadata?.jwks_uri || '',
      'oidcMetadata.userinfo_endpoint': props.connection.oidcProvider.metadata?.userinfo_endpoint || '',
    };

    state.hasDiscoveryUrl = props.connection.oidcProvider.discoveryUrl ? true : false;
  });

  return (
    <form onSubmit={(event) => state.saveSSOConnection(event)} method='post'>
      <div class='min-w-[28rem] bg-white dark:border-gray-700 dark:bg-gray-800 lg:border-none lg:p-0'>
        <div class='flex flex-col gap-0 lg:flex-row lg:gap-4'>
          <div class='flex flex-row gap-4 w-full lg:w-3/5'>
          <div class='w-full py-6 px-4 rounded border-2 border-gray-200 lg:w-3/5 lg:p-3'>
            <Show when={state.formVariant === 'advanced'}>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label for='name' class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Name
                  </label>
                </div>
                <input
                  class='input-bordered input w-full'
                  name='name'
                  id='name'
                  type='text'
                  placeholder='MyApp'
                  onInput={(event) => state.handleChange(event)}
                  value={state.oidcConnection.name}
                />
              </div>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label
                    for='description'
                    class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Description
                  </label>
                </div>
                <input
                  class='input-bordered input w-full'
                  name='description'
                  id='description'
                  type='text'
                  placeholder='A short description not more than 100 characters'
                  maxLength={100}
                  required={false}
                  onInput={(event) => state.handleChange(event)}
                  value={state.oidcConnection.description}
                />
              </div>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label
                    for='redirectUrl'
                    class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Allowed redirect URLs (newline separated)
                  </label>
                </div>
                <textarea
                  class='textarea-bordered textarea h-24 w-full whitespace-pre'
                  id='redirectUrl'
                  name='redirectUrl'
                  required={true}
                  rows={3}
                  placeholder='http://localhost:3366'
                  onInput={(event) => state.handleChange(event)}
                  value={state.oidcConnection.redirectUrl}
                />
              </div>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label
                    for='defaultRedirectUrl'
                    class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Default redirect URL
                  </label>
                </div>
                <input
                  class='input-bordered input w-full'
                  name='defaultRedirectUrl'
                  id='defaultRedirectUrl'
                  required={true}
                  type='url'
                  placeholder='http://localhost:3366/login/saml'
                  onInput={(event) => state.handleChange(event)}
                  value={state.oidcConnection.defaultRedirectUrl}
                />
              </div>
            </Show>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='oidcClientId'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Client ID [OIDC Provider]
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='oidcClientId'
                id='oidcClientId'
                required={true}
                type='text'
                placeholder=''
                onInput={(event) => state.handleChange(event)}
                value={state.oidcConnection.oidcClientId}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='oidcClientSecret'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Client Secret [OIDC Provider]
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='oidcClientSecret'
                id='oidcClientSecret'
                required={true}
                type='text'
                placeholder=''
                onInput={(event) => state.handleChange(event)}
                value={state.oidcConnection.oidcClientSecret}
              />
            </div>
            <Show when={state.hasDiscoveryUrl}>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label
                    for='oidcDiscoveryUrl'
                    class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Well-known URL of OpenID Provider
                  </label>
                  <button onClick={() => state.toggleHasDiscoveryUrl()}>
                    Missing the discovery URL? Click here to set the individual attributes
                  </button>
                </div>
                <input
                  class='input-bordered input w-full'
                  name='oidcDiscoveryUrl'
                  id='oidcDiscoveryUrl'
                  required={true}
                  type='url'
                  placeholder='https://example.com/.well-known/openid-configuration'
                  onInput={(event) => state.handleChange(event)}
                  value={state.oidcConnection.oidcDiscoveryUrl}
                />
              </div>
            </Show>
            <Show when={!state.hasDiscoveryUrl}>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label for='issuer' class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Issuer
                  </label>
                  <button onClick={() => state.toggleHasDiscoveryUrl()}>
                    Have a discovery URL? Click here to set it
                  </button>
                </div>
                <input
                  class='input-bordered input w-full'
                  name='oidcMetadata.issuer'
                  id='issuer'
                  type='url'
                  onInput={(event) => state.handleChange(event)}
                  value={state.oidcConnection['oidcMetadata.issuer']}
                />
              </div>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label
                    for='authorization_endpoint'
                    class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Authorization Endpoint
                  </label>
                </div>
                <input
                  class='input-bordered input w-full'
                  id='authorization_endpoint'
                  name='oidcMetadata.authorization_endpoint'
                  type='url'
                  onInput={(event) => state.handleChange(event)}
                  value={state.oidcConnection['oidcMetadata.authorization_endpoint']}
                />
              </div>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label
                    for='token_endpoint'
                    class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Token endpoint
                  </label>
                </div>
                <input
                  class='input-bordered input w-full'
                  id='token_endpoint'
                  name='oidcMetadata.token_endpoint'
                  type='url'
                  onInput={(event) => state.handleChange(event)}
                  value={state.oidcConnection['oidcMetadata.token_endpoint']}
                />
              </div>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label
                    for='jwks_uri'
                    class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    JWKS URI
                  </label>
                </div>
                <input
                  class='input-bordered input w-full'
                  id='jwks_uri'
                  name='oidcMetadata.jwks_uri'
                  type='url'
                  onInput={(event) => state.handleChange(event)}
                  value={state.oidcConnection['oidcMetadata.jwks_uri']}
                />
              </div>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label
                    for='userinfo_endpoint'
                    class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    UserInfo endpoint
                  </label>
                </div>
                <input
                  class='input-bordered input w-full'
                  id='userinfo_endpoint'
                  name='oidcMetadata.userinfo_endpoint'
                  type='url'
                  onInput={(event) => state.handleChange(event)}
                  value={state.oidcConnection['oidcMetadata.userinfo_endpoint']}
                />
              </div>
            </Show>
          </div>
          <div class='w-full py-6 px-4 rounded border-2 border-gray-200 lg:w-3/5 lg:p-3'>
            <Show when={state.formVariant === 'advanced'}>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label for='tenant' class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Tenant
                  </label>
                </div>
                <input
                  class='input-bordered input w-full'
                  name='tenant'
                  id='tenant'
                  placeholder='acme.com'
                  type='text'
                  required={true}
                  disabled={true}
                  value={props.connection.tenant}
                />
              </div>
              <div class='mb-6'>
                <div class='flex items-center justify-between'>
                  <label
                    for='product'
                    class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Product
                  </label>
                </div>
                <input
                  class='input-bordered input w-full'
                  name='product'
                  id='product'
                  type='text'
                  required={true}
                  disabled={true}
                  placeholder='demo'
                  value={props.connection.product}
                />
              </div>
            </Show>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label for='clientID' class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Client ID
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='clientID'
                id='clientID'
                type='text'
                required={true}
                disabled={true}
                value={props.connection.clientID}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='clientSecret'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Client Secret
                </label>
                <CopyToClipboardButton
                  text={props.connection.clientSecret}
                  toastSuccessCallback={props.successCallback}
                />
              </div>
              <input
                class='input-bordered input w-full'
                name='clientSecret'
                id='clientSecret'
                type='password'
                required={true}
                readOnly={true}
                value={props.connection.clientSecret}
              />
            </div>
          </div>
          </div>
          <div className='flex py-6 w-full'>
            <button type='submit' class='btn btn-success text-white'>
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <Show when={props.connection?.clientID && props.connection.clientSecret}>
        <section class='mt-10 flex items-center rounded bg-red-100 p-6 text-red-900'>
          <div class='flex-1'>
            <h6 class='mb-1 font-medium'>Delete this connection</h6>
            <p class='font-light'>All your apps using this connection will stop working.</p>
          </div>
          <Show when={!state.displayDeletionConfirmation}>
            <button type='button' onClick={(event) => state.askForConfirmation()} class='btn btn-error text-white'>
              Delete
            </button>
          </Show>
          <Show when={state.displayDeletionConfirmation}>
            <div>
              <h1>
                Are you sure you want to delete the Connection? This action cannot be undone and will
                permanently delete the Connection.
              </h1>
              <button class='btn btn-danger' onClick={(event) => state.deleteSSOConnection(event)}>
                Confirm
              </button>
              <button class='btn btn-outline' onClick={(event) => state.onCancel()}>
                Cancel
              </button>
            </div>
          </Show>
        </section>
      </Show>
    </form>
  );
}
