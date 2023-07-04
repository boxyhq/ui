import { useStore } from '@builder.io/mitosis';
import { CreateConnectionProps } from './types';
import { ApiResponse } from './types';
import { saveConnection } from './utils.lite';
import { ButtonPrimary } from '../../shared/ButtonPrimary.lite';

export default function CreateSAMLConnection(props: CreateConnectionProps) {
  const state = useStore({
    _name: '',
    _description: '',
    _tenant: '',
    _product: '',
    _redirectUrl: '',
    _defaultRedirectUrl: '',
    _rawMetadata: '',
    _metadataUrl: '',
    _forceAuthn: false,
    handleChange(storeVariable: string, newValue: any) {
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
        state._forceAuthn = newValue;
      }
    },
    save(event: Event) {
      void (async function (e) {
        e.preventDefault();

        props.loading = true;

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
          connectionIsSAML: props.connectionIsSAML,
          connectionIsOIDC: props.connectionIsOIDC,
          setupLinkToken: props.setupLinkToken,
          callback: async (rawResponse: any) => {
            props.loading = false;

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
  });

  return (
    <form onSubmit={(event) => state.save(event)}>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='name'>Name</label>
        <input
          name='name'
          onChange={(event) => state.handleChange('name', event.target.value)}
          value={state._name}
          required={false}
          type='text'
          placeholder='MyApp'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='description'>Description</label>
        <input
          name='description'
          onChange={(event) => state.handleChange('description', event.target.value)}
          value={state._description}
          required={false}
          maxLength={100}
          type='text'
          placeholder='A short description not more than 100 characters'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='tenant'>Tenant</label>
        <input
          name='tenant'
          onChange={(event) => state.handleChange('tenant', event.target.value)}
          value={state._tenant}
          type='text'
          placeholder='acme.com'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='product'>Product</label>
        <input
          name='product'
          onChange={(event) => state.handleChange('product', event.target.value)}
          value={state._product}
          type='text'
          placeholder='demo'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='redirectUrl'>Allowed redirect URLs (newline separated)</label>
        <input
          name='redirectUrl'
          onChange={(event) => state.handleChange('redirectUrl', event.target.value)}
          value={state._redirectUrl}
          type='textarea'
          placeholder='http://localhost:3366'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='defaultRedirectUrl'>Default redirect URL</label>
        <input
          name='defaultRedirectUrl'
          onChange={(event) => state.handleChange('defaultRedirectUrl', event.target.value)}
          value={state._defaultRedirectUrl}
          type='url'
          placeholder='http://localhost:3366/login/saml'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='rawMetadata'>Raw IdP XML</label>
        <input
          name='rawMetadata'
          value={state._rawMetadata}
          onChange={(event) => state.handleChange('rawMetadata', event.target.value)}
          required={false}
          type='textarea'
          placeholder='Paste the raw XML here'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='metadataUrl'>Metadata URL</label>
        <input
          name='metadataUrl'
          value={state._metadataUrl}
          onChange={(event) => state.handleChange('metadataUrl', event.target.value)}
          required={false}
          type='url'
          placeholder='Paste the Metadata URL here'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='forceAuthn'>Force Authentication</label>
        <input
          name='forceAuthn'
          onChange={(event) => state.handleChange('forceAuthn', event.target.value)}
          checked={state._forceAuthn}
          required={false}
          type='checkbox'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <div className='flex'>
          <ButtonPrimary loading={props.loading} data-testid='submit-form-create-sso'>
            {props.t('save_changes')}
          </ButtonPrimary>
        </div>
      </div>
    </form>
  );
}
