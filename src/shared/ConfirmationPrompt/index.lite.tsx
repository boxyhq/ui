import { Show, useStore } from '@builder.io/mitosis';
import Button from '../Button/index.lite';
import { ConfirmationPromptProps } from '../types';
import defaultClasses from './index.module.css';

export default function ConfirmationPrompt(props: ConfirmationPromptProps) {
  const state = useStore({
    isPromptVisible: false,
    askForConfirmation() {
      state.isPromptVisible = true;
    },
    handleCancel() {
      state.isPromptVisible = false;
    },
    handleConfirm(event: Event) {
      state.isPromptVisible = false;
      props.confirmationCallback(event);
    },
  });

  return (
    <div>
      <Show when={!state.isPromptVisible}>
        <Button name='Delete' handleClick={state.askForConfirmation} variant='destructive' type='button' />
      </Show>
      <Show when={state.isPromptVisible}>
        <div class={defaultClasses.confirmationDiv}>
          <h6>{props.promptMessge}</h6>
          <div class={defaultClasses.buttonsDiv}>
            <Button name='Confirm' type='button' variant='destructive' handleClick={state.handleConfirm} />
            <Button name='Cancel' type='button' variant='outline' handleClick={state.handleCancel} />
          </div>
        </div>
      </Show>
    </div>
  );
}
