import { For, Show, onMount, useStore } from '@builder.io/mitosis';
import { CreateDirectoryProps, ApiResponse, Directory } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';
import Button from '../../../shared/Button/index.lite';
import Spacer from '../../../shared/Spacer/index.lite';

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
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        fieldContainer: cssClassAssembler(props.classNames?.fieldContainer, defaultClasses.fieldContainer),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
        button: cssClassAssembler(props.classNames?.button, defaultClasses.button),
      };
    },
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
      const { data } = await response.json();

      state.providers = data;
    }

    getDirectoryProviders(props.urls.useDirectoryProviderUrl);
  });

  return (
    <div>
      <h2 class={defaultClasses.heading}>New Directory</h2>
      <div class={state.classes.container}>
        <form onSubmit={(event) => state.onSubmit(event)}>
          <div class={defaultClasses.divContainer}>
            <div class={state.classes.fieldContainer}>
              <label for='name' class={state.classes.label}>
                <span class={defaultClasses.labelText}>Directory name</span>
              </label>
              <input
                type='text'
                id='name'
                name='name'
                class={state.classes.input}
                required={true}
                onChange={(event) => state.handleChange(event)}
                value={state.directory.name}
              />
            </div>
            <div class={state.classes.fieldContainer}>
              <label class={state.classes.label}>
                <span class={defaultClasses.labelText}>Directory provider</span>
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
              <div class={state.classes.fieldContainer}>
                <label for='google_domain' class={state.classes.label}>
                  <span class={defaultClasses.labelText}>Directory domain</span>
                </label>
                <input
                  type='text'
                  id='google_domain'
                  name='google_domain'
                  class={state.classes.input}
                  onChange={(event) => state.handleChange(event)}
                  value={state.directory.google_domain}
                  pattern={`^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$`}
                  title='Please enter a valid domain (e.g: boxyhq.com)'
                />
              </div>
            </Show>
            <Show when={!props.setupLinkToken}>
              <>
                <div class={state.classes.fieldContainer}>
                  <label for='tenant' class={state.classes.label}>
                    <span class={defaultClasses.labelText}>Tenant</span>
                  </label>
                  <input
                    type='text'
                    id='tenant'
                    name='tenant'
                    class={state.classes.input}
                    required={true}
                    onChange={(event) => state.handleChange(event)}
                    value={state.directory.tenant}
                  />
                </div>
                <div class={state.classes.fieldContainer}>
                  <label for='product' class={state.classes.label}>
                    <span class={defaultClasses.labelText}>Product</span>
                  </label>
                  <input
                    type='text'
                    id='product'
                    name='product'
                    class={state.classes.input}
                    required={true}
                    onChange={(event) => state.handleChange(event)}
                    value={state.directory.product}
                  />
                </div>
              </>
            </Show>
            <div class={state.classes.fieldContainer}>
              <label for='webhook_url' class={state.classes.label}>
                <span class={defaultClasses.labelText}>Webhook URL</span>
              </label>
              <input
                type='text'
                id='webhook_url'
                name='webhook_url'
                class={state.classes.input}
                onChange={(event) => state.handleChange(event)}
                value={state.directory.webhook_url}
              />
            </div>
            <div class={state.classes.fieldContainer}>
              <label for='webhook_secret' class={state.classes.label}>
                <span class={defaultClasses.labelText}>Webhook secret</span>
              </label>
              <input
                type='text'
                id='webhook_secret'
                name='webhook_secret'
                class={state.classes.input}
                onChange={(event) => state.handleChange(event)}
                value={state.directory.webhook_secret}
              />
            </div>
            <div>
              <Spacer y={5} />
              <Button variant='primary' type='submit' name='Create Directory' />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
