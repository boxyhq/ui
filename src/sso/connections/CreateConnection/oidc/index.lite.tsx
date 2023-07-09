import { useStore, Show } from '@builder.io/mitosis';
import { CreateConnectionProps } from '../../types';
import { ApiResponse } from '../../types';
import { saveConnection } from '../../utils.lite';
import ButtonPrimary from '../../../../shared/ButtonPrimary.lite';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';

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
    get classes() {
      return {
        fieldContainer: cssClassAssembler(props.classNames?.fieldContainer, defaultClasses.fieldContainer),
        buttonContainer: cssClassAssembler(props.classNames?.buttonContainer, defaultClasses.buttonContainer),
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
        button: cssClassAssembler(props.classNames?.button, defaultClasses.button),
      };
    },
  });

  return (
    <form onSubmit={(event) => state.save(event)}>
      <div class={state.classes.fieldContainer}>
        <label for='name' class={state.classes.label}>
          Name
        </label>
        <input
          name='name'
          class={state.classes.input}
          onChange={(event) => state.handleChange('name', event.target.value)}
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
          name='description'
          class={state.classes.input}
          value={state._description}
          onChange={(event) => state.handleChange('description', event.target.value)}
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
          name='tenant'
          class={state.classes.input}
          onChange={(event) => state.handleChange('tenant', event.target.value)}
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
          name='product'
          class={state.classes.input}
          onChange={(event) => state.handleChange('product', event.target.value)}
          value={state._product}
          type='text'
          placeholder='demo'
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='redirectUrl' class={state.classes.label}>
          Allowed redirect URLs (newline separated)
        </label>
        <input
          name='redirectUrl'
          class={state.classes.input}
          onChange={(event) => state.handleChange('redirectUrl', event.target.value)}
          value={state._redirectUrl}
          type='textarea'
          placeholder='http://localhost:3366'
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='defaultRedirectUrl' class={state.classes.label}>
          Default redirect URL
        </label>
        <input
          name='defaultRedirectUrl'
          class={state.classes.input}
          onChange={(event) => state.handleChange('defaultRedirectUrl', event.target.value)}
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
          name='oidcClientId'
          class={state.classes.input}
          onChange={(event) => state.handleChange('oidcClientId', event.target.value)}
          value={state._oidcClientId}
          type='text'
          placeholder=''
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='oidcClientSecret' class={state.classes.label}>
          Client Secret [OIDC Provider]
        </label>
        <input
          name='oidcClientSecret'
          class={state.classes.input}
          onChange={(event) => state.handleChange('defaultRedirectUrl', event.target.value)}
          value={state._oidcClientSecret}
          type='text'
          placeholder=''
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
            name='oidcDiscoveryUrl'
            class={state.classes.input}
            onChange={(event) => state.handleChange('oidcDiscoveryUrl', event.target.value)}
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
            name='issuer'
            class={state.classes.input}
            onChange={(event) => state.handleChange('issuer', event.target.value)}
            value={state._issuer}
            type='url'
            placeholder=''
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='authorization_endpoint' class={state.classes.label}>
            Authorization Endpoint
          </label>
          <input
            name='authorization_endpoint'
            class={state.classes.input}
            onChange={(event) => state.handleChange('authorization_endpoint', event.target.value)}
            value={state._authorization_endpoint}
            type='url'
            placeholder=''
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='token_endpoint' class={state.classes.label}>
            Token endpoint
          </label>
          <input
            name='token_endpoint'
            class={state.classes.input}
            onChange={(event) => state.handleChange('token_endpoint', event.target.value)}
            value={state._token_endpoint}
            type='url'
            placeholder=''
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='jwks_uri' class={state.classes.label}>
            JWKS URI
          </label>
          <input
            name='jwks_uri'
            class={state.classes.input}
            onChange={(event) => state.handleChange('jwks_uri', event.target.value)}
            value={state._jwks_uri}
            type='url'
            placeholder=''
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='userinfo_endpoint' class={state.classes.label}>
            UserInfo endpoint
          </label>
          <input
            name='userinfo_endpoint'
            class={state.classes.input}
            onChange={(event) => state.handleChange('userinfo_endpoint', event.target.value)}
            value={state._userinfo_endpoint}
            type='url'
            placeholder=''
          />
        </div>
      </Show>
      <div class={state.classes.fieldContainer}>
        <div class={state.classes.buttonContainer}>
          <ButtonPrimary data-testid='submit-form-create-sso'>{props.t('save_changes')}</ButtonPrimary>
        </div>
      </div>
    </form>
  );
}
