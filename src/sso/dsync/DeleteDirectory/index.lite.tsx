import { useStore, Show } from '@builder.io/mitosis';
import { ApiResponse } from '../types';
import { DeleteDirectoryProps } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';
import ConfirmationPrompt from '../../../shared/ConfirmationPrompt/index.lite';

export default function DeleteDirectory(props: DeleteDirectoryProps) {
  const state = useStore({
    get classes() {
      return {
        section: cssClassAssembler(props.classNames?.section, defaultClasses.section),
        deleteBtn: cssClassAssembler(props.classNames?.deleteBtn, defaultClasses.deleteBtn),
        outlineBtn: cssClassAssembler(props.classNames?.outlineBtn, defaultClasses.outlineBtn),
      };
    },
    promptConfirmationCallback() {
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

      sendHTTPrequest(url);
    },
  });

  return (
    <>
      <section class={state.classes.section}>
        <div class={defaultClasses.info}>
          <h6 class={defaultClasses.sectionHeading}>Delete this directory connection</h6>
          <p class={defaultClasses.sectionPara}>All your apps using this connection will stop working.</p>
        </div>
        <ConfirmationPrompt
          promptMessge=' Are you sure you want to delete the directory connection? This will permanently delete the
              directory connection, users, and groups.'
          confirmationCallback={state.promptConfirmationCallback}
        />
      </section>
    </>
  );
}
