import InputWithCopyButton from '../../shared/ClipboardButton/index.lite';
import { Show, Slot } from '@builder.io/mitosis';
import { ConnectionListProps } from './types';

const DEFAULT_VALUES = {
  isSettingsView: false,
};

export default function ConnectionList(props: ConnectionListProps) {
  return (
    <div>
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='font-bold text-gray-700 dark:text-white md:text-xl'>
          {props.translation(
            props.isSettingsView || DEFAULT_VALUES.isSettingsView ? 'admin_portal_sso' : 'enterprise_sso'
          )}
        </h2>
        <div className='flex gap-2'>
          <Slot name={props.slotLinkPrimary}></Slot>
          <Show when={!props.setupLinkToken && !(props.isSettingsView || DEFAULT_VALUES.isSettingsView)}>
            <Slot name={props.slotLinkPrimary}></Slot>
          </Show>
        </div>
      </div>
      <Show when={props.idpEntityID && props.setupLinkToken}>
        <div className='mb-5 mt-5 items-center justify-between'>
          <div className='form-control'>
            <InputWithCopyButton
              text={props.idpEntityID}
              label={props.translation('idp_entity_id')}
              translation={props.translation}
              toastSucessCallback={props.toastSuccessCallback}
            />
          </div>
        </div>
      </Show>
    </div>
  );
}
