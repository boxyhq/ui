import type { Directory, EditDirectoryProps, UnSavedDirectory } from '../types';
import { useStore, onUpdate, Show } from '@builder.io/mitosis';
import ToggleConnectionStatus from '../ToggleConnectionStatus/index.lite';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../sso/utils/cssClassAssembler';
import Button from '../../shared/Button/index.lite';
import Spacer from '../../shared/Spacer/index.lite';
import ConfirmationPrompt from '../../shared/ConfirmationPrompt/index.lite';
import Checkbox from '../../shared/Checkbox/index.lite';
import InputField from '../../shared/inputs/InputField/index.lite';
import SecretInputFormControl from '../../shared/inputs/SecretInputFormControl/index.lite';
import { InputWithCopyButton } from '../../shared';
import LoadingContainer from '../../shared/LoadingContainer/index.lite';
import { sendHTTPRequest } from '../../shared/http';

type FormState = Pick<
  UnSavedDirectory,
  'name' | 'log_webhook_events' | 'webhook_url' | 'webhook_secret' | 'google_domain'
>;

const DEFAULT_FORM_STATE: FormState = {
  name: '',
  log_webhook_events: false,
  webhook_url: '',
  webhook_secret: '',
  google_domain: '',
};

export default function EditDirectory(props: EditDirectoryProps) {
  const state: any = useStore({
    showDelConfirmation: false,
    toggleDelConfirmation() {
      state.showDelConfirmation = !state.showDelConfirmation;
    },
    isDirectoryLoading: true,
    directoryUpdated: DEFAULT_FORM_STATE,
    get classes() {
      return {
        inputField: {
          label: props.classNames?.label,
          input: props.classNames?.input,
          container: props.classNames?.fieldContainer,
        },
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
      const id = target.id;
      const value = target.type === 'checkbox' ? target.checked : target.value;

      state.directoryUpdated = state.updateFormState(id, value);
    },
    onSubmit(event: Event) {
      event.preventDefault();

      async function saveDirectory(url: string) {
        const response = await sendHTTPRequest<{ data: Directory }>(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(state.directoryUpdated),
        });

        if (response) {
          if ('error' in response && response.error) {
            typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
          } else if ('data' in response) {
            typeof props.successCallback === 'function' &&
              props.successCallback({ operation: 'UPDATE', connection: response.data });
          }
        }
      }
      saveDirectory(props.urls.patch);
    },
    deleteDirectory() {
      async function deleteConnection(url: string) {
        const response = await sendHTTPRequest<null>(url, {
          method: 'DELETE',
        });

        if (response && 'error' in response && response.error) {
          typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
        } else {
          typeof props.successCallback === 'function' && props.successCallback({ operation: 'DELETE' });
        }
      }

      deleteConnection(props.urls.delete);
    },
    isExcluded(fieldName: Exclude<EditDirectoryProps['excludeFields'], undefined>[number]) {
      return !!props.excludeFields?.includes(fieldName);
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
      const response = await sendHTTPRequest<{ data: Directory }>(url);

      state.isDirectoryLoading = false;
      if (response) {
        if ('error' in response && response.error) {
          typeof props.errorCallback === 'function' && props.errorCallback(response.error.message);
        } else if ('data' in response) {
          const directoryData = response.data;
          state.directoryUpdated = {
            ...directoryData,
            name: directoryData.name,
            log_webhook_events: directoryData.log_webhook_events,
            webhook_url: directoryData.webhook.endpoint || '',
            webhook_secret: directoryData.webhook.secret || '',
            google_domain: directoryData.google_domain || '',
            deactivated: directoryData.deactivated,
          };
        }
      }
    }
    getDirectory(state.directoryFetchUrl);
  }, [state.directoryFetchUrl]);

  return (
    <LoadingContainer isBusy={state.isDirectoryLoading}>
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
        <Show when={!state.isExcluded('name')}>
          <InputField
            label='Directory name'
            id='name'
            value={state.directoryUpdated.name}
            handleInputChange={state.handleChange}
            required
            classNames={state.classes.inputField}
          />
          <Spacer y={6} />
        </Show>
        <Show when={!state.isExcluded('scim_endpoint')}>
          <InputWithCopyButton
            label='SCIM Endpoint'
            text={state.directoryUpdated.scim?.endpoint}
            copyDoneCallback={props.successCallback}
            classNames={state.classes.inputField}
          />
          <Spacer y={6} />
        </Show>
        <Show when={!state.isExcluded('scim_token')}>
          <InputWithCopyButton
            label='SCIM Token'
            text={state.directoryUpdated.scim?.secret}
            copyDoneCallback={props.successCallback}
            classNames={state.classes.inputField}
          />
          <Spacer y={6} />
        </Show>
        <Show when={state.directoryUpdated?.type === 'google'}>
          <InputField
            label='Directory domain'
            id='google_domain'
            value={state.directoryUpdated.google_domain}
            handleInputChange={state.handleChange}
            classNames={state.classes.inputField}
          />
          <Spacer y={6} />
        </Show>
        <Show when={!state.isExcluded('webhook_url')}>
          <InputField
            type='url'
            label='Webhook URL'
            id='webhook_url'
            value={state.directoryUpdated.webhook_url}
            handleInputChange={state.handleChange}
            classNames={state.classes.inputField}
          />
          <Spacer y={6} />
        </Show>
        <Show when={!state.isExcluded('webhook_secret')}>
          <SecretInputFormControl
            label='Webhook secret'
            id='webhook_secret'
            classNames={state.classes.inputField}
            handleChange={state.handleChange}
            value={state.directoryUpdated.webhook_secret}
            copyDoneCallback={props.successCallback}
            required={false}
            readOnly={false}
          />
          <Spacer y={6} />
        </Show>
        <Show when={!state.isExcluded('log_webhook_events')}>
          <Checkbox
            label='Enable Webhook events logging'
            id='log_webhook_events'
            name='log_webhook_events'
            checked={state.directoryUpdated?.log_webhook_events}
            handleChange={state.handleChange}
          />
          <Spacer y={6} />
        </Show>
        <div class={defaultClasses.formAction}>
          <Show when={typeof props.cancelCallback === 'function'}>
            <Button type='button' name='Cancel' handleClick={props.cancelCallback} variant='outline' />
          </Show>
          <Button type='submit' name='Save' variant='primary' classNames={props.classNames?.button?.ctoa} />
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
    </LoadingContainer>
  );
}
