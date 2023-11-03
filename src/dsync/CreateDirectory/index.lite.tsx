import { Show, onMount, useStore } from '@builder.io/mitosis';
import {
  type CreateDirectoryProps,
  type ApiResponse,
  type Directory,
  type UnSavedDirectory,
  DirectorySyncProviders,
} from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../sso/utils/cssClassAssembler';
import Button from '../../shared/Button/index.lite';
import Spacer from '../../shared/Spacer/index.lite';
import Select from '../../shared/Select/index.lite';
// import Checkbox from '../../../shared/Checkbox/index.lite';

const DEFAULT_DIRECTORY_VALUES: UnSavedDirectory = {
  name: '',
  tenant: '',
  product: '',
  webhook_url: '',
  webhook_secret: '',
  type: 'azure-scim-v2',
  google_domain: '',
  log_webhook_events: false,
};

export default function CreateDirectory(props: CreateDirectoryProps) {
  const state = useStore({
    directory: DEFAULT_DIRECTORY_VALUES,
    showDomain: false,
    get providers() {
      return Object.entries<string>(DirectorySyncProviders)?.map(([value, text]) => ({
        value,
        text,
      }));
    },
    setProvider(event: any) {
      const _val = event?.target?.value;
      if (_val === 'google') {
        state.showDomain = true;
      } else {
        state.showDomain = false;
      }
      state.directory = { ...state.directory, type: _val };
    },
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        fieldContainer: cssClassAssembler(props.classNames?.fieldContainer, defaultClasses.fieldContainer),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
      };
    },
    get shouldDisplayHeader() {
      if (props.displayHeader !== undefined) {
        return props.displayHeader;
      }
      return true;
    },
    handleChange(event: Event) {
      const target = event.target as HTMLInputElement;
      const value = target.type === 'checkbox' ? target.checked : target.value;

      state.directory = {
        ...state.directory,
        [target.id]: value,
      };
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
          typeof props.successCallback === 'function' &&
            props.successCallback({ operation: 'CREATE', connection: response.data });
        }
      }
      sendHTTPrequest(state.directory, props.urls.post);
    },
    isExcluded(fieldName: keyof UnSavedDirectory) {
      return !!(props.excludeFields as (keyof UnSavedDirectory)[])?.includes(fieldName);
    },
  });

  onMount(() => {
    state.directory.webhook_url = props.defaultWebhookEndpoint || '';
  });

  return (
    <div>
      <Show when={state.shouldDisplayHeader}>
        <h2 class={defaultClasses.heading}>Create Directory</h2>
      </Show>
      <form onSubmit={(event) => state.onSubmit(event)}>
        <Show when={!state.isExcluded('name')}>
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
            <Spacer y={6} />
          </div>
        </Show>
        <Show when={!state.isExcluded('type')}>
          <div class={state.classes.fieldContainer}>
            <Select
              label='Directory provider'
              options={state.providers}
              selectedValue={state.directory.type}
              handleChange={state.setProvider}
              name='type'
              id='type'
            />
            <Spacer y={6} />
          </div>
        </Show>
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
            <Spacer y={6} />
          </div>
        </Show>
        <Show when={!state.isExcluded('tenant')}>
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
            <Spacer y={6} />
          </div>
        </Show>
        <Show when={!state.isExcluded('product')}>
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
            <Spacer y={6} />
          </div>
        </Show>
        <Show when={!state.isExcluded('webhook_url')}>
          <div class={state.classes.fieldContainer}>
            <label for='webhook_url' class={state.classes.label}>
              Webhook URL
            </label>
            <Spacer y={2} />
            <input
              type='url'
              id='webhook_url'
              name='webhook_url'
              class={state.classes.input}
              onChange={(event) => state.handleChange(event)}
              value={state.directory.webhook_url}
            />
            <Spacer y={6} />
          </div>
        </Show>
        <Show when={!state.isExcluded('webhook_secret')}>
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
            <Spacer y={6} />
          </div>
        </Show>
        {/* <Show when={!state.isExcluded('log_webhook_events')}>
          <div class={defaultClasses.checkboxFieldsDiv}>
            <Checkbox
              label='Enable Webhook events logging'
              id='log_webhook_events'
              name='log_webhook_events'
              checked={state.directory.log_webhook_events}
              handleChange={state.handleChange}
            />
            <Spacer y={6} />
          </div>
        </Show> */}
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
