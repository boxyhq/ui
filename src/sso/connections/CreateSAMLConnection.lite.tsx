import { useStore } from '@builder.io/mitosis';
import { saveConnection } from './utils';
import { ApiResponse } from 'types';
import { errorToast } from '@components/Toaster';
import { ButtonPrimary } from '@components/ButtonPrimary';

export default function CreateSAMLConnection({
  loading,
  cb,
  t,
  setupLinkToken,
  connectionIsSAML,
  connectionIsOIDC,
}: {
  loading: boolean;
  cb: any;
  t: any;
  setupLinkToken?: string;
  connectionIsSAML: boolean;
  connectionIsOIDC: boolean;
}) {
  const state = useStore({
    name: '',
    description: '',
    tenant: '',
    product: '',
    redirectUrl: '',
    defaultRedirectUrl: '',
    rawMetadata: '',
    metadataUrl: '',
    forceAuthn: false,
    handleChange(storeVariable: string, newValue: any) {
      if (storeVariable === 'name') {
        state.name = newValue;
      } else if (storeVariable === 'description') {
        state.description = newValue;
      } else if (storeVariable === 'tenant') {
        state.tenant = newValue;
      } else if (storeVariable === 'product') {
        state.product = newValue;
      } else if (storeVariable === 'redirectUrl') {
        state.redirectUrl = newValue;
      } else if (storeVariable === 'defaultRedirectUrl') {
        state.defaultRedirectUrl = newValue;
      } else if (storeVariable === 'rawMetadata') {
        state.rawMetadata = newValue;
      } else if (storeVariable === 'metadataUrl') {
        state.metadataUrl = newValue;
      } else if (storeVariable === 'forceAuthn') {
        state.forceAuthn = newValue;
      }
    },
    save(event: Event) {
      void (async function (e) {
        e.preventDefault();

        loading = true;

        await saveConnection({
          formObj: {
            name: state.name,
            description: state.description,
            tenant: state.tenant,
            product: state.product,
            redirectUrl: state.redirectUrl,
            defaultRedirectUrl: state.defaultRedirectUrl,
            rawMetadata: state.rawMetadata,
            metadataUrl: state.metadataUrl,
            forceAuthn: state.forceAuthn,
          },
          connectionIsSAML: connectionIsSAML,
          connectionIsOIDC: connectionIsOIDC,
          setupLinkToken,
          callback: async (rawResponse: any) => {
            loading = false;

            const response: ApiResponse = await rawResponse.json();

            if ('error' in response) {
              errorToast(response.error.message);
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
          value={state.name}
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
          value={state.description}
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
          value={state.tenant}
          type='text'
          placeholder='acme.com'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='product'>Product</label>
        <input
          name='product'
          onChange={(event) => state.handleChange('product', event.target.value)}
          value={state.product}
          type='text'
          placeholder='demo'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='redirectUrl'>Allowed redirect URLs (newline separated)</label>
        <input
          name='redirectUrl'
          onChange={(event) => state.handleChange('redirectUrl', event.target.value)}
          value={state.redirectUrl}
          type='textarea'
          placeholder='http://localhost:3366'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='defaultRedirectUrl'>Default redirect URL</label>
        <input
          name='defaultRedirectUrl'
          onChange={(event) => state.handleChange('defaultRedirectUrl', event.target.value)}
          value={state.defaultRedirectUrl}
          type='url'
          placeholder='http://localhost:3366/login/saml'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='rawMetadata'>Raw IdP XML</label>
        <input
          name='rawMetadata'
          value={state.rawMetadata}
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
          value={state.metadataUrl}
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
          checked={state.forceAuthn}
          required={false}
          type='checkbox'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <div className='flex'>
          <ButtonPrimary loading={loading} data-testid='submit-form-create-sso'>
            {t('save_changes')}
          </ButtonPrimary>
        </div>
      </div>
    </form>
  );
}
