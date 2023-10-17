import { useStore, Show } from '@builder.io/mitosis';
import type { CreateConnectionProps, FormObj, OIDCSSOConnection, ApiResponse } from '../../types';
import { saveConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';
import Button from '../../../../shared/Button/index.lite';
import Spacer from '../../../../shared/Spacer/index.lite';
import Separator from '../../../../shared/Separator/index.lite';
import Anchor from '../../../../shared/Anchor/index.lite';

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
            typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
            return;
          }

          if (rawResponse.ok) {
            typeof props.successCallback === 'function' && props.successCallback();
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
      };
    },
    get formVariant() {
      return props.variant || DEFAULT_VALUES.variant;
    },
    isExcluded(fieldName: keyof OIDCSSOConnection) {
      return !!(props.excludeFields as (keyof OIDCSSOConnection)[])?.includes(fieldName);
    },
    get shouldDisplayHeader() {
      if (props.displayHeader !== undefined) {
        return props.displayHeader;
      }
      return true;
    },
  });

  return (
    <div>
      <Show when={state.shouldDisplayHeader}>
        <h2 class={defaultClasses.heading}>Create OIDC Connection</h2>
      </Show>
      <form onSubmit={(event) => state.save(event)} method='post' class={state.classes.form}>
        <Show when={state.formVariant === 'advanced'}>
          <Show when={!state.isExcluded('name')}>
            <div class={state.classes.fieldContainer}>
              <label for='name' class={state.classes.label}>
                Connection name (Optional)
              </label>
              <Spacer y={2} />
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
          <Spacer y={6} />
          <Show when={!state.isExcluded('description')}>
            <div class={state.classes.fieldContainer}>
              <label for='description' class={state.classes.label}>
                Description (Optional)
              </label>
              <Spacer y={2} />
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
          <Spacer y={6} />
          <Show when={!state.isExcluded('tenant')}>
            <div class={state.classes.fieldContainer}>
              <label for='tenant' class={state.classes.label}>
                Tenant
              </label>
              <Spacer y={2} />
              <input
                id='tenant'
                name='tenant'
                required
                class={state.classes.input}
                onInput={(event) => state.handleChange(event)}
                value={state.oidcConnection.tenant}
                type='text'
                placeholder='acme.com'
                aria-describedby='tenant-hint'
              />
              <span id='tenant-hint' class={defaultClasses.hint}>
                Unique identifier for the tenant to which this SSO connection is linked.See
                <Spacer x={1} />
                <Anchor
                  href='https://boxyhq.com/guides/jackson/configuring-saml-sso#sso-connection-identifier'
                  linkText='SSO connection identifier.'
                />
              </span>
            </div>
          </Show>
          <Spacer y={6} />
          <Show when={!state.isExcluded('product')}>
            <div class={state.classes.fieldContainer}>
              <label for='product' class={state.classes.label}>
                Product
              </label>
              <Spacer y={2} />
              <input
                id='product'
                name='product'
                required
                class={state.classes.input}
                onInput={(event) => state.handleChange(event)}
                value={state.oidcConnection.product}
                type='text'
                placeholder='demo'
                aria-describedby='product-hint'
              />
              <span id='product-hint' class={defaultClasses.hint}>
                Identifies the product/app to which this SSO connection is linked.
              </span>
            </div>
          </Show>
          <Spacer y={6} />
          <Show when={!state.isExcluded('redirectUrl')}>
            <div class={state.classes.fieldContainer}>
              <label for='redirectUrl' class={state.classes.label}>
                Allowed redirect URLs (newline separated)
              </label>
              <Spacer y={2} />
              <textarea
                id='redirectUrl'
                name='redirectUrl'
                required
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
          <Spacer y={6} />
          <Show when={!state.isExcluded('defaultRedirectUrl')}>
            <div class={state.classes.fieldContainer}>
              <label for='defaultRedirectUrl' class={state.classes.label}>
                Default redirect URL
              </label>
              <Spacer y={2} />
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
          <Spacer y={6} />
          <Separator text='OIDC Provider Metadata' />
          <Spacer y={6} />
        </Show>
        <div class={state.classes.fieldContainer}>
          <label for='oidcClientId' class={state.classes.label}>
            Client ID
          </label>
          <Spacer y={2} />
          <input
            id='oidcClientId'
            name='oidcClientId'
            class={state.classes.input}
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection.oidcClientId}
            type='text'
            required
            aria-describedby='oidc-clientid-hint'
          />
          <span id='oidc-clientid-hint' class={defaultClasses.hint}>
            ClientId of the app created on the OIDC Provider.
          </span>
        </div>
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <label for='oidcClientSecret' class={state.classes.label}>
            Client Secret
          </label>
          <Spacer y={2} />
          <input
            id='oidcClientSecret'
            name='oidcClientSecret'
            class={state.classes.input}
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection.oidcClientSecret}
            type='text'
            required
            aria-describedby='oidc-clientsecret-hint'
          />
          <span id='oidc-clientsecret-hint' class={defaultClasses.hint}>
            ClientSecret of the app created on the OIDC Provider.
          </span>
        </div>
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <label for='oidcDiscoveryUrl' class={state.classes.label}>
            Well-known URL of OpenID Provider
          </label>
          <Spacer y={2} />
          <input
            id='oidcDiscoveryUrl'
            name='oidcDiscoveryUrl'
            class={state.classes.input}
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection.oidcDiscoveryUrl}
            type='url'
            placeholder='https://example.com/.well-known/openid-configuration'
            aria-describedby='oidc-metadata-hint'
          />
          <span id='oidc-metadata-hint' class={defaultClasses.hint}>
            Enter the well known discovery path of OpenID provider or manually enter the OpenId provider
            metadata below.
          </span>
        </div>
        <Spacer y={6} />
        <Separator text='OR' />
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <label for='issuer' class={state.classes.label}>
            Issuer
          </label>
          <Spacer y={2} />
          <input
            id='issuer'
            name='oidcMetadata.issuer'
            class={state.classes.input}
            placeholder='https://example.com'
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection['oidcMetadata.issuer']}
            type='url'
          />
        </div>
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <label for='authorization_endpoint' class={state.classes.label}>
            Authorization Endpoint
          </label>
          <Spacer y={2} />
          <input
            id='authorization_endpoint'
            name='oidcMetadata.authorization_endpoint'
            class={state.classes.input}
            placeholder='https://example.com/oauth/authorize'
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection['oidcMetadata.authorization_endpoint']}
            type='url'
          />
        </div>
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <label for='token_endpoint' class={state.classes.label}>
            Token endpoint
          </label>
          <Spacer y={2} />
          <input
            id='token_endpoint'
            name='oidcMetadata.token_endpoint'
            class={state.classes.input}
            placeholder='https://example.com/oauth/token'
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection['oidcMetadata.token_endpoint']}
            type='url'
          />
        </div>
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <label for='jwks_uri' class={state.classes.label}>
            JWKS URI
          </label>
          <Spacer y={2} />
          <input
            id='jwks_uri'
            name='oidcMetadata.jwks_uri'
            class={state.classes.input}
            placeholder='https://example.com/.well-known/jwks.json'
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection['oidcMetadata.jwks_uri']}
            type='url'
          />
        </div>
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <label for='userinfo_endpoint' class={state.classes.label}>
            UserInfo endpoint
          </label>
          <Spacer y={2} />
          <input
            id='userinfo_endpoint'
            name='oidcMetadata.userinfo_endpoint'
            class={state.classes.input}
            placeholder='https://example.com/userinfo'
            onInput={(event) => state.handleChange(event)}
            value={state.oidcConnection['oidcMetadata.userinfo_endpoint']}
            type='url'
          />
        </div>
        <Spacer y={6} />
        {/* TODO: bring loading state */}
        {/* TODO: bring translation support */}
        <div class={defaultClasses.formAction}>
          <Show when={typeof props.cancelCallback === 'function'}>
            <Button type='button' name='Cancel' handleClick={props.cancelCallback} variant='outline' />
          </Show>
          <Button type='submit' name='Save' classNames={props.classNames?.button?.ctoa} />
        </div>
      </form>
    </div>
  );
}
