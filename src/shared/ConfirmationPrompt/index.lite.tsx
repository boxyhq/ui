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
    onCancel() {
      state.isPromptVisible = false;
    },
    onConfirm() {
      state.isPromptVisible = false;
      props.confirmationCallback();
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
          <div>
            <Button name='Confirm' type='button' variant='destructive' handleClick={state.onConfirm} />
            <Button name='Cancel' type='button' variant='outline' handleClick={state.onCancel} />
          </div>
        </div>
      </Show>
    </div>
  );
}
