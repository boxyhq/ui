import { useStore, onMount, onUpdate } from '@builder.io/mitosis';
import ToggleStatusProps from '../types';

export default function ToggleConnectionStatus(props: ToggleStatusProps) {
  const state = useStore({
    active: !props.connection.deactivated,
    isModalVisible: false,
    get ConnectinStatusMessage() {
      return !props.connection.deactivated ? props.translation('active') : props.translation('inactive');
    },
    askForConfirmation() {
      state.isModalVisible = true;
    },
  });

  onMount(() => {
    state.active = !props.connection.deactivated;
  });

  onUpdate(() => {
    state.active = !props.connection.deactivated;
  }, [props.connection]);

  return (
    <>
      <label className='label cursor-pointer'>
        <span className='label-text mr-2'>{state.ConnectinStatusMessage}</span>
        <input
          type='checkbox'
          className='toggle-success toggle'
          onChange={(event) => state.askForConfirmation()}
          checked={state.active}
        />
      </label>
    </>
  );
}
