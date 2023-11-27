import SecretInputFormControl from '../../../../shared/inputs/SecretInputFormControl/index.lite';
import ToggleConnectionStatus from '../../ToggleConnectionStatus/index.lite';
import { Show, useStore, onUpdate } from '@builder.io/mitosis';
import type {
  EditOIDCConnectionProps,
  FormObj,
  OIDCSSOConnection,
  ApiResponse,
  OIDCSSORecord,
  OIDCFormState,
} from '../../types';
import { saveConnection, deleteConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';
import Button from '../../../../shared/Button/index.lite';
import Spacer from '../../../../shared/Spacer/index.lite';
import ConfirmationPrompt from '../../../../shared/ConfirmationPrompt/index.lite';
import InputField from '../../../../shared/inputs/InputField/index.lite';
import TextArea from '../../../../shared/inputs/TextArea/index.lite';
import Separator from '../../../../shared/Separator/index.lite';
import Card from '../../../../shared/Card/index.lite';
import { InputWithCopyButton } from '../../../../shared';

const INITIAL_VALUES = {
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
} as OIDCFormState;

type Keys = keyof typeof INITIAL_VALUES;
type Values = (typeof INITIAL_VALUES)[Keys];

export default function EditOIDCConnection(props: EditOIDCConnectionProps) {
  const state = useStore({
    oidcConnection: INITIAL_VALUES,
    showDelConfirmation: false,
    toggleDelConfirmation() {
      state.showDelConfirmation = !state.showDelConfirmation;
    },
    hasDiscoveryUrl: true,
    get formVariant() {
      return props.variant || 'basic';
    },
    get classes() {
      return {
        formDiv: cssClassAssembler(props.classNames?.formDiv, defaultClasses.formDiv),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
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
      const id = target.id as Keys;
      const targetValue = (event.currentTarget as HTMLInputElement | HTMLTextAreaElement)?.value;

      state.oidcConnection = state.updateConnection(id, targetValue);
    },
    saveSSOConnection(event: Event) {
      event.preventDefault();

      const formObj: any = { connectionIsOIDC: true };
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
            typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
            return;
          }

          if (rawResponse.ok) {
            typeof props.successCallback === 'function' && props.successCallback(formObj);
          }
        },
      });
    },
    deleteSSOConnection(event: Event) {
      event.preventDefault();

      deleteConnection({
        url: props.urls.delete,
        clientId: state.oidcConnection.clientID!,
        clientSecret: state.oidcConnection.clientSecret!,
        callback: async (rawResponse: any) => {
          const response: ApiResponse = await rawResponse.json();

          if ('error' in response) {
            typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
            return;
          }

          if (rawResponse.ok) {
            typeof props.successCallback === 'function' &&
              props.successCallback({ operation: 'DELETE', connectionIsOIDC: true });
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
    get shouldDisplayInfoCard() {
      if (props.displayInfo !== undefined) {
        return props.displayInfo;
      }
      return true;
    },
    get connectionFetchUrl() {
      return props.urls.get;
    },
  });

  onUpdate(() => {
    async function getConnection(url: string) {
      const response = await fetch(url);
      const apiResponse: ApiResponse<OIDCSSORecord[]> = await response.json();

      if ('error' in apiResponse) {
        typeof props.errorCallback === 'function' && props.errorCallback(apiResponse.error.message);
        return;
      }

      const _connection = apiResponse.data[0];

      if (_connection) {
        state.oidcConnection = {
          ..._connection,
          name: _connection.name || '',
          tenant: _connection.tenant || '',
          product: _connection.product || '',
          description: _connection.description || '',
          redirectUrl: _connection.redirectUrl.join(`\r\n`),
          defaultRedirectUrl: _connection.defaultRedirectUrl,
          oidcClientId: _connection.oidcProvider.clientId || '',
          oidcClientSecret: _connection.oidcProvider.clientSecret || '',
          oidcDiscoveryUrl: _connection.oidcProvider.discoveryUrl || '',
          'oidcMetadata.issuer': _connection.oidcProvider.metadata?.issuer || '',
          'oidcMetadata.authorization_endpoint':
            _connection.oidcProvider.metadata?.authorization_endpoint || '',
          'oidcMetadata.token_endpoint': _connection.oidcProvider.metadata?.token_endpoint || '',
          'oidcMetadata.jwks_uri': _connection.oidcProvider.metadata?.jwks_uri || '',
          'oidcMetadata.userinfo_endpoint': _connection.oidcProvider.metadata?.userinfo_endpoint || '',
        };
      }
      state.hasDiscoveryUrl = _connection.oidcProvider.discoveryUrl ? true : false;
    }
    getConnection(state.connectionFetchUrl);
  }, [state.connectionFetchUrl]);

  return (
    <div>
      <div class={state.classes.formDiv}>
        <div class={defaultClasses.headingContainer}>
          <Show when={state.shouldDisplayHeader}>
            <h5 className={defaultClasses.h5}>Edit SSO Connection</h5>
          </Show>
          <ToggleConnectionStatus
            connection={state.oidcConnection}
            urls={{ patch: props.urls.patch }}
            classNames={{
              confirmationPrompt: {
                button: {
                  ctoa: `${props.classNames?.confirmationPrompt?.button?.ctoa} ${
                    state.oidcConnection.deactivated
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
            <Show when={state.formVariant === 'advanced'}>
              <Show when={!state.isExcluded('name')}>
                <InputField
                  label='Connection name (Optional)'
                  id='name'
                  classNames={state.classes.inputField}
                  placeholder='MyApp'
                  required={false}
                  value={state.oidcConnection.name || ''}
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
                  value={state.oidcConnection.description || ''}
                  handleInputChange={state.handleChange}
                />
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
                  value={state.oidcConnection.redirectUrl || ''}
                  handleInputChange={state.handleChange}
                />
                <div id='redirectUrl-hint' class={defaultClasses.hint}>
                  URL to redirect the user to after login. You can specify multiple URLs by separating them
                  with a new line.
                </div>
                <Spacer y={6} />
              </Show>
              <Show when={!state.isExcluded('defaultRedirectUrl')}>
                <InputField
                  label='Default redirect URL'
                  id='defaultRedirectUrl'
                  classNames={state.classes.inputField}
                  required
                  placeholder='http://localhost:3366/login/saml'
                  type='url'
                  value={state.oidcConnection.defaultRedirectUrl || ''}
                  handleInputChange={state.handleChange}
                />
                <Spacer y={6} />
              </Show>
            </Show>
            <InputField
              label='Client ID [OIDC Provider]'
              id='oidcClientId'
              required={true}
              classNames={state.classes.inputField}
              value={state.oidcConnection.oidcClientId || ''}
              handleInputChange={state.handleChange}
              aria-describedby='oidc-clientid-hint'
            />
            <div id='oidc-clientid-hint' class={defaultClasses.hint}>
              ClientId of the app created on the OIDC Provider.
            </div>
            <Spacer y={6} />
            <SecretInputFormControl
              classNames={{ input: props.classNames?.secretInput }}
              label='Client Secret [OIDC Provider]'
              value={state.oidcConnection.oidcClientSecret}
              id='oidcClientSecret'
              required={true}
              readOnly={false}
              copyDoneCallback={props.successCallback}
              handleChange={state.handleChange}
            />
            <Spacer y={6} />
            <InputField
              id='oidcDiscoveryUrl'
              type='url'
              label='Well-known URL of OpenID Provider'
              classNames={state.classes.inputField}
              value={state.oidcConnection.oidcDiscoveryUrl || ''}
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
              value={state.oidcConnection['oidcMetadata.issuer']!}
              handleInputChange={state.handleChange}
              placeholder='https://example.com'
            />
            <Spacer y={6} />
            <InputField
              id='oidcMetadata.authorization_endpoint'
              type='url'
              label='Authorization Endpoint'
              classNames={state.classes.inputField}
              value={state.oidcConnection['oidcMetadata.authorization_endpoint']!}
              handleInputChange={state.handleChange}
              placeholder='https://example.com/oauth/authorize'
            />
            <Spacer y={6} />
            <InputField
              id='oidcMetadata.token_endpoint'
              type='url'
              label='Token endpoint'
              classNames={state.classes.inputField}
              value={state.oidcConnection['oidcMetadata.token_endpoint']!}
              handleInputChange={state.handleChange}
              placeholder='https://example.com/oauth/token'
            />
            <Spacer y={6} />
            <InputField
              id='oidcMetadata.jwks_uri'
              type='url'
              label='JWKS URI'
              classNames={state.classes.inputField}
              value={state.oidcConnection['oidcMetadata.jwks_uri']!}
              handleInputChange={state.handleChange}
              placeholder='https://example.com/.well-known/jwks.json'
            />
            <Spacer y={6} />
            <InputField
              id='oidcMetadata.userinfo_endpoint'
              type='url'
              label='UserInfo endpoint'
              classNames={state.classes.inputField}
              value={state.oidcConnection['oidcMetadata.userinfo_endpoint']!}
              handleInputChange={state.handleChange}
              placeholder='https://example.com/userinfo'
            />
            <Spacer y={6} />
            <div class={defaultClasses.formAction}>
              <Show when={typeof props.cancelCallback === 'function'}>
                <Button type='button' name='Cancel' handleClick={props.cancelCallback} variant='outline' />
              </Show>
              <Button type='submit' name='Save' classNames={props.classNames?.button?.ctoa} />
            </div>
            <Spacer y={6} />
            <Show when={state.shouldDisplayInfoCard}>
              <Card title='Connection info' variant='info' arrangement='vertical'>
                <div class={defaultClasses.info}>
                  <Show when={state.formVariant === 'advanced'}>
                    <Show when={!state.isExcluded('tenant')}>
                      <InputField
                        label='Tenant'
                        id='tenant'
                        placeholder='acme.com'
                        classNames={state.classes.inputField}
                        required={true}
                        readOnly={true}
                        value={state.oidcConnection.tenant!}
                      />
                      <Spacer y={6} />
                    </Show>
                    <Show when={!state.isExcluded('product')}>
                      <InputField
                        label='Product'
                        id='product'
                        placeholder='demo'
                        classNames={state.classes.inputField}
                        required={true}
                        readOnly={true}
                        value={state.oidcConnection.product!}
                      />
                      <Spacer y={6} />
                    </Show>
                  </Show>
                  <InputWithCopyButton
                    text={state.oidcConnection.clientID || ''}
                    classNames={state.classes.inputField}
                    label='Client ID'
                    copyDoneCallback={props.successCallback}
                  />
                  <Spacer y={6} />
                  <SecretInputFormControl
                    classNames={{ input: props.classNames?.secretInput }}
                    label='Client Secret'
                    value={state.oidcConnection.clientSecret}
                    id='clientSecret'
                    required={true}
                    readOnly={true}
                    copyDoneCallback={props.successCallback}
                    handleChange={state.handleChange}
                  />
                </div>
              </Card>
            </Show>
            <Spacer y={4} />
            <Show when={state.oidcConnection.clientID && state.oidcConnection.clientSecret}>
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
