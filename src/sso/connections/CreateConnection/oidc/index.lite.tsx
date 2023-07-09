import { useStore, Show } from '@builder.io/mitosis';
import { CreateConnectionProps } from '../../types';
import { ApiResponse } from '../../types';
import { saveConnection } from '../../utils.lite';
import ButtonPrimary from '../../../../shared/ButtonPrimary.lite';

export default function CreateOIDCConnection(props: CreateConnectionProps) {
  const state = useStore({
    fieldValue: true,
    _name: '',
    _description: '',
    _tenant: '',
    _product: '',
    _redirectUrl: '',
    _defaultRedirectUrl: '',
    _oidcClientSecret: '',
    _oidcClientId: '',
    _oidcDiscoveryUrl: '',
    _issuer: '',
    _authorization_endpoint: '',
    _token_endpoint: '',
    _jwks_uri: '',
    _userinfo_endpoint: '',
    toggleButton() {
      state.fieldValue = !state.fieldValue;
    },
    handleChange(storeVariable: string, newValue: any) {
      if (storeVariable === 'name') {
        state._name = newValue;
      } else if (storeVariable === 'description') {
        state._description = newValue;
      } else if (storeVariable === 'tenant') {
        state._tenant = newValue;
      } else if (storeVariable === 'product') {
        state._product = newValue;
      } else if (storeVariable === 'redirectUrl') {
        state._redirectUrl = newValue;
      } else if (storeVariable === 'defaultRedirectUrl') {
        state._defaultRedirectUrl = newValue;
      } else if (storeVariable === 'oidcClientSecret') {
        state._oidcClientSecret = newValue;
      } else if (storeVariable === 'oidcClientId') {
        state._oidcClientId = newValue;
      } else if (storeVariable === 'oidcDiscoveryUrl') {
        state._oidcDiscoveryUrl = newValue;
      } else if (storeVariable === 'issuer') {
        state._issuer = newValue;
      } else if (storeVariable === 'authorization_endpoint') {
        state._authorization_endpoint = newValue;
      } else if (storeVariable === 'token_endpoint') {
        state._token_endpoint = newValue;
      } else if (storeVariable === 'jwks_uri') {
        state._jwks_uri = newValue;
      } else if (storeVariable === 'userinfo_endpoint') {
        state._userinfo_endpoint = newValue;
      }
    },
    save(event: Event) {
      void (async function (e) {
        e.preventDefault();

        props.loading = true;

        await saveConnection({
          formObj: {
            name: state._name,
            description: state._description,
            tenant: state._tenant,
            product: state._product,
            redirectUrl: state._redirectUrl,
            defaultRedirectUrl: state._defaultRedirectUrl,
            oidcClientId: state._oidcClientId,
            oidcClientSecret: state._oidcClientSecret,
          },
          connectionIsOIDC: true,
          setupLinkToken: props.setupLinkToken,
          callback: async (rawResponse: any) => {
            props.loading = false;

            const response: ApiResponse = await rawResponse.json();

            if ('error' in response) {
              props.errorToastCallback(response.error.message);
              return;
            }

            if (rawResponse.ok) {
              cb: () => {
                // router replace and mutate url using swr
                // happens here
              };
            }
          },
        });
      })(event);
    },
  });

  return (
    <form onSubmit={(event) => state.save(event)}>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='name'>Name</label>
        <input
          name='name'
          onChange={(event) => state.handleChange('name', event.target.value)}
          value={state._name}
          required={false}
          type='text'
          placeholder='MyApp'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='description'>Description</label>
        <input
          name='description'
          value={state._description}
          onChange={(event) => state.handleChange('description', event.target.value)}
          required={false}
          maxLength={100}
          type='text'
          placeholder='A short description not more than 100 characters'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='tenant'>Tenant</label>
        <input
          name='tenant'
          onChange={(event) => state.handleChange('tenant', event.target.value)}
          value={state._tenant}
          type='text'
          placeholder='acme.com'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='product'>Product</label>
        <input
          name='product'
          onChange={(event) => state.handleChange('product', event.target.value)}
          value={state._product}
          type='text'
          placeholder='demo'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='redirectUrl'>Allowed redirect URLs (newline separated)</label>
        <input
          name='redirectUrl'
          onChange={(event) => state.handleChange('redirectUrl', event.target.value)}
          value={state._redirectUrl}
          type='textarea'
          placeholder='http://localhost:3366'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='defaultRedirectUrl'>Default redirect URL</label>
        <input
          name='defaultRedirectUrl'
          onChange={(event) => state.handleChange('defaultRedirectUrl', event.target.value)}
          value={state._defaultRedirectUrl}
          type='url'
          placeholder='http://localhost:3366/login/saml'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='oidcClientId'>Client ID [OIDC Provider]</label>
        <input
          name='oidcClientId'
          onChange={(event) => state.handleChange('oidcClientId', event.target.value)}
          value={state._oidcClientId}
          type='text'
          placeholder=''
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='oidcClientSecret'>Client Secret [OIDC Provider]</label>
        <input
          name='oidcClientSecret'
          onChange={(event) => state.handleChange('defaultRedirectUrl', event.target.value)}
          value={state._oidcClientSecret}
          type='text'
          placeholder=''
        />
      </div>
      <Show when={state.fieldValue}>
        <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
          <label for='oidcDiscoveryUrl'>Well-known URL of OpenID Provider</label>
          <button onClick={() => state.toggleButton()}>
            Missing the discovery URL? Click here to set the individual attributes
          </button>
          <input
            name='oidcDiscoveryUrl'
            onChange={(event) => state.handleChange('oidcDiscoveryUrl', event.target.value)}
            value={state._oidcDiscoveryUrl}
            type='url'
            placeholder='https://example.com/.well-known/openid-configuration'
          />
        </div>
      </Show>
      <Show when={!state.fieldValue}>
        <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
          <button onClick={() => state.toggleButton()}>Have a discovery URL? Click here to set it</button>
        </div>
        <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
          <label for='issuer'>Issuer</label>
          <input
            name='issuer'
            onChange={(event) => state.handleChange('issuer', event.target.value)}
            value={state._issuer}
            type='url'
            placeholder=''
          />
        </div>
        <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
          <label for='authorization_endpoint'>Authorization Endpoint</label>
          <input
            name='authorization_endpoint'
            onChange={(event) => state.handleChange('authorization_endpoint', event.target.value)}
            value={state._authorization_endpoint}
            type='url'
            placeholder=''
          />
        </div>
        <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
          <label for='token_endpoint'>Token endpoint</label>
          <input
            name='token_endpoint'
            onChange={(event) => state.handleChange('token_endpoint', event.target.value)}
            value={state._token_endpoint}
            type='url'
            placeholder=''
          />
        </div>
        <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
          <label for='jwks_uri'>JWKS URI</label>
          <input
            name='jwks_uri'
            onChange={(event) => state.handleChange('jwks_uri', event.target.value)}
            value={state._jwks_uri}
            type='url'
            placeholder=''
          />
        </div>
        <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
          <label for='userinfo_endpoint'>UserInfo endpoint</label>
          <input
            name='userinfo_endpoint'
            onChange={(event) => state.handleChange('userinfo_endpoint', event.target.value)}
            value={state._userinfo_endpoint}
            type='url'
            placeholder=''
          />
        </div>
      </Show>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <div className='flex'>
          <ButtonPrimary data-testid='submit-form-create-sso'>{props.t('save_changes')}</ButtonPrimary>
        </div>
      </div>
    </form>
  );
}
