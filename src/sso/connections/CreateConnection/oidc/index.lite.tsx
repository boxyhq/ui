import { useStore, Show } from '@builder.io/mitosis';
import { CreateConnectionProps } from '../../types';
import { ApiResponse } from '../../types';
import { saveConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';

export default function CreateOIDCConnection(props: CreateConnectionProps) {
  const state = useStore({
    fieldValue: true,
    loading: false,
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
    handleChange(storeVariable: string, event: Event) {
      const newValue = (event.currentTarget as HTMLInputElement | HTMLTextAreaElement)?.value;
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

        state.loading = true;

        await saveConnection({
          url: props.urls?.save,
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
            state.loading = false;

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
      })(event);
    },
    get classes() {
      return {
        fieldContainer: cssClassAssembler(props.classNames?.fieldContainer, defaultClasses.fieldContainer),
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
        textarea: cssClassAssembler(
          props.classNames?.input,
          defaultClasses.input + ' ' + defaultClasses.textarea
        ),
        button: cssClassAssembler(props.classNames?.button, defaultClasses.button),
      };
    },
  });

  return (
    <form onSubmit={(event) => state.save(event)} method='post'>
      <div class={state.classes.fieldContainer}>
        <label for='name' class={state.classes.label}>
          Name
        </label>
        <input
          id='name'
          name='name'
          class={state.classes.input}
          onInput={(event) => state.handleChange('name', event)}
          value={state._name}
          required={false}
          type='text'
          placeholder='MyApp'
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='description' class={state.classes.label}>
          Description
        </label>
        <input
          id='description'
          name='description'
          class={state.classes.input}
          value={state._description}
          onInput={(event) => state.handleChange('description', event)}
          required={false}
          maxLength={100}
          type='text'
          placeholder='A short description not more than 100 characters'
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='tenant' class={state.classes.label}>
          Tenant
        </label>
        <input
          id='tenant'
          name='tenant'
          class={state.classes.input}
          onInput={(event) => state.handleChange('tenant', event)}
          value={state._tenant}
          type='text'
          placeholder='acme.com'
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='product' class={state.classes.label}>
          Product
        </label>
        <input
          id='product'
          name='product'
          class={state.classes.input}
          onInput={(event) => state.handleChange('product', event)}
          value={state._product}
          type='text'
          placeholder='demo'
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='redirectUrl' class={state.classes.label}>
          Allowed redirect URLs (newline separated)
        </label>
        <textarea
          id='redirectUrl'
          name='redirectUrl'
          class={state.classes.textarea}
          onInput={(event) => state.handleChange('redirectUrl', event)}
          value={state._redirectUrl}
          placeholder='http://localhost:3366'
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='defaultRedirectUrl' class={state.classes.label}>
          Default redirect URL
        </label>
        <input
          id='defaultRedirectUrl'
          name='defaultRedirectUrl'
          class={state.classes.input}
          onInput={(event) => state.handleChange('defaultRedirectUrl', event)}
          value={state._defaultRedirectUrl}
          type='url'
          placeholder='http://localhost:3366/login/saml'
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='oidcClientId' class={state.classes.label}>
          Client ID [OIDC Provider]
        </label>
        <input
          id='oidcClientId'
          name='oidcClientId'
          class={state.classes.input}
          onInput={(event) => state.handleChange('oidcClientId', event)}
          value={state._oidcClientId}
          type='text'
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='oidcClientSecret' class={state.classes.label}>
          Client Secret [OIDC Provider]
        </label>
        <input
          id='oidcClientSecret'
          name='oidcClientSecret'
          class={state.classes.input}
          onInput={(event) => state.handleChange('defaultRedirectUrl', event)}
          value={state._oidcClientSecret}
          type='text'
        />
      </div>
      <Show when={state.fieldValue}>
        <div class={state.classes.fieldContainer}>
          <label for='oidcDiscoveryUrl' class={state.classes.label}>
            Well-known URL of OpenID Provider
          </label>
          <button onClick={() => state.toggleButton()}>
            Missing the discovery URL? Click here to set the individual attributes
          </button>
          <input
            id='oidcDiscoveryUrl'
            name='oidcDiscoveryUrl'
            class={state.classes.input}
            onInput={(event) => state.handleChange('oidcDiscoveryUrl', event)}
            value={state._oidcDiscoveryUrl}
            type='url'
            placeholder='https://example.com/.well-known/openid-configuration'
          />
        </div>
      </Show>
      <Show when={!state.fieldValue}>
        <div class={state.classes.fieldContainer}>
          <button onClick={() => state.toggleButton()}>Have a discovery URL? Click here to set it</button>
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='issuer' class={state.classes.label}>
            Issuer
          </label>
          <input
            id='issuer'
            name='issuer'
            class={state.classes.input}
            onInput={(event) => state.handleChange('issuer', event)}
            value={state._issuer}
            type='url'
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='authorization_endpoint' class={state.classes.label}>
            Authorization Endpoint
          </label>
          <input
            id='authorization_endpoint'
            name='authorization_endpoint'
            class={state.classes.input}
            onInput={(event) => state.handleChange('authorization_endpoint', event)}
            value={state._authorization_endpoint}
            type='url'
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='token_endpoint' class={state.classes.label}>
            Token endpoint
          </label>
          <input
            id='token_endpoint'
            name='token_endpoint'
            class={state.classes.input}
            onInput={(event) => state.handleChange('token_endpoint', event)}
            value={state._token_endpoint}
            type='url'
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='jwks_uri' class={state.classes.label}>
            JWKS URI
          </label>
          <input
            id='jwks_uri'
            name='jwks_uri'
            class={state.classes.input}
            onInput={(event) => state.handleChange('jwks_uri', event)}
            value={state._jwks_uri}
            type='url'
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='userinfo_endpoint' class={state.classes.label}>
            UserInfo endpoint
          </label>
          <input
            id='userinfo_endpoint'
            name='userinfo_endpoint'
            class={state.classes.input}
            onInput={(event) => state.handleChange('userinfo_endpoint', event)}
            value={state._userinfo_endpoint}
            type='url'
          />
        </div>
      </Show>

      {/* TODO: bring loading state */}
      <button data-testid='submit-form-create-sso' type='submit' class={state.classes.button}>
        {/* TODO: bring translation support */}
        Save Changes
      </button>
    </form>
  );
}
