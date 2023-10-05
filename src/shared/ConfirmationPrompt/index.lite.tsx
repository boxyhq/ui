import { useRef, onMount, useStore } from '@builder.io/mitosis';
import Button from '../Button/index.lite';
import { ConfirmationPromptProps } from '../types';
import defaultClasses from './index.module.css';

export default function ConfirmationPrompt(props: ConfirmationPromptProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const state = useStore({
    focusCancelButton() {
      if (cancelRef) {
        cancelRef.focus();
      }
    },
  });

  onMount(() => {
    state.focusCancelButton();
  });

  return (
    <div class={defaultClasses.confirmationDiv}>
      <h6>{props.promptMessage}</h6>
      <div class={defaultClasses.buttonsDiv}>
        <Button
          name={props.buttonNames?.ctoa || 'Confirm'}
          type='button'
          variant={props.ctoaVariant}
          handleClick={props.confirmationCallback}
          classNames={props.classNames?.button?.ctoa}
        />
        <Button
          name={props.buttonNames?.cancel || 'Cancel'}
          type='button'
          variant='outline'
          handleClick={props.cancelCallback}
          classNames={props.classNames?.button?.cancel}
          buttonRef={cancelRef}
        />
      </div>
    </div>
  );
}
