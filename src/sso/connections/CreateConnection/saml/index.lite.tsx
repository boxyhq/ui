import { Show, useStore } from '@builder.io/mitosis';
import type { CreateConnectionProps, SAMLSSOConnection, ApiResponse } from '../../types';
import { saveConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';
import Button from '../../../../shared/Button/index.lite';
import Spacer from '../../../../shared/Spacer/index.lite';
import Separator from '../../../../shared/Separator/index.lite';
import Anchor from '../../../../shared/Anchor/index.lite';
import Checkbox from '../../../../shared/Checkbox/index.lite';

const DEFAULT_VALUES = {
  variant: 'basic',
} satisfies Partial<CreateConnectionProps>;

const INITIAL_VALUES = {
  samlConnection: {
    name: '',
    description: '',
    tenant: '',
    product: '',
    redirectUrl: '',
    defaultRedirectUrl: '',
    rawMetadata: '',
    metadataUrl: '',
    forceAuthn: false as boolean,
  },
};

type Keys = keyof typeof INITIAL_VALUES.samlConnection;
type Values = (typeof INITIAL_VALUES.samlConnection)[Keys];

export default function CreateSAMLConnection(props: CreateConnectionProps) {
  const state = useStore({
    loading: false,
    samlConnection: INITIAL_VALUES.samlConnection,
    updateConnection(key: Keys, newValue: Values) {
      return { ...state.samlConnection, [key]: newValue };
    },
    handleChange(event: Event) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      const name = target.name as Keys;
      const targetValue = name !== 'forceAuthn' ? target.value : (target as HTMLInputElement).checked;

      state.samlConnection = state.updateConnection(name, targetValue);
    },
    save(event: Event) {
      event.preventDefault();

      state.loading = true;

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
          state.loading = false;

          state.samlConnection = INITIAL_VALUES.samlConnection;

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
    get formVariant() {
      return props.variant || DEFAULT_VALUES.variant;
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
        radioContainer: cssClassAssembler(
          props.classNames?.radioContainer,
          defaultClasses.radioContainer + ' ' + defaultClasses.fieldContainer
        ),
      };
    },
    isExcluded(fieldName: keyof SAMLSSOConnection) {
      return !!(props.excludeFields as (keyof SAMLSSOConnection)[])?.includes(fieldName);
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
        <h2 class={defaultClasses.heading}>Create SAML Connection</h2>
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
                class={state.classes.input}
                id='name'
                name='name'
                onInput={(event) => state.handleChange(event)}
                value={state.samlConnection.name}
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
                class={state.classes.input}
                id='description'
                name='description'
                onInput={(event) => state.handleChange(event)}
                value={state.samlConnection.description}
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
                class={state.classes.input}
                id='tenant'
                name='tenant'
                onInput={(event) => state.handleChange(event)}
                value={state.samlConnection.tenant}
                type='text'
                required
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
                class={state.classes.input}
                id='product'
                name='product'
                required
                onInput={(event) => state.handleChange(event)}
                value={state.samlConnection.product}
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
                value={state.samlConnection.redirectUrl}
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
                class={state.classes.input}
                id='defaultRedirectUrl'
                name='defaultRedirectUrl'
                onInput={(event) => state.handleChange(event)}
                value={state.samlConnection.defaultRedirectUrl}
                type='url'
                placeholder='http://localhost:3366/login/saml'
              />
            </div>
          </Show>
          <Spacer y={6} />
          <Separator text='SAML Provider Metadata' />
          <Spacer y={6} />
        </Show>
        <div class={state.classes.fieldContainer}>
          <label for='rawMetadata' class={state.classes.label}>
            Raw IdP XML
          </label>
          <Spacer y={2} />
          <textarea
            id='rawMetadata'
            class={state.classes.textarea}
            name='rawMetadata'
            value={state.samlConnection.rawMetadata}
            onInput={(event) => state.handleChange(event)}
            required={state.samlConnection.metadataUrl === ''}
            placeholder='Paste the raw XML here'
            aria-describedby='xml-metadata-hint'
          />
          <span id='xml-metadata-hint' class={defaultClasses.hint}>
            Paste the raw XML metadata obtained from SAML provider or enter the metadata URL below.
          </span>
        </div>
        <Spacer y={6} />
        <Separator text='OR' />
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <label for='metadataUrl' class={state.classes.label}>
            Metadata URL
          </label>
          <Spacer y={2} />
          <input
            class={state.classes.input}
            id='metadataUrl'
            name='metadataUrl'
            value={state.samlConnection.metadataUrl}
            onInput={(event) => state.handleChange(event)}
            required={state.samlConnection.rawMetadata === ''}
            type='url'
            placeholder='Paste the Metadata URL here'
          />
        </div>
        <Spacer y={6} />
        <Show when={state.formVariant === 'advanced'}>
          <Show when={!state.isExcluded('forceAuthn')}>
            <Checkbox
              checked={state.samlConnection.forceAuthn}
              handleChange={state.handleChange}
              label='Force Authentication'
              name='forceAuthn'
            />
          </Show>
        </Show>
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
