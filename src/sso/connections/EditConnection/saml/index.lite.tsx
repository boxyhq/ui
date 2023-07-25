import { Show } from '@builder.io/mitosis';
import type { EditSAMLConnectionProps } from '../../types';

export default function EditSAMLConnection(props: EditSAMLConnectionProps) {
  return (
    <form>
      <div class='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 lg:border-none lg:p-0'>
        <div class='flex flex-col gap-0 lg:flex-row lg:gap-4'>
          <div class='w-full rounded border-gray-200 dark:border-gray-700 lg:w-3/5 lg:border lg:p-3'>
            <h1>Editable fields</h1>
          </div>
          <div class='w-full rounded border-gray-200 dark:border-gray-700 lg:w-3/5 lg:border lg:p-3'>
            <h1>Read only fields</h1>
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
