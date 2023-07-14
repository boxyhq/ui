import { useStore } from '@builder.io/mitosis';
import { ConnectionToggleProps } from '../types';
import ConfirmationModal from '../ConfirmationModal/index.lite';

export default function ConnectionToggle(props: ConnectionToggleProps) {
  const state = useStore({
    isModalVisible: false,
    active: props.connection.active,
    confirmationModalDescription: {
      sso: {
        activate: props.translation('activate_sso_connection_description'),
        deactivate: props.translation('deactivate_sso_connection_description'),
      },
      dsync: {
        activate: props.translation('activate_dsync_connection_description'),
        deactivate: props.translation('deactivate_dsync_connection_description'),
      },
    }[props.connection.type][props.connection.active ? 'deactivate' : 'activate'],
    get confirmationModalTitle() {
      return props.connection.active
        ? props.translation('deactivate_connection')
        : props.translation('activate_connection');
    },
    get ConnectinStatusMessage() {
      return props.connection.active ? props.translation('active') : props.translation('inactive');
    },
    askForConfirmation() {
      state.isModalVisible = true;
    },
    onCancel() {
      state.isModalVisible = false;
    },
    onConfirm() {
      state.isModalVisible = false;
      state.active = !state.active;
      props.onChange(!state.active);
    },
  });

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
      <ConfirmationModal
        title={state.confirmationModalTitle}
        description={state.confirmationModalDescription}
        actionButtonText={props.translation('yes_proceed')}
        overrideDeleteButton={true}
        visible={state.isModalVisible}
        onConfirm={state.onConfirm}
        onCancel={state.onCancel}
        dataTestId='confirm-connection-toggle'
      />
    </>
  );
}
