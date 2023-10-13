import { Fragment, Show, onMount, useStore } from '@builder.io/mitosis';
import { CreateDirectoryProps, ApiResponse, Directory } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';
import Button from '../../../shared/Button/index.lite';
import Spacer from '../../../shared/Spacer/index.lite';
import Select from '../../../shared/Select/index.lite';

const DEFAULT_DIRECTORY_VALUES = {
  name: '',
  tenant: '',
  product: '',
  webhook_url: '',
  webhook_secret: '',
  type: 'azure-scim-v2',
  google_domain: '',
};

const DEFAULT_PROVIDERS = [] as { value: string; text: string }[];

export default function CreateDirectory(props: CreateDirectoryProps) {
  const state = useStore({
    directory: DEFAULT_DIRECTORY_VALUES,
    showDomain: false,
    providers: DEFAULT_PROVIDERS,
    setProvider(event: any) {
      state.directory = { ...state.directory, type: event?.target?.value };
    },
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        fieldContainer: cssClassAssembler(props.classNames?.fieldContainer, defaultClasses.fieldContainer),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
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
          typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
          return;
        }

        if (rawResponse.ok) {
          typeof props.successCallback === 'function' && props.successCallback();
        }
      }
      sendHTTPrequest(state.directory, props.urls.post);
    },
  });

  onMount(() => {
    state.directory.webhook_url = props.defaultWebhookEndpoint || '';

    async function getDirectoryProviders(url: string) {
      const response = await fetch(url);
      const { data } = await response.json();

      state.providers = Object.entries<string>(data).map(([value, text]) => ({ value, text }));
    }

    getDirectoryProviders(props.urls.providers);
  });

  return (
    <div>
      <Show when={props.displayHeader !== undefined ? props.displayHeader : true}>
        <h2 class={defaultClasses.heading}>Create Directory</h2>
      </Show>
      <form onSubmit={(event) => state.onSubmit(event)}>
        <div class={state.classes.fieldContainer}>
          <label for='name' class={state.classes.label}>
            <span class={defaultClasses.labelText}>Directory name</span>
          </label>
          <Spacer y={2} />
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
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <Select
            label='Directory provider'
            options={state.providers}
            selectedValue={state.directory.type}
            handleChange={state.setProvider}
            name='type'
          />
        </div>
        <Spacer y={6} />
        <Show when={state.showDomain}>
          <div class={state.classes.fieldContainer}>
            <label for='google_domain' class={state.classes.label}>
              Directory domain
            </label>
            <Spacer y={2} />
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
        <Spacer y={6} />
        <Show when={!props.setupLinkToken}>
          <Fragment>
            <div class={state.classes.fieldContainer}>
              <label for='tenant' class={state.classes.label}>
                Tenant
              </label>
              <Spacer y={2} />
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
            <Spacer y={6} />
            <div class={state.classes.fieldContainer}>
              <label for='product' class={state.classes.label}>
                Product
              </label>
              <Spacer y={2} />
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
          </Fragment>
        </Show>
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <label for='webhook_url' class={state.classes.label}>
            Webhook URL
          </label>
          <Spacer y={2} />
          <input
            type='text'
            id='webhook_url'
            name='webhook_url'
            class={state.classes.input}
            onChange={(event) => state.handleChange(event)}
            value={state.directory.webhook_url}
          />
        </div>
        <Spacer y={6} />
        <div class={state.classes.fieldContainer}>
          <label for='webhook_secret' class={state.classes.label}>
            Webhook secret
          </label>
          <Spacer y={2} />
          <input
            type='text'
            id='webhook_secret'
            name='webhook_secret'
            class={state.classes.input}
            onChange={(event) => state.handleChange(event)}
            value={state.directory.webhook_secret}
          />
        </div>
        <Spacer y={6} />
        <div class={defaultClasses.formAction}>
          <Show when={typeof props.cancelCallback === 'function'}>
            <Button type='button' name='Cancel' handleClick={props.cancelCallback} variant='outline' />
          </Show>
          <Button
            variant='primary'
            type='submit'
            name='Create Directory'
            classNames={props.classNames?.button?.ctoa}
          />
        </div>
      </form>
    </div>
  );
}
