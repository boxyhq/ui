import LinkIcon from '../../shared/LinkIcon.lite';
import PlusIcon from '../../shared/PlusIcon.lite';
import { LinkPrimary } from '@components/LinkPrimary';
import { InputWithCopyButton } from '@components/ClipboardButton';
import { Show } from '@builder.io/mitosis';
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
          <LinkPrimary Icon={PlusIcon} href={props.createConnectionUrl} data-testid='create-connection'>
            {props.translation('new_connection')}
          </LinkPrimary>
          <Show when={!props.setupLinkToken && !(props.isSettingsView || DEFAULT_VALUES.isSettingsView)}>
            <LinkPrimary
              Icon={LinkIcon}
              href='/admin/sso-connection/setup-link/new'
              data-testid='create-setup-link'>
              {props.translation('new_setup_link')}
            </LinkPrimary>
          </Show>
        </div>
      </div>
      <Show when={props.idpEntityID && props.setupLinkToken}>
        <div className='mb-5 mt-5 items-center justify-between'>
          <div className='form-control'>
            <InputWithCopyButton text={props.idpEntityID} label={props.translation('idp_entity_id')} />
          </div>
        </div>
      </Show>
    </div>
  );
}
