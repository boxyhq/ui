import { Show, useStore } from '@builder.io/mitosis';
import type { CreateConnectionProps } from '../../types';
import { ApiResponse } from '../../types';
import { saveConnection } from '../../utils';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../../utils/cssClassAssembler';

const DEFAULT_VALUES: Partial<CreateConnectionProps> = {
  variant: 'basic',
};

export default function CreateSAMLConnection(props: CreateConnectionProps) {
  const state = useStore({
    loading: false,
    _name: '',
    _description: '',
    _tenant: '',
    _product: '',
    _redirectUrl: '',
    _defaultRedirectUrl: '',
    _rawMetadata: '',
    _metadataUrl: '',
    _forceAuthn: false,
    handleChange(storeVariable: string, event: Event) {
      const newValue = (event.currentTarget as HTMLInputElement | HTMLTextAreaElement)?.value;
      if (storeVariable === 'name') {
        state._name = newValue;
      } else if (storeVariable === 'description') {
        state._description = newValue;
      } else if (storeVariable === 'tenant') {
        state._tenant = newValue;
      } else if (storeVariable === 'product') {
        state._product = newValue;
      } else if (storeVariable === 'redirectUrl') {
        state._redirectUrl = newValue;
      } else if (storeVariable === 'defaultRedirectUrl') {
        state._defaultRedirectUrl = newValue;
      } else if (storeVariable === 'rawMetadata') {
        state._rawMetadata = newValue;
      } else if (storeVariable === 'metadataUrl') {
        state._metadataUrl = newValue;
      } else if (storeVariable === 'forceAuthn') {
        state._forceAuthn = (event.currentTarget as HTMLInputElement)?.checked;
      }
    },
    save(event: Event) {
      void (async function (e) {
        e.preventDefault();

        state.loading = true;

        await saveConnection({
          formObj: {
            name: state._name,
            description: state._description,
            tenant: state._tenant,
            product: state._product,
            redirectUrl: state._redirectUrl,
            defaultRedirectUrl: state._defaultRedirectUrl,
            rawMetadata: state._rawMetadata,
            metadataUrl: state._metadataUrl,
            forceAuthn: state._forceAuthn,
          },
          connectionIsSAML: true,
          setupLinkToken: props.setupLinkToken,
          callback: async (rawResponse: any) => {
            state.loading = false;

            const response: ApiResponse = await rawResponse.json();

            if ('error' in response) {
              props.errorToastCallback(response.error.message);
              return;
            }

            if (rawResponse.ok) {
              cb: () => {
                // router replace and mutate url using swr
                // happens here
              };
            }
          },
        });
      })(event);
    },
    get variant() {
      return props.variant || DEFAULT_VALUES.variant;
    },
    get classes() {
      return {
        fieldContainer: cssClassAssembler(props.classNames?.fieldContainer, defaultClasses.fieldContainer),
        buttonContainer: cssClassAssembler(props.classNames?.buttonContainer, defaultClasses.buttonContainer),
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
        button: cssClassAssembler(props.classNames?.button, defaultClasses.button),
      };
    },
  });

  return (
    <form onSubmit={(event) => state.save(event)}>
      <Show when={state.variant === 'advanced'}>
        <div class={state.classes.fieldContainer}>
          <label for='name' class={state.classes.label}>
            Name
          </label>
          <input
            class={state.classes.input}
            id='name'
            name='name'
            onInput={(event) => state.handleChange('name', event)}
            value={state._name}
            required={false}
            type='text'
            placeholder='MyApp'
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='description' class={state.classes.label}>
            Description
          </label>
          <input
            class={state.classes.input}
            id='description'
            name='description'
            onInput={(event) => state.handleChange('description', event)}
            value={state._description}
            required={false}
            maxLength={100}
            type='text'
            placeholder='A short description not more than 100 characters'
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='tenant' class={state.classes.label}>
            Tenant
          </label>
          <input
            class={state.classes.input}
            id='tenant'
            name='tenant'
            onInput={(event) => state.handleChange('tenant', event)}
            value={state._tenant}
            type='text'
            placeholder='acme.com'
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='product' class={state.classes.label}>
            Product
          </label>
          <input
            class={state.classes.input}
            id='product'
            name='product'
            onInput={(event) => state.handleChange('product', event)}
            value={state._product}
            type='text'
            placeholder='demo'
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='redirectUrl' class={state.classes.label}>
            Allowed redirect URLs (newline separated)
          </label>
          <textarea
            id='redirectUrl'
            name='redirectUrl'
            onInput={(event) => state.handleChange('redirectUrl', event)}
            value={state._redirectUrl}
            placeholder='http://localhost:3366'
          />
        </div>
        <div class={state.classes.fieldContainer}>
          <label for='defaultRedirectUrl' class={state.classes.label}>
            Default redirect URL
          </label>
          <input
            class={state.classes.input}
            id='defaultRedirectUrl'
            name='defaultRedirectUrl'
            onInput={(event) => state.handleChange('defaultRedirectUrl', event)}
            value={state._defaultRedirectUrl}
            type='url'
            placeholder='http://localhost:3366/login/saml'
          />
        </div>
      </Show>
      <div class={state.classes.fieldContainer}>
        <label for='rawMetadata' class={state.classes.label}>
          Raw IdP XML
        </label>
        <textarea
          id='rawMetadata'
          class={state.classes.input}
          name='rawMetadata'
          value={state._rawMetadata}
          onInput={(event) => state.handleChange('rawMetadata', event)}
          required={false}
          placeholder='Paste the raw XML here'
        />
      </div>
      <div class={state.classes.fieldContainer}>
        <label for='metadataUrl' class={state.classes.label}>
          Metadata URL
        </label>
        <input
          class={state.classes.input}
          id='metadataUrl'
          name='metadataUrl'
          value={state._metadataUrl}
          onInput={(event) => state.handleChange('metadataUrl', event)}
          required={false}
          type='url'
          placeholder='Paste the Metadata URL here'
        />
      </div>
      <Show when={state.variant === 'advanced'}>
        <div class={state.classes.fieldContainer}>
          <label for='forceAuthn' class={state.classes.label}>
            Force Authentication
          </label>
          <input
            id='forceAuthn'
            name='forceAuthn'
            onInput={(event) => state.handleChange('forceAuthn', event)}
            checked={state._forceAuthn}
            required={false}
            type='checkbox'
          />
        </div>
      </Show>
      <div class={state.classes.fieldContainer}>
        <div class={state.classes.buttonContainer}>
          {/* TODO: bring loading state */}
          <button data-testid='submit-form-create-sso' type='submit' class={state.classes.button}>
            {props.t('save_changes')}
          </button>
        </div>
      </div>
    </form>
  );
}
