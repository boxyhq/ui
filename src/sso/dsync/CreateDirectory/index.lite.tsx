import { For, Show, onMount, useStore } from '@builder.io/mitosis';
import { CreateDirectoryProps, ApiResponse, Directory } from '../types';
// import { getDirectoryProviders } from '../utils';

const DEFAULT_DIRECTORY_VALUES = {
  name: '',
  tenant: '',
  product: '',
  webhook_url: '',
  webhook_secret: '',
  type: 'azure-scim-v2',
  google_domain: '',
};

export default function CreateDirectory(props: CreateDirectoryProps) {
  const state = useStore({
    directory: DEFAULT_DIRECTORY_VALUES,
    showDomain: false,
    providers: {},
    handleChange(event: Event) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;

      state.directory = {
        ...state.directory,
        [target.id]: target.value,
      };

      // Ask for domain if google is selected
      if (target.id === 'type') {
        target.value === 'google' ? (state.showDomain = true) : (state.showDomain = false);
      }
    },
    onSubmit(event: Event) {
      event.preventDefault();

      async function sendHTTPrequest(body: any, url: string) {
        const rawResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const response: ApiResponse<Directory> = await rawResponse.json();

        if ('error' in response) {
          props.errorCallback(response.error.message);
          return;
        }

        if (rawResponse.ok) {
          props.cb();
          props.successCallback('Directory created successfully');
          return;
        }
      }
      sendHTTPrequest(state.directory, props.urls.patchUrl);
    },
  });

  onMount(() => {
    state.directory.webhook_url = props.defaultWebhookEndpoint || '';

    async function getDirectoryProviders(url: string) {
      const response = await fetch(url);
      const data = await response.json();

      return data.data?.data;
    }

    state.providers = getDirectoryProviders(props.urls.useDirectoryProviderUrl);
  });

  return (
    <div>
      <h2 class='mb-5 mt-5 font-bold text-gray-700 md:text-xl'>New Directory</h2>
      <div class='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 md:w-3/4 md:max-w-lg'>
        <form onSubmit={(event) => state.onSubmit(event)}>
          <div class='flex flex-col space-y-3'>
            <div class='form-control w-full'>
              <label for='name' class='label'>
                <span className='label-text'>Directory name</span>
              </label>
              <input
                type='text'
                id='name'
                name='name'
                class='input-bordered input w-full'
                required={true}
                onChange={(event) => state.handleChange(event)}
                value={state.directory.name}
              />
            </div>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Directory provider</span>
              </label>
              <select>
                <Show when={state.providers}>
                  <For each={Object.entries(state.providers)}>
                    {(item: any) => (
                      <option key={item[0]} value={item[0]}>
                        {item[1]}
                      </option>
                    )}
                  </For>
                </Show>
              </select>
            </div>
            <Show when={state.showDomain}>
              <div class='form-control w-full'>
                <label for='google_domain' class='label'>
                  <span class='label-text'>Directory domain</span>
                </label>
                <input
                  type='text'
                  id='google_domain'
                  name='google_domain'
                  class='input-bordered input w-full'
                  onChange={(event) => state.handleChange(event)}
                  value={state.directory.google_domain}
                  pattern={`^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$`}
                  title='Please enter a valid domain (e.g: boxyhq.com)'
                />
              </div>
            </Show>
            <Show when={!props.setupLinkToken}>
              <>
                <div class='form-control w-full'>
                  <label for='tenant' class='label'>
                    <span className='label-text'>Tenant</span>
                  </label>
                  <input
                    type='text'
                    id='tenant'
                    name='tenant'
                    class='input-bordered input w-full'
                    required={true}
                    onChange={(event) => state.handleChange(event)}
                    value={state.directory.tenant}
                  />
                </div>
                <div class='form-control w-full'>
                  <label for='product' class='label'>
                    <span className='label-text'>Product</span>
                  </label>
                  <input
                    type='text'
                    id='product'
                    name='product'
                    class='input-bordered input w-full'
                    required={true}
                    onChange={(event) => state.handleChange(event)}
                    value={state.directory.product}
                  />
                </div>
              </>
            </Show>
            <div class='form-control w-full'>
              <label for='webhook_url' class='label'>
                <span class='label-text'>Webhook URL</span>
              </label>
              <input
                type='text'
                id='webhook_url'
                name='webhook_url'
                class='input-bordered input w-full'
                onChange={(event) => state.handleChange(event)}
                value={state.directory.webhook_url}
              />
            </div>
            <div class='form-control w-full'>
              <label for='webhook_secret' class='label'>
                <span class='label-text'>Webhook secret</span>
              </label>
              <input
                type='text'
                id='webhook_secret'
                name='webhook_secret'
                class='input-bordered input w-full'
                onChange={(event) => state.handleChange(event)}
                value={state.directory.webhook_secret}
              />
            </div>
            <div>
              <button class='btn btn-primary' type='submit'>
                Create Directory
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
