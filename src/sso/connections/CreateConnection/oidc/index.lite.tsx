import { useStore, Show, onUpdate } from '@builder.io/mitosis';
import type { CreateConnectionProps, FormObj, OIDCSSOConnection } from '../../types';
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
    oidcConnection: INITIAL_VALUES.oidcConnection,
    isSaving: false,
    updateConnection(key: Keys, newValue: Values) {
      return { ...state.oidcConnection, [key]: newValue };
    },
    handleChange(event: Event) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      const id = target.id as Keys;
      const targetValue = (event.currentTarget as HTMLInputElement | HTMLTextAreaElement)?.value;
      state.oidcConnection = state.updateConnection(id, targetValue);
    },
    save(event: Event) {
      event.preventDefault();

      const formObj = {} as Partial<OIDCSSOConnection>;
      Object.entries(state.oidcConnection).map(([key, val]) => {
        if (key.startsWith('oidcMetadata.')) {
          if (formObj.oidcMetadata === undefined) {
            formObj.oidcMetadata = {} as Exclude<OIDCSSOConnection['oidcMetadata'], undefined>;
          }
          formObj.oidcMetadata[key.replace('oidcMetadata.', '')] = val;
        } else {
          formObj[key as keyof Omit<OIDCSSOConnection, 'oidcMetadata'>] = val;
        }
      });
      state.isSaving = true;
      saveConnection({
        url: props.urls.post,
        formObj: formObj as FormObj,
        connectionIsOIDC: true,
        callback: async (data) => {
          state.isSaving = false;
          if (data) {
            if ('error' in data) {
              typeof props.errorCallback === 'function' && props.errorCallback(data.error.message);
            } else {
              typeof props.successCallback === 'function' &&
                props.successCallback({ operation: 'CREATE', connection: data, connectionIsOIDC: true });
            }
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

  onUpdate(() => {
    if (props.tenant) {
      state.oidcConnection = state.updateConnection('tenant', props.tenant);
    }
    if (props.product) {
      state.oidcConnection = state.updateConnection('product', props.product);
    }
  }, [props.tenant, props.product]);

  return (
    <div>
      <Show when={state.shouldDisplayHeader}>
        <h5 class={defaultClasses.h5}>Create SSO Connection</h5>
      </Show>
      <form onSubmit={(event) => state.save(event)} method='post' class={state.classes.form}>
        <Show when={state.formVariant === 'advanced'}>
          <Show when={!state.isExcluded('name')}>
            <InputField
              label='Connection name (Optional)'
              id='name'
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
              classNames={state.classes.inputField}
              required
              aria-describedby='defaultRedirectUrl-hint'
              placeholder='http://localhost:3366'
              type='url'
              value={state.oidcConnection.defaultRedirectUrl}
              handleInputChange={state.handleChange}
            />
            <div id='defaultRedirectUrl-hint' class={defaultClasses.hint}>
              URL to redirect the user to after an IdP initiated login.
            </div>
            <Spacer y={6} />
          </Show>
          <Separator text='OIDC Provider Metadata' />
          <Spacer y={6} />
        </Show>
        <InputField
          label='Client ID'
          id='oidcClientId'
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
          classNames={state.classes.inputField}
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
          id='oidcMetadata.issuer'
          label='Issuer'
          classNames={state.classes.inputField}
          value={state.oidcConnection['oidcMetadata.issuer']}
          handleInputChange={state.handleChange}
          placeholder='https://example.com'
        />
        <Spacer y={6} />
        <InputField
          id='oidcMetadata.authorization_endpoint'
          type='url'
          label='Authorization Endpoint'
          classNames={state.classes.inputField}
          value={state.oidcConnection['oidcMetadata.authorization_endpoint']}
          handleInputChange={state.handleChange}
          placeholder='https://example.com/oauth/authorize'
        />
        <Spacer y={6} />
        <InputField
          id='oidcMetadata.token_endpoint'
          type='url'
          label='Token endpoint'
          classNames={state.classes.inputField}
          value={state.oidcConnection['oidcMetadata.token_endpoint']}
          handleInputChange={state.handleChange}
          placeholder='https://example.com/oauth/token'
        />
        <Spacer y={6} />
        <InputField
          id='oidcMetadata.jwks_uri'
          type='url'
          label='JWKS URI'
          classNames={state.classes.inputField}
          value={state.oidcConnection['oidcMetadata.jwks_uri']}
          handleInputChange={state.handleChange}
          placeholder='https://example.com/.well-known/jwks.json'
        />
        <Spacer y={6} />
        <InputField
          id='oidcMetadata.userinfo_endpoint'
          type='url'
          label='UserInfo endpoint'
          classNames={state.classes.inputField}
          value={state.oidcConnection['oidcMetadata.userinfo_endpoint']}
          handleInputChange={state.handleChange}
          placeholder='https://example.com/userinfo'
          autocomplete='one-time-code'
        />
        <Spacer y={6} />
        {/* TODO: bring loading state */}
        {/* TODO: bring translation support */}
        <div class={defaultClasses.formAction}>
          <Show when={typeof props.cancelCallback === 'function'}>
            <Button type='button' name='Cancel' handleClick={props.cancelCallback} variant='outline' />
          </Show>
          <Button
            type='submit'
            name='Save'
            classNames={props.classNames?.button?.ctoa}
            isLoading={state.isSaving}
          />
        </div>
      </form>
    </div>
  );
}
