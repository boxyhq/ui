import { useStore, Show } from '@builder.io/mitosis';
import { CreateConnectionProps } from '../../types';
import { ApiResponse } from '../../types';
import { saveConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';

const INITIAL_VALUES = {
  oidcConnection: {
    name: '',
    description: '',
    tenant: '',
    product: '',
    redirectUrl: '',
    defaultRedirectUrl: '',
    oidcClientSecret: '',
    oidcClientId: '',
    oidcDiscoveryUrl: '',
    issuer: '',
    authorization_endpoint: '',
    token_endpoint: '',
    jwks_uri: '',
    userinfo_endpoint: '',
  },
};

type Keys = keyof typeof INITIAL_VALUES.oidcConnection;
type Values = (typeof INITIAL_VALUES.oidcConnection)[Keys];

export default function CreateOIDCConnection(props: CreateConnectionProps) {
  const state = useStore({
    fieldValue: true,
    loading: false,
    oidcConnection: INITIAL_VALUES.oidcConnection,
    toggleButton() {
      state.fieldValue = !state.fieldValue;
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
    save(event: Event) {
      void (async function (e) {
        e.preventDefault();

        state.loading = true;

        await saveConnection({
          url: props.urls?.save,
          formObj: { ...state.oidcConnection },
          connectionIsOIDC: true,
          setupLinkToken: props.setupLinkToken,
          callback: async (rawResponse: any) => {
            state.loading = false;

            state.oidcConnection = INITIAL_VALUES.oidcConnection;

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
          onInput={(event) => state.handleChange(event)}
          value={state.oidcConnection.name}
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
          value={state.oidcConnection.description}
          onInput={(event) => state.handleChange(event)}
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
          onInput={(event) => state.handleChange(event)}
          value={state.oidcConnection.tenant}
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
          onInput={(event) => state.handleChange(event)}
          value={state.oidcConnection.product}
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
          onInput={(event) => state.handleChange(event)}
          value={state.oidcConnection.redirectUrl}
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
          onInput={(event) => state.handleChange(event)}
          value={state.oidcConnection.defaultRedirectUrl}
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
          onInput={(event) => state.handleChange(event)}
          value={state.oidcConnection.oidcClientId}
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
          onInput={(event) => state.handleChange(event)}
          value={state.oidcConnection.oidcClientSecret}
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
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection.oidcDiscoveryUrl}
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
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection.issuer}
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
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection.authorization_endpoint}
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
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection.token_endpoint}
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
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection.jwks_uri}
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
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection.userinfo_endpoint}
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
