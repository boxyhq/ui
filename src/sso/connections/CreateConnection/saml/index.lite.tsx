import { Show, onUpdate, useStore } from '@builder.io/mitosis';
import type { CreateConnectionProps, SAMLSSOConnection, SAMLSSORecord } from '../../types';
import { saveConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';
import Button from '../../../../shared/Button/index.lite';
import Spacer from '../../../../shared/Spacer/index.lite';
import Separator from '../../../../shared/Separator/index.lite';
import Anchor from '../../../../shared/Anchor/index.lite';
import Checkbox from '../../../../shared/Checkbox/index.lite';
import InputField from '../../../../shared/inputs/InputField/index.lite';
import TextArea from '../../../../shared/inputs/TextArea/index.lite';

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
    samlConnection: INITIAL_VALUES.samlConnection,
    updateConnection(key: Keys, newValue: Values) {
      return { ...state.samlConnection, [key]: newValue };
    },
    isSaving: false,
    handleChange(event: Event) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      const id = target.id as Keys;
      const targetValue = id !== 'forceAuthn' ? target.value : (target as HTMLInputElement).checked;

      state.samlConnection = state.updateConnection(id, targetValue);
    },
    save(event: Event) {
      event.preventDefault();
      state.isSaving = true;
      saveConnection<SAMLSSORecord>({
        url: props.urls.post,
        formObj: state.samlConnection,
        connectionIsSAML: true,
        callback: async (data) => {
          state.isSaving = false;
          if (data) {
            if ('error' in data) {
              typeof props.errorCallback === 'function' && props.errorCallback(data.error.message);
            } else {
              typeof props.successCallback === 'function' &&
                props.successCallback({ operation: 'CREATE', connection: data, connectionIsSAML: true });
            }
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

  onUpdate(() => {
    if (props.tenant) {
      state.samlConnection = state.updateConnection('tenant', props.tenant);
    }
    if (props.product) {
      state.samlConnection = state.updateConnection('product', props.product);
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
              value={state.samlConnection.name}
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
              value={state.samlConnection.description}
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
              value={state.samlConnection.tenant}
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
              value={state.samlConnection.product}
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
              value={state.samlConnection.redirectUrl}
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
              placeholder='http://localhost:3366/login/saml'
              type='url'
              value={state.samlConnection.defaultRedirectUrl}
              handleInputChange={state.handleChange}
            />
            <div id='defaultRedirectUrl-hint' class={defaultClasses.hint}>
              URL to redirect the user to after an IdP initiated SAML login.
            </div>
          </Show>
          <Spacer y={6} />
          <Separator text='SAML Provider Metadata' />
          <Spacer y={6} />
        </Show>
        <TextArea
          label='Raw IdP XML'
          id='rawMetadata'
          classNames={state.classes.textarea}
          required={state.samlConnection.metadataUrl === ''}
          aria-describedby='xml-metadata-hint'
          placeholder='Paste the raw XML here'
          value={state.samlConnection.rawMetadata}
          handleInputChange={state.handleChange}
        />
        <div id='xml-metadata-hint' class={defaultClasses.hint}>
          Paste the raw XML metadata obtained from SAML provider or enter the metadata URL below.
        </div>
        <Spacer y={6} />
        <Separator text='OR' />
        <Spacer y={6} />
        <InputField
          label='Metadata URL'
          id='metadataUrl'
          classNames={state.classes.inputField}
          required={state.samlConnection.rawMetadata === ''}
          type='url'
          placeholder='Paste the Metadata URL here'
          value={state.samlConnection.metadataUrl}
          handleInputChange={state.handleChange}
        />
        <Spacer y={6} />
        <Show when={state.formVariant === 'advanced'}>
          <Show when={!state.isExcluded('forceAuthn')}>
            <Checkbox
              checked={state.samlConnection.forceAuthn}
              handleChange={state.handleChange}
              label='Force Authentication'
              name='forceAuthn'
              id='forceAuthn'
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
