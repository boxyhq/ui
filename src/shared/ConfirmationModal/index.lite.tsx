import Modal from '../Modal/index.lite';
import { ConfirmationModalProps } from '../types';
import ButtonBase from '../ButtonBase/index.lite';
import ButtonOutline from '../ButtonOutline/index.lite';
import ButtonDanger from '../ButtonDanger/index.lite';
import { useStore, Show } from '@builder.io/mitosis';

export default function ConfirmationModal(props: ConfirmationModalProps) {
  const state = useStore({
    buttonText: props.actionButtonText || props.translation('delete'),
  });

  return (
    <Modal visible={props.visible} title={props.title} description={props.description}>
      <div className='modal-action'>
        <ButtonOutline onClick={() => props.onCancel()}>{props.translation('cancel')}</ButtonOutline>
        <Show
          when={props.overrideDeleteButton}
          else={
            <ButtonDanger onClick={() => props.onConfirm()} data-testid={props.dataTestId}>
              {state.buttonText}
            </ButtonDanger>
          }>
          <ButtonBase color='secondary' onClick={() => props.onConfirm()} data-testid={props.dataTestId}>
            {state.buttonText}
          </ButtonBase>
        </Show>
      </div>
    </Modal>
  );
}
