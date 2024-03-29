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
import SecretInputFormControl from '../../../../shared/inputs/SecretInputFormControl/index.lite';
import Select from '../../../../shared/Select/index.lite';
import ItemList from '../../../../shared/inputs/ItemList/index.lite';

const DEFAULT_VALUES = {
  variant: 'basic',
} satisfies Partial<CreateConnectionProps>;

const INITIAL_VALUES = {
  oidcConnection: {
    name: '',
    label: '',
    description: '',
    tenant: '',
    product: '',
    redirectUrl: [''],
    defaultRedirectUrl: '',
    oidcClientSecret: '',
    oidcClientId: '',
    oidcDiscoveryUrl: '',
    'oidcMetadata.issuer': '',
    'oidcMetadata.authorization_endpoint': '',
    'oidcMetadata.token_endpoint': '',
    'oidcMetadata.jwks_uri': '',
    'oidcMetadata.userinfo_endpoint': '',
    sortOrder: '' as unknown as string | number,
  },
};

type Keys = keyof typeof INITIAL_VALUES.oidcConnection;
type Values = (typeof INITIAL_VALUES.oidcConnection)[Keys];

export default function CreateOIDCConnection(props: CreateConnectionProps) {
  const state = useStore({
    oidcConnection: INITIAL_VALUES.oidcConnection,
    isSaving: false,
    updateConnection(data: Partial<OIDCSSOConnection>) {
      return { ...state.oidcConnection, ...data };
    },
    handleChange(event: Event) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      const id = target.id as Keys;
      const targetValue = (event.currentTarget as HTMLInputElement | HTMLTextAreaElement)?.value as Values;
      state.oidcConnection = state.updateConnection({ [id]: targetValue });
    },
    handleItemListUpdate(fieldName: string, listValue: string[]) {
      state.oidcConnection = state.updateConnection({ [fieldName]: listValue });
    },
    save(event: Event) {
      event.preventDefault();

      const formObj = {} as any;
      Object.entries(state.oidcConnection).map(([key, val]) => {
        if (key.startsWith('oidcMetadata.')) {
          if (formObj.oidcMetadata === undefined) {
            formObj.oidcMetadata = {} as Exclude<OIDCSSOConnection['oidcMetadata'], undefined>;
          }
          formObj.oidcMetadata[key.replace('oidcMetadata.', '')] = val;
        } else if (key === 'sortOrder') {
          // pass sortOrder only if set to non-empty string
          val !== '' && (formObj[key] = +val); // convert sortOrder into number
        } else {
          formObj[key] = val;
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
        select: {
          label: props.classNames?.label,
          select: props.classNames?.select,
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
    isReadOnly(fieldName: keyof OIDCSSOConnection) {
      if (
        fieldName === 'tenant' &&
        Array.isArray(props.defaults?.tenant) &&
        props.defaults.tenant.length === 1
      ) {
        return true;
      }
      return !!(props.readOnlyFields as (keyof OIDCSSOConnection)[])?.includes(fieldName);
    },
    isTenantADropdown() {
      return Array.isArray(props.defaults?.tenant) && props.defaults.tenant.length > 1;
    },
    get tenantOptions() {
      return Array.isArray(props.defaults?.tenant)
        ? props.defaults?.tenant.map((tenant: string) => ({
            value: tenant,
            text: tenant,
          }))
        : [];
    },
    get shouldDisplayHeader() {
      if (props.displayHeader !== undefined) {
        return props.displayHeader;
      }
      return true;
    },
  });

  onUpdate(() => {
    if (props.defaults) {
      // forceAuthn is a SAML only setting, remove it
      const { forceAuthn, tenant, ...rest } = props.defaults;
      const _tenant = Array.isArray(tenant) ? tenant[0] : tenant;
      state.oidcConnection = state.updateConnection({ ...rest, tenant: _tenant });
    }
  }, [props.defaults]);

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
              readOnly={state.isReadOnly('name')}
              value={state.oidcConnection.name}
              handleInputChange={state.handleChange}
            />
            <Spacer y={6} />
          </Show>
          <Show when={!state.isExcluded('label')}>
            <InputField
              label='Connection label (Optional)'
              id='label'
              classNames={state.classes.inputField}
              placeholder='An internal label to identify the connection'
              required={false}
              readOnly={state.isReadOnly('label')}
              value={state.oidcConnection.label}
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
              readOnly={state.isReadOnly('description')}
              maxLength={100}
              value={state.oidcConnection.description}
              handleInputChange={state.handleChange}
            />
            <Spacer y={6} />
          </Show>
          <Show when={!state.isExcluded('tenant')}>
            <Show when={!state.isTenantADropdown()}>
              <InputField
                label='Tenant'
                id='tenant'
                classNames={state.classes.inputField}
                required
                readOnly={state.isReadOnly('tenant')}
                placeholder='acme.com'
                aria-describedby='tenant-hint'
                value={state.oidcConnection.tenant}
                handleInputChange={state.handleChange}
              />
            </Show>
            <Show when={state.isTenantADropdown()}>
              <div className={defaultClasses.selectContainer}>
                <Select
                  label='Tenant'
                  options={state.tenantOptions}
                  classNames={state.classes.select}
                  selectedValue={state.oidcConnection.tenant}
                  handleChange={state.handleChange}
                  name='tenant'
                  id='tenant'
                />
              </div>
            </Show>
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
              readOnly={state.isReadOnly('product')}
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
            <ItemList
              currentlist={state.oidcConnection.redirectUrl}
              fieldName='redirectUrl'
              handleItemListUpdate={state.handleItemListUpdate}
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
              readOnly={state.isReadOnly('defaultRedirectUrl')}
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
        <Show when={state.formVariant === 'advanced'}>
          <Show when={!state.isExcluded('sortOrder')}>
            <InputField
              label='Sort Order'
              id='sortOrder'
              classNames={state.classes.inputField}
              type='number'
              min='0'
              placeholder='10'
              readOnly={state.isReadOnly('sortOrder')}
              value={state.oidcConnection.sortOrder as string}
              handleInputChange={state.handleChange}
            />
            <div id='sortOrder-hint' class={defaultClasses.hint}>
              Connections will be sorted (in a listing view like IdP Selection) using this setting. Higher
              values will be displayed first.
            </div>
          </Show>
        </Show>
        <Spacer y={6} />
        {/* TODO: bring loading state */}
        {/* TODO: bring translation support */}
        <div class={defaultClasses.formAction}>
          <Show when={typeof props.cancelCallback === 'function'}>
            <Button
              type='button'
              name='Cancel'
              handleClick={props.cancelCallback}
              variant='outline'
              classNames={props.classNames?.button?.cancel}
            />
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
