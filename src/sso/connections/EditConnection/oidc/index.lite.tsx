import SecretInputFormControl from '../../../../shared/SecretInputFormControl/index.lite';
import ToggleConnectionStatus from '../../ToggleConnectionStatus/index.lite';
import { Show, useStore, onUpdate } from '@builder.io/mitosis';
import type {
  EditOIDCConnectionProps,
  FormObj,
  OIDCSSOConnection,
  ApiResponse,
  CreateConnectionProps,
} from '../../types';
import { saveConnection, deleteConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';
import Button from '../../../../shared/Button/index.lite';
import Spacer from '../../../../shared/Spacer/index.lite';
import ConfirmationPrompt from '../../../../shared/ConfirmationPrompt/index.lite';

const DEFAULT_VALUES = {
  variant: 'basic',
} satisfies Partial<CreateConnectionProps>;

const INITIAL_VALUES = {
  oidcConnection: {
    name: '',
    tenant: '',
    product: '',
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
    showDelConfirmation: false,
    toggleDelConfirmation() {
      state.showDelConfirmation = !state.showDelConfirmation;
    },
    hasDiscoveryUrl: true,
    get formVariant() {
      return props.variant || DEFAULT_VALUES.variant;
    },
    get classes() {
      return {
        formDiv: cssClassAssembler(props.classNames?.formDiv, defaultClasses.formDiv),
        fieldsContainer: cssClassAssembler(props.classNames?.fieldsContainer, defaultClasses.fieldsContainer),
        fieldsDiv: cssClassAssembler(props.classNames?.fieldsDiv, defaultClasses.fieldsDiv),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
        textarea: cssClassAssembler(props.classNames?.textarea, defaultClasses.textarea),
        section: cssClassAssembler(props.classNames?.section, defaultClasses.section),
      };
    },
    isExcluded(fieldName: keyof OIDCSSOConnection) {
      return !!(props.excludeFields as (keyof OIDCSSOConnection)[])?.includes(fieldName);
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
        url: props.urls.patch,
        isEditView: true,
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
    get shouldDisplayHeader() {
      if (props.displayHeader !== undefined) {
        return props.displayHeader;
      }
      return true;
    },
  });

  onUpdate(() => {
    state.oidcConnection = {
      name: props.connection.name || '',
      tenant: props.connection.tenant || '',
      product: props.connection.product || '',
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
  }, [props.connection]);

  return (
    <div>
      <div class={defaultClasses.formDiv}>
        <div class={defaultClasses.headingContainer}>
          <Show when={state.shouldDisplayHeader}>
            <h2 className={defaultClasses.heading}>Edit SSO Connection</h2>
          </Show>
          <ToggleConnectionStatus
            connection={props.connection}
            urls={{ patch: props.urls.patch }}
            classNames={{
              confirmationPrompt: {
                button: {
                  ctoa: `${props.classNames?.confirmationPrompt?.button?.ctoa} ${
                    props.connection.deactivated
                      ? props.classNames?.button?.ctoa
                      : props.classNames?.button?.destructive
                  }`.trim(),
                  cancel: props.classNames?.confirmationPrompt?.button?.cancel,
                },
              },
            }}
            errorCallback={props.errorCallback}
            successCallback={props.successCallback}
          />
        </div>
        <div>
          <form onSubmit={(event) => state.saveSSOConnection(event)} method='post'>
            <div class={state.classes.fieldsContainer}>
              <div class={state.classes.fieldsDiv}>
                <Show when={state.formVariant === 'advanced'}>
                  <Show when={!state.isExcluded('name')}>
                    <div class={defaultClasses.field}>
                      <div class={defaultClasses.labelDiv}>
                        <label for='name' class={state.classes.label}>
                          Name
                        </label>
                      </div>
                      <input
                        class={state.classes.input}
                        name='name'
                        id='name'
                        type='text'
                        placeholder='MyApp'
                        onInput={(event) => state.handleChange(event)}
                        value={state.oidcConnection.name}
                      />
                    </div>
                  </Show>
                  <Show when={!state.isExcluded('description')}>
                    <div class={defaultClasses.field}>
                      <div class={defaultClasses.labelDiv}>
                        <label for='description' class={state.classes.label}>
                          Description
                        </label>
                      </div>
                      <input
                        class={state.classes.input}
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
                  </Show>
                  <Show when={!state.isExcluded('redirectUrl')}>
                    <div class={defaultClasses.field}>
                      <div class={defaultClasses.labelDiv}>
                        <label for='redirectUrl' class={state.classes.label}>
                          Allowed redirect URLs (newline separated)
                        </label>
                      </div>
                      <textarea
                        class={state.classes.textarea}
                        id='redirectUrl'
                        name='redirectUrl'
                        required={true}
                        rows={3}
                        placeholder='http://localhost:3366'
                        onInput={(event) => state.handleChange(event)}
                        value={state.oidcConnection.redirectUrl}
                      />
                    </div>
                  </Show>
                  <Show when={!state.isExcluded('defaultRedirectUrl')}>
                    <div class={defaultClasses.field}>
                      <div class={defaultClasses.labelDiv}>
                        <label for='defaultRedirectUrl' class={state.classes.label}>
                          Default redirect URL
                        </label>
                      </div>
                      <input
                        class={state.classes.input}
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
                </Show>
                <div class={defaultClasses.field}>
                  <div class={defaultClasses.labelDiv}>
                    <label for='oidcClientId' class={state.classes.label}>
                      Client ID [OIDC Provider]
                    </label>
                  </div>
                  <input
                    class={state.classes.input}
                    name='oidcClientId'
                    id='oidcClientId'
                    required={true}
                    type='text'
                    placeholder=''
                    onInput={(event) => state.handleChange(event)}
                    value={state.oidcConnection.oidcClientId}
                  />
                </div>
                <SecretInputFormControl
                  classNames={{ input: props.classNames?.secretInput }}
                  label='Client Secret [OIDC Provider]'
                  value={state.oidcConnection.oidcClientSecret}
                  id='oidcClientSecret'
                  placeholder=''
                  required={true}
                  readOnly={false}
                  copyDoneCallback={props.copyDoneCallback}
                  handleChange={state.handleChange}
                />
                <Show when={state.hasDiscoveryUrl}>
                  <div class={defaultClasses.field}>
                    <div class={defaultClasses.labelDiv}>
                      <label for='oidcDiscoveryUrl' class={state.classes.label}>
                        Well-known URL of OpenID Provider
                      </label>
                      <button
                        type='button'
                        class={defaultClasses.hint}
                        onClick={() => state.toggleHasDiscoveryUrl()}>
                        Missing the discovery URL? Click here to set the individual attributes
                      </button>
                    </div>
                    <input
                      class={state.classes.input}
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
                  <div class={defaultClasses.field}>
                    <div class={defaultClasses.labelDiv}>
                      <label for='issuer' class={state.classes.label}>
                        Issuer
                      </label>
                      <button
                        type='button'
                        class={defaultClasses.hint}
                        onClick={() => state.toggleHasDiscoveryUrl()}>
                        Have a discovery URL? Click here to set it
                      </button>
                    </div>
                    <input
                      class={state.classes.input}
                      name='oidcMetadata.issuer'
                      id='issuer'
                      type='url'
                      onInput={(event) => state.handleChange(event)}
                      value={state.oidcConnection['oidcMetadata.issuer']}
                    />
                  </div>
                  <div class={defaultClasses.field}>
                    <div class={defaultClasses.labelDiv}>
                      <label for='authorization_endpoint' class={state.classes.label}>
                        Authorization Endpoint
                      </label>
                    </div>
                    <input
                      class={state.classes.input}
                      id='authorization_endpoint'
                      name='oidcMetadata.authorization_endpoint'
                      type='url'
                      onInput={(event) => state.handleChange(event)}
                      value={state.oidcConnection['oidcMetadata.authorization_endpoint']}
                    />
                  </div>
                  <div class={defaultClasses.field}>
                    <div class={defaultClasses.labelDiv}>
                      <label for='token_endpoint' class={state.classes.label}>
                        Token endpoint
                      </label>
                    </div>
                    <input
                      class={state.classes.input}
                      id='token_endpoint'
                      name='oidcMetadata.token_endpoint'
                      type='url'
                      onInput={(event) => state.handleChange(event)}
                      value={state.oidcConnection['oidcMetadata.token_endpoint']}
                    />
                  </div>
                  <div class={defaultClasses.field}>
                    <div class={defaultClasses.labelDiv}>
                      <label for='jwks_uri' class={state.classes.label}>
                        JWKS URI
                      </label>
                    </div>
                    <input
                      class={state.classes.input}
                      id='jwks_uri'
                      name='oidcMetadata.jwks_uri'
                      type='url'
                      onInput={(event) => state.handleChange(event)}
                      value={state.oidcConnection['oidcMetadata.jwks_uri']}
                    />
                  </div>
                  <div class={defaultClasses.field}>
                    <div class={defaultClasses.labelDiv}>
                      <label for='userinfo_endpoint' class={state.classes.label}>
                        UserInfo endpoint
                      </label>
                    </div>
                    <input
                      class={state.classes.input}
                      id='userinfo_endpoint'
                      name='oidcMetadata.userinfo_endpoint'
                      type='url'
                      onInput={(event) => state.handleChange(event)}
                      value={state.oidcConnection['oidcMetadata.userinfo_endpoint']}
                    />
                  </div>
                </Show>
              </div>
              <div class={state.classes.fieldsDiv}>
                <Show when={state.formVariant === 'advanced'}>
                  <Show when={!state.isExcluded('tenant')}>
                    <div class={defaultClasses.field}>
                      <div class={defaultClasses.labelDiv}>
                        <label for='tenant' class={state.classes.label}>
                          Tenant
                        </label>
                      </div>
                      <input
                        class={state.classes.input}
                        name='tenant'
                        id='tenant'
                        placeholder='acme.com'
                        type='text'
                        required={true}
                        disabled={true}
                        value={props.connection.tenant}
                      />
                    </div>
                  </Show>
                  <Show when={!state.isExcluded('product')}>
                    <div class={defaultClasses.field}>
                      <div class={defaultClasses.labelDiv}>
                        <label for='product' class={state.classes.label}>
                          Product
                        </label>
                      </div>
                      <input
                        class={state.classes.input}
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
                </Show>
                <div class={defaultClasses.field}>
                  <div class={defaultClasses.labelDiv}>
                    <label for='clientID' class={state.classes.label}>
                      Client ID
                    </label>
                  </div>
                  <input
                    class={state.classes.input}
                    name='clientID'
                    id='clientID'
                    type='text'
                    required={true}
                    disabled={true}
                    value={props.connection.clientID}
                  />
                </div>
                <SecretInputFormControl
                  classNames={{ input: props.classNames?.secretInput }}
                  label='Client Secret'
                  value={props.connection.clientSecret}
                  id='clientSecret'
                  required={true}
                  readOnly={true}
                  copyDoneCallback={props.copyDoneCallback}
                  handleChange={state.handleChange}
                />
              </div>
            </div>
            <Spacer y={4} />
            <div class={defaultClasses.formAction}>
              <Show when={typeof props.cancelCallback === 'function'}>
                <Button type='button' name='Cancel' handleClick={props.cancelCallback} variant='outline' />
              </Show>
              <Button type='submit' name='Save' classNames={props.classNames?.button?.ctoa} />
            </div>
            <Show when={props.connection?.clientID && props.connection.clientSecret}>
              <section class={state.classes.section}>
                <div class={defaultClasses.info}>
                  <h6 class={defaultClasses.sectionHeading}>Delete this connection</h6>
                  <p class={defaultClasses.sectionPara}>
                    All your apps using this connection will stop working.
                  </p>
                </div>
                <Show when={!state.showDelConfirmation}>
                  <Button
                    name='Delete'
                    handleClick={state.toggleDelConfirmation}
                    variant='outline'
                    type='button'
                    classNames={props.classNames?.button?.destructive}
                  />
                </Show>
                <Show when={state.showDelConfirmation}>
                  <ConfirmationPrompt
                    ctoaVariant='destructive'
                    classNames={{
                      button: {
                        ctoa: `${props.classNames?.button?.destructive} ${props.classNames?.confirmationPrompt?.button?.ctoa}`.trim(),
                        cancel: props.classNames?.confirmationPrompt?.button?.cancel,
                      },
                    }}
                    cancelCallback={state.toggleDelConfirmation}
                    promptMessage='Are you sure you want to delete the Connection? This action cannot be undone and will permanently delete the Connection.'
                    confirmationCallback={state.deleteSSOConnection}
                  />
                </Show>
              </section>
            </Show>
          </form>
        </div>
      </div>
    </div>
  );
}
