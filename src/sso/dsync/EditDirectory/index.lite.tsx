import type { Directory, EditDirectoryProps, ApiResponse } from '../types';
import { useStore, onUpdate, Show } from '@builder.io/mitosis';
import ToggleConnectionStatus from '../ToggleConnectionStatus/index.lite';
import DeleteDirectory from '../DeleteDirectory/index.lite';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';

export default function EditDirectory(props: EditDirectoryProps) {
  const state: any = useStore({
    loading: true,
    directory: null as Directory | null,
    get classes() {
      return {
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        formDiv: cssClassAssembler(props.classNames?.formDiv, defaultClasses.formDiv),
        fieldsDiv: cssClassAssembler(props.classNames?.fieldsDiv, defaultClasses.fieldsDiv),
        btn: cssClassAssembler(props.classNames?.btn, defaultClasses.btn),
      };
    },
    updateDirectory(key: string, newValue: string, id: string) {
      if (id === 'webhook.endpoint' || id === 'webhook.secret') {
        return {
          ...state.directory,
          webhook: {
            ...state.directory.webhook,
            [id.split('.')[1]]: newValue,
          },
        };
      }

      return {
        ...state.directory,
        [key]: newValue,
      };
    },
    handleChange(event: Event) {
      const target = event.target as HTMLInputElement;
      const name = target.name as keyof typeof state.directory;
      const value = target.type === 'checkbox' ? target.checked : target.value;

      state.directory = state.updateDirectory(name, value, target.id);
    },
    onSubmit(event: Event) {
      event.preventDefault();
      state.loading = true;

      async function sendHttpRequest(url: string) {
        const rawResponse = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(state.directory),
        });

        state.loading = false;

        const response: ApiResponse<Directory> = await rawResponse.json();

        if ('error' in response) {
          props.errorCallback(response.error.message);
          return null;
        }

        if (rawResponse.ok) {
          props.successCallback('Directory updated successfully');
          props.cb();
        }
      }
      sendHttpRequest(props.urls.put);
    },
  });

  onUpdate(() => {
    async function getDirectory(url: string) {
      const response = await fetch(url);
      const { data: directoryData, error } = await response.json();

      if (directoryData) {
        state.directory = directoryData;
      }

      if (error) {
        alert(error);
      }
    }
    getDirectory(props.urls.get);
  }, [props.urls.get]);

  return (
    <div>
      <div class={defaultClasses.headingContainer}>
        <h2 className={defaultClasses.heading}>Update Directory</h2>
        <ToggleConnectionStatus
          connection={state.directory}
          urls={{ patch: props.urls.patch }}
          errorCallback={props.errorCallback}
          successCallback={props.successCallback}
        />
      </div>
      <div class={state.classes.container}>
        <form onSubmit={(event) => state.onSubmit(event)}>
          <div class={state.classes.formDiv}>
            <div class={state.classes.fieldsDiv}>
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
                value={state.directory?.name}
              />
            </div>
            <Show when={state.directory?.type === 'google'}>
              <div class={state.classes.fieldsDiv}>
                <label for='google_domain' class={state.classes.label}>
                  <span class={defaultClasses.labelText}>Directory domain</span>
                </label>
                <input
                  type='text'
                  id='google_domain'
                  name='google_domain'
                  class={state.classes.input}
                  onChange={(event) => state.handleChange(event)}
                  value={state.directory?.google_domain}
                />
              </div>
            </Show>
            <div class={state.classes.fieldsDiv}>
              <label for='webhook.endpoint' class={state.classes.label}>
                <span class={defaultClasses.labelText}>Webhook URL</span>
              </label>
              <input
                type='text'
                id='webhook.endpoint'
                name='webhook.endpoint'
                class={state.classes.input}
                onChange={(event) => state.handleChange(event)}
                value={state.directory?.webhook.endpoint}
              />
            </div>
            <div class={state.classes.fieldsDiv}>
              <label for='webhook.secret' class={state.classes.label}>
                <span class={defaultClasses.labelText}>Webhook secret</span>
              </label>
              <input
                type='text'
                id='webhook.secret'
                name='webhook.secret'
                class={state.classes.input}
                onChange={(event) => state.handleChange(event)}
                value={state.directory?.webhook.secret}
              />
            </div>
            <div class={defaultClasses.checkboxFieldsDiv}>
              <div class='flex items-center'>
                <input
                  id='log_webhook_events'
                  name='log_webhook_events'
                  type='checkbox'
                  checked={state.directory?.log_webhook_events}
                  onChange={(event) => state.handleChange(event)}
                  class={defaultClasses.checkboxInput}
                />
                <label for='log_webhook_events' class={defaultClasses.checkboxLabel}>
                  Enable Webhook events logging
                </label>
              </div>
            </div>
            <div>
              <button type='submit' class={state.classes.btn}>
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
      <DeleteDirectory
        urls={{ delete: props.urls.delete }}
        cb={props.deleteCallback}
        successCallback={props.successCallback}
        errorCallback={props.errorCallback}
      />
    </div>
  );
}
