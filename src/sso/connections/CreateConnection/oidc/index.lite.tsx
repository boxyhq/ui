import { useStore, Show } from '@builder.io/mitosis';
import type { CreateConnectionProps, FormObj, OIDCSSOConnection, ApiResponse } from '../../types';
import { saveConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';
import Button from '../../../../shared/Button/index.lite';
import Spacer from '../../../../shared/Spacer/index.lite';
import Separator from '../../../../shared/Separator/index.lite';
import Well from '../../../../shared/Well/index.lite';

const DEFAULT_VALUES = {
  variant: 'basic',
} satisfies Partial<CreateConnectionProps>;

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
    'oidcMetadata.issuer': '',
    'oidcMetadata.authorization_endpoint': '',
    'oidcMetadata.token_endpoint': '',
    'oidcMetadata.jwks_uri': '',
    'oidcMetadata.userinfo_endpoint': '',
  },
};

type Keys = keyof typeof INITIAL_VALUES.oidcConnection;
type Values = (typeof INITIAL_VALUES.oidcConnection)[Keys];

export default function CreateOIDCConnection(props: CreateConnectionProps) {
  const state = useStore({
    loading: false,
    oidcConnection: INITIAL_VALUES.oidcConnection,
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
      event.preventDefault();

      state.loading = true;

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
    },
    get classes() {
      return {
        form: cssClassAssembler(props.classNames?.form, defaultClasses.form),
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
    get formVariant() {
      return props.variant || DEFAULT_VALUES.variant;
    },
    isExcluded(fieldName: keyof OIDCSSOConnection) {
      return !!(props.excludeFields as (keyof OIDCSSOConnection)[])?.includes(fieldName);
    },
  });

  return (
    <div>
      <h2 class={defaultClasses.heading}>Create OIDC Connection</h2>
      <Well>
        <form onSubmit={(event) => state.save(event)} method='post' class={state.classes.form}>
          <Show when={state.formVariant === 'advanced'}>
            <Show when={!state.isExcluded('name')}>
              <div class={state.classes.fieldContainer}>
                <label for='name' class={state.classes.label}>
                  Connection name (Optional)
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
            </Show>
            <Show when={!state.isExcluded('description')}>
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
            </Show>
            <Show when={!state.isExcluded('tenant')}>
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
                  aria-describedby='tenant-hint'
                />
                <span id='tenant-hint' class={defaultClasses.hint}>
                  Unique identifier for the tenant in your app
                </span>
              </div>
            </Show>
            <Show when={!state.isExcluded('product')}>
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
            </Show>
            <Show when={!state.isExcluded('redirectUrl')}>
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
                  aria-describedby='redirectUrl-hint'
                />
                <span id='redirectUrl-hint' class={defaultClasses.hint}>
                  URL to redirect the user to after login. You can specify multiple URLs by separating them with
                  a new line.
                </span>
              </div>
            </Show>
            <Show when={!state.isExcluded('defaultRedirectUrl')}>
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
            </Show>
          </Show>
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
              required
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
              required
            />
          </div>
          <div class={state.classes.fieldContainer}>
            <label for='oidcDiscoveryUrl' class={state.classes.label}>
              Well-known URL of OpenID Provider
            </label>
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
          <Spacer y={6} />
          <Separator text='OR' />
          <Spacer y={6} />
          <div class={state.classes.fieldContainer}>
            <label for='issuer' class={state.classes.label}>
              Issuer
            </label>
            <input
              id='issuer'
              name='oidcMetadata.issuer'
              class={state.classes.input}
              onInput={(event) => state.handleChange(event)}
              value={state.oidcConnection['oidcMetadata.issuer']}
              type='url'
            />
          </div>
          <div class={state.classes.fieldContainer}>
            <label for='authorization_endpoint' class={state.classes.label}>
              Authorization Endpoint
            </label>
            <input
              id='authorization_endpoint'
              name='oidcMetadata.authorization_endpoint'
              class={state.classes.input}
              onInput={(event) => state.handleChange(event)}
              value={state.oidcConnection['oidcMetadata.authorization_endpoint']}
              type='url'
            />
          </div>
          <div class={state.classes.fieldContainer}>
            <label for='token_endpoint' class={state.classes.label}>
              Token endpoint
            </label>
            <input
              id='token_endpoint'
              name='oidcMetadata.token_endpoint'
              class={state.classes.input}
              onInput={(event) => state.handleChange(event)}
              value={state.oidcConnection['oidcMetadata.token_endpoint']}
              type='url'
            />
          </div>
          <div class={state.classes.fieldContainer}>
            <label for='jwks_uri' class={state.classes.label}>
              JWKS URI
            </label>
            <input
              id='jwks_uri'
              name='oidcMetadata.jwks_uri'
              class={state.classes.input}
              onInput={(event) => state.handleChange(event)}
              value={state.oidcConnection['oidcMetadata.jwks_uri']}
              type='url'
            />
          </div>
          <div class={state.classes.fieldContainer}>
            <label for='userinfo_endpoint' class={state.classes.label}>
              UserInfo endpoint
            </label>
            <input
              id='userinfo_endpoint'
              name='oidcMetadata.userinfo_endpoint'
              class={state.classes.input}
              onInput={(event) => state.handleChange(event)}
              value={state.oidcConnection['oidcMetadata.userinfo_endpoint']}
              type='url'
            />
          </div>
          <Spacer y={4} />
          {/* TODO: bring loading state */}
          {/* TODO: bring translation support */}
          <div class={defaultClasses.formAction}>
            <Show when={typeof props.cancelCallback === 'function'}>
              <Button type='button' name='Cancel' handleClick={props.cancelCallback} variant='outline' />
            </Show>
            <Button type='submit' name='Save' />
          </div>

        </form>
      </Well>
    </div>
  );
}
