import ToggleConnectionStatus from '../../ToggleConnectionStatus/index.lite';
import { Show, onUpdate, useStore } from '@builder.io/mitosis';
import type {
  EditSAMLConnectionProps,
  ApiResponse,
  SAMLSSOConnection,
  SAMLSSORecord,
  SAMLFormState,
} from '../../types';
import { saveConnection, deleteConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';
import SecretInputFormControl from '../../../../shared/SecretInputFormControl/index.lite';
import Card from '../../../../shared/Card/index.lite';
import Button from '../../../../shared/Button/index.lite';
import Spacer from '../../../../shared/Spacer/index.lite';
import CopyToClipboardButton from '../../../../shared/ClipboardButton/index.lite';
import Separator from '../../../../shared/Separator/index.lite';
import ConfirmationPrompt from '../../../../shared/ConfirmationPrompt/index.lite';
import Checkbox from '../../../../shared/Checkbox/index.lite';

const DEFAULT_VALUES = {
  variant: 'basic',
} satisfies Partial<EditSAMLConnectionProps>;

const INITIAL_VALUES = {
  samlConnection: {
    name: '',
    tenant: '',
    product: '',
    clientID: '',
    clientSecret: '',
    description: '',
    redirectUrl: '',
    defaultRedirectUrl: '',
    rawMetadata: '',
    metadataUrl: '',
    forceAuthn: false as boolean,
  } as Partial<SAMLFormState>,
};

type Keys = keyof typeof INITIAL_VALUES.samlConnection;
type Values = (typeof INITIAL_VALUES.samlConnection)[Keys];

export default function EditSAMLConnection(props: EditSAMLConnectionProps) {
  const state = useStore({
    samlConnection: INITIAL_VALUES.samlConnection,
    showDelConfirmation: false,
    toggleDelConfirmation() {
      state.showDelConfirmation = !state.showDelConfirmation;
    },
    get formVariant() {
      return props.variant || DEFAULT_VALUES.variant;
    },
    get classes() {
      return {
        formDiv: cssClassAssembler(props.classNames?.formDiv, defaultClasses.formDiv),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
        textarea: cssClassAssembler(props.classNames?.textarea, defaultClasses.textarea),
        section: cssClassAssembler(props.classNames?.section, defaultClasses.section),
      };
    },
    isExcluded(fieldName: keyof SAMLSSOConnection) {
      return !!(props.excludeFields as (keyof SAMLSSOConnection)[])?.includes(fieldName);
    },
    updateConnection(key: Keys, newValue: Values) {
      return { ...state.samlConnection, [key]: newValue };
    },
    handleChange(event: Event) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      const name = target.name as Keys;
      const targetValue = name !== 'forceAuthn' ? target.value : (target as HTMLInputElement).checked;

      state.samlConnection = state.updateConnection(name, targetValue);
    },
    saveSSOConnection(event: Event) {
      event.preventDefault();
      const payload =
        props.variant === 'advanced'
          ? { ...state.samlConnection }
          : {
              tenant: state.samlConnection.tenant,
              product: state.samlConnection.product,
              clientID: state.samlConnection.clientID,
              clientSecret: state.samlConnection.clientSecret,
              rawMetadata: state.samlConnection.rawMetadata,
              metadataUrl: state.samlConnection.metadataUrl,
            };
      saveConnection({
        url: props.urls.patch,
        isEditView: true,
        formObj: payload,
        connectionIsSAML: true,
        callback: async (rawResponse: any) => {
          const response: ApiResponse = await rawResponse.json();

          if ('error' in response) {
            typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
            return;
          }

          if (rawResponse.ok) {
            typeof props.successCallback === 'function' &&
              props.successCallback({ operation: 'UPDATE', connection: payload, connectionIsSAML: true });
          }
        },
      });
    },
    deleteSSOConnection(event: Event) {
      event.preventDefault();

      deleteConnection({
        url: props.urls.delete,
        clientId: state.samlConnection.clientID!,
        clientSecret: state.samlConnection.clientSecret!,
        callback: async (rawResponse: any) => {
          const response: ApiResponse = await rawResponse.json();

          if ('error' in response) {
            typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
            return;
          }

          if (rawResponse.ok) {
            typeof props.successCallback === 'function' &&
              props.successCallback({ operation: 'DELETE', connectionIsSAML: true });
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
    get connectionFetchUrl() {
      return props.urls.get;
    },
  });

  onUpdate(() => {
    async function getConnection(url: string) {
      const response = await fetch(url);
      const apiResponse: ApiResponse<SAMLSSORecord[]> = await response.json();

      if ('error' in apiResponse) {
        typeof props.errorCallback === 'function' && props.errorCallback(apiResponse.error.message);
        return;
      }

      const _connection = apiResponse.data[0];

      if (_connection) {
        state.samlConnection = {
          ..._connection,
          name: _connection.name || '',
          tenant: _connection.tenant || '',
          product: _connection.product || '',
          clientID: _connection.clientID,
          clientSecret: _connection.clientSecret,
          description: _connection.description || '',
          redirectUrl: _connection.redirectUrl.join(`\r\n`),
          defaultRedirectUrl: _connection.defaultRedirectUrl,
          rawMetadata: _connection.rawMetadata || '',
          metadataUrl: _connection.metadataUrl || '',
          forceAuthn: _connection.forceAuthn === true || _connection.forceAuthn === 'true',
        };
      }
    }
    getConnection(state.connectionFetchUrl);
  }, [state.connectionFetchUrl]);

  return (
    <div>
      <div class={defaultClasses.formDiv}>
        <div class={defaultClasses.headingContainer}>
          <Show when={state.shouldDisplayHeader}>
            <h2 className={defaultClasses.heading}>Edit SSO Connection</h2>
          </Show>
          <ToggleConnectionStatus
            connection={state.samlConnection}
            urls={{ patch: props.urls.patch }}
            classNames={{
              confirmationPrompt: {
                button: {
                  ctoa: `${props.classNames?.confirmationPrompt?.button?.ctoa} ${
                    state.samlConnection.deactivated
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
                <div class={defaultClasses.field}>
                  <div class={defaultClasses.labelDiv}>
                    <label for='name' class={state.classes.label}>
                      Name
                    </label>
                  </div>
                  <input
                    class={state.classes.input}
                    type='text'
                    name='name'
                    id='name'
                    placeholder='MyApp'
                    required={false}
                    onInput={(event) => state.handleChange(event)}
                    value={state.samlConnection.name}
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
                    type='text'
                    name='description'
                    id='description'
                    placeholder='A short description not more than 100 characters'
                    maxLength={100}
                    required={false}
                    onInput={(event) => state.handleChange(event)}
                    value={state.samlConnection.description}
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
                    value={state.samlConnection.redirectUrl}
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
                    value={state.samlConnection.defaultRedirectUrl}
                  />
                </div>
              </Show>
            </Show>
            <div class={defaultClasses.field}>
              <div class={defaultClasses.labelWithAction}>
                <label for='rawMetadata' class={state.classes.label}>
                  Raw IdP XML
                </label>
              </div>
              <textarea
                class={state.classes.textarea}
                name='rawMetadata'
                id='rawMetadata'
                placeholder='Paste the raw XML here'
                rows={5}
                required={state.samlConnection.metadataUrl === ''}
                onChange={(event) => state.handleChange(event)}
                value={state.samlConnection.rawMetadata}
              />
            </div>
            <Separator text='OR' />
            <Spacer y={6} />
            <div class={defaultClasses.field}>
              <div class={defaultClasses.labelWithAction}>
                <label for='metadataUrl' class={state.classes.label}>
                  Metadata URL
                </label>
              </div>
              <input
                class={state.classes.input}
                name='metadataUrl'
                id='metadataUrl'
                type='url'
                placeholder='Paste the Metadata URL here'
                required={state.samlConnection.rawMetadata === ''}
                onChange={(event) => state.handleChange(event)}
                value={state.samlConnection.metadataUrl}
              />
            </div>
            <Show when={state.formVariant === 'advanced'}>
              <Show when={!state.isExcluded('forceAuthn')}>
                <div class={defaultClasses.field}>
                  <Checkbox
                    checked={
                      state.samlConnection.forceAuthn === 'true' || state.samlConnection.forceAuthn === true
                    }
                    handleChange={state.handleChange}
                    label='Force Authentication'
                    name='forceAuthn'
                    id='forceAuthn'
                  />
                </div>
              </Show>
            </Show>
            <div class={defaultClasses.formAction}>
              <Show when={typeof props.cancelCallback === 'function'}>
                <Button type='button' name='Cancel' handleClick={props.cancelCallback} variant='outline' />
              </Show>
              <Button type='submit' name='Save' classNames={props.classNames?.button?.ctoa} />
            </div>
            <Card title='Connection info' variant='info' arrangement='vertical'>
              <div class={defaultClasses.info}>
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
                        required={true}
                        readOnly={true}
                        value={state.samlConnection.tenant}
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
                        readOnly={true}
                        placeholder='demo'
                        value={state.samlConnection.product}
                      />
                    </div>
                  </Show>
                </Show>
                <div class={defaultClasses.field}>
                  <div class={defaultClasses.labelDiv}>
                    <label for='idpMetadata' class={state.classes.label}>
                      IdP Metadata
                    </label>
                  </div>
                  <pre aria-readonly={true} class={defaultClasses.pre}>
                    {JSON.stringify(state.samlConnection.idpMetadata, null, 2)}
                  </pre>
                </div>
                <div class={defaultClasses.field}>
                  <div class={defaultClasses.labelDiv}>
                    <label for='idpCertExpiry' class={state.classes.label}>
                      IdP Certificate Validity
                    </label>
                  </div>
                  <pre aria-readonly={true} class={defaultClasses.pre}>
                    {state.samlConnection.idpMetadata?.validTo}
                  </pre>
                </div>
                <div class={defaultClasses.field}>
                  <div class={defaultClasses.labelDiv}>
                    <label for='clientID' class={state.classes.label}>
                      Client ID
                    </label>
                    <CopyToClipboardButton
                      text={state.samlConnection.clientID!}
                      successCallback={props.successCallback}
                    />
                  </div>
                  <input
                    class={state.classes.input}
                    name='clientID'
                    id='clientID'
                    type='text'
                    readOnly={true}
                    value={state.samlConnection.clientID}
                  />
                </div>
                <SecretInputFormControl
                  classNames={{ input: props.classNames?.secretInput }}
                  label='Client Secret'
                  id='clientSecret'
                  value={state.samlConnection.clientSecret!}
                  readOnly={true}
                  required={true}
                  copyDoneCallback={props.successCallback}
                  handleChange={state.handleChange}
                />
              </div>
            </Card>
            <Spacer y={4} />
            <Show when={state.samlConnection?.clientID && state.samlConnection.clientSecret}>
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
                    confirmationCallback={state.deleteSSOConnection}
                    promptMessage=' Are you sure you want to delete the Connection? This action cannot be undone and will permanently delete the Connection.'
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
