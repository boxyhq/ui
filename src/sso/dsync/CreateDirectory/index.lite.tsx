import { onMount, useStore } from '@builder.io/mitosis';
import { CreateDirectoryProps } from '../type';
import { useDirectoryProviders } from '../utils';

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
  });

  onMount(() => {
    state.directory.webhook_url = props.defaultWebhookEndpoint || '';

    const res = async function getProviders() {
      let x = await useDirectoryProviders(props.useDirectoryProviderUrl);
      return x.providers;
    };

    state.providers = res;
  });

  return (
    <div>
      <h2 class='mb-5 mt-5 font-bold text-gray-700 md:text-xl'>New Directory</h2>
      <div class='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 md:w-3/4 md:max-w-lg'>
        <form>
          <div class='flex flex-col space-y-3'>
            <div className='form-control w-full'>
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
          </div>
        </form>
      </div>
    </div>
  );
}
