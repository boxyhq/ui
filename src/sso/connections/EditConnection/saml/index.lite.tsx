import ToggleConnectionStatus from '../../ToggleConnectionStatus/index.lite';
import { Show, onMount, useStore } from '@builder.io/mitosis';
import type {
  EditSAMLConnectionProps,
  ApiResponse,
  CreateConnectionProps,
  SAMLSSOConnection,
} from '../../types';
import { saveConnection, deleteConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';
import SecretInputFormControl from '../../../../shared/SecretInputFormControl/index.lite';

const DEFAULT_VALUES = {
  variant: 'basic',
} satisfies Partial<CreateConnectionProps>;

const INITIAL_VALUES = {
  samlConnection: {
    name: '',
    description: '',
    redirectUrl: '',
    defaultRedirectUrl: '',
    rawMetadata: '',
    metadataUrl: '',
    forceAuthn: false as boolean,
  },
};

type Keys = keyof typeof INITIAL_VALUES.samlConnection;
type Values = (typeof INITIAL_VALUES.samlConnection)[Keys];

export default function EditSAMLConnection(props: EditSAMLConnectionProps) {
  const state = useStore({
    samlConnection: INITIAL_VALUES.samlConnection,
    hasMetadataUrl: true,
    displayDeletionConfirmation: false,
    get formVariant() {
      return props.variant || DEFAULT_VALUES.variant;
    },
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        formDiv: cssClassAssembler(props.classNames?.formDiv, defaultClasses.formDiv),
        fieldsContainer: cssClassAssembler(props.classNames?.fieldsContainer, defaultClasses.fieldsContainer),
        fieldsDiv: cssClassAssembler(props.classNames?.fieldsDiv, defaultClasses.fieldsDiv),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
        textarea: cssClassAssembler(props.classNames?.textarea, defaultClasses.textarea),
        section: cssClassAssembler(props.classNames?.section, defaultClasses.section),
        saveBtn: cssClassAssembler(props.classNames?.saveBtn, defaultClasses.saveBtn),
        deleteBtn: cssClassAssembler(props.classNames?.deleteBtn, defaultClasses.deleteBtn),
        outlineBtn: cssClassAssembler(props.classNames?.outlineBtn, defaultClasses.outlineBtn),
      };
    },
    isExcluded(fieldName: keyof SAMLSSOConnection) {
      return !!(props.excludeFields as (keyof SAMLSSOConnection)[])?.includes(fieldName);
    },
    toggleHasMetadataUrl() {
      state.hasMetadataUrl = !state.hasMetadataUrl;
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
    onCancel() {
      state.displayDeletionConfirmation = false;
    },
    askForConfirmation() {
      state.displayDeletionConfirmation = true;
    },
    saveSSOConnection(event: Event) {
      event.preventDefault();

      saveConnection({
        url: props.urls.save,
        formObj:
          props.variant === 'advanced'
            ? { ...state.samlConnection }
            : {
                rawMetadata: state.samlConnection.rawMetadata,
                metadataUrl: state.samlConnection.metadataUrl,
              },
        connectionIsSAML: true,
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
      state.displayDeletionConfirmation = false;

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
  });

  onMount(() => {
    state.samlConnection = {
      name: props.connection.name || '',
      description: props.connection.description || '',
      redirectUrl: props.connection.redirectUrl.join(`\r\n`),
      defaultRedirectUrl: props.connection.defaultRedirectUrl,
      rawMetadata: props.connection.rawMetadata || '',
      metadataUrl: props.connection.metadataUrl || '',
      forceAuthn: props.connection.forceAuthn === true || props.connection.forceAuthn === 'true',
    };

    state.hasMetadataUrl = props.connection.metadataUrl ? true : false;
  });

  return (
    <div>
      <div class={defaultClasses.formDiv}>
        <div class={defaultClasses.labelDiv}>
          <h2 className={defaultClasses.heading}>Edit SSO Connection</h2>
          <ToggleConnectionStatus
            connection={props.connection}
            urls={{ save: props.toggleUrls.save }}
            errorCallback={props.errorCallback}
            successCallback={props.successCallback}
          />
        </div>
        <div>
          <form onSubmit={(event) => state.saveSSOConnection(event)} method='post'>
            <div class={state.classes.container}>
              <div class={state.classes.formDiv}>
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
                    <Show when={state.hasMetadataUrl}>
                      <div class={defaultClasses.field}>
                        <div class={defaultClasses.labelDiv}>
                          <label for='metadataUrl' class={state.classes.label}>
                            Metadata URL (fully replaces the current one)
                          </label>
                          <button onClick={() => state.toggleHasMetadataUrl()}>
                            Use raw XML instead ? Click here to enter raw metadata XML
                          </button>
                        </div>
                        <input
                          class={state.classes.input}
                          name='metadataUrl'
                          id='metadataUrl'
                          type='url'
                          placeholder='Paste the Metadata URL here'
                          required={false}
                          onInput={(event) => state.handleChange(event)}
                          value={state.samlConnection.metadataUrl}
                        />
                      </div>
                    </Show>
                    <Show when={!state.hasMetadataUrl}>
                      <div class={defaultClasses.field}>
                        <div class={defaultClasses.labelDiv}>
                          <label for='rawMetadata' class={state.classes.label}>
                            Raw IdP XML (fully replaces the current one)
                          </label>
                          <button onClick={() => state.toggleHasMetadataUrl()}>
                            Use metadata URL instead ? Click here to enter the IdP metadata URL
                          </button>
                        </div>
                        <textarea
                          class={state.classes.textarea}
                          name='rawMetadata'
                          id='rawMetadata'
                          placeholder='Paste the raw XML here'
                          rows={5}
                          required={false}
                          onInput={(event) => state.handleChange(event)}
                          value={state.samlConnection.rawMetadata}
                        />
                      </div>
                    </Show>
                    <Show when={state.formVariant === 'advanced'}>
                      <Show when={!state.isExcluded('forceAuthn')}>
                        <div class={defaultClasses.field}>
                          <div class={defaultClasses.labelDiv}>
                            <label for='forceAuthn' class={state.classes.label}>
                              Force Authentication
                            </label>
                          </div>
                          <input
                            class={defaultClasses.checkbox}
                            name='forceAuthn'
                            id='forceAuthn'
                            type='checkbox'
                            onChange={(event) => state.handleChange(event)}
                            checked={state.samlConnection.forceAuthn === true}
                            required={false}
                          />
                        </div>
                      </Show>
                    </Show>
                  </div>
                  <div class={defaultClasses.readOnlyFieldsDiv}>
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
                        <label for='idpMetadata' class={state.classes.label}>
                          IdP Metadata
                        </label>
                      </div>
                      <pre class={defaultClasses.preForIdpCertExpiry} aria-readonly={true}>
                        {JSON.stringify(props.connection.idpMetadata)}
                      </pre>
                    </div>
                    <div class={defaultClasses.field}>
                      <div class={defaultClasses.labelDiv}>
                        <label for='idpCertExpiry' class={state.classes.label}>
                          IdP Certificate Validity
                        </label>
                      </div>
                      <pre class={defaultClasses.pre} aria-readonly={true}>
                        {props.connection.idpMetadata.validTo}
                      </pre>
                    </div>
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
                      label='Client Secret'
                      id='clientSecret'
                      value={props.connection.clientSecret}
                      required={true}
                      readOnly={true}
                      successCallback={props.successCallback}
                    />
                  </div>
                </div>
                <div class={defaultClasses.saveDiv}>
                  <button type='submit' class={state.classes.saveBtn}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
            <Show when={props.connection?.clientID && props.connection.clientSecret}>
              <section class={state.classes.section}>
                <div class={defaultClasses.sectionDiv}>
                  <h6 class={defaultClasses.sectionHeading}>Delete this connection</h6>
                  <p class={defaultClasses.sectionPara}>
                    All your apps using this connection will stop working.
                  </p>
                </div>
                <Show when={!state.displayDeletionConfirmation}>
                  <button
                    type='button'
                    onClick={(event) => state.askForConfirmation()}
                    class={state.classes.deleteBtn}>
                    Delete
                  </button>
                </Show>
                <Show when={state.displayDeletionConfirmation}>
                  <div class={defaultClasses.confirmationDiv}>
                    <h1>
                      Are you sure you want to delete the Connection? This action cannot be undone and will
                      permanently delete the Connection.
                    </h1>
                    <button
                      class={state.classes.deleteBtn}
                      onClick={(event) => state.deleteSSOConnection(event)}>
                      Confirm
                    </button>
                    <button class={state.classes.outlineBtn} onClick={(event) => state.onCancel()}>
                      Cancel
                    </button>
                  </div>
                </Show>
              </section>
            </Show>
          </form>
        </div>
      </div>
    </div>
  );
}
