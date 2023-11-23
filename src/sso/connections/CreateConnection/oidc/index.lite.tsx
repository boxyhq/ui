import { useStore, Show } from '@builder.io/mitosis';
import type { CreateConnectionProps, FormObj, OIDCSSOConnection, ApiResponse } from '../../types';
import { saveConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';
import Button from '../../../../shared/Button/index.lite';
import Spacer from '../../../../shared/Spacer/index.lite';
import Separator from '../../../../shared/Separator/index.lite';
import Anchor from '../../../../shared/Anchor/index.lite';
import InputField from '../../../../shared/inputs/InputField/index.lite';
import TextArea from '../../../../shared/inputs/TextArea/index.lite';
import SecretInputFormControl from '../../../../shared/inputs/SecretInputFormControl/index.lite';

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
        url: props.urls.post,
        formObj: formObj as FormObj,
        connectionIsOIDC: true,
        callback: async (rawResponse: any) => {
          state.loading = false;

          const response: ApiResponse = await rawResponse.json();

          if ('error' in response) {
            typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
            return;
          }

          if (rawResponse.ok) {
            typeof props.successCallback === 'function' &&
              props.successCallback({
                operation: 'CREATE',
                connection: response.data,
                connectionIsOIDC: true,
              });
          }
        },
      });
    },
    get classes() {
      return {
        form: cssClassAssembler(props.classNames?.form, defaultClasses.form),
        inputField: {
          label: props.classNames?.label,
          input: props.classNames?.input,
          container: props.classNames?.fieldContainer,
        },
        textarea: {
          label: props.classNames?.label,
          textarea: props.classNames?.textarea,
          container: props.classNames?.fieldContainer,
        },
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
        <h2 class={defaultClasses.heading}>Create SSO Connection</h2>
      </Show>
      <form onSubmit={(event) => state.save(event)} method='post' class={state.classes.form}>
        <Show when={state.formVariant === 'advanced'}>
          <Show when={!state.isExcluded('name')}>
            <InputField
              label='Connection name (Optional)'
              id='name'
              name='name'
              classNames={state.classes.inputField}
              placeholder='MyApp'
              required={false}
              value={state.oidcConnection.name}
              handleInputChange={state.handleChange}
            />
            <Spacer y={6} />
          </Show>
          <Show when={!state.isExcluded('description')}>
            <InputField
              label='Description (Optional)'
              id='description'
              name='description'
              classNames={state.classes.inputField}
              placeholder='A short description not more than 100 characters'
              required={false}
              maxLength={100}
              value={state.oidcConnection.description}
              handleInputChange={state.handleChange}
            />
            <Spacer y={6} />
          </Show>
          <Show when={!state.isExcluded('tenant')}>
            <InputField
              label='Tenant'
              id='tenant'
              name='tenant'
              classNames={state.classes.inputField}
              required
              placeholder='acme.com'
              aria-describedby='tenant-hint'
              value={state.oidcConnection.tenant}
              handleInputChange={state.handleChange}
            />
            <div id='tenant-hint' class={defaultClasses.hint}>
              Unique identifier for the tenant to which this SSO connection is linked.See
              <Spacer x={1} />
              <Anchor
                href='https://boxyhq.com/guides/jackson/configuring-saml-sso#sso-connection-identifier'
                linkText='SSO connection identifier.'
              />
            </div>
            <Spacer y={6} />
          </Show>
          <Show when={!state.isExcluded('product')}>
            <InputField
              label='Product'
              id='product'
              name='product'
              classNames={state.classes.inputField}
              required
              placeholder='demo'
              aria-describedby='product-hint'
              value={state.oidcConnection.product}
              handleInputChange={state.handleChange}
            />
            <div id='product-hint' class={defaultClasses.hint}>
              Identifies the product/app to which this SSO connection is linked.
            </div>
            <Spacer y={6} />
          </Show>
          <Show when={!state.isExcluded('redirectUrl')}>
            <TextArea
              label='Allowed redirect URLs (newline separated)'
              id='redirectUrl'
              name='redirectUrl'
              classNames={state.classes.textarea}
              required
              aria-describedby='redirectUrl-hint'
              placeholder='http://localhost:3366'
              value={state.oidcConnection.redirectUrl}
              handleInputChange={state.handleChange}
            />
            <div id='redirectUrl-hint' class={defaultClasses.hint}>
              URL to redirect the user to after login. You can specify multiple URLs by separating them with a
              new line.
            </div>
            <Spacer y={6} />
          </Show>
          <Show when={!state.isExcluded('defaultRedirectUrl')}>
            <InputField
              label='Default redirect URL'
              id='defaultRedirectUrl'
              name='defaultRedirectUrl'
              required
              placeholder='http://localhost:3366/login/saml'
              type='url'
              value={state.oidcConnection.defaultRedirectUrl}
              handleInputChange={state.handleChange}
            />
            <Spacer y={6} />
          </Show>
          <Separator text='OIDC Provider Metadata' />
          <Spacer y={6} />
        </Show>
        <InputField
          label='Client ID'
          id='oidcClientId'
          name='oidcClientId'
          classNames={state.classes.inputField}
          value={state.oidcConnection.oidcClientId}
          handleInputChange={state.handleChange}
          aria-describedby='oidc-clientid-hint'
        />
        <div id='oidc-clientid-hint' class={defaultClasses.hint}>
          ClientId of the app created on the OIDC Provider.
        </div>
        <Spacer y={6} />
        <SecretInputFormControl
          label='Client Secret'
          id='oidcClientSecret'
          readOnly={false}
          handleChange={state.handleChange}
          value={state.oidcConnection.oidcClientSecret}
          required
          aria-describedby='oidc-clientsecret-hint'
        />
        <div id='oidc-clientsecret-hint' class={defaultClasses.hint}>
          ClientSecret of the app created on the OIDC Provider.
        </div>
        <Spacer y={6} />
        <InputField
          id='oidcDiscoveryUrl'
          name='oidcDiscoveryUrl'
          type='url'
          label='Well-known URL of OpenID Provider'
          classNames={state.classes.inputField}
          value={state.oidcConnection.oidcDiscoveryUrl}
          handleInputChange={state.handleChange}
          placeholder='https://example.com/.well-known/openid-configuration'
          aria-describedby='oidc-metadata-hint'
        />
        <div id='oidc-metadata-hint' class={defaultClasses.hint}>
          Enter the well known discovery path of OpenID provider or manually enter the OpenId provider
          metadata below.
        </div>
        <Spacer y={6} />
        <Separator text='OR' />
        <Spacer y={6} />
        <InputField
          id='issuer'
          name='oidcMetadata.issuer'
          label='Issuer'
          classNames={state.classes.inputField}
          value={state.oidcConnection['oidcMetadata.issuer']}
          handleInputChange={state.handleChange}
          placeholder='https://example.com'
        />
        <Spacer y={6} />
        <InputField
          id='authorization_endpoint'
          name='oidcMetadata.authorization_endpoint'
          type='url'
          label='Authorization Endpoint'
          classNames={state.classes.inputField}
          value={state.oidcConnection['oidcMetadata.authorization_endpoint']}
          handleInputChange={state.handleChange}
          placeholder='https://example.com/oauth/authorize'
        />
        <Spacer y={6} />
        <InputField
          id='token_endpoint'
          name='oidcMetadata.token_endpoint'
          type='url'
          label='Token endpoint'
          classNames={state.classes.inputField}
          value={state.oidcConnection['oidcMetadata.token_endpoint']}
          handleInputChange={state.handleChange}
          placeholder='https://example.com/oauth/token'
        />
        <Spacer y={6} />
        <InputField
          id='jwks_uri'
          name='oidcMetadata.jwks_uri'
          type='url'
          label='JWKS URI'
          classNames={state.classes.inputField}
          value={state.oidcConnection['oidcMetadata.jwks_uri']}
          handleInputChange={state.handleChange}
          placeholder='https://example.com/.well-known/jwks.json'
        />
        <Spacer y={6} />
        <InputField
          id='userinfo_endpoint'
          name='oidcMetadata.userinfo_endpoint'
          type='url'
          label='UserInfo endpoint'
          classNames={state.classes.inputField}
          value={state.oidcConnection['oidcMetadata.userinfo_endpoint']}
          handleInputChange={state.handleChange}
          placeholder='https://example.com/userinfo'
        />
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
