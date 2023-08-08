import { useStore, Show } from '@builder.io/mitosis';
import { ApiResponse } from '../types';
import { DeleteDirectoryProps } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';

export default function DeleteDirectory(props: DeleteDirectoryProps) {
  const state = useStore({
    displayDeletionConfirmation: false,
    get classes() {
      return {
        section: cssClassAssembler(props.classNames?.section, defaultClasses.section),
        deleteBtn: cssClassAssembler(props.classNames?.deleteBtn, defaultClasses.deleteBtn),
        outlineBtn: cssClassAssembler(props.classNames?.outlineBtn, defaultClasses.outlineBtn),
      };
    },
    askForConfirmation() {
      state.displayDeletionConfirmation = true;
    },
    onCancel() {
      state.displayDeletionConfirmation = false;
    },
    onConfirm() {
      state.deleteDirectory(props.urls.delete);
    },
    deleteDirectory(url: string) {
      async function sendHTTPrequest(url: string) {
        const rawResponse = await fetch(url, {
          method: 'DELETE',
        });

        const response: ApiResponse<unknown> = await rawResponse.json();

        if ('error' in response) {
          props.errorCallback(response.error.message);
          return;
        }

        if ('data' in response) {
          props.successCallback('Directory connection deleted successfully');
          props.cb();
        }
      }

      state.displayDeletionConfirmation = false;
      sendHTTPrequest(url);
    },
  });

  return (
    <>
      <section class={state.classes.section}>
        <div className={defaultClasses.sectionDiv}>
          <h6 className={defaultClasses.sectionHeading}>Delete this directory connection</h6>
          <p className={defaultClasses.sectionPara}>All your apps using this connection will stop working.</p>
        </div>
        <Show when={!state.displayDeletionConfirmation}>
          <button
            type='button'
            onClick={(event) => state.askForConfirmation()}
            class={state.classes.deleteBtn}>
            Delete
          </button>
        </Show>
        <Show when={state.displayDeletionConfirmation}>
          <div class={defaultClasses.confirmationDiv}>
            <h6>
              Are you sure you want to delete the directory connection? This will permanently delete the
              directory connection, users, and groups.
            </h6>
            <div class={defaultClasses.buttonsDiv}>
              <button type='button' class={state.classes.deleteBtn} onClick={() => state.onConfirm()}>
                Confirm
              </button>
              <button type='button' class={state.classes.outlineBtn} onClick={() => state.onCancel()}>
                Cancel
              </button>
            </div>
          </div>
        </Show>
      </section>
    </>
  );
}
