import { Show, onMount, useStore } from '@builder.io/mitosis';
import type { EditSAMLConnectionProps, samlConnectionInitialValues } from '../../types';

const INITIAL_VALUES: samlConnectionInitialValues = {
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
    },
  });

  onMount(() => {
    state.samlConnection = {
      name: props.connection.name,
      description: props.connection.description,
      redirectUrl: props.connection.redirectUrl,
      defaultRedirectUrl: props.connection.defaultRedirectUrl,
      rawMetadata: props.connection.rawMetadata,
      metadataUrl: props.connection.metadataUrl,
      forceAuthn: props.connection.forceAuthn,
    };
  });

  return (
    <form>
      <div class='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 lg:border-none lg:p-0'>
        <div class='flex flex-col gap-0 lg:flex-row lg:gap-4'>
          <div class='w-full rounded border-gray-200 dark:border-gray-700 lg:w-3/5 lg:border lg:p-3'>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label for='name' class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Name
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                type='text'
                name='name'
                id='name'
                placeholder='MyApp'
                required={false}
                onInput={(event) => state.handleChange(event)}
                value={state.samlConnection.name}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='description'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Description
                </label>
              </div>
              <input
                class='input-bordered input w-full'
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
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='redirectUrl'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Allowed redirect URLs (newline separated)
                </label>
              </div>
              <textarea
                class='textarea-bordered textarea h-24 w-full whitespace-pre'
                id='redirectUrl'
                name='redirectUrl'
                required={true}
                rows={3}
                placeholder='http://localhost:3366'
                onInput={(event) => state.handleChange(event)}
                value={state.samlConnection.redirectUrl}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='defaultRedirectUrl'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Default redirect URL
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='defaultRedirectUrl'
                id='defaultRedirectUrl'
                required={true}
                type='url'
                placeholder='http://localhost:3366/login/saml'
                onInput={(event) => state.handleChange(event)}
                value={state.samlConnection.defaultRedirectUrl}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='rawMetadata'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Raw IdP XML (fully replaces the current one)
                </label>
              </div>
              <textarea
                class='textarea-bordered textarea h-24 w-full'
                name='rawMetadata'
                id='rawMetadata'
                placeholder='Paste the raw XML here'
                rows={5}
                required={false}
                onInput={(event) => state.handleChange(event)}
                value={state.samlConnection.rawMetadata}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='metadataUrl'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Metadata URL (fully replaces the current one)
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='metadataUrl'
                id='metadataUrl'
                type='url'
                placeholder='Paste the Metadata URL here'
                required={false}
                onInput={(event) => state.handleChange(event)}
                value={state.samlConnection.metadataUrl}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='forceAuthn'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Force Authentication
                </label>
              </div>
              <input
                class='checkbox-primary checkbox ml-5 align-middle'
                name='forceAuthn'
                id='forceAuthn'
                type='checkbox'
                onChange={(event) => state.handleChange(event)}
                checked={
                  state.samlConnection.forceAuthn === true || state.samlConnection.forceAuthn === 'true'
                }
                required={false}
              />
            </div>
          </div>
          <div class='w-full rounded border-gray-200 dark:border-gray-700 lg:w-3/5 lg:border lg:p-3'>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label for='tenant' class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Tenant
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='tenant'
                id='tenant'
                placeholder='acme.com'
                required={true}
                disabled={true}
                value={props.connection.tenant}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label for='product' class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Product
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='product'
                id='product'
                type='text'
                required={true}
                disabled={true}
                placeholder='demo'
                value={props.connection.product}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='idpMetadata'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  IdP Metadata
                </label>
              </div>
              <pre
                class='block w-full cursor-not-allowed overflow-auto rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                aria-readonly={true}>
                {JSON.stringify(props.connection.idpMetadata)}
              </pre>
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='idpCertExpiry'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  IdP Certificate Validity
                </label>
              </div>
              <pre
                class='block w-full cursor-not-allowed overflow-auto rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                aria-readonly={true}>
                {/* Gotta double check this by doing an API call myself */}
                {props.connection.idpMetadata.validTo}
              </pre>
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label for='clientID' class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Client ID
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='clientID'
                id='clientID'
                type='text'
                required={true}
                disabled={true}
                value={props.connection.clientID}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='clientSecret'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Client Secret
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='clientSecret'
                id='clientSecret'
                type='password'
                required={true}
                disabled={true}
                value={props.connection.clientSecret}
              />
            </div>
          </div>
          <div className='flex w-full lg:mt-6'>
            <button type='submit' class='btn btn-primary'>
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <Show when={props.connection?.clientID && props.connection.clientSecret}>
        <section class='mt-10 flex items-center rounded bg-red-100 p-6 text-red-900'>
          <div class='flex-1'>
            <h6 class='mb-1 font-medium'>Delete this connection</h6>
            <p class='font-light'>All your apps using this connection will stop working.</p>
          </div>
          <button type='button' class='btn btn-error'>
            Delete
          </button>
        </section>
      </Show>
    </form>
  );
}
