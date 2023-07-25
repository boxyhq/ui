import { Show } from '@builder.io/mitosis';
import type { EditOIDCConnectionProps } from '../../types';

export default function EditOIDCConnection(props: EditOIDCConnectionProps) {
  return (
    <form>
      <div class='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 lg:border-none lg:p-0'>
        <div class='flex flex-col gap-0 lg:flex-row lg:gap-4'>
          <div class='w-full rounded border-gray-200 dark:border-gray-700 lg:w-3/5 lg:border lg:p-3'>
            <h1>Editable fields</h1>
          </div>
          <div class='w-full rounded border-gray-200 dark:border-gray-700 lg:w-3/5 lg:border lg:p-3'>
            <h1>Read only fields</h1>
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
            {/* ButtonPrimary goes here */}
            <button type='submit'>Save Changes</button>
          </div>
        </div>
      </div>
      <Show when={props.connection?.clientID && props.connection.clientSecret}>
        <section class='mt-10 flex items-center rounded bg-red-100 p-6 text-red-900'>
          <div class='flex-1'>
            <h6 class='mb-1 font-medium'>Delete this connection</h6>
            <p class='font-light'>All your apps using this connection will stop working.</p>
          </div>
          {/* Danger button goes here */}
          <button type='button'>Delete</button>
        </section>
      </Show>
    </form>
  );
}
