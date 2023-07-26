import { Show } from '@builder.io/mitosis';
import type { EditOIDCConnectionProps } from '../../types';

export default function EditOIDCConnection(props: EditOIDCConnectionProps) {
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
                name='name'
                id='name'
                type='text'
                placeholder='MyApp'
                value={props.connection.name}
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
                name='description'
                id='description'
                type='text'
                placeholder='A short description not more than 100 characters'
                maxLength={100}
                value={props.connection.description}
                required={false}
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
                value={props.connection.redirectUrl}
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
                value={props.connection.defaultRedirectUrl}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='oidcClientId'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Client ID [OIDC Provider]
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='oidcClientId'
                id='oidcClientId'
                required={true}
                type='text'
                placeholder=''
                value={props.connection.oidcProvider.clientId}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='oidcClientSecret'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Client Secret [OIDC Provider]
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='oidcClientSecret'
                id='oidcClientSecret'
                required={false}
                type='text'
                placeholder=''
                value={props.connection.oidcProvider.clientSecret}
              />
            </div>
            <div class='mb-6'>
              <div class='flex items-center justify-between'>
                <label
                  for='oidcDiscoveryUrl'
                  class='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Well-known URL of OpenID Provider
                </label>
              </div>
              <input
                class='input-bordered input w-full'
                name='oidcDiscoveryUrl'
                id='oidcDiscoveryUrl'
                required={true}
                type='url'
                placeholder='https://example.com/.well-known/openid-configuration'
                value={props.connection.oidcProvider.discoveryUrl}
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
                type='text'
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
