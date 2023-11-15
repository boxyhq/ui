import type { Directory, EditDirectoryProps, ApiResponse } from '../types';
import { useStore, onUpdate, Show } from '@builder.io/mitosis';
import ToggleConnectionStatus from '../ToggleConnectionStatus/index.lite';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../sso/utils/cssClassAssembler';
import Button from '../../shared/Button/index.lite';
import Spacer from '../../shared/Spacer/index.lite';
import ConfirmationPrompt from '../../shared/ConfirmationPrompt/index.lite';
import Checkbox from '../../shared/Checkbox/index.lite';

type FormState = Pick<Directory, 'name' | 'log_webhook_events' | 'webhook' | 'google_domain'>;

const DEFAULT_FORM_STATE: FormState = {
  name: '',
  log_webhook_events: false,
  webhook: {
    endpoint: '',
    secret: '',
  },
  google_domain: '',
};

export default function EditDirectory(props: EditDirectoryProps) {
  const state: any = useStore({
    loading: true,
    showDelConfirmation: false,
    toggleDelConfirmation() {
      state.showDelConfirmation = !state.showDelConfirmation;
    },
    directoryUpdated: DEFAULT_FORM_STATE,
    get classes() {
      return {
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        formDiv: cssClassAssembler(props.classNames?.formDiv, defaultClasses.formDiv),
        fieldsDiv: cssClassAssembler(props.classNames?.fieldsDiv, defaultClasses.fieldsDiv),
        section: cssClassAssembler(props.classNames?.section, defaultClasses.section),
      };
    },
    updateFormState(key: string, newValue: string | boolean) {
      return {
        ...state.directoryUpdated,
        [key]: newValue,
      };
    },
    handleChange(event: Event) {
      const target = event.target as HTMLInputElement;
      const name = target.name;
      const value = target.type === 'checkbox' ? target.checked : target.value;

      state.directoryUpdated = state.updateFormState(name, value);
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
          body: JSON.stringify(state.directoryUpdated),
        });

        state.loading = false;

        const response: ApiResponse<Directory> = await rawResponse.json();

        if ('error' in response) {
          typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
          return;
        }

        if (rawResponse.ok) {
          typeof props.successCallback === 'function' &&
            props.successCallback({ operation: 'UPDATE', connection: response.data });
        }
      }
      sendHttpRequest(props.urls.patch);
    },
    deleteDirectory() {
      async function sendHTTPrequest(url: string) {
        const rawResponse = await fetch(url, {
          method: 'DELETE',
        });

        const response: ApiResponse<unknown> = await rawResponse.json();

        if ('error' in response) {
          typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
          return;
        }

        if ('data' in response) {
          typeof props.successCallback === 'function' && props.successCallback({ operation: 'DELETE' });
        }
      }

      sendHTTPrequest(props.urls.delete);
    },
    isExcluded(fieldName: keyof Directory) {
      return !!(props.excludeFields as (keyof Directory)[])?.includes(fieldName);
    },
    get shouldDisplayHeader() {
      if (props.displayHeader !== undefined) {
        return props.displayHeader;
      }
      return true;
    },
    get directoryFetchUrl() {
      return props.urls.get;
    },
  });

  onUpdate(() => {
    async function getDirectory(url: string) {
      const response = await fetch(url);
      const { data: directoryData, error } = await response.json();

      if (directoryData) {
        state.directoryUpdated = {
          ...directoryData,
          name: directoryData.name,
          log_webhook_events: directoryData.log_webhook_events,
          webhook_url: directoryData.webhook?.endpoint,
          webhook_secret: directoryData.webhook?.secret,
          google_domain: directoryData.google_domain,
          deactivated: directoryData.deactivated,
        };
      }

      if (error) {
        typeof props.errorCallback === 'function' && props.errorCallback(error.message);
      }
    }
    getDirectory(state.directoryFetchUrl);
  }, [state.directoryFetchUrl]);

  return (
    <div>
      <div class={defaultClasses.headingContainer}>
        <Show when={state.shouldDisplayHeader}>
          <h2 className={defaultClasses.heading}>Update Directory</h2>
        </Show>
        <ToggleConnectionStatus
          connection={state.directoryUpdated}
          urls={{ patch: props.urls.patch }}
          classNames={{
            confirmationPrompt: {
              button: {
                ctoa: `${props.classNames?.confirmationPrompt?.button?.ctoa} ${
                  state.directoryUpdated?.deactivated
                    ? props.classNames?.button?.ctoa
                    : props.classNames?.button?.destructive
                }`.trim(),
                cancel: props.classNames?.confirmationPrompt?.button?.cancel,
              },
            },
          }}
          errorCallback={props.errorCallback}
          successCallback={props.successCallback}
        />
      </div>
      <form onSubmit={(event) => state.onSubmit(event)}>
        <div class={state.classes.formDiv}>
          <Show when={!state.isExcluded('name')}>
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
                value={state.directoryUpdated?.name}
              />
            </div>
          </Show>
          <Show when={state.directoryUpdated?.type === 'google'}>
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
                value={state.directoryUpdated?.google_domain}
              />
            </div>
          </Show>
          <Show when={!state.isExcluded('webhook_url')}>
            <div class={state.classes.fieldsDiv}>
              <label for='webhook_url' class={state.classes.label}>
                <span class={defaultClasses.labelText}>Webhook URL</span>
              </label>
              <input
                type='url'
                id='webhook_url'
                name='webhook_url'
                class={state.classes.input}
                onChange={(event) => state.handleChange(event)}
                value={state.directoryUpdated?.webhook_url}
              />
            </div>
          </Show>
          <Show when={!state.isExcluded('webhook_secret')}>
            <div class={state.classes.fieldsDiv}>
              <label for='webhook_secret' class={state.classes.label}>
                <span class={defaultClasses.labelText}>Webhook secret</span>
              </label>
              <input
                type='text'
                id='webhook_secret'
                name='webhook_secret'
                class={state.classes.input}
                onChange={(event) => state.handleChange(event)}
                value={state.directoryUpdated?.webhook_secret}
              />
            </div>
          </Show>
          <Show when={!state.isExcluded('log_webhook_events')}>
            <div class={defaultClasses.checkboxFieldsDiv}>
              <Checkbox
                label='Enable Webhook events logging'
                id='log_webhook_events'
                name='log_webhook_events'
                checked={state.directoryUpdated?.log_webhook_events}
                handleChange={state.handleChange}
              />
              <Spacer y={6} />
            </div>
          </Show>
          <div class={defaultClasses.formAction}>
            <Show when={typeof props.cancelCallback === 'function'}>
              <Button type='button' name='Cancel' handleClick={props.cancelCallback} variant='outline' />
            </Show>
            <Button type='submit' name='Save' variant='primary' classNames={props.classNames?.button?.ctoa} />
          </div>
        </div>
      </form>
      <section class={state.classes.section}>
        <div class={defaultClasses.info}>
          <h6 class={defaultClasses.sectionHeading}>Delete this directory connection</h6>
          <p class={defaultClasses.sectionPara}>All your apps using this connection will stop working.</p>
        </div>
        <Show when={!state.showDelConfirmation}>
          <Button
            name='Delete'
            handleClick={state.toggleDelConfirmation}
            variant='outline'
            type='button'
            classNames={props.classNames?.button?.destructive}
          />
        </Show>
        <Show when={state.showDelConfirmation}>
          <ConfirmationPrompt
            ctoaVariant='destructive'
            classNames={{
              button: {
                ctoa: `${props.classNames?.button?.destructive} ${props.classNames?.confirmationPrompt?.button?.ctoa}`.trim(),
                cancel: props.classNames?.confirmationPrompt?.button?.cancel,
              },
            }}
            cancelCallback={state.toggleDelConfirmation}
            promptMessage=' Are you sure you want to delete the directory connection? This will permanently delete the
              directory connection, users, and groups.'
            confirmationCallback={state.deleteDirectory}
          />
        </Show>
      </section>
    </div>
  );
}
