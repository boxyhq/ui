import { ModalProps } from '../types';
import { useStore, onMount, onUpdate } from '@builder.io/mitosis';

export default function Modal(props: ModalProps) {
  const state = useStore({
    open: props.visible ? props.visible : false,
  });

  onMount(() => {
    state.open = props.visible;
  });

  onUpdate(() => {
    state.open = props.visible;
  }, [props.visible]);

  return (
    <div className={`modal ${state.open ? 'modal-open' : ''}`}>
      <div className='modal-box'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>{props.title}</h3>
          {props.description && <p className='text-sm'>{props.description}</p>}
          <div>{props.children}</div>
        </div>
      </div>
    </div>
  );
}
